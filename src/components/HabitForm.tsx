import { Sparkles } from "lucide-react";
import { useState } from "react";

interface HabitFormProps {
  initialValues?: {
    title: string;
    description: string;
    target_minutes: number;
  };
  submitLabel?: string;
  onSubmit: (input: { title: string; description: string; target_minutes: number }) => void;
}

export function HabitForm({ initialValues, submitLabel = "Save habit", onSubmit }: HabitFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [targetMinutes, setTargetMinutes] = useState(String(initialValues?.target_minutes ?? 20));

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
          target_minutes: Number(targetMinutes) || 0,
        });
      }}
    >
      <div>
        <label className="mb-2 block text-sm text-text-secondary">Habit name</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Workout"
          className="w-full rounded-2xl border border-white/10 bg-bg px-4 py-3 text-sm outline-none placeholder:text-text-muted focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm text-text-secondary">Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="Morning exercise"
          className="w-full rounded-2xl border border-white/10 bg-bg px-4 py-3 text-sm outline-none placeholder:text-text-muted focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm text-text-secondary">Daily target minutes</label>
        <input
          value={targetMinutes}
          onChange={(event) => setTargetMinutes(event.target.value)}
          type="number"
          className="w-full rounded-2xl border border-white/10 bg-bg px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/90">
        <Sparkles className="h-4 w-4" />
        {submitLabel}
      </button>
    </form>
  );
}
