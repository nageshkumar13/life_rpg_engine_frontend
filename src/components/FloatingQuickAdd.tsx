import { Plus } from "lucide-react";
import { useState } from "react";
import { useUiStore } from "@/store/ui-store";

const options = [
  { label: "Add planned task", mode: "planned" as const },
  { label: "Add unplanned task", mode: "unplanned" as const },
  { label: "Log habit", mode: "habit" as const },
];

export function FloatingQuickAdd() {
  const [open, setOpen] = useState(false);
  const openQuickAdd = useUiStore((state) => state.openQuickAdd);

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {open ? (
        <div className="mb-3 w-56 rounded-3xl border border-white/10 bg-card p-3 shadow-panel">
          {options.map((option) => (
            <button
              key={option.mode}
              type="button"
              onClick={() => {
                openQuickAdd(option.mode);
                setOpen(false);
              }}
              className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm text-text-secondary transition hover:bg-elevated hover:text-text-primary"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-panel transition hover:scale-105 hover:bg-primary/90"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
