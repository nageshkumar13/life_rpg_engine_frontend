import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addHabit, deleteHabit, getHabits, toggleHabit, updateHabit } from "@/api/habits";
import { todayQueryKey } from "@/features/tasks/queries";

export function useHabitsQuery() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,
  });
}

export function useToggleHabitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: todayQueryKey });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useAddHabitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: todayQueryKey });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useUpdateHabitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { habitId: string; patch: { title: string; description: string; target_minutes: number } }) =>
      updateHabit(input.habitId, input.patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: todayQueryKey });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useDeleteHabitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: todayQueryKey });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
