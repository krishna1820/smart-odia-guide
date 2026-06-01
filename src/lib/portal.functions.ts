import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

/* ---------------- FEEDBACK ---------------- */

const feedbackSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(5).max(2000),
  category: z.enum(["general", "grievance", "suggestion", "scheme", "tourism", "agriculture", "service"]).default("general"),
});

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator((input) => feedbackSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("feedback").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listFeedback = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateFeedbackStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["new", "in_progress", "resolved", "archived"]),
    }).parse(input),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("feedback").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteFeedback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("feedback").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- PROFILE ---------------- */

const profileSchema = z.object({
  display_name: z.string().trim().max(120).nullable().optional(),
  phone: z.string().trim().max(20).nullable().optional(),
  district: z.string().trim().max(80).nullable().optional(),
});

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("display_name, phone, district, avatar_url, created_at")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ?? { display_name: null, phone: null, district: null, avatar_url: null, created_at: null };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => profileSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert({ user_id: context.userId, ...data }, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- VISITOR ANALYTICS ---------------- */

export const logVisit = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      path: z.string().min(1).max(300),
      referrer: z.string().max(500).optional().nullable(),
      user_agent: z.string().max(500).optional().nullable(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    await supabaseAdmin.from("page_visits").insert(data);
    return { ok: true };
  });

export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);

    const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [visitsTotal, visits30, visits24, feedbackTotal, feedbackNew, contentByCat, recentVisits] = await Promise.all([
      supabaseAdmin.from("page_visits").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("page_visits").select("*", { count: "exact", head: true }).gte("created_at", since30),
      supabaseAdmin.from("page_visits").select("*", { count: "exact", head: true }).gte("created_at", since24h),
      supabaseAdmin.from("feedback").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("feedback").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabaseAdmin.from("content_items").select("category"),
      supabaseAdmin.from("page_visits").select("path, created_at").order("created_at", { ascending: false }).limit(2000),
    ]);

    // Bucket visits per day for the last 14 days
    const days: { date: string; count: number }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, count: 0 });
    }
    const byDay = new Map(days.map((d) => [d.date, d]));
    (recentVisits.data ?? []).forEach((v: { created_at: string }) => {
      const key = v.created_at.slice(0, 10);
      const bucket = byDay.get(key);
      if (bucket) bucket.count += 1;
    });

    // Top paths
    const pathCounts = new Map<string, number>();
    (recentVisits.data ?? []).forEach((v: { path: string }) => {
      pathCounts.set(v.path, (pathCounts.get(v.path) ?? 0) + 1);
    });
    const topPaths = [...pathCounts.entries()]
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Content by category
    const catCounts: Record<string, number> = { scheme: 0, tourism: 0, agriculture: 0, service: 0 };
    (contentByCat.data ?? []).forEach((r: { category: string }) => {
      catCounts[r.category] = (catCounts[r.category] ?? 0) + 1;
    });

    // Users count
    const usersCount = await supabaseAdmin.from("user_roles").select("user_id", { count: "exact", head: true });

    return {
      visitsTotal: visitsTotal.count ?? 0,
      visits30: visits30.count ?? 0,
      visits24: visits24.count ?? 0,
      feedbackTotal: feedbackTotal.count ?? 0,
      feedbackNew: feedbackNew.count ?? 0,
      usersTotal: usersCount.count ?? 0,
      byDay: days,
      topPaths,
      contentByCategory: catCounts,
    };
  });
