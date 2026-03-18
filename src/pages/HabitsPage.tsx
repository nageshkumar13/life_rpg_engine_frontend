import { HabitCard } from "@/components/HabitCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { useHabitsQuery, useToggleHabitMutation } from "@/features/habits/queries";
import { useUiStore } from "@/store/ui-store";

export function HabitsPage() {
  const { data, isLoading } = useHabitsQuery();
  const toggleHabit = useToggleHabitMutation();
  const pushXpToast = useUiStore((state) => state.pushXpToast);

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Habit Board"
        title="Habits"
        description="Daily habit state is date-driven through habit logs, while the habit definitions stay reusable over time."
      />
      <div className="grid gap-4">
        {data.map((item) => (
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
    </>
  );
}
