import { AnimatePresence, motion } from "framer-motion";
import { TaskForm } from "@/components/TaskForm";
import { HabitForm } from "@/components/HabitForm";
import { useAddTaskMutation, useUpdateTaskMutation } from "@/features/tasks/queries";
import { useAddHabitMutation, useUpdateHabitMutation } from "@/features/habits/queries";
import { useUiStore } from "@/store/ui-store";
import type { TaskType } from "@/types/models";

export function QuickAddModal() {
  const mode = useUiStore((state) => state.quickAddMode);
  const editor = useUiStore((state) => state.editor);
  const close = useUiStore((state) => state.closeQuickAdd);
  const closeEditor = useUiStore((state) => state.closeEditor);
  const addTask = useAddTaskMutation();
  const updateTask = useUpdateTaskMutation();
  const addHabit = useAddHabitMutation();
  const updateHabit = useUpdateHabitMutation();

  const taskMode = mode === "planned" ? "PLANNED" : mode === "unplanned" ? "UNPLANNED" : null;
  const editorTaskMode = editor?.type === "task" ? (editor.task.type === "UNPLANNED" ? "UNPLANNED" : "PLANNED") : null;
  const isOpen = Boolean(mode || editor);
  const closeAll = () => {
    close();
    closeEditor();
  };

  const submitTask = async (input: {
    title: string;
    description: string;
    estimated_minutes_total: number;
    type: Extract<TaskType, "PLANNED" | "UNPLANNED">;
    assigned_day?: string;
  }) => {
    await addTask.mutateAsync(input);
    closeAll();
  };

  const submitHabit = async (input: { title: string; description: string; target_minutes: number }) => {
    await addHabit.mutateAsync(input);
    closeAll();
  };

  const submitTaskEdit = async (input: {
    title: string;
    description: string;
    estimated_minutes_total: number;
    type: Extract<TaskType, "PLANNED" | "UNPLANNED">;
    assigned_day?: string;
  }) => {
    if (!editor || editor.type !== "task") {
      return;
    }

    await updateTask.mutateAsync({
      taskId: editor.task.id,
      patch: {
        title: input.title,
        description: input.description,
        estimated_minutes_total: input.estimated_minutes_total,
        assigned_day: input.assigned_day ?? editor.task.assigned_day,
      },
    });
    closeAll();
  };

  const submitHabitEdit = async (input: { title: string; description: string; target_minutes: number }) => {
    if (!editor || editor.type !== "habit") {
      return;
    }

    await updateHabit.mutateAsync({
      habitId: editor.habit.id,
      patch: input,
    });
    closeAll();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAll}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="panel w-full max-w-lg p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-text-muted">{editor ? "Edit item" : "Quick add"}</p>
            <h3 className="mb-5 text-2xl font-bold">
              {editor?.type === "task"
                ? "Edit task"
                : editor?.type === "habit"
                  ? "Edit habit"
                  : mode === "habit"
                    ? "Log a new habit"
                    : `Add ${mode} task`}
            </h3>
            {taskMode ? <TaskForm mode={taskMode} onSubmit={submitTask} /> : null}
            {mode === "habit" ? <HabitForm onSubmit={submitHabit} /> : null}
            {editor?.type === "task" && editorTaskMode ? (
              <TaskForm
                mode={editorTaskMode}
                initialValues={{
                  title: editor.task.title,
                  description: editor.task.description,
                  estimated_minutes_total: editor.task.estimated_minutes_total,
                  assigned_day: editor.task.assigned_day,
                }}
                submitLabel="Update task"
                onSubmit={submitTaskEdit}
              />
            ) : null}
            {editor?.type === "habit" ? (
              <HabitForm
                initialValues={{
                  title: editor.habit.title,
                  description: editor.habit.description,
                  target_minutes: editor.habit.target_minutes,
                }}
                submitLabel="Update habit"
                onSubmit={submitHabitEdit}
              />
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
