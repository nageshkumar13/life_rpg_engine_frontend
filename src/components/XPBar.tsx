import { levelProgress } from "@/lib/utils";

interface XPBarProps {
  level: number;
  currentXp: number;
  nextLevelXp: number;
}

export function XPBar({ level, currentXp, nextLevelXp }: XPBarProps) {
  const progress = levelProgress(currentXp, nextLevelXp);

  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Level</p>
          <div className="mt-1 flex items-end gap-3">
            <span className="text-3xl font-bold">{level}</span>
            <span className="mb-1 text-sm text-text-secondary">{currentXp} / {nextLevelXp} XP</span>
          </div>
        </div>
        <div className="rounded-2xl border border-xp/20 bg-xp/10 px-3 py-2 text-sm font-semibold text-xp shadow-xp">
          {progress}% loaded
        </div>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-xp shadow-xp transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
