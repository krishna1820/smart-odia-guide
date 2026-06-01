import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHero } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import agriImg from "@/assets/agriculture.jpg";
import { Sprout } from "lucide-react";
import { listContent } from "@/lib/content.functions";

export const Route = createFileRoute("/agriculture")({
  head: () => ({
    meta: [
      { title: "Agriculture — Smart Odisha" },
      { name: "description", content: "Crop advisories, mandi prices, subsidies and digital tools for Odisha's farmers." },
    ],
  }),
  component: AgriculturePage,
});

type Item = { id: string; title: string; subtitle: string | null; description: string | null };

function AgriculturePage() {
  const fn = useServerFn(listContent);
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => { fn({ data: { category: "agriculture" } }).then((d) => setItems(d as Item[])); }, [fn]);

  const filtered = useMemo(() => items.filter((i) =>
    !q || `${i.title} ${i.subtitle ?? ""} ${i.description ?? ""}`.toLowerCase().includes(q.toLowerCase())
  ), [items, q]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Agriculture"
        title="The hands that feed the state, empowered."
        description="A digital companion for every farmer in Odisha — from sowing to selling, in one trusted place."
        image={agriImg}
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 flex items-center justify-between gap-4">
          <SearchBar value={q} onChange={setQ} placeholder="Search resources…" />
          <div className="text-xs text-muted-foreground">{filtered.length} of {items.length}</div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filtered.map((f) => (
            <div key={f.id} className="rounded-2xl border border-border bg-card p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-background">
                <Sprout className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl text-foreground">{f.title}</h3>
              {f.subtitle && <div className="mt-1 text-xs text-primary">{f.subtitle}</div>}
              {f.description && <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>}
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-full py-16 text-center text-sm text-muted-foreground">No resources match.</div>}
        </div>
      </section>
    </PageShell>
  );
}

