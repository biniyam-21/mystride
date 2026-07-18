import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, RotateCcw, ChevronRight, Bot } from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import { findResponse, suggestedQuestions } from "../data/ragMock";
import { mockData } from "../data/mockData";

/* ─── Message text renderer ─────────────────────────────── */
function FormattedText({ text }) {
  return (
    <span className="leading-7">
      {text.split("\n").map((line, i) => {
        // Bold: **text**
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

/* ─── Typing indicator ──────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-accent-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
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
function Message({ role, content, isTyping }) {
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
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${
          isBot
            ? "rounded-bl-sm border border-ink-650/80 bg-ink-800/90 text-zinc-300"
            : "rounded-br-sm border border-accent-400/20 bg-accent-500/15 text-zinc-100"
        }`}
      >
        {isTyping ? <TypingDots /> : <FormattedText text={content} />}
      </div>

      {!isBot && (
        <img
          src={mockData.user.avatar}
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
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-ink-650 bg-ink-800/70 px-3.5 py-2 text-xs font-medium text-zinc-400 transition hover:border-accent-400/40 hover:bg-accent-500/10 hover:text-accent-300"
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
    "Hi! I'm Ishaan's AI assistant. 👋\n\nI can answer questions about his **experience**, **skills**, **projects**, **availability**, and more.\n\nWhat would you like to know?",
  id: "welcome",
};

// Simulated RAG delay proportional to response length
function getDelay(text) {
  return Math.min(600 + text.length * 1.2, 2200);
}

export default function AskMe() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    (text) => {
      const query = text.trim();
      if (!query || isTyping) return;

      const userMsg = { role: "user", content: query, id: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      const response = findResponse(query);
      const delay = getDelay(response);

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: response, id: Date.now() + 1 },
        ]);
      }, delay);
    },
    [isTyping]
  );

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
      <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col gap-4">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-glow">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Ask About Ishaan</h1>
              <p className="text-xs text-zinc-400">
                AI-powered Q&amp;A · Mock RAG · Real integration coming soon
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
            Assistant online · Mock mode
          </span>
          <span className="rounded-full border border-accent-400/20 bg-accent-500/10 px-3 py-1.5 text-xs text-accent-400">
            Powered by keyword matching · RAG-ready structure
          </span>
        </div>

        {/* Chat window */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-ink-650/80 bg-ink-900/60 backdrop-blur-md">
          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <Message key={msg.id} role={msg.role} content={msg.content} />
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
                Suggested
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {suggestedQuestions.map((q) => (
                  <QuestionChip key={q} label={q} onClick={() => sendMessage(q)} />
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-3 border-t border-ink-650/60 bg-ink-950/40 px-5 py-4"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Ishaan…"
              rows={1}
              disabled={isTyping}
              className="flex-1 resize-none bg-transparent text-sm text-white placeholder-zinc-600 outline-none disabled:opacity-50"
              style={{ maxHeight: "120px", overflowY: "auto" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isTyping}
              whileTap={{ scale: 0.92 }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-600 text-white shadow-glow transition hover:bg-accent-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={15} />
            </motion.button>
          </form>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-zinc-400">
          Responses are pre-programmed mock data. Real RAG integration (embeddings + LLM) can be wired in by replacing{" "}
          <code className="font-mono text-zinc-400">findResponse()</code> in{" "}
          <code className="font-mono text-zinc-400">ragMock.js</code>.
        </p>
      </div>
    </PageWrapper>
  );
}
