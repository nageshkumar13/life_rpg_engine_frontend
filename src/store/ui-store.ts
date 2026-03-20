import { create } from "zustand";
import type { Habit, Task, TaskType } from "@/types/models";

type QuickAddMode = "planned" | "unplanned" | "habit" | null;

type EditorState =
  | {
      type: "task";
      task: Pick<Task, "id" | "title" | "description" | "estimated_minutes_total" | "assigned_day" | "type">;
    }
  | {
      type: "habit";
      habit: Pick<Habit, "id" | "title" | "description" | "target_minutes">;
    }
  | null;

interface XpToast {
  id: string;
  amount: number;
}

interface UiStore {
  quickAddMode: QuickAddMode;
  editor: EditorState;
  xpToasts: XpToast[];
  openQuickAdd: (mode: Exclude<QuickAddMode, null>) => void;
  closeQuickAdd: () => void;
  openTaskEditor: (task: Pick<Task, "id" | "title" | "description" | "estimated_minutes_total" | "assigned_day" | "type">) => void;
  openHabitEditor: (habit: Pick<Habit, "id" | "title" | "description" | "target_minutes">) => void;
  closeEditor: () => void;
  pushXpToast: (amount: number) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  quickAddMode: null,
  editor: null,
  xpToasts: [],
  openQuickAdd: (mode) => set({ quickAddMode: mode }),
  closeQuickAdd: () => set({ quickAddMode: null }),
  openTaskEditor: (task) => set({ editor: { type: "task", task } }),
  openHabitEditor: (habit) => set({ editor: { type: "habit", habit } }),
  closeEditor: () => set({ editor: null }),
  pushXpToast: (amount) => {
    const id = crypto.randomUUID();

    set((state) => ({
      xpToasts: [...state.xpToasts, { id, amount }],
    }));

    window.setTimeout(() => {
      set((state) => ({
        xpToasts: state.xpToasts.filter((toast) => toast.id !== id),
      }));
    }, 1400);
  },
}));
