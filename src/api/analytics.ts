import { delay } from "@/api/delay";
import { ACTIVE_DATE, DEMO_USER_ID } from "@/lib/session";
import { db } from "@/mocks/db";
import type { ProfileSummary } from "@/types/models";

export async function getAnalytics() {
  await delay();
  return JSON.parse(JSON.stringify(db.analyticsOverview));
}

export async function getProfileSummary(): Promise<ProfileSummary> {
  await delay();

  return {
    user: { ...db.user },
    today_focus_minutes: db.habitLogs
      .filter((log) => log.user_id === DEMO_USER_ID && log.log_date === ACTIVE_DATE && log.status === "COMPLETED")
      .reduce((sum, log) => sum + log.actual_minutes, 0),
    habits_completed_today: db.habitLogs.filter((log) => log.user_id === DEMO_USER_ID && log.log_date === ACTIVE_DATE && log.status === "COMPLETED").length,
    tasks_completed_today: db.tasks.filter((task) => task.user_id === DEMO_USER_ID && task.assigned_day === ACTIVE_DATE && task.status === "DONE").length,
    total_tasks_today: db.tasks.filter((task) => task.user_id === DEMO_USER_ID && task.assigned_day === ACTIVE_DATE).length,
    today_xp: db.xpLogs
      .filter((log) => log.user_id === DEMO_USER_ID && log.created_at.slice(0, 10) === ACTIVE_DATE)
      .reduce((sum, log) => sum + log.xp_delta, 0),
  };
}
