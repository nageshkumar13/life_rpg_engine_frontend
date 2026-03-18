import { AnimatePresence, motion } from "framer-motion";
import { useUiStore } from "@/store/ui-store";

export function XpToastLayer() {
  const toasts = useUiStore((state) => state.xpToasts);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[60] flex justify-center">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            className="absolute rounded-full border border-xp/20 bg-xp/15 px-5 py-3 text-sm font-semibold text-xp shadow-xp"
          >
            {toast.amount >= 0 ? "+" : ""}{toast.amount} XP ?
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
