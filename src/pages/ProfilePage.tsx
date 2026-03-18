import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { StreakBadge } from "@/components/StreakBadge";
import { XPBar } from "@/components/XPBar";
import { useProfileQuery } from "@/features/analytics/queries";

export function ProfilePage() {
  const { data, isLoading } = useProfileQuery();

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  const currentLevelFloor = Math.max(0, (data.user.level - 1) * 160);
  const currentXp = data.user.total_xp - currentLevelFloor;

  return (
    <>
      <PageHeader
        eyebrow="Player Profile"
        title="Profile"
        description="Compact user summary driven by canonical user totals and today-level aggregates."
        actions={<StreakBadge streak={data.user.current_streak} />}
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <XPBar level={data.user.level} currentXp={currentXp} nextLevelXp={160} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Total XP</p>
              <p className="mt-3 text-4xl font-bold text-xp">{data.user.total_xp}</p>
            </div>
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Best streak</p>
              <p className="mt-3 text-4xl font-bold text-streak">{data.user.best_streak}</p>
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Summary stats</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-text-secondary">Habits completed today</span>
              <span className="font-semibold">{data.habits_completed_today}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-text-secondary">Tasks completed today</span>
              <span className="font-semibold">{data.tasks_completed_today}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-text-secondary">Tasks tracked today</span>
              <span className="font-semibold">{data.total_tasks_today}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-text-secondary">Today focus minutes</span>
              <span className="font-semibold">{data.today_focus_minutes}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-text-secondary">Today XP</span>
              <span className="font-semibold text-xp">{data.today_xp}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
