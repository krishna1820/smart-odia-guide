import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import schemesImg from "@/assets/schemes.jpg";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Government Schemes — Smart Odisha" },
      { name: "description", content: "Explore welfare, education, health and farmer schemes from the Government of Odisha." },
    ],
  }),
  component: SchemesPage,
});

const schemes = [
  { name: "Kalia Yojana", dept: "Agriculture & Farmers", desc: "Financial assistance of ₹10,000/year for small and marginal farmers.", tag: "Farmers" },
  { name: "Biju Swasthya Kalyan Yojana", dept: "Health", desc: "Cashless treatment up to ₹5 lakh per family per year.", tag: "Health" },
  { name: "Mukhyamantri Karma Tatpara Abhiyan", dept: "Skill Development", desc: "Skilling youth for industry-ready employment.", tag: "Youth" },
  { name: "Mission Shakti", dept: "Women & Child", desc: "Empowering 70 lakh women through self-help groups.", tag: "Women" },
  { name: "Madho Singh Haath Kharcha", dept: "ST & SC Development", desc: "Pocket money for tribal students in residential schools.", tag: "Education" },
  { name: "Nirman Shramik Pension", dept: "Labour", desc: "Monthly pension for registered construction workers.", tag: "Workers" },
];

function SchemesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Government Schemes"
        title="Welfare that reaches every doorstep."
        description="Browse flagship schemes across health, agriculture, education and women's empowerment — designed for the people of Odisha."
        image={schemesImg}
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schemes.map((s) => (
            <article key={s.name} className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-accent/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground">{s.tag}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-45" />
              </div>
              <h3 className="mt-5 font-display text-2xl text-foreground">{s.name}</h3>
              <div className="mt-1 text-xs text-primary">{s.dept}</div>
              <p className="mt-4 text-sm text-muted-foreground">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
