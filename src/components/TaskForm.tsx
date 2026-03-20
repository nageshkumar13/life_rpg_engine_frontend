import { CalendarDays, Pencil, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { ACTIVE_DATE } from "@/lib/session";
import type { TaskType } from "@/types/models";

interface TaskFormProps {
  mode: Extract<TaskType, "PLANNED" | "UNPLANNED">;
  initialValues?: {
    title: string;
    description: string;
    estimated_minutes_total: number;
    assigned_day?: string;
  };
  submitLabel?: string;
  onSubmit: (input: {
    title: string;
    description: string;
    estimated_minutes_total: number;
    type: Extract<TaskType, "PLANNED" | "UNPLANNED">;
    assigned_day?: string;
  }) => void;
}

export function TaskForm({ mode, initialValues, submitLabel = "Save task", onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(String(initialValues?.estimated_minutes_total ?? (mode === "PLANNED" ? 45 : 20)));
  const [assignedDay, setAssignedDay] = useState(initialValues?.assigned_day ?? ACTIVE_DATE);
  const assignedDayRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim()) {
          return;
        }

        onSubmit({
          title: title.trim(),
          description: description.trim(),
          estimated_minutes_total: Number(estimatedMinutes) || 0,
          type: mode,
          assigned_day: assignedDay || undefined,
        });
      }}
    >
      <div>
        <label className="mb-2 block text-sm text-text-secondary">Title</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={mode === "PLANNED" ? "Plan sprint retro notes" : "Handle quick admin task"}
          className="w-full rounded-2xl border border-white/10 bg-bg px-4 py-3 text-sm outline-none placeholder:text-text-muted focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm text-text-secondary">Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="Short context for this task"
          className="w-full rounded-2xl border border-white/10 bg-bg px-4 py-3 text-sm outline-none placeholder:text-text-muted focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm text-text-secondary">Estimated minutes</label>
        <div className="relative">
          <Pencil className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={estimatedMinutes}
            onChange={(event) => setEstimatedMinutes(event.target.value)}
            type="number"
            className="w-full rounded-2xl border border-white/10 bg-bg py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm text-text-secondary">Assigned day</label>
        <div className="relative">
          <input
            ref={assignedDayRef}
            value={assignedDay}
            onChange={(event) => setAssignedDay(event.target.value)}
            onClick={() => assignedDayRef.current?.showPicker?.()}
            type="date"
            className="w-full rounded-2xl border border-white/10 bg-bg px-4 py-3 pr-14 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => assignedDayRef.current?.showPicker?.()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 p-2 text-text-secondary transition-all duration-200 ease-out hover:bg-elevated hover:text-text-primary"
            aria-label="Open calendar"
          >
            <CalendarDays className="h-4 w-4" />
          </button>
        </div>
      </div>
      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/90">
        <Sparkles className="h-4 w-4" />
        {submitLabel}
      </button>
    </form>
  );
}
