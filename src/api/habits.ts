import { delay } from "@/api/delay";
import { ACTIVE_DATE, DEMO_USER_ID } from "@/lib/session";
import { db } from "@/mocks/db";
import type { Habit, HabitLog } from "@/types/models";

function cloneHabit(habit: Habit) {
  return { ...habit };
}

function cloneLog(log: HabitLog) {
  return { ...log };
}

export async function getHabits() {
  await delay();

  return db.habits
    .filter((habit) => habit.user_id === DEMO_USER_ID && habit.is_active)
    .map((habit) => {
      const log = db.habitLogs.find((entry) => entry.habit_id === habit.id && entry.log_date === ACTIVE_DATE) ?? null;
      const history = db.habitLogs.filter((entry) => entry.habit_id === habit.id);
      const total_minutes = history.reduce((sum, entry) => sum + entry.actual_minutes, 0);
      const total_xp = history.reduce((sum, entry) => sum + entry.xp_earned, 0);
      const completed_count = history.filter((entry) => entry.status === "COMPLETED").length;

      return {
        habit: cloneHabit(habit),
        log: log ? cloneLog(log) : null,
        consistency_ratio: history.length ? completed_count / history.length : 0,
        total_minutes,
        total_xp,
      };
    });
}

export async function toggleHabit(habitId: string) {
  await delay(150);
  const habit = db.habits.find((item) => item.id === habitId);

  if (!habit) {
    throw new Error("Habit not found");
  }

  const hadCompletedToday = db.habitLogs.some(
    (item) => item.user_id === DEMO_USER_ID && item.log_date === ACTIVE_DATE && item.status === "COMPLETED",
  );
  let log = db.habitLogs.find((item) => item.habit_id === habitId && item.log_date === ACTIVE_DATE);
  let xp_delta = 0;

  if (!log || log.status === "EXPECTED" || log.status === "MISSED") {
    const nextXp = Math.round(habit.xp_base * 1.15);
    if (!log) {
      log = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        user_id: DEMO_USER_ID,
        log_date: ACTIVE_DATE,
        actual_minutes: habit.target_minutes,
        xp_earned: nextXp,
        status: "COMPLETED",
        streak_after_log: db.user.current_streak,
        created_at: new Date().toISOString(),
      };
      db.habitLogs.unshift(log);
    } else {
      log.status = "COMPLETED";
      log.actual_minutes = habit.target_minutes;
      log.xp_earned = nextXp;
      log.streak_after_log = db.user.current_streak;
    }

    xp_delta = log.xp_earned;
    db.user.total_xp += xp_delta;
    if (!hadCompletedToday) {
      db.user.current_streak += 1;
      db.user.best_streak = Math.max(db.user.best_streak, db.user.current_streak);
      log.streak_after_log = db.user.current_streak;
    }
    db.xpLogs.unshift({
      id: crypto.randomUUID(),
      user_id: DEMO_USER_ID,
      source_type: "HABIT_LOG",
      source_id: log.id,
      xp_delta,
      reason: `Completed ${habit.title}`,
      created_at: new Date().toISOString(),
    });
  } else {
    log.status = "MISSED";
    log.actual_minutes = 0;
    log.xp_earned = 0;
    log.streak_after_log = 0;
    db.user.current_streak = 0;
  }

  return {
    habit: cloneHabit(habit),
    log: cloneLog(log),
    xp_delta,
  };
}

export async function addHabit(input: { title: string; description: string; target_minutes: number }) {
  await delay(160);
  const now = new Date().toISOString();
  const habit: Habit = {
    id: crypto.randomUUID(),
    user_id: DEMO_USER_ID,
    title: input.title,
    description: input.description,
    unit_type: "MINUTES",
    target_minutes: input.target_minutes,
    xp_base: Math.max(10, Math.round(input.target_minutes / 2)),
    is_active: true,
    created_at: now,
    updated_at: now,
  };

  db.habits.unshift(habit);
  db.habitLogs.unshift({
    id: crypto.randomUUID(),
    habit_id: habit.id,
    user_id: DEMO_USER_ID,
    log_date: ACTIVE_DATE,
    actual_minutes: 0,
    xp_earned: 0,
    status: "EXPECTED",
    streak_after_log: db.user.current_streak,
    created_at: now,
  });
  return cloneHabit(habit);
}
