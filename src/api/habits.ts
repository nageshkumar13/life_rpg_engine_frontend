import { apiRequest } from "@/api/client";
import { getCurrentUser } from "@/api/users";
import { ACTIVE_DATE } from "@/lib/session";
import type { Habit, HabitBoardItem } from "@/types/models";

function buildHabitBoardItem(habit: Habit, date: string): HabitBoardItem {
  const logs = habit.logs ?? [];
  const log = logs.find((entry) => entry.log_date === date) ?? null;
  const total_minutes = logs.reduce((sum, entry) => sum + entry.actual_minutes, 0);
  const total_xp = logs.reduce((sum, entry) => sum + entry.xp_earned, 0);
  const completed_count = logs.filter((entry) => entry.status === "COMPLETED").length;

  return {
    habit,
    log,
    consistency_ratio: logs.length ? completed_count / logs.length : 0,
    total_minutes,
    total_xp,
  };
}

async function generateHabitLogs(date = ACTIVE_DATE) {
  await apiRequest(`/habits/generate?target_date=${encodeURIComponent(date)}`, {
    method: "POST",
  });
}

async function getHabit(habitId: string) {
  return apiRequest<Habit>(`/habits/${habitId}`);
}

export async function loadHabitBoardItems(date = ACTIVE_DATE) {
  await generateHabitLogs(date);

  const habits = await apiRequest<Habit[]>("/habits");

  return habits.filter((habit) => habit.is_active).map((habit) => buildHabitBoardItem(habit, date));
}

export async function getHabits() {
  return loadHabitBoardItems();
}

export async function toggleHabit(habitId: string) {
  const beforeUser = await getCurrentUser();
  const habit = await getHabit(habitId);
  const currentLog = (habit.logs ?? []).find((entry) => entry.log_date === ACTIVE_DATE) ?? null;

  if (!currentLog || currentLog.status === "EXPECTED" || currentLog.status === "MISSED") {
    await apiRequest(`/habits/${habitId}/log`, {
      method: "POST",
      body: {
        log_date: ACTIVE_DATE,
        actual_minutes: habit.target_minutes,
      },
    });
  } else {
    await apiRequest(`/habits/${habitId}/missed?log_date=${encodeURIComponent(ACTIVE_DATE)}`, {
      method: "POST",
    });
  }

  const refreshedHabit = await getHabit(habitId);
  const refreshedLog = (refreshedHabit.logs ?? []).find((entry) => entry.log_date === ACTIVE_DATE) ?? null;
  const afterUser = await getCurrentUser();

  return {
    habit: refreshedHabit,
    log: refreshedLog,
    xp_delta: Math.max(0, afterUser.total_xp - beforeUser.total_xp),
  };
}

export async function addHabit(input: { title: string; description: string; target_minutes: number }) {
  const habit = await apiRequest<Habit>("/habits", {
    method: "POST",
    body: {
      title: input.title,
      description: input.description,
      unit_type: "MINUTES",
      target_minutes: input.target_minutes,
      xp_base: Math.max(10, Math.round(input.target_minutes / 2)),
    },
  });

  await generateHabitLogs(ACTIVE_DATE);

  return getHabit(habit.id);
}

export async function updateHabit(habitId: string, input: { title: string; description: string; target_minutes: number }) {
  return apiRequest<Habit>(`/habits/${habitId}`, {
    method: "PATCH",
    body: {
      title: input.title,
      description: input.description,
      target_minutes: input.target_minutes,
    },
  });
}

export async function deleteHabit(habitId: string) {
  await apiRequest<{ message: string }>(`/habits/${habitId}`, {
    method: "DELETE",
  });

  return habitId;
}
