import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CardTitle({ title, onPrev, onNext, showControls = false }) {
  const hasControls = showControls || (Boolean(onPrev) && Boolean(onNext));

  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">{title}</h2>
      {hasControls && (
        <div className="flex items-center gap-1">
          <motion.button
            type="button"
            onClick={onPrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous"
            className="flex h-6 w-6 items-center justify-center rounded-lg border border-ink-650 bg-ink-950/60 text-zinc-400 transition-colors hover:border-accent-400/40 hover:bg-accent-500/15 hover:text-accent-300"
          >
            <ChevronLeft size={14} />
          </motion.button>
          <motion.button
            type="button"
            onClick={onNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next"
            className="flex h-6 w-6 items-center justify-center rounded-lg border border-ink-650 bg-ink-950/60 text-zinc-400 transition-colors hover:border-accent-400/40 hover:bg-accent-500/15 hover:text-accent-300"
          >
            <ChevronRight size={14} />
          </motion.button>
        </div>
      )}
    </div>
  );
}
