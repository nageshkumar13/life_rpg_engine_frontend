import { ArrowRight, BarChart3, Clock3, Flame, ListChecks, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

const featureCards = [
  {
    title: "Plan the day like a campaign",
    description: "Keep today visible with planned tasks, carryover work, backlog assignments, and a clearer sense of what actually moved.",
    icon: Target,
  },
  {
    title: "Make habits feel tangible",
    description: "Daily logs, weekly patterns, and streak-focused views turn repeating habits into something you can actually read at a glance.",
    icon: Sparkles,
  },
  {
    title: "Track momentum, not noise",
    description: "XP, completion ratios, focus minutes, and activity trends help you see whether your system is reinforcing the right behavior.",
    icon: BarChart3,
  },
];

const proofPoints = [
  {
    value: "Tasks + habits",
    label: "One place to run your day instead of splitting intent, execution, and review across different tools.",
    icon: ListChecks,
  },
  {
    value: "Timeline clarity",
    label: "See what belongs today, what slipped, and what is scheduled next without guessing from empty states.",
    icon: Clock3,
  },
  {
    value: "XP-backed feedback",
    label: "Progress feels game-like, but the source of truth still lives in the backend data and event history.",
    icon: Flame,
  },
];

export function LandingPage() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-primary/80">Life RPG Engine</p>
            <h1 className="mt-2 text-xl font-bold">Design your days with more intent.</h1>
          </div>

          <div className="flex items-center gap-3">
            {token ? (
              <Link
                to="/today"
                className="rounded-full border border-primary/30 bg-primary/15 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/20"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-white/[0.06] hover:text-text-primary"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full border border-primary/30 bg-primary px-5 py-2.5 text-sm font-semibold text-bg transition hover:brightness-110"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-10">
          <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-12">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-text-muted">Built for daily execution</p>
              <h2 className="mt-4 max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
                Turn goals, habits, and daily work into one readable system.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
                Life RPG Engine is a lightweight productivity loop: plan the day, complete the work, protect your habits, and review momentum with
                backend-backed streaks, XP, and activity analytics.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={token ? "/today" : "/signup"}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary px-6 py-3 text-sm font-semibold text-bg transition hover:brightness-110"
                >
                  {token ? "Continue to app" : "Create account"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={token ? "/profile" : "/login"}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-text-secondary transition hover:bg-white/[0.06] hover:text-text-primary"
                >
                  {token ? "View profile" : "Sign in"}
                </Link>
              </div>

              <div className="mt-6 rounded-3xl border border-primary/15 bg-primary/10 px-5 py-4 text-sm text-text-secondary">
                {token && user
                  ? `Signed in as ${user.email}. Your dashboard, habits, backlog, and profile are already ready to load.`
                  : "No OTP wall or extra ceremony here. Simple signup, simple login, and a session that unlocks the full app."}
              </div>
            </div>

            <div className="panel overflow-hidden p-6">
              <div className="rounded-[28px] border border-white/6 bg-black/20 p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  {proofPoints.map(({ value, label, icon: Icon }) => (
                    <div key={value} className="rounded-3xl border border-white/6 bg-white/[0.03] p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-4 text-lg font-semibold">{value}</p>
                      <p className="mt-2 text-sm leading-6 text-text-secondary">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4">
                  {featureCards.map(({ title, description, icon: Icon }) => (
                    <div key={title} className="rounded-3xl border border-white/6 bg-card/70 p-5">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{title}</h3>
                          <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-[32px] border border-white/6 bg-white/[0.03] px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-text-muted">Start here</p>
                <h3 className="mt-3 text-3xl font-bold">Get the full workflow after sign-in.</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
                  Create an account to unlock today planning, streak-based habits, backlog assignment, profile progression, and analytics views driven
                  by your own data instead of a demo identity.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={token ? "/today" : "/login"}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-text-secondary transition hover:bg-white/[0.06] hover:text-text-primary"
                >
                  {token ? "Open today" : "Sign in"}
                </Link>
                <Link
                  to={token ? "/analytics" : "/signup"}
                  className="rounded-full border border-primary/30 bg-primary px-5 py-3 text-sm font-semibold text-bg transition hover:brightness-110"
                >
                  {token ? "See analytics" : "Sign up"}
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
