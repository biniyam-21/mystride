import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Search, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { navItems, mockData } from "../data/mockData";
import mypic from "../assets/images/mypic.jpg";
// Variant tree: parent controls icon + label children together
const rowVariants = {
  rest:  { x: 0 },
  hover: { x: 4, transition: { duration: 0.2, ease: "easeOut" } },
};
const iconVariants = {
  rest:  { rotate: 0, scale: 1 },
  hover: { rotate: 13, scale: 1.2, transition: { duration: 0.2, ease: "easeOut" } },
};
const labelVariants = {
  rest:  { x: 0 },
  hover: { x: 2, transition: { duration: 0.2, ease: "easeOut" } },
};

const MotionNavLink = motion(NavLink);

function NavItem({ item }) {
  const Icon = item.icon;

  if (item.highlight) {
    return (
      <MotionNavLink
        to={item.path}
        variants={rowVariants}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className={({ isActive }) =>
          `relative mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
            isActive
              ? "bg-accent-500/20 text-accent-200 ring-1 ring-accent-400/30"
              : "bg-accent-500/8 text-accent-400 ring-1 ring-accent-400/15 hover:bg-accent-500/15 hover:text-accent-300"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-xl bg-accent-500/15 ring-1 ring-inset ring-accent-400/25"
                transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
              />
            )}
            <motion.span variants={iconVariants} className="relative flex shrink-0">
              <Icon size={17} className="text-accent-400" />
            </motion.span>
            <motion.span variants={labelVariants} className="relative flex-1">
              {item.label}
            </motion.span>
            <span className="relative rounded-full bg-accent-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-300">
              AI
            </span>
          </>
        )}
      </MotionNavLink>
    );
  }

  return (
    <MotionNavLink
      to={item.path}
      end={item.path === "/"}
      variants={rowVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
          isActive
            ? "bg-accent-500/14 text-accent-200"
            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-300"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="nav-pill"
              className="absolute inset-0 rounded-xl bg-accent-500/10 ring-1 ring-inset ring-accent-400/20"
              transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
            />
          )}
          <motion.span variants={iconVariants} className="relative flex shrink-0">
            <Icon
              size={17}
              className={isActive ? "text-accent-400" : "text-zinc-400"}
            />
          </motion.span>
          <motion.span variants={labelVariants} className="relative">
            {item.label}
          </motion.span>
        </>
      )}
    </MotionNavLink>
  );
}

function SidebarContent({ onSearchOpen, onClose }) {
  const location = useLocation();

  React.useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Logo />
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              className="grid h-11 w-11 place-items-center rounded-full border border-ink-650 bg-ink-800 text-zinc-400 transition-colors hover:border-accent-400/50 hover:text-accent-300 lg:hidden"
              aria-label="Close menu"
            >
              <X size={16} />
            </motion.button>
          )}
        </div>

        <motion.button
          onClick={onSearchOpen}
          whileHover={{ scale: 1.015, borderColor: "rgba(167,139,250,0.4)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="flex w-full items-center gap-3 rounded-xl border border-ink-650 bg-ink-800/60 px-4 py-2.5 text-sm text-zinc-400 transition-colors hover:text-zinc-300"
        >
          <motion.span
            variants={{ rest: { rotate: 0 }, hover: { rotate: -15, scale: 1.15 } }}
            initial="rest"
            whileHover="hover"
            transition={{ duration: 0.18 }}
            className="flex"
          >
            <Search size={15} className="text-accent-400" />
          </motion.span>
          <span className="flex-1 text-left">Search pages…</span>
          <kbd className="rounded-md border border-ink-650 bg-ink-900 px-1.5 py-0.5 text-[10px] text-zinc-400">
            ⌘K
          </kbd>
        </motion.button>
      </div>

      <nav className="mt-6 flex-1 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      <div className="space-y-2 border-t border-ink-650/60 pt-3">
        {/* Mini profile */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="relative shrink-0">
            <img
              src={mypic}
              alt={mockData.user.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-accent-500/30"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink-950 bg-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-200">{mockData.user.name}</p>
            <p className="truncate text-[10px] text-emerald-400">● Available for work</p>
          </div>
        </div>

        <MotionNavLink
          to="/settings"
          variants={rowVariants}
          initial="rest"
          whileHover="hover"
          animate="rest"
          className={({ isActive }) =>
            `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
              isActive ? "bg-accent-500/14 text-accent-200" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-300"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <motion.span variants={iconVariants} className="flex shrink-0">
                <Settings size={17} className={isActive ? "text-accent-400" : "text-zinc-400"} />
              </motion.span>
              <motion.span variants={labelVariants}>Settings</motion.span>
            </>
          )}
        </MotionNavLink>
      </div>
    </>
  );
}

export default function Sidebar({ onSearchOpen, mobileOpen, onClose }) {
  const isFirstVisit = !sessionStorage.getItem("portfolio-booted");
  const sidebarClass =
    "fixed inset-y-0 left-0 z-30 hidden w-80 flex-col border-r border-ink-650/60 bg-ink-950/96 px-5 py-6 backdrop-blur-xl lg:flex";

  return (
    <>
      {/* Desktop sidebar */}
      {isFirstVisit ? (
        <motion.aside
          aria-label="Main navigation"
          className={sidebarClass}
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 28, stiffness: 200, delay: 3.2 }}
        >
          <SidebarContent onSearchOpen={onSearchOpen} />
        </motion.aside>
      ) : (
        <aside aria-label="Main navigation" className={sidebarClass}>
          <SidebarContent onSearchOpen={onSearchOpen} />
        </aside>
      )}

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-ink-650/60 bg-ink-950 px-5 py-6 lg:hidden"
            >
              <SidebarContent onSearchOpen={onSearchOpen} onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
