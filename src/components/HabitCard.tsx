import { Gauge, Sparkles, TimerReset } from "lucide-react";
import type { HabitBoardItem } from "@/types/models";
import { AnimatedCheckbox } from "@/components/AnimatedCheckbox";

interface HabitCardProps {
  item: HabitBoardItem;
  onToggle: () => void;
}

export function HabitCard({ item, onToggle }: HabitCardProps) {
  const { habit, log, consistency_ratio, total_minutes, total_xp } = item;
  const isCompleted = log?.status === "COMPLETED";
  const isMissed = log?.status === "MISSED";

  return (
    <div className="panel p-5">
      <div className="flex items-start gap-4">
        <AnimatedCheckbox checked={isCompleted} onChange={onToggle} />

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
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Today</p>
              <p className="mt-1 text-lg font-semibold">{log?.actual_minutes ?? 0}/{habit.target_minutes} min</p>
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
        </div>
      </div>
    </div>
  );
}
