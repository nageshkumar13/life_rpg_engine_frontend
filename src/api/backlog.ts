import { delay } from "@/api/delay";
import { ACTIVE_DATE, DEMO_USER_ID } from "@/lib/session";
import { db } from "@/mocks/db";
import type { BacklogTask, Task } from "@/types/models";

export async function getBacklog() {
  await delay();
  return db.backlog.filter((item) => item.user_id === DEMO_USER_ID).map((item) => ({ ...item }));
}

export async function assignBacklogToToday(backlogId: string) {
  await delay(200);
  const backlogItem = db.backlog.find((item) => item.id === backlogId);

  if (!backlogItem) {
    throw new Error("Backlog item not found");
  }

  backlogItem.status = "ASSIGNED";
  backlogItem.updated_at = new Date().toISOString();

  const task: Task = {
    id: crypto.randomUUID(),
    user_id: DEMO_USER_ID,
    title: backlogItem.title,
    description: backlogItem.description,
    type: "BACKLOG",
    importance_score: backlogItem.importance_score,
    estimated_minutes_total: backlogItem.estimated_effort,
    assigned_day: ACTIVE_DATE,
    status: "PLANNED",
    completion_percentage: 0,
    source_backlog_id: backlogItem.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: null,
    chunks: [],
  };

  db.tasks.unshift(task);

  return { backlog: { ...backlogItem }, task };
}
