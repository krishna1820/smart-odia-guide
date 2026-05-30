import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/schemes", label: "Schemes" },
  { to: "/tourism", label: "Tourism" },
  { to: "/agriculture", label: "Agriculture" },
  { to: "/services", label: "Services" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
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
        <nav className="hidden items-center gap-1 md:flex">
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
        <Link
          to="/services"
          className="hidden rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:bg-foreground/90 md:inline-flex"
        >
          Citizen Login
        </Link>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
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
        </div>
      )}
    </header>
  );
}
