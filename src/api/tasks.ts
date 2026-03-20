import { loadHabitBoardItems } from "@/api/habits";
import { apiRequest } from "@/api/client";
import { getCurrentUser } from "@/api/users";
import { getXpLogs } from "@/api/xp";
import { ACTIVE_DATE } from "@/lib/session";
import { addDays } from "@/lib/utils";
import type { AnalyticsOverview, ScheduleWindow, Task, TaskChunk, TaskDayGroup, TodayPayload, TodayStats } from "@/types/models";

const LEVEL_XP_STEP = 100;

function levelProgressWindow(totalXp: number, level: number) {
  const previousLevelFloor = Math.max(0, (level - 1) * LEVEL_XP_STEP);
  const nextLevelFloor = level * LEVEL_XP_STEP;

  return {
    level_xp: totalXp - previousLevelFloor,
    next_level_xp: nextLevelFloor - previousLevelFloor,
  };
}

function buildTodayStats(input: {
  date: string;
  tasks: Task[];
  habitItems: TodayPayload["habit_items"];
  todayXp: number;
  totalXp: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
}): TodayStats {
  const focusMinutes = input.habitItems
    .filter((item) => item.log?.status === "COMPLETED")
    .reduce((sum, item) => sum + (item.log?.actual_minutes ?? 0), 0);
  const totalTracked = input.tasks.length + input.habitItems.length;
  const completedTracked =
    input.tasks.filter((task) => task.status === "DONE").length +
    input.habitItems.filter((item) => item.log?.status === "COMPLETED").length;
  const { level_xp, next_level_xp } = levelProgressWindow(input.totalXp, input.level);

  return {
    date: input.date,
    current_streak: input.currentStreak,
    best_streak: input.bestStreak,
    total_xp: input.totalXp,
    current_level: input.level,
    level_xp,
    next_level_xp,
    focus_minutes: focusMinutes,
    today_xp: input.todayXp,
    daily_completion_ratio: totalTracked ? completedTracked / totalTracked : 0,
    completed_tracked_count: completedTracked,
    total_tracked_count: totalTracked,
  };
}

function buildTaskDayGroups(tasks: Task[], startDate: string, endDate: string): TaskDayGroup[] {
  const groups: TaskDayGroup[] = [];

  for (let cursor = startDate; cursor <= endDate; cursor = addDays(cursor, 1)) {
    const dayTasks = tasks
      .filter((task) => task.assigned_day === cursor)
      .sort((left, right) => {
        if (left.status === right.status) {
          return left.created_at.localeCompare(right.created_at);
        }

        if (left.status === "DONE") {
          return 1;
        }

        if (right.status === "DONE") {
          return -1;
        }

        return left.status.localeCompare(right.status);
      });

    if (!dayTasks.length) {
      continue;
    }

    const completed_count = dayTasks.filter((task) => task.status === "DONE").length;

    groups.push({
      date: cursor,
      tasks: dayTasks,
      total_count: dayTasks.length,
      completed_count,
      remaining_count: dayTasks.length - completed_count,
    });
  }

  return groups;
}

function buildScheduleWindow(tasks: Task[], date: string): ScheduleWindow {
  const startDate = addDays(date, -3);
  const endDate = addDays(date, 7);

  return {
    overdue: tasks.filter((task) => task.assigned_day < date && task.status !== "DONE" && task.status !== "MISSED"),
    missed: tasks.filter((task) => task.assigned_day < date && task.status === "MISSED"),
    day_groups: buildTaskDayGroups(tasks, startDate, endDate),
    scheduled_later_count: tasks.filter((task) => task.assigned_day > date && task.status !== "DONE").length,
  };
}

async function getXpDelta(work: () => Promise<Task>) {
  const beforeUser = await getCurrentUser();
  const task = await work();
  const afterUser = await getCurrentUser();

  return {
    task,
    xp_delta: Math.max(0, afterUser.total_xp - beforeUser.total_xp),
  };
}

export async function fetchTasksForDate(date = ACTIVE_DATE) {
  if (date === ACTIVE_DATE) {
    const response = await apiRequest<{ items: Task[] }>("/tasks/today");
    return response.items;
  }

  const response = await apiRequest<{ items: Task[] }>(`/tasks?assigned_day=${encodeURIComponent(date)}`);
  return response.items;
}

export async function fetchTaskRange(startDate: string, endDate: string) {
  const response = await apiRequest<{ items: Task[] }>(
    `/tasks/range?start_day=${encodeURIComponent(startDate)}&end_day=${encodeURIComponent(endDate)}`,
  );

  return response.items;
}

export async function getToday(date = ACTIVE_DATE): Promise<TodayPayload> {
  const rangeStart = addDays(date, -3);
  const rangeEnd = addDays(date, 7);

  const [user, tasks, rangeTasks, habitItems, xpLogs, analytics] = await Promise.all([
    getCurrentUser(),
    fetchTasksForDate(date),
    fetchTaskRange(rangeStart, rangeEnd),
    loadHabitBoardItems(date),
    getXpLogs(),
    apiRequest<AnalyticsOverview>("/analytics/overview"),
  ]);
  const todayXp = xpLogs
    .filter((log) => log.created_at.slice(0, 10) === date)
    .reduce((sum, log) => sum + log.xp_delta, 0);
  const planned_tasks = tasks.filter((task) => task.status !== "DONE" && task.type !== "UNPLANNED");
  const unplanned_tasks = tasks.filter((task) => task.status !== "DONE" && task.type === "UNPLANNED");
  const completed_tasks = tasks.filter((task) => task.status === "DONE");

  return {
    stats: buildTodayStats({
      date,
      tasks,
      habitItems,
      todayXp,
      totalXp: user.total_xp,
      level: user.level,
      currentStreak: analytics.streak_summary.current_streak,
      bestStreak: Math.max(user.best_streak, analytics.streak_summary.best_streak),
    }),
    planned_tasks,
    unplanned_tasks,
    habit_items: habitItems,
    completed_tasks,
    schedule_window: buildScheduleWindow(rangeTasks, date),
  };
}

export async function getTask(taskId: string) {
  return apiRequest<Task>(`/tasks/${taskId}`);
}

export async function advanceTask(taskId: string) {
  const currentTask = await getTask(taskId);

  if (!currentTask.chunks.length && currentTask.status !== "DONE") {
    return getXpDelta(() =>
      apiRequest<Task>(`/tasks/${taskId}/done`, {
        method: "POST",
      }),
    );
  }

  if (currentTask.chunks.length && currentTask.status === "PLANNED") {
    return getXpDelta(() =>
      apiRequest<Task>(`/tasks/${taskId}/active`, {
        method: "POST",
      }),
    );
  }

  if (currentTask.chunks.length && currentTask.chunks.every((chunk) => chunk.status === "DONE") && currentTask.status !== "DONE") {
    return getXpDelta(() =>
      apiRequest<Task>(`/tasks/${taskId}/done`, {
        method: "POST",
      }),
    );
  }

  return {
    task: currentTask,
    xp_delta: 0,
  };
}

export async function addTask(input: Pick<Task, "title" | "description" | "estimated_minutes_total" | "type"> & { assigned_day?: string }) {
  return apiRequest<Task>("/tasks", {
    method: "POST",
    body: {
      title: input.title,
      description: input.description,
      type: input.type,
      importance_score: input.type === "PLANNED" ? 4 : 2,
      estimated_minutes_total: input.estimated_minutes_total,
      assigned_day: input.assigned_day ?? ACTIVE_DATE,
      source_backlog_id: null,
    },
  });
}

export async function updateTask(
  taskId: string,
  input: Pick<Task, "title" | "description" | "estimated_minutes_total"> & { assigned_day: string },
) {
  return apiRequest<Task>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: {
      title: input.title,
      description: input.description,
      estimated_minutes_total: input.estimated_minutes_total,
      assigned_day: input.assigned_day,
    },
  });
}

export async function deleteTask(taskId: string) {
  await apiRequest<{ message: string }>(`/tasks/${taskId}`, {
    method: "DELETE",
  });

  return taskId;
}

export async function addChunk(taskId: string, input: Pick<TaskChunk, "title" | "estimated_minutes">) {
  const task = await getTask(taskId);
  const nextOrderIndex = task.chunks.reduce((max, chunk) => Math.max(max, chunk.order_index), 0) + 1;

  await apiRequest<TaskChunk>(`/tasks/${taskId}/chunks`, {
    method: "POST",
    body: {
      title: input.title,
      estimated_minutes: input.estimated_minutes,
      order_index: nextOrderIndex,
    },
  });

  return getTask(taskId);
}

export async function updateChunk(taskId: string, chunkId: string, patch: Partial<TaskChunk>) {
  const task = await getTask(taskId);
  const chunk = task.chunks.find((item) => item.id === chunkId);

  if (!chunk) {
    throw new Error("Chunk not found");
  }

  await apiRequest<TaskChunk>(`/tasks/${taskId}/chunks/${chunkId}`, {
    method: "PATCH",
    body: {
      title: patch.title ?? chunk.title,
      estimated_minutes: patch.estimated_minutes ?? chunk.estimated_minutes,
      actual_minutes: patch.actual_minutes ?? chunk.actual_minutes,
      order_index: patch.order_index ?? chunk.order_index,
    },
  });

  return getTask(taskId);
}

export async function completeChunk(taskId: string, chunkId: string) {
  const task = await getTask(taskId);
  const chunk = task.chunks.find((item) => item.id === chunkId);

  if (!chunk) {
    throw new Error("Chunk not found");
  }

  const actualMinutes = chunk.actual_minutes ?? chunk.estimated_minutes;

  return getXpDelta(() =>
    apiRequest<Task>(`/tasks/${taskId}/chunks/${chunkId}/done?actual_minutes=${encodeURIComponent(String(actualMinutes))}`, {
      method: "POST",
    }),
  );
}

export async function deleteChunk(taskId: string, chunkId: string) {
  await apiRequest<{ message: string }>(`/tasks/${taskId}/chunks/${chunkId}`, {
    method: "DELETE",
  });

  return getTask(taskId);
}
