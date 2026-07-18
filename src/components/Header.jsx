import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Bell, ChevronDown, Search, Menu,
  User, FileText, Palette, MessageCircle, Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./shared/ThemeToggle";
import { mockData } from "../data/mockData";
import mypic from "../assets/images/mypic.jpg";

const MENU_SECTIONS = [
  {
    items: [
      { icon: User,     label: "About Me", path: "/about" },
      { icon: FileText, label: "Resume",   path: "/resume" },
    ],
  },
  {
    label: "Preferences",
    items: [
      { icon: Palette,        label: "Theme",  path: "/settings" },
      { icon: MessageCircle,  label: "Ask Me", path: "/ask" },
    ],
  },
];

function UserMenu({ onClose }) {
  const navigate = useNavigate();

  const go = (path, isShortcut) => {
    onClose();
    if (isShortcut) {
      // dispatch a synthetic Ctrl+K to open the command palette
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
    } else {
      navigate(path);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 overflow-hidden rounded-2xl border border-ink-650/70 bg-ink-900/95 shadow-panel backdrop-blur-xl"
    >
      {/* Profile header */}
      <div className="flex items-center gap-3 border-b border-ink-650/50 px-4 py-3.5">
        <img
          src={mypic}
          alt=""
          className="h-9 w-9 rounded-full object-cover ring-2 ring-accent-500/40"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{mockData.user.name}</p>
          <p className="truncate text-xs text-zinc-400">{mockData.user.title}</p>
        </div>
      </div>

      {/* Sections */}
      <div className="py-1.5">
        {MENU_SECTIONS.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="px-4 pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                {section.label}
              </p>
            )}
            {section.items.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.path, item.kbd != null)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-ink-700/60 hover:text-white"
              >
                <item.icon size={14} className="shrink-0 text-accent-400" />
                <span className="flex-1">{item.label}</span>
                {item.kbd && (
                  <kbd className="rounded border border-ink-650 bg-ink-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                    {item.kbd}
                  </kbd>
                )}
              </button>
            ))}
            {si < MENU_SECTIONS.length - 1 && (
              <div className="mx-4 my-1.5 border-t border-ink-650/40" />
            )}
          </div>
        ))}
      </div>

    </motion.div>
  );
}

export default function Header({ onSearchOpen, onMenuOpen }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-20 border-b border-ink-650/50 bg-ink-950/80 px-3 py-2.5 backdrop-blur-xl sm:px-6 sm:py-3 lg:ml-80 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuOpen}
            className="grid h-11 w-11 place-items-center rounded-full border border-ink-650 bg-ink-800 text-zinc-400 transition hover:border-accent-400/50 hover:text-accent-300 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-full border border-ink-650 bg-ink-800 px-4 py-2 text-sm font-medium text-zinc-400 transition hover:border-accent-400/50 hover:text-white"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onSearchOpen}
            className="hidden items-center gap-2 rounded-full border border-ink-650 bg-ink-800 px-4 py-2 text-sm text-zinc-400 transition hover:border-accent-400/40 hover:text-zinc-300 sm:flex"
          >
            <Search size={14} className="text-accent-400" />
            Search…
            <kbd className="rounded border border-ink-650 bg-ink-900 px-1 py-0.5 text-[10px] text-zinc-400">⌘K</kbd>
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="hidden items-center gap-1.5 text-sm font-medium text-zinc-400 transition hover:text-accent-300 sm:flex"
          >
            <Briefcase size={13} />
            Hire Me
          </button>

          <ThemeToggle />

          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-ink-650 bg-ink-800 text-zinc-400 transition hover:border-accent-400/50 hover:text-accent-300"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>

          {/* Avatar + dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-ink-650 bg-ink-800 p-1 pr-3 text-sm text-zinc-300 transition hover:border-accent-400/50"
            >
              <img
                src={mypic}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
              <motion.span animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={13} className="text-zinc-400" />
              </motion.span>
            </button>

            <AnimatePresence>
              {menuOpen && <UserMenu onClose={() => setMenuOpen(false)} />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
