import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMyRole, claimFirstAdmin } from "@/lib/content.functions";
import { LogOut, Shield, FileText, MapPin, Sprout, Building2, Home, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin · Smart Odisha" }] }),
  component: AdminLayout,
});

const tabs = [
  { to: "/admin", label: "Dashboard", icon: Home, exact: true },
  { to: "/admin/scheme", label: "Schemes", icon: FileText },
  { to: "/admin/tourism", label: "Tourism", icon: MapPin },
  { to: "/admin/agriculture", label: "Agriculture", icon: Sprout },
  { to: "/admin/service", label: "Services", icon: Building2 },
  { to: "/admin/feedback", label: "Feedback", icon: MessageSquare },
];

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const fetchRole = useServerFn(getMyRole);
  const claim = useServerFn(claimFirstAdmin);
  const [state, setState] = useState<"checking" | "admin" | "not-admin">("checking");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
    fetchRole().then((r) => setState(r.isAdmin ? "admin" : "not-admin")).catch(() => setState("not-admin"));
  }, [fetchRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  const claimAdmin = async () => {
    setErr(null);
    try {
      await claim();
      setState("admin");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  if (state === "checking") {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Checking access…</div>;
  }

  if (state === "not-admin") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <Shield className="h-10 w-10 text-primary" />
        <h1 className="mt-4 font-display text-3xl text-foreground">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in as <strong>{email}</strong> but this account doesn't have admin rights.
          If you're the first user, claim admin access now. Otherwise, ask an existing admin to grant access.
        </p>
        {err && <div className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>}
        <div className="mt-6 flex gap-3">
          <button onClick={claimAdmin} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90">
            Claim admin access
          </button>
          <button onClick={signOut} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[image:var(--gradient-hero)]" />
            <div className="font-display text-lg">Smart Odisha <span className="text-muted-foreground">/ Admin</span></div>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground md:inline">{email}</span>
            <button onClick={signOut} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 hover:bg-muted">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6">
          {tabs.map((t) => {
            const active = t.exact ? path === t.to : path.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
