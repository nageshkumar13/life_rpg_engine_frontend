import { ChevronDown, ChevronUp, Flame, Target } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { FloatingQuickAdd } from "@/components/FloatingQuickAdd";
import { HabitCard } from "@/components/HabitCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { StreakBadge } from "@/components/StreakBadge";
import { TaskCard } from "@/components/TaskCard";
import { XPBar } from "@/components/XPBar";
import { useToggleHabitMutation } from "@/features/habits/queries";
import { useAdvanceTaskMutation, useTodayQuery } from "@/features/tasks/queries";
import { formatLongDate } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";

export function TodayPage() {
  const { data, isLoading } = useTodayQuery();
  const [showCompleted, setShowCompleted] = useState(false);
  const advanceTask = useAdvanceTaskMutation();
  const toggleHabit = useToggleHabitMutation();
  const pushXpToast = useUiStore((state) => state.pushXpToast);

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  const completion = Math.round(data.stats.daily_completion_ratio * 100);

  return (
    <>
      <PageHeader
        eyebrow={formatLongDate(data.stats.date)}
        title="Today"
        description="Run the day like a campaign. Clear planned quests, protect identity habits, and let backend-truth drive the state changes."
        actions={<StreakBadge streak={data.stats.current_streak} />}
      />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Daily completion</p>
              <p className="mt-3 text-4xl font-bold">{completion}%</p>
              <div className="mt-4 h-2 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${completion}%` }} />
              </div>
            </div>
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Focus minutes</p>
              <p className="mt-3 text-4xl font-bold">{data.stats.focus_minutes}</p>
              <p className="mt-2 text-sm text-text-secondary">Derived from completed habit logs for the selected day</p>
            </div>
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Today XP</p>
              <div className="mt-3 inline-flex items-center gap-2 text-4xl font-bold text-xp">
                <Flame className="h-8 w-8 text-streak" />
                {data.stats.today_xp}
              </div>
              <p className="mt-2 text-sm text-text-secondary">Event-sourced through XP logs</p>
            </div>
          </div>

          <XPBar level={data.stats.current_level} currentXp={data.stats.level_xp} nextLevelXp={data.stats.next_level_xp} />

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Planned Tasks</h3>
                <p className="mt-1 text-sm text-text-secondary">PLANNED, ACTIVE, and BACKLOG-sourced tasks assigned to this day.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-info/20 bg-info/10 px-3 py-2 text-sm text-info">
                <Target className="h-4 w-4" />
                {data.planned_tasks.length} active
              </div>
            </div>

            {data.planned_tasks.length ? (
              data.planned_tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={async () => {
                    const result = await advanceTask.mutateAsync(task.id);
                    if (result.xp_delta) {
                      pushXpToast(result.xp_delta);
                    }
                  }}
                />
              ))
            ) : (
              <EmptyState title="No planned tasks" description="The backend has no active planned work assigned to this day yet." />
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Habit Tasks</h3>
              <p className="mt-1 text-sm text-text-secondary">Daily habit state is derived from date-scoped habit logs, not transient UI state.</p>
            </div>

            <div className="grid gap-4">
              {data.habit_items.map((item) => (
                <HabitCard
                  key={item.habit.id}
                  item={item}
                  onToggle={async () => {
                    const result = await toggleHabit.mutateAsync(item.habit.id);
                    if (result.xp_delta) {
                      pushXpToast(result.xp_delta);
                    }
                  }}
                />
              ))}
            </div>
          </section>

          {data.unplanned_tasks.length ? (
            <section className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Unplanned Tasks</h3>
                <p className="mt-1 text-sm text-text-secondary">Intentional visibility for reactive work that showed up during the day.</p>
              </div>
              {data.unplanned_tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={async () => {
                    const result = await advanceTask.mutateAsync(task.id);
                    if (result.xp_delta) {
                      pushXpToast(result.xp_delta);
                    }
                  }}
                />
              ))}
            </section>
          ) : null}

          <section className="space-y-4">
            <button
              type="button"
              onClick={() => setShowCompleted((value) => !value)}
              className="flex w-full items-center justify-between rounded-3xl border border-white/5 bg-white/[0.03] px-5 py-4 text-left transition hover:bg-white/[0.05]"
            >
              <div>
                <h3 className="text-xl font-semibold">Completed Tasks</h3>
                <p className="mt-1 text-sm text-text-secondary">{data.completed_tasks.length} tasks already banked today</p>
              </div>
              {showCompleted ? <ChevronUp className="h-5 w-5 text-text-secondary" /> : <ChevronDown className="h-5 w-5 text-text-secondary" />}
            </button>

            {showCompleted ? (
              data.completed_tasks.length ? (
                data.completed_tasks.map((task) => <TaskCard key={task.id} task={task} onToggle={() => undefined} />)
              ) : (
                <EmptyState title="Nothing completed yet" description="Once a task reaches DONE it lands here for the victory lap." />
              )
            ) : null}
          </section>
        </div>

        <div className="space-y-4">
          <div className="panel subtle-grid p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Coordination Notes</p>
            <h3 className="mt-3 text-2xl font-bold">Server truth wins.</h3>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Task status, completion percentage, streaks, and XP totals should always rehydrate from the backend after important transitions.
            </p>
          </div>

          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Today at a glance</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
                <span className="text-sm text-text-secondary">Completed tasks</span>
                <span className="font-semibold">{data.completed_tasks.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
                <span className="text-sm text-text-secondary">Completed habits</span>
                <span className="font-semibold">{data.habit_items.filter((item) => item.log?.status === "COMPLETED").length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
                <span className="text-sm text-text-secondary">Total XP</span>
                <span className="font-semibold text-xp">{data.stats.total_xp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingQuickAdd />
    </>
  );
}
