import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addChunk,
  addTask,
  advanceTask,
  completeChunk,
  deleteChunk,
  getTask,
  getToday,
  updateChunk,
} from "@/api/tasks";

export const todayQueryKey = ["today"];

export function useTodayQuery() {
  return useQuery({
    queryKey: todayQueryKey,
    queryFn: () => getToday(),
  });
}

export function useTaskQuery(taskId: string) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId),
    enabled: Boolean(taskId),
  });
}

export function useAdvanceTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: advanceTask,
    onSuccess: ({ task }) => {
      queryClient.invalidateQueries({ queryKey: todayQueryKey });
      queryClient.setQueryData(["task", task.id], task);
    },
  });
}

export function useAddTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todayQueryKey });
    },
  });
}

export function useChunkMutations(taskId: string) {
  const queryClient = useQueryClient();

  const invalidate = (updatedTaskId: string) => {
    queryClient.invalidateQueries({ queryKey: todayQueryKey });
    queryClient.invalidateQueries({ queryKey: ["task", updatedTaskId] });
  };

  return {
    addChunk: useMutation({
      mutationFn: (input: { title: string; estimated_minutes: number }) => addChunk(taskId, input),
      onSuccess: (task) => invalidate(task.id),
    }),
    updateChunk: useMutation({
      mutationFn: (input: { chunkId: string; patch: { title?: string; estimated_minutes?: number; status?: "PENDING" | "DONE" } }) =>
        updateChunk(taskId, input.chunkId, input.patch),
      onSuccess: (task) => invalidate(task.id),
    }),
    completeChunk: useMutation({
      mutationFn: (chunkId: string) => completeChunk(taskId, chunkId),
      onSuccess: ({ task }) => invalidate(task.id),
    }),
    deleteChunk: useMutation({
      mutationFn: (chunkId: string) => deleteChunk(taskId, chunkId),
      onSuccess: (task) => invalidate(task.id),
    }),
  };
}
