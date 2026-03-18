import { AnimatePresence, motion } from "framer-motion";
import { useUiStore } from "@/store/ui-store";
import { TaskForm } from "@/components/TaskForm";
import { HabitForm } from "@/components/HabitForm";
import { useAddTaskMutation } from "@/features/tasks/queries";
import { useAddHabitMutation } from "@/features/habits/queries";
import type { TaskType } from "@/types/models";

export function QuickAddModal() {
  const mode = useUiStore((state) => state.quickAddMode);
  const close = useUiStore((state) => state.closeQuickAdd);
  const pushXpToast = useUiStore((state) => state.pushXpToast);
  const addTask = useAddTaskMutation();
  const addHabit = useAddHabitMutation();

  const taskMode = mode === "planned" ? "PLANNED" : mode === "unplanned" ? "UNPLANNED" : null;

  const submitTask = async (input: {
    title: string;
    description: string;
    estimated_minutes_total: number;
    type: Extract<TaskType, "PLANNED" | "UNPLANNED">;
  }) => {
    await addTask.mutateAsync(input);
    pushXpToast(Math.max(8, Math.round(input.estimated_minutes_total / 3)));
    close();
  };

  const submitHabit = async (input: { title: string; description: string; target_minutes: number }) => {
    await addHabit.mutateAsync(input);
    close();
  };

  return (
    <AnimatePresence>
      {mode ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="panel w-full max-w-lg p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-text-muted">Quick add</p>
            <h3 className="mb-5 text-2xl font-bold">{mode === "habit" ? "Log a new habit" : `Add ${mode} task`}</h3>
            {taskMode ? <TaskForm mode={taskMode} onSubmit={submitTask} /> : null}
            {mode === "habit" ? <HabitForm onSubmit={submitHabit} /> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
