import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, LayoutDashboard, User, FolderOpen, FileText,
  BarChart3, Trophy, BookOpen, Zap, Award, FileUser, Mail, Settings, Sparkles,
} from "lucide-react";

const routes = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard, desc: "Overview & stats" },
  { label: "About Me", path: "/about", icon: User, desc: "Who I am" },
  { label: "Projects", path: "/projects", icon: FolderOpen, desc: "My work" },
  { label: "Blog", path: "/blog", icon: FileText, desc: "Articles & writing" },
  { label: "Stats", path: "/stats", icon: BarChart3, desc: "Coding statistics" },
  { label: "Achievements", path: "/achievements", icon: Trophy, desc: "Badges & milestones" },
  { label: "Learning Journey", path: "/learning", icon: BookOpen, desc: "Timeline" },
  { label: "Skills", path: "/skills", icon: Zap, desc: "Tech stack" },
  { label: "Certifications", path: "/certifications", icon: Award, desc: "Certs & courses" },
  { label: "Resume", path: "/resume", icon: FileUser, desc: "Download CV" },
  { label: "Contact", path: "/contact", icon: Mail, desc: "Get in touch" },
  { label: "Ask About Me", path: "/ask", icon: Sparkles, desc: "AI-powered Q&A" },
  { label: "Settings", path: "/settings", icon: Settings, desc: "Preferences" },
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  const filtered = query
    ? routes.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.desc.toLowerCase().includes(query.toLowerCase())
      )
    : routes;

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  // Scroll the highlighted item into view inside the list
  useEffect(() => {
    itemRefs.current[selected]?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const go = useCallback(
    (path) => {
      navigate(path);
      onClose();
    },
    [navigate, onClose]
  );

  const handleKey = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter" && filtered[selected]) {
        e.preventDefault();
        go(filtered[selected].path);
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Tab") {
        // Keep focus trapped inside the dialog
        e.preventDefault();
        if (e.shiftKey) {
          setSelected((s) => Math.max(s - 1, 0));
        } else {
          setSelected((s) => Math.min(s + 1, filtered.length - 1));
        }
      }
    },
    [filtered, selected, go, onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette — navigate to a page"
            className="fixed left-1/2 top-[18%] z-50 w-full max-w-lg -translate-x-1/2 px-4"
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="overflow-hidden rounded-2xl border border-ink-650/80 bg-ink-900/95 shadow-2xl shadow-black/60 backdrop-blur-xl">
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-ink-650 px-4 py-3.5">
                <Search size={17} className="shrink-0 text-accent-400" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Search pages..."
                  aria-label="Search pages"
                  role="combobox"
                  aria-expanded={filtered.length > 0}
                  aria-autocomplete="list"
                  aria-controls="cmd-listbox"
                  aria-activedescendant={filtered[selected] ? `cmd-option-${selected}` : undefined}
                  className="flex-1 bg-transparent text-sm text-white placeholder-zinc-400 outline-none"
                />
                <kbd className="rounded-md border border-ink-650 bg-ink-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <ul
                id="cmd-listbox"
                ref={listRef}
                role="listbox"
                aria-label="Pages"
                className="max-h-80 overflow-y-auto py-2"
              >
                {filtered.length === 0 && (
                  <li role="status" className="px-4 py-6 text-center text-sm text-zinc-400">
                    No results for &ldquo;{query}&rdquo;
                  </li>
                )}
                {filtered.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = selected === i;
                  return (
                    <li
                      key={item.path}
                      id={`cmd-option-${i}`}
                      role="option"
                      aria-selected={isActive}
                      ref={(el) => { itemRefs.current[i] = el; }}
                    >
                      <button
                        onClick={() => go(item.path)}
                        onMouseEnter={() => setSelected(i)}
                        tabIndex={-1}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isActive ? "bg-accent-500/12 text-white" : "text-zinc-400"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${
                            isActive
                              ? "border-accent-400/30 bg-accent-500/15 text-accent-300"
                              : "border-ink-650 bg-ink-800 text-zinc-400"
                          }`}
                        >
                          <Icon size={15} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">{item.label}</span>
                          <span className="block truncate text-xs text-zinc-400">{item.desc}</span>
                        </span>
                        {isActive && (
                          <kbd aria-hidden="true" className="rounded border border-ink-650 bg-ink-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                            ↵
                          </kbd>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div aria-hidden="true" className="flex items-center gap-4 border-t border-ink-650 px-4 py-2 text-[10px] text-zinc-400">
                <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono">↵</kbd> open</span>
                <span><kbd className="font-mono">esc</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
