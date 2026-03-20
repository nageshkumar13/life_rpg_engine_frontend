import { Gauge, Pencil, Sparkles, TimerReset, Trash2 } from "lucide-react";
import { ACTIVE_DATE } from "@/lib/session";
import { addDays, formatWeekday } from "@/lib/utils";
import type { HabitBoardItem } from "@/types/models";
import { AnimatedCheckbox } from "@/components/AnimatedCheckbox";

interface HabitCardProps {
  item: HabitBoardItem;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showHistory?: boolean;
}

function buildDateStatusMap(item: HabitBoardItem) {
  return new Map((item.habit.logs ?? []).map((log) => [log.log_date, log.status]));
}

function getCurrentHabitStreak(item: HabitBoardItem) {
  const statusByDate = buildDateStatusMap(item);
  let cursor = ACTIVE_DATE;

  for (let steps = 0; steps < 365; steps += 1) {
    const status = statusByDate.get(cursor);

    if (status === "MISSED") {
      return 0;
    }

    if (status === "COMPLETED") {
      break;
    }

    cursor = addDays(cursor, -1);
  }

  let streak = 0;

  for (let steps = 0; steps < 365; steps += 1) {
    if (statusByDate.get(cursor) !== "COMPLETED") {
      break;
    }

    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function getWeekDates() {
  return Array.from({ length: 7 }, (_, index) => addDays(ACTIVE_DATE, index - 6));
}

function getMonthDates() {
  return Array.from({ length: 30 }, (_, index) => addDays(ACTIVE_DATE, index - 29));
}

export function HabitCard({ item, onToggle, onEdit, onDelete, showHistory = false }: HabitCardProps) {
  const { habit, log, consistency_ratio, total_minutes, total_xp } = item;
  const isCompleted = log?.status === "COMPLETED";
  const isMissed = log?.status === "MISSED";
  const statusByDate = buildDateStatusMap(item);
  const weekDates = getWeekDates();
  const monthDates = getMonthDates();
  const weekCompleted = weekDates.filter((date) => statusByDate.get(date) === "COMPLETED").length;
  const monthCompleted = monthDates.filter((date) => statusByDate.get(date) === "COMPLETED").length;
  const currentStreak = getCurrentHabitStreak(item);

  return (
    <div className="panel p-5">
      <div className="flex items-start gap-4">
        <AnimatedCheckbox checked={isCompleted} onChange={onToggle} disabled={isCompleted} />

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                  {habit.unit_type}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${isCompleted ? "bg-xp/10 text-xp" : isMissed ? "bg-danger/10 text-danger" : "bg-white/10 text-text-secondary"}`}>
                  {log?.status ?? "EXPECTED"}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{habit.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{habit.description}</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Today</p>
                <p className="mt-1 text-lg font-semibold">{log?.actual_minutes ?? 0}/{habit.target_minutes} min</p>
              </div>
              <div className="flex flex-col gap-2">
                {onEdit ? (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="rounded-xl border border-white/10 p-2 text-text-secondary transition-all duration-200 ease-out hover:bg-elevated hover:text-text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                ) : null}
                {onDelete ? (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="rounded-xl border border-danger/20 p-2 text-danger transition-all duration-200 ease-out hover:bg-danger/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-text-secondary sm:grid-cols-3">
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <span className="mb-2 inline-flex items-center gap-2 text-text-muted">
                <Gauge className="h-4 w-4" />
                Consistency
              </span>
              <p className="text-lg font-semibold text-text-primary">{Math.round(consistency_ratio * 100)}%</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <span className="mb-2 inline-flex items-center gap-2 text-text-muted">
                <TimerReset className="h-4 w-4" />
                Total Minutes
              </span>
              <p className="text-lg font-semibold text-text-primary">{total_minutes}</p>
            </div>
            <div className="rounded-2xl bg-xp/10 px-4 py-3 shadow-xp">
              <span className="mb-2 inline-flex items-center gap-2 text-xp">
                <Sparkles className="h-4 w-4" />
                XP Earned
              </span>
              <p className="text-lg font-semibold text-text-primary">{total_xp}</p>
            </div>
          </div>

          {showHistory ? (
            <div className="mt-5 space-y-4 rounded-3xl border border-white/5 bg-black/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Weekly rhythm</p>
                  <p className="mt-2 text-sm text-text-secondary">
                    Streak {currentStreak} · {weekCompleted}/7 completed
                  </p>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                  30d: {monthCompleted}/30
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date) => {
                  const status = statusByDate.get(date) ?? "EXPECTED";
                  const isToday = date === ACTIVE_DATE;

                  return (
                    <div key={date} className="space-y-2 text-center">
                      <p className={`text-xs ${isToday ? "font-semibold text-text-primary" : "text-text-muted"}`}>{formatWeekday(date).slice(0, 2)}</p>
                      <div
                        className={`h-12 rounded-2xl border transition-all duration-200 ${
                          status === "COMPLETED"
                            ? "border-xp/20 bg-xp/20 shadow-xp"
                            : status === "MISSED"
                              ? "border-danger/20 bg-danger/10"
                              : isToday
                                ? "border-white/70 bg-white/[0.05]"
                                : "border-white/10 bg-white/[0.03]"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.24em] text-text-muted">30-day view</p>
                  <p className="text-xs text-text-secondary">Completed days are highlighted</p>
                </div>
                <div className="grid grid-cols-10 gap-1.5">
                  {monthDates.map((date) => {
                    const status = statusByDate.get(date) ?? "EXPECTED";

                    return (
                      <div
                        key={date}
                        className={`h-3 rounded-[4px] ${
                          status === "COMPLETED"
                            ? "bg-primary/70"
                            : status === "MISSED"
                              ? "bg-danger/40"
                              : "bg-white/[0.05]"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
