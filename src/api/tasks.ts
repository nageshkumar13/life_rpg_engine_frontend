import { delay } from "@/api/delay";
import { ACTIVE_DATE, DEMO_USER_ID } from "@/lib/session";
import { db } from "@/mocks/db";
import type { Task, TaskChunk, TodayPayload, TodayStats } from "@/types/models";

function cloneChunk(chunk: TaskChunk): TaskChunk {
  return { ...chunk };
}

function cloneTask(task: Task): Task {
  return {
    ...task,
    chunks: task.chunks.map(cloneChunk),
  };
}

function recalculateTask(task: Task) {
  if (!task.chunks.length) {
    task.completion_percentage = task.status === "DONE" ? 100 : 0;
    return;
  }

  const doneCount = task.chunks.filter((chunk) => chunk.status === "DONE").length;
  task.completion_percentage = Math.round((doneCount / task.chunks.length) * 100);

  if (doneCount === task.chunks.length) {
    task.status = "DONE";
    task.completed_at = new Date().toISOString();
  } else if (doneCount > 0 && task.status === "PLANNED") {
    task.status = "ACTIVE";
  }
}

function levelProgressWindow(totalXp: number, level: number) {
  const prevLevelFloor = Math.max(0, (level - 1) * 160);
  const nextLevelFloor = level * 160;

  return {
    level_xp: totalXp - prevLevelFloor,
    next_level_xp: nextLevelFloor - prevLevelFloor,
  };
}

function buildTodayStats(date: string): TodayStats {
  const focus_minutes = db.habitLogs
    .filter((log) => log.user_id === DEMO_USER_ID && log.log_date === date && log.status === "COMPLETED")
    .reduce((sum, log) => sum + log.actual_minutes, 0);
  const today_xp = db.xpLogs
    .filter((log) => log.user_id === DEMO_USER_ID && log.created_at.slice(0, 10) === date)
    .reduce((sum, log) => sum + log.xp_delta, 0);
  const totalTracked = db.tasks.filter((task) => task.user_id === DEMO_USER_ID && task.assigned_day === date).length + db.habitLogs.filter((log) => log.user_id === DEMO_USER_ID && log.log_date === date).length;
  const completeTracked = db.tasks.filter((task) => task.user_id === DEMO_USER_ID && task.assigned_day === date && task.status === "DONE").length + db.habitLogs.filter((log) => log.user_id === DEMO_USER_ID && log.log_date === date && log.status === "COMPLETED").length;
  const { level_xp, next_level_xp } = levelProgressWindow(db.user.total_xp, db.user.level);

  return {
    date,
    current_streak: db.user.current_streak,
    best_streak: db.user.best_streak,
    total_xp: db.user.total_xp,
    current_level: db.user.level,
    level_xp,
    next_level_xp,
    focus_minutes,
    today_xp,
    daily_completion_ratio: totalTracked ? completeTracked / totalTracked : 0,
  };
}

export async function getToday(userId = DEMO_USER_ID, date = ACTIVE_DATE): Promise<TodayPayload> {
  await delay();

  const tasks = db.tasks.filter((task) => task.user_id === userId && task.assigned_day === date);
  const planned_tasks = tasks.filter((task) => task.status !== "DONE" && task.type !== "UNPLANNED").map(cloneTask);
  const unplanned_tasks = tasks.filter((task) => task.status !== "DONE" && task.type === "UNPLANNED").map(cloneTask);
  const completed_tasks = tasks.filter((task) => task.status === "DONE").map(cloneTask);

  const habit_items = db.habits
    .filter((habit) => habit.user_id === userId && habit.is_active)
    .map((habit) => {
      const log = db.habitLogs.find((entry) => entry.habit_id === habit.id && entry.log_date === date) ?? null;
      const history = db.habitLogs.filter((entry) => entry.habit_id === habit.id);
      const completedCount = history.filter((entry) => entry.status === "COMPLETED").length;
      const totalMinutes = history.reduce((sum, entry) => sum + entry.actual_minutes, 0);
      const totalXp = history.reduce((sum, entry) => sum + entry.xp_earned, 0);

      return {
        habit: { ...habit },
        log: log ? { ...log } : null,
        consistency_ratio: history.length ? completedCount / history.length : 0,
        total_minutes: totalMinutes,
        total_xp: totalXp,
      };
    });

  return {
    stats: buildTodayStats(date),
    planned_tasks,
    unplanned_tasks,
    habit_items,
    completed_tasks,
  };
}

export async function getTask(taskId: string) {
  await delay();
  const task = db.tasks.find((item) => item.id === taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  return cloneTask(task);
}

export async function advanceTask(taskId: string) {
  await delay(150);
  const task = db.tasks.find((item) => item.id === taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  let xp_delta = 0;

  if (!task.chunks.length && (task.status === "PLANNED" || task.status === "ACTIVE")) {
    task.status = "DONE";
    task.completion_percentage = 100;
    task.completed_at = new Date().toISOString();
    xp_delta = Math.max(8, task.importance_score * 6);
  } else if (task.chunks.length && task.status === "PLANNED") {
    task.status = "ACTIVE";
  } else if (task.chunks.length && task.chunks.every((chunk) => chunk.status === "DONE") && task.status !== "DONE") {
    task.status = "DONE";
    task.completed_at = new Date().toISOString();
    xp_delta = Math.max(10, task.importance_score * 5);
  }

  if (xp_delta > 0) {
    db.user.total_xp += xp_delta;
    db.xpLogs.unshift({
      id: crypto.randomUUID(),
      user_id: task.user_id,
      source_type: "TASK",
      source_id: task.id,
      xp_delta,
      reason: `Completed ${task.title}`,
      created_at: new Date().toISOString(),
    });
  }

  return { task: cloneTask(task), xp_delta };
}

export async function addTask(input: Pick<Task, "title" | "description" | "estimated_minutes_total" | "type">) {
  await delay(180);
  const task: Task = {
    id: crypto.randomUUID(),
    user_id: DEMO_USER_ID,
    title: input.title,
    description: input.description,
    type: input.type,
    importance_score: input.type === "PLANNED" ? 4 : 2,
    estimated_minutes_total: input.estimated_minutes_total,
    assigned_day: ACTIVE_DATE,
    status: "PLANNED",
    completion_percentage: 0,
    source_backlog_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: null,
    chunks: [],
  };

  db.tasks.unshift(task);
  return cloneTask(task);
}

export async function addChunk(taskId: string, input: Pick<TaskChunk, "title" | "estimated_minutes">) {
  await delay(160);
  const task = db.tasks.find((item) => item.id === taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const chunk: TaskChunk = {
    id: crypto.randomUUID(),
    task_id: taskId,
    title: input.title,
    estimated_minutes: input.estimated_minutes,
    actual_minutes: null,
    xp_earned: 0,
    status: "PENDING",
    order_index: task.chunks.length + 1,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  task.chunks.push(chunk);
  recalculateTask(task);
  return cloneTask(task);
}

export async function updateChunk(taskId: string, chunkId: string, patch: Partial<TaskChunk>) {
  await delay(150);
  const task = db.tasks.find((item) => item.id === taskId);
  const chunk = task?.chunks.find((item) => item.id === chunkId);

  if (!task || !chunk) {
    throw new Error("Chunk not found");
  }

  Object.assign(chunk, patch, { updated_at: new Date().toISOString() });
  recalculateTask(task);
  return cloneTask(task);
}

export async function completeChunk(taskId: string, chunkId: string) {
  await delay(150);
  const task = db.tasks.find((item) => item.id === taskId);
  const chunk = task?.chunks.find((item) => item.id === chunkId);

  if (!task || !chunk) {
    throw new Error("Chunk not found");
  }

  if (chunk.status !== "DONE") {
    chunk.status = "DONE";
    chunk.actual_minutes = chunk.estimated_minutes;
    chunk.completed_at = new Date().toISOString();
    chunk.updated_at = new Date().toISOString();
    chunk.xp_earned = Math.max(6, task.importance_score * 3 + Math.round(chunk.estimated_minutes / 10));
    db.user.total_xp += chunk.xp_earned;
    db.xpLogs.unshift({
      id: crypto.randomUUID(),
      user_id: task.user_id,
      source_type: "TASK_CHUNK",
      source_id: chunk.id,
      xp_delta: chunk.xp_earned,
      reason: `Finished ${chunk.title}`,
      created_at: new Date().toISOString(),
    });
  }

  recalculateTask(task);

  let xp_delta = chunk.xp_earned;

  if (task.status === "DONE" && !db.xpLogs.some((log) => log.source_type === "BONUS" && log.source_id === task.id)) {
    const bonus = Math.max(10, task.importance_score * 5);
    db.user.total_xp += bonus;
    db.xpLogs.unshift({
      id: crypto.randomUUID(),
      user_id: task.user_id,
      source_type: "BONUS",
      source_id: task.id,
      xp_delta: bonus,
      reason: `Task completion bonus for ${task.title}`,
      created_at: new Date().toISOString(),
    });
    xp_delta += bonus;
  }

  return { task: cloneTask(task), xp_delta };
}

export async function deleteChunk(taskId: string, chunkId: string) {
  await delay(150);
  const task = db.tasks.find((item) => item.id === taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  task.chunks = task.chunks.filter((chunk) => chunk.id !== chunkId);
  recalculateTask(task);
  return cloneTask(task);
}
