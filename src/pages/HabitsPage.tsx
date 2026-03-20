import { ACTIVE_DATE } from "@/lib/session";
import { addDays } from "@/lib/utils";
import { HabitCard } from "@/components/HabitCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorState } from "@/components/QueryErrorState";
import { useDeleteHabitMutation, useHabitsQuery, useToggleHabitMutation } from "@/features/habits/queries";
import { useUiStore } from "@/store/ui-store";

function getWindowDates(length: number) {
  return Array.from({ length }, (_, index) => addDays(ACTIVE_DATE, index - (length - 1)));
}

export function HabitsPage() {
  const { data, error, isError, isLoading } = useHabitsQuery();
  const toggleHabit = useToggleHabitMutation();
  const deleteHabit = useDeleteHabitMutation();
  const pushXpToast = useUiStore((state) => state.pushXpToast);
  const openHabitEditor = useUiStore((state) => state.openHabitEditor);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <QueryErrorState title="Habits could not load" error={error} />;
  }

  if (!data) {
    return <QueryErrorState title="Habits could not load" error={new Error("The habits response was empty.")} />;
  }

  const weekDates = getWindowDates(7);
  const monthDates = getWindowDates(30);
  const completedThisWeek = data.reduce(
    (sum, item) => sum + weekDates.filter((date) => item.habit.logs?.some((log) => log.log_date === date && log.status === "COMPLETED")).length,
    0,
  );
  const completedThisMonth = data.reduce(
    (sum, item) => sum + monthDates.filter((date) => item.habit.logs?.some((log) => log.log_date === date && log.status === "COMPLETED")).length,
    0,
  );

  const handleDeleteHabit = async (habitId: string, title: string) => {
    if (!window.confirm(`Delete habit "${title}"? This will remove its logs too.`)) {
      return;
    }

    await deleteHabit.mutateAsync(habitId);
  };

  return (
    <>
      <PageHeader
        eyebrow="Habit Board"
        title="Habits"
        description="Daily habit state is date-driven through habit logs, with weekly and monthly views layered on top so streaks feel visible rather than hidden in raw counters."
        actions={
          <>
            <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-primary/80">7-day hits</p>
              <p className="mt-2 text-lg font-semibold text-text-primary">{completedThisWeek}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">30-day hits</p>
              <p className="mt-2 text-lg font-semibold text-text-primary">{completedThisMonth}</p>
            </div>
          </>
        }
      />
      <div className="grid gap-4">
        {data.map((item) => (
          <HabitCard
            key={item.habit.id}
            item={item}
            onEdit={() => openHabitEditor(item.habit)}
            onDelete={() => {
              void handleDeleteHabit(item.habit.id, item.habit.title);
            }}
            showHistory
            onToggle={async () => {
              const result = await toggleHabit.mutateAsync(item.habit.id);
              if (result.xp_delta) {
                pushXpToast(result.xp_delta);
              }
            }}
          />
        ))}
      </div>
    </>
  );
}
