import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Reveal } from "@/components/Reveal";

const SITE = "https://avatar-journey-web.lovable.app";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — SAIF Solutions" },
      { name: "description", content: "Secure sign in for the SAIF Solutions admin dashboard." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Sign In — SAIF Solutions" },
      { property: "og:description", content: "Secure sign in for the SAIF Solutions admin dashboard." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/auth` },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created — signing you in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: "/admin" });
      else toast.info("Check your inbox to confirm your email, then sign in.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Try email and password.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pb-24 pt-32">
      <Reveal>
        <div className="glass-card w-[min(26rem,90vw)] rounded-3xl p-8">
          <p className="font-display text-xs tracking-[0.4em] text-accent">ADMIN ACCESS</p>
          <h1 className="chrome-text mt-3 text-3xl">
            {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
          </h1>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl bg-secondary px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block text-sm">
              Password
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl bg-secondary px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="glow-ring w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:opacity-60"
            >
              {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
            </button>
          </form>

          <button
            onClick={google}
            className="mt-3 w-full rounded-full border border-border px-6 py-3 font-semibold transition hover:bg-secondary"
          >
            Continue with Google
          </button>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-sm text-accent"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </Reveal>
    </div>
  );
}
