import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

export function AnimatedCheckbox({ checked, onChange }: AnimatedCheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-xl border transition",
        checked ? "border-xp bg-xp/20 text-xp shadow-xp" : "border-white/10 bg-white/5 text-transparent",
      )}
      aria-pressed={checked}
    >
      <motion.span
        initial={false}
        animate={{ scale: checked ? 1 : 0.6, opacity: checked ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
      >
        <Check className="h-4 w-4" />
      </motion.span>
    </button>
  );
}
