import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHero } from "@/components/PageShell";
import schemesImg from "@/assets/schemes.jpg";
import { Building2 } from "lucide-react";
import { listContent } from "@/lib/content.functions";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Local Services — Smart Odisha" },
      { name: "description", content: "Pay bills, request certificates, raise grievances and access citizen services online." },
    ],
  }),
  component: ServicesPage,
});

type Item = { id: string; title: string; subtitle: string | null; description: string | null };

function ServicesPage() {
  const fn = useServerFn(listContent);
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => { fn({ data: { category: "service" } }).then((d) => setItems(d as Item[])); }, [fn]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Local Services"
        title="Your district office, in your pocket."
        description="Citizen services across departments — apply, pay, track and resolve, without queues or paperwork."
        image={schemesImg}
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s) => (
            <div key={s.id} className="group cursor-pointer bg-background p-8 transition-colors hover:bg-foreground hover:text-background">
              <Building2 className="h-7 w-7 text-primary transition-colors group-hover:text-accent" />
              <div className="mt-6 font-display text-xl">{s.title}</div>
              {s.subtitle && <div className="mt-1 text-sm opacity-70">{s.subtitle}</div>}
              {s.description && <div className="mt-2 text-xs opacity-60">{s.description}</div>}
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
