import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

/**
 * Boot sequence script.
 *  type "cmd"    → characters are typed out one by one, then committed
 *  type "out"    → appears instantly (dim output line)
 *  type "ok"     → appears instantly (green ✓ line)
 *  type "hi"     → appears instantly (bright welcome line)
 *  type "div"    → horizontal rule
 *  type "gap"    → invisible pause (ms field required)
 */
const CHAR_MS = 14; // ms per character — feels like a fast typist

// Timing breakdown (CHAR_MS=14):
//  t=160  cmd1 "node portfolio.js --env=production"  34 chars → done ~t=636  +200ms pause
//  t=850  out + ok  → t=960
//  gap 260 → t=1220
//  t=1220  cmd2 "load projects --source=github"  29 chars → done ~t=1626  +200ms pause
//  t=1826  ok → t=1881
//  gap 260 → t=2141
//  t=2141  cmd3 "fetch github --stats"  20 chars → done ~t=2421  +200ms pause
//  t=2621  ok → t=2676
//  gap 180 → t=2856  div+hi → t=3011
//  hold 500ms → fade at ~3511ms  onDone at ~4061ms
const SCRIPT = [
  { type: "cmd", text: "node portfolio.js --env=production" },
  { type: "out", text: "  Booting on http://localhost:5173" },
  { type: "ok",  text: "  React 18.3.1  ·  Vite 5.4  ·  Node v20.11" },
  { type: "gap", ms: 260 },
  { type: "cmd", text: "load projects --source=github" },
  { type: "ok",  text: "  12 projects indexed  ·  3 featured  ·  0 errors" },
  { type: "gap", ms: 260 },
  { type: "cmd", text: "fetch github --stats" },
  { type: "ok",  text: "  1,247 commits  ·  89 stars  ·  23 public repos" },
  { type: "gap", ms: 180 },
  { type: "div" },
  { type: "hi",  text: "All systems ready.  Welcome, recruiter." },
];

// --- tiny hook: blink interval ---
function useBlink(ms = 530) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), ms);
    return () => clearInterval(id);
  }, [ms]);
  return on;
}

// --- cursor block element ---
function Cursor({ blink }) {
  return (
    <span
      className="inline-block h-[13px] w-[7px] translate-y-px bg-accent-400"
      style={{ opacity: blink ? 1 : 0, transition: "opacity 0.08s" }}
    />
  );
}

export default function BootLoader({ onDone }) {
  const [committed, setCommitted] = useState([]); // finished lines
  const [partial, setPartial]     = useState(null); // string being typed, or null
  const [visible, setVisible]     = useState(true);
  const blink = useBlink();

  useEffect(() => {
    const timers = [];
    let t = 160; // initial pause before first character

    const at = (delay, fn) => timers.push(setTimeout(fn, delay));

    for (const entry of SCRIPT) {
      if (entry.type === "cmd") {
        // Animate each character
        for (let i = 0; i <= entry.text.length; i++) {
          const slice = entry.text.slice(0, i);
          at(t, () => setPartial(slice));
          t += CHAR_MS;
        }
        // Commit the full line and clear partial
        const text = entry.text;
        at(t, () => {
          setCommitted((prev) => [...prev, { type: "cmd", text }]);
          setPartial(null);
        });
        t += 200; // brief pause after "pressing Enter"
      } else if (entry.type === "gap") {
        t += entry.ms;
      } else if (entry.type === "div") {
        at(t, () => setCommitted((prev) => [...prev, { type: "div" }]));
        t += 100;
      } else {
        // out / ok / hi — instant
        const e = { type: entry.type, text: entry.text };
        at(t, () => setCommitted((prev) => [...prev, e]));
        t += 55;
      }
    }

    // Hold after last line → fade → notify
    at(t + 500,  () => setVisible(false));
    at(t + 1050, () => onDone());

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="bootloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#08080a]"
        >
          <div className="w-full max-w-lg px-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0c0f] shadow-2xl shadow-black"
            >
              {/* ── Title bar ── */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-auto flex items-center gap-1.5 text-[11px] text-zinc-600">
                  <Terminal size={11} />
                  ishaan@portfolio — zsh — 80×24
                </span>
              </div>

              {/* ── Terminal body ── */}
              <div className="p-5 font-mono text-[13px] leading-[1.75]">
                {/* Committed lines */}
                {committed.map((line, i) => {
                  if (line.type === "div") {
                    return (
                      <div
                        key={i}
                        className="my-2.5 border-t border-white/[0.07]"
                      />
                    );
                  }
                  return (
                    <div key={i} className="flex gap-2 items-baseline">
                      {line.type === "cmd" && (
                        <span className="shrink-0 text-accent-400 select-none">❯</span>
                      )}
                      {line.type === "ok" && (
                        <span className="shrink-0 text-emerald-400 select-none">✓</span>
                      )}
                      {line.type === "out" && (
                        <span className="shrink-0 text-zinc-600 select-none">·</span>
                      )}
                      {line.type === "hi" && (
                        <span className="shrink-0 text-accent-400 select-none">~</span>
                      )}
                      <span
                        className={
                          line.type === "cmd" ? "text-white" :
                          line.type === "ok"  ? "text-zinc-300" :
                          line.type === "out" ? "text-zinc-500" :
                          /* hi */ "font-semibold text-white"
                        }
                      >
                        {line.text}
                      </span>
                    </div>
                  );
                })}

                {/* Active prompt line — shows typing or idle cursor */}
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="shrink-0 text-accent-400 select-none">❯</span>
                  <span className="text-white">
                    {partial ?? ""}
                    <Cursor blink={blink} />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
