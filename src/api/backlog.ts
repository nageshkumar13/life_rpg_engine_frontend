import { apiRequest } from "@/api/client";
import { ACTIVE_DATE } from "@/lib/session";
import type { BacklogTask, Task } from "@/types/models";

export async function getBacklog() {
  return apiRequest<BacklogTask[]>("/backlog");
}

export async function assignBacklogToToday(backlogId: string) {
  return apiRequest<{ backlog: BacklogTask; task: Task }>(`/backlog/${backlogId}/assign`, {
    method: "POST",
    body: {
      assigned_day: ACTIVE_DATE,
    },
  });
}
