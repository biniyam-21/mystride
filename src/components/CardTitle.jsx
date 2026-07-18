import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CardTitle({ title }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <div className="flex gap-1">
        {[ChevronLeft, ChevronRight].map((Icon, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="grid h-8 w-8 place-items-center rounded-full border border-ink-650 bg-ink-950/50 text-zinc-400 transition-colors duration-150 hover:border-accent-400/40 hover:bg-accent-500/10 hover:text-accent-300"
          >
            <motion.span
              whileHover={{ x: index === 0 ? -1 : 1 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              <Icon size={15} />
            </motion.span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
