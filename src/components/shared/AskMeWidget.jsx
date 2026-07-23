import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X, RotateCcw, ChevronRight, Minus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchRAGResponse } from "../../services/ragApi";
import { suggestedQuestions } from "../../data/ragMock";
import mypic from "../../assets/images/mypic.jpg";

/* ─── Brand SVG icons ───────────────────────────────────── */
function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

/* ─── Robot SVG icon ────────────────────────────────────── */
function IconRobot({ size = 28 }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Antenna */}
      <line x1="32" y1="6" x2="32" y2="14" />
      <circle cx="32" cy="5" r="3" fill="currentColor" stroke="none" />
      {/* Head */}
      <rect x="14" y="14" width="36" height="26" rx="6" />
      {/* Eyes */}
      <circle cx="24" cy="25" r="4" fill="currentColor" stroke="none" />
      <circle cx="40" cy="25" r="4" fill="currentColor" stroke="none" />
      <circle cx="25.5" cy="23.5" r="1.2" fill="white" stroke="none" />
      <circle cx="41.5" cy="23.5" r="1.2" fill="white" stroke="none" />
      {/* Mouth */}
      <path d="M24 33 Q32 38 40 33" strokeWidth="2.5" fill="none" />
      {/* Neck */}
      <line x1="28" y1="40" x2="28" y2="46" />
      <line x1="36" y1="40" x2="36" y2="46" />
      {/* Body */}
      <rect x="18" y="46" width="28" height="14" rx="4" />
      {/* Ears / side bolts */}
      <rect x="8" y="20" width="6" height="10" rx="3" />
      <rect x="50" y="20" width="6" height="10" rx="3" />
      {/* Body buttons */}
      <circle cx="27" cy="53" r="2" fill="currentColor" stroke="none" />
      <circle cx="32" cy="53" r="2" fill="currentColor" stroke="none" />
      <circle cx="37" cy="53" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─── Responsive hook ───────────────────────────────────── */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

/* ─── Claude-style Hardcoded Thinking Phrases ───────────── */
const CLAUDE_PHRASES = [
  "Searching portfolio knowledge base...",
  "Analyzing experience & skills...",
  "Synthesizing RAG context...",
  "Formulating response...",
];

function ClaudeTypingIndicator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CLAUDE_PHRASES.length);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-1 py-0.5">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-accent-400"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.14, ease: "easeInOut" }}
          />
        ))}
      </div>
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -2 }}
        transition={{ duration: 0.25 }}
        className="text-[10px] font-medium text-accent-300/90 italic"
      >
        {CLAUDE_PHRASES[index]}
      </motion.p>
    </div>
  );
}

/* ─── Smart Route Suggestions Mapper ───────────────────── */
function getRelevantRoutes(content = "", sources = []) {
  const text = (content + " " + JSON.stringify(sources)).toLowerCase();
  const routes = [];

  if (
    text.includes("project") ||
    text.includes("finot") ||
    text.includes("di-assist") ||
    text.includes("hsim") ||
    text.includes("built")
  ) {
    routes.push({ label: "Explore Projects", path: "/projects", icon: "🚀" });
  }

  if (
    text.includes("skill") ||
    text.includes("tech") ||
    text.includes("stack") ||
    text.includes("react") ||
    text.includes("node") ||
    text.includes("java")
  ) {
    routes.push({ label: "View Skills", path: "/skills", icon: "⚡" });
  }

  if (
    text.includes("experience") ||
    text.includes("orbit") ||
    text.includes("jpmorgan") ||
    text.includes("work") ||
    text.includes("job") ||
    text.includes("career")
  ) {
    routes.push({ label: "Work History", path: "/resume", icon: "💼" });
  }

  if (
    text.includes("contact") ||
    text.includes("hire") ||
    text.includes("available") ||
    text.includes("email") ||
    text.includes("reach")
  ) {
    routes.push({ label: "Get in Touch", path: "/contact", icon: "✉️" });
  }

  if (
    text.includes("achievement") ||
    text.includes("certif") ||
    text.includes("forage") ||
    text.includes("education")
  ) {
    routes.push({ label: "View Achievements", path: "/achievements", icon: "🏆" });
  }

  if (routes.length === 0) {
    routes.push({ label: "View Dashboard", path: "/dashboard", icon: "📊" });
  }

  return routes.slice(0, 2);
}

function SmartRouteSuggestions({ content, sources, onCloseChat }) {
  const navigate = useNavigate();
  const routes = getRelevantRoutes(content, sources);

  const handleNavigate = (path) => {
    if (onCloseChat) onCloseChat();
    navigate(path);
  };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-ink-650/40 pt-2">
      <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-400">
        Suggested details:
      </span>
      {routes.map((r) => (
        <motion.button
          key={r.path}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => handleNavigate(r.path)}
          className="flex items-center gap-1 rounded border border-accent-400/30 bg-accent-500/10 px-2 py-0.5 text-[10px] font-medium text-accent-300 transition hover:border-accent-400/60 hover:bg-accent-500/20 hover:text-white"
        >
          <span>{r.icon}</span>
          <span>{r.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ─── Text renderer (supports **bold** and \n) ──────────── */
function FormattedText({ text }) {
  return (
    <span className="leading-6">
      {text.split("\n").map((line, i, arr) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <React.Fragment key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold text-white">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
}

/* ─── Bot avatar ────────────────────────────────────────── */
function BotAvatar({ size = "sm" }) {
  const dim = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const icon = size === "sm" ? 11 : 14;
  return (
    <div className={`${dim} shrink-0 grid place-items-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 ring-2 ring-accent-400/20`}>
      <Sparkles size={icon} className="text-white" />
    </div>
  );
}

/* ─── Message bubble ────────────────────────────────────── */
function Message({ role, content, sources, isTyping, onCloseChat }) {
  const isBot = role === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && <BotAvatar size="sm" />}
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
          isBot
            ? "rounded-bl-sm border border-ink-650/70 bg-ink-800/90 text-zinc-200"
            : "rounded-br-sm border border-accent-400/20 bg-accent-500/15 text-zinc-100"
        }`}
      >
        {isTyping ? <ClaudeTypingIndicator /> : <FormattedText text={content} />}

        {/* Smart Route Suggestions instead of raw OpenRouter / MD tags */}
        {isBot && !isTyping && content && (
          <SmartRouteSuggestions content={content} sources={sources} onCloseChat={onCloseChat} />
        )}
      </div>
      {!isBot && (
        <img
          src={mypic}
          alt="You"
          className="h-6 w-6 shrink-0 rounded-full border border-accent-400/20 object-cover"
        />
      )}
    </motion.div>
  );
}

/* ─── Suggested chip ────────────────────────────────────── */
function Chip({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex shrink-0 items-center gap-1 rounded-full border border-ink-650 bg-ink-800/60 px-3 py-1.5 text-[11px] text-zinc-300 transition hover:border-accent-400/40 hover:text-accent-300"
    >
      <ChevronRight size={9} className="text-accent-500" />
      {label}
    </button>
  );
}

/* ─── Speed-dial option button ──────────────────────────── */
function DialOption({ icon, label, bg, onClick, href, delay }) {
  const content = (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.7 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.7 }}
      transition={{ type: "spring", stiffness: 400, damping: 28, delay }}
      className="flex items-center gap-3"
    >
      {/* Label */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: delay + 0.05 }}
        className="rounded-lg border border-ink-650/80 bg-ink-900/95 px-2.5 py-1 text-xs font-medium text-zinc-300 shadow-lg backdrop-blur-sm"
      >
        {label}
      </motion.span>
      {/* Icon button */}
      <button
        onClick={onClick}
        className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-95 ${bg}`}
      >
        {icon}
      </button>
    </motion.div>
  );

  if (href) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.7 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.7 }}
        transition={{ type: "spring", stiffness: 400, damping: 28, delay }}
        className="flex items-center gap-3"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: delay + 0.05 }}
          className="rounded-lg border border-ink-650/80 bg-ink-900/95 px-2.5 py-1 text-xs font-medium text-zinc-300 shadow-lg backdrop-blur-sm"
        >
          {label}
        </motion.span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-95 ${bg}`}
        >
          {icon}
        </a>
      </motion.div>
    );
  }

  return content;
}

/* ─── Constants ─────────────────────────────────────────── */
const WELCOME = {
  role: "bot",
  id: "welcome",
  content:
    "Hi! I'm Biniyam's AI assistant powered by OpenRouter RAG. 👋\n\nAsk me anything about his **experience**, **skills**, **projects**, or **availability**!",
};

/* ─── Widget ────────────────────────────────────────────── */
export default function AskMeWidget() {
  const location = useLocation();
  const isDesktop = useIsDesktop();

  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const isOnAskPage = location.pathname === "/ask";

  useEffect(() => {
    if (chatOpen && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, chatOpen, minimized]);

  useEffect(() => {
    if (chatOpen && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [chatOpen, minimized]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!e.target.closest("[data-widget]")) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [menuOpen]);

  const closeChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  // Escape key: close chat → then menu
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== "Escape") return;
      if (chatOpen) {
        closeChat();
      } else if (menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [chatOpen, menuOpen, closeChat]);

  const sendMessage = useCallback(
    async (text) => {
      const query = text.trim();
      if (!query || isTyping) return;

      setMessages((prev) => [...prev, { role: "user", content: query, id: Date.now() }]);
      setInput("");
      setIsTyping(true);
      setMsgCount((n) => n + 1);

      const res = await fetchRAGResponse(query);

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: res.answer,
          sources: res.sources,
          meta: res.meta,
          id: Date.now() + 1,
        },
      ]);
    },
    [isTyping]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    setIsTyping(false);
    setInput("");
    setMsgCount(0);
  };

  const openChat = () => {
    setMenuOpen(false);
    setChatOpen(true);
  };

  const panelVariants = {
    initial: isDesktop ? { opacity: 0, scale: 0.92, y: 20 } : { y: "100%" },
    animate: isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 },
    exit: isDesktop ? { opacity: 0, scale: 0.92, y: 20 } : { y: "100%" },
  };

  if (isOnAskPage) return null;

  return (
    <div data-widget>
      {/* Mobile backdrop for chat panel */}
      <AnimatePresence>
        {chatOpen && !isDesktop && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
          />
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            key="chat-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Ask about Biniyam — AI chat"
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className={`
              fixed z-50 flex flex-col overflow-hidden
              border border-ink-650/80 bg-ink-900/96 shadow-2xl shadow-black/60 backdrop-blur-xl
              bottom-0 left-0 right-0 rounded-t-2xl
              lg:bottom-24 lg:right-6 lg:left-auto lg:w-[380px] lg:rounded-2xl
              ${minimized ? "h-auto" : "max-h-[88vh] lg:h-[530px] lg:max-h-none"}
            `}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-ink-650/70 bg-gradient-to-r from-accent-600/10 to-transparent px-4 py-3.5">
              <BotAvatar size="lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Ask About Biniyam</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[10px] text-zinc-400">OpenRouter RAG · Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMinimized((v) => !v)}
                  aria-label={minimized ? "Expand chat" : "Minimize chat"}
                  className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-ink-700 hover:text-zinc-300"
                >
                  <Minus size={14} />
                </button>
                {msgCount > 0 && (
                  <button
                    onClick={clearChat}
                    aria-label="Clear chat history"
                    className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-ink-700 hover:text-zinc-300"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
                <button
                  onClick={closeChat}
                  aria-label="Close chat"
                  className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-rose-500/15 hover:text-rose-400"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Body */}
            {!minimized && (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <Message
                        key={msg.id}
                        role={msg.role}
                        content={msg.content}
                        sources={msg.sources}
                        isTyping={msg.isTyping}
                        onCloseChat={closeChat}
                      />
                    ))}
                    {isTyping && (
                      <Message key="typing" role="bot" content="" isTyping />
                    )}
                  </AnimatePresence>
                  <div ref={bottomRef} />
                </div>

                {msgCount === 0 && !isTyping && (
                  <div className="border-t border-ink-650/60 px-4 py-3">
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                      Try asking
                    </p>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {suggestedQuestions.slice(0, 5).map((q) => (
                        <Chip key={q} label={q} onClick={() => sendMessage(q)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Spacious Glass Input Box (No Inner Outline) */}
                <form
                  onSubmit={handleSubmit}
                  className="border-t border-ink-650/60 bg-ink-950/70 p-3"
                >
                  <div className="flex items-center gap-2.5 rounded-2xl border border-ink-650/80 bg-ink-900/90 p-2.5 backdrop-blur-xl shadow-lg transition-all duration-300 focus-within:border-accent-400/60 focus-within:ring-2 focus-within:ring-accent-500/20">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(input);
                        }
                      }}
                      placeholder="Ask anything about Biniyam…"
                      rows={1}
                      disabled={isTyping}
                      className="flex-1 resize-none bg-transparent px-1 text-xs sm:text-sm text-white placeholder-zinc-500 border-none outline-none focus:outline-none focus:ring-0 focus:border-none ring-0 shadow-none disabled:opacity-40 leading-relaxed"
                      style={{ minHeight: "44px", maxHeight: "110px", overflowY: "auto" }}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = Math.max(44, e.target.scrollHeight) + "px";
                      }}
                    />
                    <motion.button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 text-white transition-all hover:from-accent-500 hover:to-accent-400 disabled:cursor-not-allowed disabled:opacity-30 shadow-glow"
                    >
                      <Send size={14} />
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ringing Phone Robot FAB Button (Label Removed) */}
      {!chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {/* Speed-dial options */}
          <AnimatePresence>
            {menuOpen && (
              <>
                {/* WhatsApp */}
                <DialOption
                  href="https://wa.me/251919588970"
                  icon={<IconWhatsApp />}
                  label="WhatsApp"
                  bg="bg-[#25D366] hover:bg-[#20bb5a] shadow-[0_0_16px_rgba(37,211,102,0.4)]"
                  delay={0}
                />
                {/* Telegram */}
                <DialOption
                  href="https://t.me/silvaries"
                  icon={<IconTelegram />}
                  label="Telegram"
                  bg="bg-[#229ED9] hover:bg-[#1a8fc4] shadow-[0_0_16px_rgba(34,158,217,0.4)]"
                  delay={0.06}
                />
                {/* AI Chat */}
                <DialOption
                  onClick={openChat}
                  icon={<Sparkles size={20} />}
                  label="Ask AI"
                  bg="bg-gradient-to-br from-accent-500 to-accent-700 hover:from-accent-400 hover:to-accent-600 shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                  delay={0.12}
                />
              </>
            )}
          </AnimatePresence>

          {/* Robot FAB Button with Ringing Phone Movement on Icon Only */}
          <div className="relative">
            {/* Pulse beam emerging from icon */}
            {!menuOpen && (
              <motion.span
                className="absolute inset-0 rounded-full border border-accent-400/70 bg-accent-500/15 shadow-[0_0_12px_rgba(139,92,246,0.4)] pointer-events-none"
                animate={{
                  scale: [1, 1.55],
                  opacity: [0.85, 0],
                }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}

            <motion.button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close contact menu" : "Open contact menu"}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`relative flex h-16 w-16 items-center justify-center rounded-full text-white shadow-xl transition-all ${
                menuOpen
                  ? "bg-gradient-to-br from-accent-400 to-accent-600 ring-2 ring-accent-400/40"
                  : "bg-gradient-to-br from-accent-500 via-purple-600 to-accent-700 ring-2 ring-accent-400/50 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              }`}
              title={menuOpen ? "Close" : "Contact me & Ask AI"}
            >
              {/* Ringing Phone Oscillation Animation on Icon Only */}
              <motion.div
                animate={
                  menuOpen
                    ? { rotate: 180, scale: 1 }
                    : {
                        rotate: [0, -18, 18, -15, 15, -10, 10, -5, 5, 0],
                        scale: [1, 1.1, 1, 1.08, 1],
                      }
                }
                transition={
                  menuOpen
                    ? { type: "spring", stiffness: 300, damping: 22 }
                    : {
                        duration: 1.6,
                        repeat: Infinity,
                        repeatDelay: 1.2,
                        ease: "easeInOut",
                      }
                }
              >
                {menuOpen ? <X size={24} /> : <IconRobot size={34} />}
              </motion.div>

              {/* Eye glow dots when idle */}
              {!menuOpen && (
                <motion.span
                  className="absolute top-3.5 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-white/40 shadow-glow"
                  animate={{ opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
