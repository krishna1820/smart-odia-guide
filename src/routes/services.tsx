import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import schemesImg from "@/assets/schemes.jpg";
import { FileText, Zap, Droplet, GraduationCap, Heart, ShieldCheck, Bus, Home } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Local Services — Smart Odisha" },
      { name: "description", content: "Pay bills, request certificates, raise grievances and access citizen services online." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: FileText, name: "Certificates", desc: "Birth, caste, income, residence" },
  { icon: Zap, name: "Electricity Bills", desc: "TPCODL, TPWODL, TPNODL, TPSODL" },
  { icon: Droplet, name: "Water & Sanitation", desc: "PHED connections & complaints" },
  { icon: GraduationCap, name: "Education", desc: "Admissions, scholarships, results" },
  { icon: Heart, name: "Health Services", desc: "BSKY card, hospital lookup" },
  { icon: ShieldCheck, name: "Police & Safety", desc: "FIR, women helpline, traffic" },
  { icon: Bus, name: "Transport", desc: "Driving licence, RC, fitness" },
  { icon: Home, name: "Municipal", desc: "Property tax, trade licence" },
];

function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Local Services"
        title="Your district office, in your pocket."
        description="Sixty citizen services across departments — apply, pay, track and resolve, without queues or paperwork."
        image={schemesImg}
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.name} className="group cursor-pointer bg-background p-8 transition-colors hover:bg-foreground hover:text-background">
              <s.icon className="h-7 w-7 text-primary transition-colors group-hover:text-accent" />
              <div className="mt-6 font-display text-xl">{s.name}</div>
              <div className="mt-1 text-sm opacity-70">{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-24 overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-10 text-background md:p-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-background/80">Mo Sarkar 5T</div>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">
                Have a grievance? We're listening.
              </h2>
              <p className="mt-4 text-background/80">
                Raise a complaint, give feedback or request a callback. Average resolution time under 72 hours.
              </p>
            </div>
            <form className="space-y-3 rounded-2xl bg-background/15 p-6 backdrop-blur">
              <input placeholder="Full name" className="w-full rounded-lg border border-background/30 bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/60 outline-none focus:border-background" />
              <input placeholder="Mobile number" className="w-full rounded-lg border border-background/30 bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/60 outline-none focus:border-background" />
              <textarea placeholder="Describe your concern" rows={3} className="w-full rounded-lg border border-background/30 bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/60 outline-none focus:border-background" />
              <button type="button" className="w-full rounded-lg bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90">
                Submit Grievance
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
