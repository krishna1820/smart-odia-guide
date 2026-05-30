import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import agriImg from "@/assets/agriculture.jpg";
import { Sprout, Droplets, TrendingUp, Tractor } from "lucide-react";

export const Route = createFileRoute("/agriculture")({
  head: () => ({
    meta: [
      { title: "Agriculture — Smart Odisha" },
      { name: "description", content: "Crop advisories, mandi prices, subsidies and digital tools for Odisha's farmers." },
    ],
  }),
  component: AgriculturePage,
});

const features = [
  { icon: Sprout, title: "Crop Advisory", desc: "Personalised guidance for paddy, pulses, oilseeds and horticulture." },
  { icon: TrendingUp, title: "Live Mandi Prices", desc: "Daily price updates from over 80 regulated markets across the state." },
  { icon: Droplets, title: "Irrigation & Weather", desc: "Reservoir levels, rainfall forecasts and Jal Jeevan project status." },
  { icon: Tractor, title: "Subsidies & Equipment", desc: "Apply for tractors, pumps and farm machinery subsidies online." },
];

const prices = [
  { crop: "Paddy (Common)", mandi: "Bargarh", price: "₹2,300", trend: "+1.2%" },
  { crop: "Arhar Dal", mandi: "Cuttack", price: "₹7,850", trend: "+0.4%" },
  { crop: "Groundnut", mandi: "Balangir", price: "₹6,100", trend: "-0.8%" },
  { crop: "Turmeric", mandi: "Kandhamal", price: "₹12,400", trend: "+2.1%" },
];

function AgriculturePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Agriculture"
        title="The hands that feed the state, empowered."
        description="A digital companion for every farmer in Odisha — from sowing to selling, in one trusted place."
        image={agriImg}
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-background">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="border-b border-border bg-muted/40 px-8 py-6">
            <div className="text-xs uppercase tracking-widest text-primary">Live mandi prices</div>
            <h2 className="mt-2 font-display text-3xl text-foreground">Today's rates · per quintal</h2>
          </div>
          <table className="w-full text-left">
            <thead className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-8 py-4">Crop</th>
                <th className="px-8 py-4">Mandi</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => (
                <tr key={p.crop} className="border-b border-border last:border-0">
                  <td className="px-8 py-5 font-medium text-foreground">{p.crop}</td>
                  <td className="px-8 py-5 text-muted-foreground">{p.mandi}</td>
                  <td className="px-8 py-5 font-display text-xl text-foreground">{p.price}</td>
                  <td className={`px-8 py-5 text-sm ${p.trend.startsWith("+") ? "text-jade" : "text-destructive"}`}>{p.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
