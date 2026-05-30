import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Landmark, Sprout, MapPin, Building2 } from "lucide-react";
import hero from "@/assets/hero-odisha.jpg";
import agri from "@/assets/agriculture.jpg";
import tourism from "@/assets/tourism.jpg";
import schemes from "@/assets/schemes.jpg";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Odisha Development Portal" },
      { name: "description", content: "A unified digital window into Odisha government schemes, tourism, agriculture and citizen services." },
      { property: "og:title", content: "Smart Odisha Development Portal" },
      { property: "og:description", content: "Discover schemes, tourism, agriculture and local services across Odisha." },
    ],
  }),
  component: Index,
});

const pillars = [
  { to: "/schemes", title: "Government Schemes", icon: Landmark, image: schemes, desc: "Welfare, education, health and pension programs for every citizen.", count: "120+ active schemes" },
  { to: "/tourism", title: "Tourism", icon: MapPin, image: tourism, desc: "Temples, beaches, wildlife and tribal heritage of Odisha.", count: "300+ destinations" },
  { to: "/agriculture", title: "Agriculture", icon: Sprout, image: agri, desc: "Crop advisories, mandi prices, subsidies and farmer support.", count: "45 lakh farmers" },
  { to: "/services", title: "Local Services", icon: Building2, image: schemes, desc: "Certificates, utilities, grievances and municipal services online.", count: "60+ services" },
];

const stats = [
  { v: "30", l: "Districts" },
  { v: "4.5Cr", l: "Citizens served" },
  { v: "₹1.2L Cr", l: "Scheme outlay" },
  { v: "300+", l: "Heritage sites" },
];

function Index() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={hero} alt="Konark sun temple wheel" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-28 pt-20 md:grid-cols-12 md:pt-32">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-medium text-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Government of Odisha · Digital India Initiative
            </div>
            <h1 className="mt-6 font-display text-6xl leading-[0.95] text-foreground md:text-8xl">
              The soul of Odisha,<br />
              <span className="italic text-primary">now one click away.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              From the temples of Puri to the paddy fields of Sambalpur — discover schemes, services and stories powering the state's transformation.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/schemes" className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-all hover:gap-3">
                Explore Schemes <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
              <Link to="/tourism" className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3.5 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-background">
                Visit Odisha
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 md:pt-20">
            <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-[var(--shadow-elegant)] backdrop-blur-xl">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Today in Odisha</div>
              <div className="mt-4 space-y-4">
                {[
                  { k: "Kalia Yojana", v: "New cycle disbursed to 38L farmers" },
                  { k: "Rath Yatra", v: "Live darshan from Puri at 4:00 PM" },
                  { k: "Mo Sarkar", v: "1,240 grievances resolved today" },
                ].map((i) => (
                  <div key={i.k} className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-foreground">{i.k}</div>
                      <div className="text-xs text-muted-foreground">{i.v}</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-background/10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-foreground px-6 py-10">
              <div className="font-display text-5xl text-accent">{s.v}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-background/60">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary">Four pillars</div>
            <h2 className="mt-3 max-w-2xl font-display text-5xl text-foreground">
              Everything the state offers, organised for you.
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            One portal. Every department. Built with citizens at the centre.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {pillars.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={p.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-background/90 backdrop-blur">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="p-7">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl text-foreground">{p.title}</h3>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-foreground" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-5 text-xs uppercase tracking-widest text-primary">{p.count}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <div className="font-display text-3xl italic leading-relaxed text-foreground md:text-5xl">
          "Odisha's progress is written in the hands of its farmers, the prayers of its devotees, and the dreams of its youth."
        </div>
        <div className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">Vision · Smart Odisha 2030</div>
      </section>
    </PageShell>
  );
}
