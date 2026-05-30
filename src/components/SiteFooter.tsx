export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl">Smart Odisha</div>
          <p className="mt-3 max-w-sm text-sm text-background/60">
            A unified digital window into government schemes, tourism, agriculture and citizen services across the state of Odisha.
          </p>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-widest text-background/40">Quick Links</div>
          <ul className="space-y-2 text-sm text-background/80">
            <li>Schemes</li><li>Tourism</li><li>Agriculture</li><li>Local Services</li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-widest text-background/40">Contact</div>
          <ul className="space-y-2 text-sm text-background/80">
            <li>Bhubaneswar, Odisha</li>
            <li>helpdesk@smartodisha.gov.in</li>
            <li>1800-345-6770</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 py-6 text-center text-xs text-background/50">
        © {new Date().getFullYear()} Smart Odisha Development Portal · Built for the people of Odisha
      </div>
    </footer>
  );
}
