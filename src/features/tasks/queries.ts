import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addChunk,
  addTask,
  advanceTask,
  completeChunk,
  deleteTask,
  deleteChunk,
  getTask,
  getToday,
  updateChunk,
  updateTask,
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

  const invalidate = (taskId: string) => {
    queryClient.invalidateQueries({ queryKey: todayQueryKey });
    queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
  };

  return useMutation({
    mutationFn: advanceTask,
    onSuccess: ({ task }) => {
      invalidate(task.id);
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
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      taskId: string;
      patch: { title: string; description: string; estimated_minutes_total: number; assigned_day: string };
    }) => updateTask(input.taskId, input.patch),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: todayQueryKey });
      queryClient.invalidateQueries({ queryKey: ["task", task.id] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: todayQueryKey });
      queryClient.removeQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useChunkMutations(taskId: string) {
  const queryClient = useQueryClient();

  const invalidate = (updatedTaskId: string) => {
    queryClient.invalidateQueries({ queryKey: todayQueryKey });
    queryClient.invalidateQueries({ queryKey: ["task", updatedTaskId] });
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
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
