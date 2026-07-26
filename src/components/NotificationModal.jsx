import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, X, CheckCheck, Sparkles, Rocket, Briefcase,
  BookOpen, ChevronRight, ExternalLink, MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationModal({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
}) {
  const navigate = useNavigate();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case "ai":
        return <Sparkles size={16} className="text-accent-400" />;
      case "project":
        return <Rocket size={16} className="text-emerald-400" />;
      case "work":
        return <Briefcase size={16} className="text-amber-400" />;
      case "blog":
        return <BookOpen size={16} className="text-sky-400" />;
      default:
        return <Bell size={16} className="text-accent-400" />;
    }
  };

  const handleClickItem = (item) => {
    onNotificationClick(item.id);
    onClose();
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <AnimatePresence>
      {/* Blurry Backdrop overlay — dismisses view when clicking empty section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/65 backdrop-blur-md cursor-pointer"
      />

      {/* Responsive Modal Container — clicking empty space closes modal */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end p-4 pt-16 sm:pt-20 sm:pr-8 md:pr-12 lg:pr-20 xl:pr-28 cursor-pointer"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-[min(92vw,22rem)] max-w-sm overflow-hidden rounded-2xl border border-ink-650/80 bg-ink-900/95 shadow-panel backdrop-blur-2xl cursor-default"
        >

          {/* Header */}
          <div className="flex items-center justify-between border-b border-ink-650/60 px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-accent-400/30 bg-accent-500/10 text-accent-400">
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-accent-500/20 border border-accent-400/30 px-2 py-0.5 text-[10px] font-semibold text-accent-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">Latest updates & portfolio announcements</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  title="Mark all as read"
                  className="flex items-center gap-1 rounded-lg border border-ink-650 bg-ink-800/80 px-2 py-1 text-[11px] font-medium text-zinc-300 transition hover:border-accent-400/40 hover:text-white"
                >
                  <CheckCheck size={13} className="text-accent-400" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-ink-700 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[22rem] overflow-y-auto divide-y divide-ink-650/40 p-1.5 scrollbar-thin scrollbar-thumb-ink-700">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <Bell size={28} className="text-zinc-600" />
                <p className="text-xs text-zinc-400">No notifications at the moment.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleClickItem(item)}
                  className={`group relative flex items-start gap-3 rounded-xl p-3 text-left transition-all cursor-pointer ${
                    item.read
                      ? "bg-transparent hover:bg-ink-800/50"
                      : "bg-accent-500/[0.06] hover:bg-accent-500/[0.12] border-l-2 border-accent-400"
                  }`}
                >
                  {/* Category icon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-ink-650 bg-ink-800/90 shadow-sm">
                    {getIcon(item.type)}
                  </div>

                  {/* Body */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-semibold truncate ${item.read ? "text-zinc-200" : "text-white font-bold"}`}>
                        {item.title}
                      </h4>
                      <span className="shrink-0 text-[10px] text-zinc-500">{item.time}</span>
                    </div>

                    <p className="text-[11px] leading-relaxed text-zinc-400 line-clamp-2">
                      {item.message}
                    </p>

                    {item.actionText && (
                      <span className="inline-flex items-center gap-1 pt-1 text-[11px] font-medium text-accent-400 group-hover:text-accent-300 group-hover:underline">
                        {item.actionText}
                        <ChevronRight size={11} />
                      </span>
                    )}
                  </div>

                  {!item.read && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-ink-650/60 bg-ink-950/60 px-4 py-2.5 text-[11px] text-zinc-400">
            <span>Pinging live updates</span>
            <button
              onClick={() => {
                onClose();
                navigate("/ask");
              }}
              className="flex items-center gap-1 font-medium text-accent-400 hover:underline"
            >
              <MessageSquare size={12} />
              Ask AI Assistant
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
