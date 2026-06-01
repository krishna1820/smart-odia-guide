import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHero } from "@/components/PageShell";
import { submitFeedback } from "@/lib/portal.functions";
import { CheckCircle2 } from "lucide-react";
import schemesImg from "@/assets/schemes.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Feedback — Smart Odisha" },
      { name: "description", content: "Share feedback, suggestions or grievances with the Smart Odisha Development Portal team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const submit = useServerFn(submitFeedback);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", category: "general" as const });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await submit({ data: form });
      setDone(true);
      setForm({ name: "", email: "", subject: "", message: "", category: "general" });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Contact & Feedback"
        title="We're listening — every voice shapes Odisha."
        description="Send us a suggestion, raise a grievance, or simply say hello. Our team reviews every message."
        image={schemesImg}
      />
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-3xl text-foreground">Get in touch</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            For urgent grievances, use the 5T Mo Sarkar category. We typically respond within 7 working days.
          </p>
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">Email</dt>
              <dd className="mt-1 text-foreground">portal@odisha.gov.in</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">Helpline</dt>
              <dd className="mt-1 text-foreground">155335 (toll-free)</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">Address</dt>
              <dd className="mt-1 text-foreground">Lok Seva Bhawan, Bhubaneswar, Odisha 751001</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-background p-8 shadow-[var(--shadow-elegant)]">
          {done ? (
            <div className="flex flex-col items-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <h3 className="mt-4 font-display text-2xl">Thank you</h3>
              <p className="mt-2 text-sm text-muted-foreground">Your message has been recorded. We'll reach out if a response is needed.</p>
              <button onClick={() => setDone(false)} className="mt-6 text-sm text-primary underline">Send another</button>
            </div>
          ) : (
            <>
              <h3 className="font-display text-2xl">Send a message</h3>
              <div className="mt-5 grid gap-3">
                <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required maxLength={120} />
                <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required maxLength={200} />
                <label className="block">
                  <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-muted-foreground">Category</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as typeof form.category })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="general">General</option>
                    <option value="grievance">Grievance (Mo Sarkar)</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="scheme">Schemes</option>
                    <option value="tourism">Tourism</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="service">Services</option>
                  </select>
                </label>
                <Input label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required maxLength={200} />
                <label className="block">
                  <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-muted-foreground">Message</span>
                  <textarea
                    required minLength={5} maxLength={2000} rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
                {err && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>}
                <button
                  type="submit" disabled={busy}
                  className="mt-2 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? "Sending…" : "Send message"}
                </button>
              </div>
            </>
          )}
        </form>
      </section>
    </PageShell>
  );
}

function Input({ label, value, onChange, type = "text", required, maxLength }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type} required={required} maxLength={maxLength}
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
