import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
  label?: string;
}

export function StreakBadge({ streak, label = "Current streak" }: StreakBadgeProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-streak/20 bg-streak/10 px-4 py-3 shadow-streak">
      <div className="rounded-xl bg-streak/20 p-2 text-streak">
        <Flame className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-streak/80">{label}</p>
        <p className="text-lg font-semibold text-text-primary">{streak}</p>
      </div>
    </div>
  );
}
