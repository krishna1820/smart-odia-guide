import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</div>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}
