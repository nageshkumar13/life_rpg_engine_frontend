import { BacklogCard } from "@/components/BacklogCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { useAssignBacklogMutation, useBacklogQuery } from "@/features/backlog/queries";
import { useUiStore } from "@/store/ui-store";

export function BacklogPage() {
  const { data, isLoading } = useBacklogQuery();
  const assignMutation = useAssignBacklogMutation();
  const pushXpToast = useUiStore((state) => state.pushXpToast);

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Long-Term Queue"
        title="Backlog"
        description="Backlog items stay unscheduled until assignment, at which point the backend creates a linked task via source_backlog_id."
      />
      <div className="grid gap-4">
        {data.map((item) => (
          <BacklogCard
            key={item.id}
            item={item}
            onAssign={async () => {
              const result = await assignMutation.mutateAsync(item.id);
              pushXpToast(result.backlog.xp_reward);
            }}
          />
        ))}
      </div>
    </>
  );
}
