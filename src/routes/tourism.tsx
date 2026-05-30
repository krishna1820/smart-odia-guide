import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import tourismImg from "@/assets/tourism.jpg";

export const Route = createFileRoute("/tourism")({
  head: () => ({
    meta: [
      { title: "Tourism in Odisha — Smart Odisha" },
      { name: "description", content: "Temples, beaches, wildlife and tribal heritage — discover the soul of Odisha." },
    ],
  }),
  component: TourismPage,
});

const places = [
  { name: "Konark Sun Temple", region: "Puri District", note: "13th century UNESCO World Heritage site shaped as a colossal chariot." },
  { name: "Puri Jagannath Temple", region: "Puri", note: "One of the Char Dham pilgrimages and the seat of the Rath Yatra." },
  { name: "Chilika Lake", region: "Khordha", note: "Asia's largest brackish water lagoon — home to dolphins and migratory birds." },
  { name: "Bhitarkanika National Park", region: "Kendrapara", note: "Mangrove forests and saltwater crocodiles in their natural habitat." },
  { name: "Udayagiri & Khandagiri", region: "Bhubaneswar", note: "Ancient rock-cut Jain caves carved over 2,000 years ago." },
  { name: "Daringbadi", region: "Kandhamal", note: "The 'Kashmir of Odisha' — pine forests, valleys and coffee plantations." },
];

function TourismPage() {
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
          {places.map((p, i) => (
            <div key={p.name} className="group relative overflow-hidden bg-card p-8 transition-colors hover:bg-foreground hover:text-background">
              <div className="text-xs uppercase tracking-widest text-primary group-hover:text-accent">{String(i + 1).padStart(2, "0")} · {p.region}</div>
              <h3 className="mt-4 font-display text-3xl">{p.name}</h3>
              <p className="mt-4 text-sm opacity-70">{p.note}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
