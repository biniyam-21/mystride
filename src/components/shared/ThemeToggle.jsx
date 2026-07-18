import React from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-ink-650 bg-ink-800 text-zinc-400 transition hover:border-accent-400/60 hover:text-accent-300"
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        {isDark ? <Moon size={17} /> : <Sun size={17} />}
      </motion.span>
    </button>
  );
}
