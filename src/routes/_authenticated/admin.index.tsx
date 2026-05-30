import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, MapPin, Sprout, Building2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

const cards = [
  { to: "/admin/scheme", label: "Schemes", icon: FileText, desc: "Welfare and government programs" },
  { to: "/admin/tourism", label: "Tourism", icon: MapPin, desc: "Destinations and heritage sites" },
  { to: "/admin/agriculture", label: "Agriculture", icon: Sprout, desc: "Farmer tools and advisories" },
  { to: "/admin/service", label: "Services", icon: Building2, desc: "Citizen services and utilities" },
];

function AdminHome() {
  return (
    <div>
      <h1 className="font-display text-4xl text-foreground">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage all public content across the portal.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
            <c.icon className="h-6 w-6 text-primary" />
            <div className="mt-4 font-display text-2xl text-foreground">{c.label}</div>
            <div className="text-sm text-muted-foreground">{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
