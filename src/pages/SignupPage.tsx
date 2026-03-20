import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signup } from "@/api/auth";
import { formatRedirectLabel, getRedirectState, getRedirectTarget } from "@/lib/auth-redirect";
import { useAuthStore } from "@/store/auth-store";

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const redirectTarget = useMemo(() => getRedirectTarget(location.state), [location.state]);
  const redirectState = useMemo(() => getRedirectState(location.state), [location.state]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await signup({ email, password });
      setSession(response.access_token, response.user);
      navigate(redirectTarget, { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
        <section className="panel hidden p-8 lg:block">
          <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Life RPG Engine</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Create a simple account and start building momentum.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-text-secondary">
            This version keeps auth intentionally light: email, password, JWT session, and straight into the app. Once inside, your habits, tasks,
            backlog, profile progression, and analytics all stay scoped to your own user.
          </p>
          <div className="mt-8 rounded-3xl border border-primary/15 bg-primary/10 p-5">
            <p className="text-sm font-semibold">What you unlock</p>
            <div className="mt-4 space-y-3 text-sm text-text-secondary">
              <p>A cleaner Today view with planned tasks, completed tasks, and schedule visibility.</p>
              <p>Habit boards with logs, streaks, and weekly or monthly consistency views.</p>
              <p>Profile and analytics screens tied to your own XP and completion history.</p>
            </div>
          </div>
        </section>

        <section className="panel p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Simple signup</p>
          <h2 className="mt-3 text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-sm text-text-secondary">Email plus password is enough to get started here.</p>

          {redirectTarget !== "/today" ? (
            <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/10 px-4 py-3 text-sm text-text-secondary">
              Create an account to continue to {formatRedirectLabel(redirectTarget)}.
            </div>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text-secondary">Email</span>
              <div className="flex items-center rounded-2xl border border-white/10 bg-black/20 px-4 transition focus-within:border-primary/60">
                <Mail className="h-4 w-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-transparent px-3 py-3 text-base text-text-primary outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-text-secondary">Password</span>
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted transition hover:text-text-primary"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="flex items-center rounded-2xl border border-white/10 bg-black/20 px-4 transition focus-within:border-primary/60">
                <LockKeyhole className="h-4 w-4 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full bg-transparent px-3 py-3 text-base text-text-primary outline-none"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-xl p-1 text-text-muted transition hover:bg-white/5 hover:text-text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3 text-xs leading-6 text-text-muted">
              Password must be at least 6 characters. This is intentionally simple auth for now, so advanced recovery and MFA are not part of this flow yet.
            </div>

            {error ? <p className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-primary/30 bg-primary px-5 py-3 text-base font-semibold text-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-text-secondary">
            Already have an account?{" "}
            <Link to="/login" state={redirectState} className="font-semibold text-primary transition hover:text-primary/80">
              Sign in
            </Link>
          </p>

          <p className="mt-3 text-sm text-text-secondary">
            Want the overview first?{" "}
            <Link to="/" className="font-semibold text-text-primary transition hover:text-primary">
              Go to home
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
