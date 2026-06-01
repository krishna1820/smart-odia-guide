import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHero } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
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
  const [q, setQ] = useState("");
  useEffect(() => { fn({ data: { category: "tourism" } }).then((d) => setItems(d as Item[])); }, [fn]);

  const filtered = useMemo(() => items.filter((i) => {
    if (!q) return true;
    return `${i.title} ${i.subtitle ?? ""} ${i.description ?? ""}`.toLowerCase().includes(q.toLowerCase());
  }), [items, q]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Tourism"
        title="A state where every stone tells a story."
        description="From sun temples and royal palaces to tribal hamlets and untouched beaches — plan your journey through Odisha."
        image={tourismImg}
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 flex items-center justify-between gap-4">
          <SearchBar value={q} onChange={setQ} placeholder="Search destinations…" />
          <div className="text-xs text-muted-foreground">{filtered.length} of {items.length}</div>
        </div>
        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <div key={p.id} className="group relative overflow-hidden bg-card p-8 transition-colors hover:bg-foreground hover:text-background">
              <div className="text-xs uppercase tracking-widest text-primary group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}{p.subtitle ? ` · ${p.subtitle}` : ""}
              </div>
              <h3 className="mt-4 font-display text-3xl">{p.title}</h3>
              {p.description && <p className="mt-4 text-sm opacity-70">{p.description}</p>}
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-full bg-card py-16 text-center text-sm text-muted-foreground">No destinations match.</div>}
        </div>
      </section>
    </PageShell>
  );
}

