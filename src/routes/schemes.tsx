import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHero } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import schemesImg from "@/assets/schemes.jpg";
import { ArrowUpRight } from "lucide-react";
import { listContent } from "@/lib/content.functions";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Government Schemes — Smart Odisha" },
      { name: "description", content: "Explore welfare, education, health and farmer schemes from the Government of Odisha." },
    ],
  }),
  component: SchemesPage,
});

type Item = { id: string; title: string; subtitle: string | null; description: string | null; tag: string | null };

function SchemesPage() {
  const fn = useServerFn(listContent);
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [tagFilter, setTagFilter] = useState("all");

  useEffect(() => { fn({ data: { category: "scheme" } }).then((d) => setItems(d as Item[])); }, [fn]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.tag && set.add(i.tag));
    return ["all", ...[...set].sort()];
  }, [items]);

  const filtered = useMemo(() => items.filter((i) => {
    if (tagFilter !== "all" && i.tag !== tagFilter) return false;
    if (q) {
      const hay = `${i.title} ${i.subtitle ?? ""} ${i.description ?? ""}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  }), [items, q, tagFilter]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Government Schemes"
        title="Welfare that reaches every doorstep."
        description="Browse flagship schemes across health, agriculture, education and women's empowerment — designed for the people of Odisha."
        image={schemesImg}
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <SearchBar value={q} onChange={setQ} placeholder="Search schemes…" />
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTagFilter(t)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-widest transition-colors ${
                  tagFilter === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">{filtered.length} of {items.length}</div>
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <article key={s.id} className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]">
              <div className="flex items-center justify-between">
                {s.tag && <span className="rounded-full bg-accent/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground">{s.tag}</span>}
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-45" />
              </div>
              <h3 className="mt-5 font-display text-2xl text-foreground">{s.title}</h3>
              {s.subtitle && <div className="mt-1 text-xs text-primary">{s.subtitle}</div>}
              {s.description && <p className="mt-4 text-sm text-muted-foreground">{s.description}</p>}
            </article>
          ))}
          {filtered.length === 0 && <div className="col-span-full py-16 text-center text-sm text-muted-foreground">No schemes match your search.</div>}
        </div>
      </section>
    </PageShell>
  );
}
