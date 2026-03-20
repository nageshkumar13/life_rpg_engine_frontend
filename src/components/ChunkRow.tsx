import { Pencil, Trash2 } from "lucide-react";
import type { TaskChunk } from "@/types/models";
import { AnimatedCheckbox } from "@/components/AnimatedCheckbox";

interface ChunkRowProps {
  chunk: TaskChunk;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ChunkRow({ chunk, onToggle, onEdit, onDelete }: ChunkRowProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <AnimatedCheckbox checked={chunk.status === "DONE"} onChange={onToggle} disabled={chunk.status === "DONE"} />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-text-primary">{chunk.title}</p>
        <p className="text-sm text-text-secondary">{chunk.estimated_minutes} minutes</p>
      </div>
      <div className="rounded-xl bg-xp/10 px-3 py-2 text-xs font-semibold text-xp">+{chunk.xp_earned || 0} XP</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl border border-white/10 p-2 text-text-secondary transition-all duration-200 ease-out hover:bg-elevated hover:text-text-primary"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl border border-danger/20 p-2 text-danger transition-all duration-200 ease-out hover:bg-danger/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
