import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Users, Eye, MessageSquare, FileText, MapPin, Sprout, Building2, TrendingUp } from "lucide-react";
import { getAnalytics } from "@/lib/portal.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

type Analytics = Awaited<ReturnType<typeof getAnalytics>>;

function AdminHome() {
  const fn = useServerFn(getAnalytics);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fn().then((d) => setData(d as Analytics)).finally(() => setLoading(false));
  }, [fn]);

  if (loading) return <div className="text-sm text-muted-foreground">Loading dashboard…</div>;
  if (!data) return <div className="text-sm text-destructive">Couldn't load analytics.</div>;

  const maxDay = Math.max(1, ...data.byDay.map((d) => d.count));

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Real-time view of portal usage and content.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Eye} label="Visits (24h)" value={data.visits24} />
        <Stat icon={TrendingUp} label="Visits (30d)" value={data.visits30} />
        <Stat icon={Users} label="Registered users" value={data.usersTotal} />
        <Stat icon={MessageSquare} label="New feedback" value={data.feedbackNew} accent={data.feedbackNew > 0} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Visits — last 14 days</h2>
            <div className="text-xs text-muted-foreground">Total: {data.visitsTotal.toLocaleString()}</div>
          </div>
          <div className="mt-6 flex h-48 items-end gap-1.5">
            {data.byDay.map((d) => (
              <div key={d.date} className="group relative flex flex-1 flex-col items-center">
                <div
                  className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary"
                  style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count > 0 ? 4 : 1 }}
                />
                <div className="invisible absolute -top-7 rounded-md bg-foreground px-2 py-0.5 text-[10px] text-background group-hover:visible">
                  {d.count}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>{data.byDay[0]?.date.slice(5)}</span>
            <span>{data.byDay[data.byDay.length - 1]?.date.slice(5)}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6">
          <h2 className="font-display text-xl">Top pages</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.topPaths.length === 0 && <li className="text-muted-foreground">No visits yet.</li>}
            {data.topPaths.map((p) => (
              <li key={p.path} className="flex items-center justify-between gap-3">
                <span className="truncate text-foreground">{p.path}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{p.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="mt-12 font-display text-2xl text-foreground">Manage content</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { to: "/admin/scheme", label: "Schemes", icon: FileText, count: data.contentByCategory.scheme },
          { to: "/admin/tourism", label: "Tourism", icon: MapPin, count: data.contentByCategory.tourism },
          { to: "/admin/agriculture", label: "Agriculture", icon: Sprout, count: data.contentByCategory.agriculture },
          { to: "/admin/service", label: "Services", icon: Building2, count: data.contentByCategory.service },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-2xl border border-border bg-background p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
            <c.icon className="h-5 w-5 text-primary" />
            <div className="mt-3 font-display text-xl">{c.label}</div>
            <div className="text-xs text-muted-foreground">{c.count} item{c.count === 1 ? "" : "s"}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border bg-background p-5 ${accent ? "border-primary/40" : "border-border"}`}>
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-3 font-display text-3xl text-foreground">{value.toLocaleString()}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
