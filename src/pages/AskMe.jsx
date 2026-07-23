import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, RotateCcw, ChevronRight, CornerDownLeft } from "lucide-react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import PageWrapper from "../components/shared/PageWrapper";
import { fetchRAGResponse } from "../services/ragApi";
import { suggestedQuestions } from "../data/ragMock";
import mypic from "../assets/images/mypic.jpg";

/* ─── Claude-style Hardcoded Thinking Phrases ───────────── */
const CLAUDE_PHRASES = [
  "Searching portfolio knowledge base...",
  "Analyzing Biniyam's experience & skills...",
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
    <div className="flex flex-col gap-1.5 py-1">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-accent-400"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -3 }}
        transition={{ duration: 0.25 }}
        className="text-[11px] font-medium text-accent-300/90 italic tracking-wide"
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

function SmartRouteSuggestions({ content, sources }) {
  const navigate = useNavigate();
  const routes = getRelevantRoutes(content, sources);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink-650/40 pt-2.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
        Suggested details:
      </span>
      {routes.map((r) => (
        <motion.button
          key={r.path}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(r.path)}
          className="flex items-center gap-1.5 rounded-lg border border-accent-400/30 bg-accent-500/10 px-2.5 py-1 text-xs font-medium text-accent-300 transition hover:border-accent-400/60 hover:bg-accent-500/20 hover:text-white hover:shadow-glow"
        >
          <span>{r.icon}</span>
          <span>{r.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ─── Message text renderer ─────────────────────────────── */
function FormattedText({ text }) {
  return (
    <span className="leading-7">
      {text.split("\n").map((line, i) => {
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
            {i < text.split("\n").length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
}

/* ─── Bot avatar ────────────────────────────────────────── */
function BotAvatar() {
  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 shadow-glow ring-2 ring-accent-400/20">
      <Sparkles size={14} className="text-white" />
    </div>
  );
}

/* ─── Single message bubble ─────────────────────────────── */
function Message({ role, content, sources, isTyping }) {
  const isBot = role === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`flex items-end gap-3 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && <BotAvatar />}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-sm ${
          isBot
            ? "rounded-bl-sm border border-ink-650/80 bg-ink-800/90 text-zinc-200 shadow-sm"
            : "rounded-br-sm border border-accent-400/20 bg-accent-500/15 text-zinc-100 shadow-sm"
        }`}
      >
        {isTyping ? <ClaudeTypingIndicator /> : <FormattedText text={content} />}

        {/* Smart Route Suggestions instead of raw OpenRouter / MD tags */}
        {isBot && !isTyping && content && (
          <SmartRouteSuggestions content={content} sources={sources} />
        )}
      </div>

      {!isBot && (
        <img
          src={mypic}
          alt="You"
          className="h-8 w-8 shrink-0 rounded-full border-2 border-accent-400/20 object-cover"
        />
      )}
    </motion.div>
  );
}

/* ─── Suggested question chip ───────────────────────────── */
function QuestionChip({ label, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-ink-650 bg-ink-800/70 px-3.5 py-2 text-xs font-medium text-zinc-300 transition hover:border-accent-400/40 hover:bg-accent-500/10 hover:text-accent-300"
    >
      <ChevronRight size={11} className="text-accent-500" />
      {label}
    </motion.button>
  );
}

/* ─── Main page ─────────────────────────────────────────── */
const WELCOME = {
  role: "bot",
  content:
    "Hi! I'm Biniyam's AI assistant powered by OpenRouter RAG. 👋\n\nI can answer questions about his **experience**, **skills**, **projects**, **availability**, and more using vector search across his knowledge base.\n\nWhat would you like to know?",
  id: "welcome",
};

export default function AskMe() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text) => {
      const query = text.trim();
      if (!query || isTyping) return;

      const userMsg = { role: "user", content: query, id: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

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

  // Auto-send initial question if passed from Dashboard or URL parameter
  useEffect(() => {
    const initialQuery = location.state?.initialQuestion || searchParams.get("q");
    if (initialQuery && messages.length === 1) {
      sendMessage(initialQuery);
    }
  }, [location.state, searchParams, sendMessage, messages.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    setIsTyping(false);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <PageWrapper>
      <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-3xl flex-col gap-4">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-glow">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Ask About Biniyam</h1>
              <p className="text-xs text-zinc-400">
                AI-powered Q&amp;A · Live RAG Assistant
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 rounded-xl border border-ink-650 bg-ink-800/60 px-3 py-2 text-xs text-zinc-400 transition hover:border-accent-400/30 hover:text-accent-300"
          >
            <RotateCcw size={12} />
            Clear chat
          </button>
        </div>

        {/* Status chip */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Assistant Online · OpenRouter RAG Connected
          </span>
        </div>

        {/* Chat window */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-ink-650/80 bg-ink-900/60 backdrop-blur-md shadow-xl">
          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  sources={msg.sources}
                  isTyping={msg.isTyping}
                />
              ))}
              {isTyping && (
                <Message key="typing" role="bot" content="" isTyping />
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {messages.length <= 2 && !isTyping && (
            <div className="border-t border-ink-650/60 px-5 py-3">
              <p className="mb-2.5 text-[11px] font-medium uppercase tracking-widest text-zinc-400">
                Suggested Questions
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {suggestedQuestions.map((q) => (
                  <QuestionChip key={q} label={q} onClick={() => sendMessage(q)} />
                ))}
              </div>
            </div>
          )}

          {/* Aesthetic Input Container (Inner Textarea Outline Completely Removed) */}
          <div className="border-t border-ink-650/60 bg-ink-950/70 p-4">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 rounded-2xl border border-ink-650/80 bg-ink-900/90 p-3.5 backdrop-blur-xl shadow-lg transition-all duration-300 focus-within:border-accent-400/60 focus-within:ring-2 focus-within:ring-accent-500/20 focus-within:shadow-[0_0_25px_rgba(139,92,246,0.15)]"
            >
              {/* Textarea without inner outline */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Biniyam's skills, projects, experience, or availability..."
                rows={2}
                disabled={isTyping}
                className="w-full resize-none bg-transparent px-1 text-sm sm:text-base text-white placeholder:text-zinc-500 border-none outline-none focus:outline-none focus:ring-0 focus:border-none ring-0 shadow-none disabled:opacity-50 leading-relaxed"
                style={{ minHeight: "52px", maxHeight: "140px", overflowY: "auto" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.max(52, e.target.scrollHeight) + "px";
                }}
              />

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between border-t border-ink-700/50 pt-2.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500">
                    <CornerDownLeft size={10} /> Enter to send · Shift+Enter for newline
                  </span>
                </div>

                <motion.button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 px-4 py-2 text-xs font-semibold text-white shadow-glow transition-all hover:from-accent-500 hover:to-accent-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                >
                  <span>Send</span>
                  <Send size={13} />
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-zinc-400">
          Powered by OpenRouter LLM + LanceDB Vector Database · Real-time RAG answers from portfolio knowledge base
        </p>
      </div>
    </PageWrapper>
  );
}
