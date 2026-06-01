import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "Home" },
  { to: "/schemes", label: "Schemes" },
  { to: "/tourism", label: "Tourism" },
  { to: "/agriculture", label: "Agriculture" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email: string | null } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { email: data.user.email ?? null } : null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ? { email: session.user.email ?? null } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full bg-[image:var(--gradient-hero)] shadow-[var(--shadow-glow)]">
            <div className="absolute inset-1.5 rounded-full border-2 border-ivory/70" />
            <div className="absolute inset-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-foreground">Smart Odisha</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Development Portal</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-foreground/5 text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:bg-foreground/90"
            >
              <User className="h-4 w-4" />
              Account
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-foreground/90"
            >
              Sign in
            </Link>
          )}
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-6 py-4 lg:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-foreground"
            >
              {n.label}
            </Link>
          ))}
          <div className="mt-3 border-t border-border pt-3">
            {user ? (
              <Link to="/profile" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-primary">
                My account
              </Link>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-primary">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
