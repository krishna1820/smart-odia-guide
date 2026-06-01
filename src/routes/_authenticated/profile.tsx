import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile, updateMyProfile } from "@/lib/portal.functions";
import { getMyRole } from "@/lib/content.functions";
import { LogOut, User, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My Profile — Smart Odisha" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getMyProfile);
  const save = useServerFn(updateMyProfile);
  const fetchRole = useServerFn(getMyRole);
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ display_name: "", phone: "", district: "" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
    Promise.all([fetchProfile(), fetchRole()])
      .then(([p, r]) => {
        setForm({
          display_name: p.display_name ?? "",
          phone: p.phone ?? "",
          district: p.district ?? "",
        });
        setIsAdmin(r.isAdmin);
      })
      .finally(() => setLoading(false));
  }, [fetchProfile, fetchRole]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      await save({ data: {
        display_name: form.display_name || null,
        phone: form.phone || null,
        district: form.district || null,
      }});
      setMsg("Saved.");
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[image:var(--gradient-hero)]" />
            <div className="font-display text-lg">Smart Odisha</div>
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-muted">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-background">
            <User className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-foreground">{form.display_name || "My profile"}</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/30 px-3 py-0.5 text-[10px] uppercase tracking-widest">
              <Shield className="h-3 w-3" /> {isAdmin ? "Administrator" : "Citizen"}
            </div>
          </div>
        </div>

        {isAdmin && (
          <Link to="/admin" className="mt-6 inline-block text-sm text-primary underline">
            Open admin dashboard →
          </Link>
        )}

        <form onSubmit={onSave} className="mt-10 space-y-4 rounded-2xl border border-border bg-background p-6">
          <h2 className="font-display text-xl">Account details</h2>
          <Field label="Display name">
            <input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              maxLength={120} className={inputCls} />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              maxLength={20} className={inputCls} placeholder="+91…" />
          </Field>
          <Field label="District">
            <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}
              maxLength={80} className={inputCls} placeholder="Cuttack, Khordha…" />
          </Field>
          {msg && <div className="rounded-lg bg-muted px-3 py-2 text-xs">{msg}</div>}
          <button type="submit" disabled={busy} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50">
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      </main>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
