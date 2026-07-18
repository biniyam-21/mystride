import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useScrollStart } from "../../hooks/gsapUtils";

const SCRIPT = [
  { delay: 300,  type: "cmd", text: "whoami" },
  { delay: 600, type: "out", text: "Biniyam tesfu— backend dev & problem solver" },
  { delay: 1100, type: "cmd", text: "cat stack.json" },
  { delay: 1500, type: "out", text: '{ "languages": ["Java", "Python", "TypeScript", "Go"] }' },
  { delay: 2100, type: "cmd", text: "git log --oneline -3" },
  { delay: 2500, type: "out", text: "feat: ship NeuroSync API v2 with auto-scaling" },
  { delay: 2600, type: "out", text: "perf: cut p99 latency from 120ms to 8ms" },
  { delay: 2700, type: "out", text: "fix: resolve race condition in Kafka consumer" },
  { delay: 3300, type: "cmd", text: "echo $STATUS" },
  { delay: 3700, type: "out", text: "Available for work — drop me a message!" },
];

export default function TerminalWidget() {
  const [lines, setLines]   = useState([]);
  const [cursor, setCursor] = useState(true);
  const outputRef = useRef(null); // the overflow-y-auto container

  // Only start the animation when this element scrolls into view
  const [started, containerRef] = useScrollStart({ start: "top 92%" });

  // Gate all timers behind `started`
  useEffect(() => {
    const timers = SCRIPT.map(({ delay, type, text }) =>
      setTimeout(() => setLines((prev) => [...prev, { type, text }]), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Scroll only within the terminal's own overflow container — never the page
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, [started]);

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-2xl border border-ink-650/80 bg-[#0c0c0e] shadow-panel">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-ink-650/60 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rose-500/80" />
        <span className="h-3 w-3 rounded-full bg-amber-500/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 flex items-center gap-1.5 text-xs text-zinc-400">
          <Terminal size={12} />
          Biniyam@portfolio ~ zsh
        </span>
      </div>

      {/* Output */}
      <div ref={outputRef} className="h-52 overflow-y-auto p-4 font-mono text-xs leading-6">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
          >
            {line.type === "cmd" ? (
              <p>
                <span className="text-accent-400">❯ </span>
                <span className="text-white">{line.text}</span>
              </p>
            ) : (
              <p className="text-zinc-400 pl-4">{line.text}</p>
            )}
          </motion.div>
        ))}

        {/* Live cursor at the end */}
        <p>
          <span className="text-accent-400">❯ </span>
          <span
            className="inline-block w-2 h-4 bg-accent-400 align-middle"
            style={{ opacity: cursor ? 1 : 0, transition: "opacity 0.1s" }}
          />
        </p>
      </div>
    </div>
  );
}
