import { create } from "zustand";

type QuickAddMode = "planned" | "unplanned" | "habit" | null;

interface XpToast {
  id: string;
  amount: number;
}

interface UiStore {
  quickAddMode: QuickAddMode;
  xpToasts: XpToast[];
  openQuickAdd: (mode: Exclude<QuickAddMode, null>) => void;
  closeQuickAdd: () => void;
  pushXpToast: (amount: number) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  quickAddMode: null,
  xpToasts: [],
  openQuickAdd: (mode) => set({ quickAddMode: mode }),
  closeQuickAdd: () => set({ quickAddMode: null }),
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
