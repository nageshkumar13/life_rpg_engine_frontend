import { BacklogCard } from "@/components/BacklogCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorState } from "@/components/QueryErrorState";
import { useAssignBacklogMutation, useBacklogQuery } from "@/features/backlog/queries";

export function BacklogPage() {
  const { data, error, isError, isLoading } = useBacklogQuery();
  const assignMutation = useAssignBacklogMutation();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <QueryErrorState title="Backlog could not load" error={error} />;
  }

  if (!data) {
    return <QueryErrorState title="Backlog could not load" error={new Error("The backlog response was empty.")} />;
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
              await assignMutation.mutateAsync(item.id);
            }}
          />
        ))}
      </div>
    </>
  );
}
