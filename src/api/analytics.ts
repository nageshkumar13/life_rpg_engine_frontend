import { apiRequest } from "@/api/client";
import { loadHabitBoardItems } from "@/api/habits";
import { fetchTasksForDate } from "@/api/tasks";
import { getCurrentUser } from "@/api/users";
import { getXpLogs } from "@/api/xp";
import { ACTIVE_DATE } from "@/lib/session";
import type { AnalyticsOverview, ProfileSummary } from "@/types/models";

export async function getAnalytics() {
  return apiRequest<AnalyticsOverview>("/analytics/overview");
}

export async function getProfileSummary(): Promise<ProfileSummary> {
  const [user, analytics, tasks, habitItems, xpLogs] = await Promise.all([
    getCurrentUser(),
    getAnalytics(),
    fetchTasksForDate(ACTIVE_DATE),
    loadHabitBoardItems(ACTIVE_DATE),
    getXpLogs(),
  ]);
  const today_focus_minutes = habitItems
    .filter((item) => item.log?.status === "COMPLETED")
    .reduce((sum, item) => sum + (item.log?.actual_minutes ?? 0), 0);
  const today_xp = xpLogs
    .filter((log) => log.created_at.slice(0, 10) === ACTIVE_DATE)
    .reduce((sum, log) => sum + log.xp_delta, 0);

  return {
    user: {
      ...user,
      current_streak: analytics.streak_summary.current_streak,
      best_streak: Math.max(user.best_streak, analytics.streak_summary.best_streak),
    },
    today_focus_minutes,
    habits_completed_today: habitItems.filter((item) => item.log?.status === "COMPLETED").length,
    tasks_completed_today: tasks.filter((task) => task.status === "DONE").length,
    total_tasks_today: tasks.length,
    today_xp,
  };
}
