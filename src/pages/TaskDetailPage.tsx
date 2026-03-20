import { useParams } from "react-router-dom";
import { ChunkList } from "@/components/ChunkList";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorState } from "@/components/QueryErrorState";
import { useChunkMutations, useTaskQuery } from "@/features/tasks/queries";
import { useUiStore } from "@/store/ui-store";

export function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id ?? "";
  const { data: task, error, isError, isLoading } = useTaskQuery(taskId);
  const chunkMutations = useChunkMutations(taskId);
  const pushXpToast = useUiStore((state) => state.pushXpToast);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <QueryErrorState title="Task details could not load" error={error} />;
  }

  if (!task) {
    return <EmptyState title="Task not found" description="This quest may have been archived or removed." />;
  }

  const earnedXp = task.chunks.reduce((sum, chunk) => sum + chunk.xp_earned, 0);

  return (
    <>
      <PageHeader
        eyebrow="Quest Screen"
        title={task.title}
        description={task.description || "Break important work into crisp, completable chunks."}
      />

      <div className="grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-4">
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Importance score</p>
            <p className="mt-3 text-4xl font-bold">{task.importance_score}</p>
          </div>
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Tracked XP</p>
            <p className="mt-3 text-4xl font-bold text-xp">+{earnedXp}</p>
          </div>
          <div className="panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Progress</p>
              <span className="text-sm font-semibold">{task.completion_percentage}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/5">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${task.completion_percentage}%` }} />
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Chunk list</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Chunk completion should rehydrate the parent task because status and completion percentage may change server-side.
            </p>
          </div>

          <ChunkList
            chunks={task.chunks}
            onAdd={(input) => chunkMutations.addChunk.mutate(input)}
            onEdit={(chunkId, input) => chunkMutations.updateChunk.mutate({ chunkId, patch: input })}
            onToggle={async (chunkId, nextValue) => {
              if (!nextValue) {
                return;
              }
              const result = await chunkMutations.completeChunk.mutateAsync(chunkId);
              if (result.xp_delta) {
                pushXpToast(result.xp_delta);
              }
            }}
            onDelete={(chunkId) => chunkMutations.deleteChunk.mutate(chunkId)}
          />
        </div>
      </div>
    </>
  );
}
