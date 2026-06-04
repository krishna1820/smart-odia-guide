import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Smart Odisha" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase recovery link sets a session via hash params; listen for it.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate({ to: "/login", replace: true }), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
        <Link to="/" className="text-xs uppercase tracking-[0.3em] text-primary">← Smart Odisha</Link>
        <h1 className="mt-4 font-display text-4xl text-foreground">Set a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {ready
            ? "Choose a strong password (minimum 8 characters)."
            : "Verifying your reset link… If nothing happens, request a new link from the sign-in page."}
        </p>

        {done ? (
          <div className="mt-8 rounded-lg bg-accent/30 px-4 py-3 text-sm">
            Password updated. Redirecting to sign in…
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-3">
            <input
              type="password" required minLength={8}
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              disabled={!ready}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary disabled:opacity-50"
            />
            <input
              type="password" required minLength={8}
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              disabled={!ready}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary disabled:opacity-50"
            />
            {error && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>}
            <button
              type="submit" disabled={busy || !ready}
              className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
        )}

        <Link to="/login" className="mt-6 text-center text-sm text-muted-foreground hover:text-foreground">
          Back to sign in
        </Link>
      </section>
    </PageShell>
  );
}
