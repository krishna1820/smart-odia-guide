import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Smart Odisha Admin" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") return; // handled on /reset-password
      if (session) navigate({ to: "/profile", replace: true });
    });
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/profile", replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/profile" },
        });
        if (error) throw error;
        setInfo("Check your email to confirm your account.");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setInfo("If an account exists for that email, a reset link is on its way.");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/profile",
    });
    if (result.error) setError(result.error.message);
  };

  const title = mode === "signin" ? "Admin sign in" : mode === "signup" ? "Create admin account" : "Reset your password";
  const cta = mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link";

  return (
    <PageShell>
      <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
        <Link to="/" className="text-xs uppercase tracking-[0.3em] text-primary">← Smart Odisha</Link>
        <h1 className="mt-4 font-display text-4xl text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "forgot"
            ? "Enter your email and we'll send you a secure link to reset your password."
            : "Restricted area. The first registered user can claim admin access."}
        </p>

        {mode !== "forgot" && (
          <>
            <button
              onClick={google}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Continue with Google
            </button>
            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={submit} className={`space-y-3 ${mode === "forgot" ? "mt-8" : ""}`}>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          {mode !== "forgot" && (
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          )}
          {error && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>}
          {info && <div className="rounded-lg bg-accent/30 px-3 py-2 text-xs">{info}</div>}
          <button
            type="submit" disabled={busy}
            className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Please wait…" : cta}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
          {mode === "signin" && (
            <>
              <button onClick={() => { setMode("forgot"); setError(null); setInfo(null); }} className="hover:text-foreground">
                Forgot your password?
              </button>
              <button onClick={() => { setMode("signup"); setError(null); setInfo(null); }} className="hover:text-foreground">
                Don't have an account? Sign up
              </button>
            </>
          )}
          {mode === "signup" && (
            <button onClick={() => { setMode("signin"); setError(null); setInfo(null); }} className="hover:text-foreground">
              Already have an account? Sign in
            </button>
          )}
          {mode === "forgot" && (
            <button onClick={() => { setMode("signin"); setError(null); setInfo(null); }} className="hover:text-foreground">
              Back to sign in
            </button>
          )}
        </div>
      </section>
    </PageShell>
  );
}
