import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHero } from "@/components/PageShell";
import tourismImg from "@/assets/tourism.jpg";
import { listContent } from "@/lib/content.functions";

export const Route = createFileRoute("/tourism")({
  head: () => ({
    meta: [
      { title: "Tourism in Odisha — Smart Odisha" },
      { name: "description", content: "Temples, beaches, wildlife and tribal heritage — discover the soul of Odisha." },
    ],
  }),
  component: TourismPage,
});

type Item = { id: string; title: string; subtitle: string | null; description: string | null };

function TourismPage() {
  const fn = useServerFn(listContent);
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => { fn({ data: { category: "tourism" } }).then((d) => setItems(d as Item[])); }, [fn]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Tourism"
        title="A state where every stone tells a story."
        description="From sun temples and royal palaces to tribal hamlets and untouched beaches — plan your journey through Odisha."
        image={tourismImg}
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <div key={p.id} className="group relative overflow-hidden bg-card p-8 transition-colors hover:bg-foreground hover:text-background">
              <div className="text-xs uppercase tracking-widest text-primary group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}{p.subtitle ? ` · ${p.subtitle}` : ""}
              </div>
              <h3 className="mt-4 font-display text-3xl">{p.title}</h3>
              {p.description && <p className="mt-4 text-sm opacity-70">{p.description}</p>}
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
