import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignBacklogToToday, getBacklog } from "@/api/backlog";
import { todayQueryKey } from "@/features/tasks/queries";

export function useBacklogQuery() {
  return useQuery({
    queryKey: ["backlog"],
    queryFn: getBacklog,
  });
}

export function useAssignBacklogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignBacklogToToday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todayQueryKey });
      queryClient.invalidateQueries({ queryKey: ["backlog"] });
    },
  });
}
