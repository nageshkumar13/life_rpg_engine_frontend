import { ArrowUpRight, CalendarPlus2 } from "lucide-react";
import type { BacklogTask } from "@/types/models";

interface BacklogCardProps {
  item: BacklogTask;
  onAssign: () => void;
}

export function BacklogCard({ item, onAssign }: BacklogCardProps) {
  return (
    <div className="panel p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              {item.status}
            </span>
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
              Importance {item.importance_score}
            </span>
          </div>
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-text-secondary">{item.description}</p>
          <div className="mt-3 flex flex-wrap gap-5 text-sm text-text-secondary">
            <span>Effort {item.estimated_effort} min</span>
            <span className="text-xp">Reward +{item.xp_reward} XP</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onAssign}
          disabled={item.status !== "PENDING"}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/30"
        >
          <CalendarPlus2 className="h-4 w-4" />
          Assign to day
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
