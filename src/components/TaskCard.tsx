import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Task } from "@/types/models";
import { AnimatedCheckbox } from "@/components/AnimatedCheckbox";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
}

function typeColor(type: Task["type"]) {
  switch (type) {
    case "PLANNED":
      return "bg-info/15 text-info";
    case "UNPLANNED":
      return "bg-white/10 text-text-secondary";
    case "BACKLOG":
      return "bg-primary/15 text-primary";
    default:
      return "bg-streak/15 text-streak";
  }
}

export function TaskCard({ task, onToggle }: TaskCardProps) {
  const earnedXp = task.chunks.reduce((sum, chunk) => sum + chunk.xp_earned, 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: task.status === "DONE" ? 0.7 : 1, y: 0 }}
      className={cn("panel p-5 transition duration-300", task.status === "DONE" && "border-white/0 bg-card/70")}
    >
      <div className="flex items-start gap-4">
        <AnimatedCheckbox checked={task.status === "DONE"} onChange={onToggle} />

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]", typeColor(task.type))}>
                  {task.type.replace("_", " ")}
                </span>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                  Importance {task.importance_score}
                </span>
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                  {task.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{task.description}</p>
            </div>

            <Link
              to={`/tasks/${task.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-text-secondary transition hover:bg-elevated hover:text-text-primary"
            >
              Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-info" />
              {task.estimated_minutes_total} min
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-xp/10 px-3 py-1 text-xp shadow-xp">
              <Sparkles className="h-4 w-4" />{earnedXp > 0 ? `+${earnedXp} XP banked` : "XP on progress"}
            </span>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-text-muted">
              <span>Quest Progress</span>
              <span>{task.completion_percentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${task.completion_percentage}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
