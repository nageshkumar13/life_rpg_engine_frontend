import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addHabit, getHabits, toggleHabit } from "@/api/habits";
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
    },
  });
}
