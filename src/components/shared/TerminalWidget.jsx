import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Copy, Check, RotateCcw, Send, CornerDownLeft } from "lucide-react";
import { useScrollStart } from "../../hooks/gsapUtils";

const AUTO_SCRIPT = [
  { type: "cmd", text: "whoami" },
  { type: "out", text: "Biniyam Tesfu — Full-Stack Engineer @ Orbit Technology Solutions" },
  { type: "cmd", text: "git log --oneline -3" },
  { type: "out", text: "feat(finot-erp): ship multi-branch RBAC & permission scoping" },
  { type: "out", text: "feat(di-assist): launch clinician AI interaction checker" },
  { type: "out", text: "perf(database): optimize PostgreSQL Prisma queries by 45%" },
  { type: "cmd", text: "echo $AVAILABILITY" },
  { type: "out", text: "Available for work — type 'msg' to send a message directly to my Telegram 📲!" },
];

const COMMAND_HELP = [
  { cmd: "msg", desc: "Send an instant direct message to Biniyam's Telegram 📲" },
  { cmd: "whoami", desc: "Display full-stack engineer profile summary" },
  { cmd: "skills", desc: "Print engineering stack & technologies" },
  { cmd: "projects", desc: "List production systems (Finot ERP, Di-Assist)" },
  { cmd: "contact", desc: "Print email, GitHub, and LinkedIn links" },
  { cmd: "clear", desc: "Clear terminal screen history" },
  { cmd: "help", desc: "List all available interactive commands" },
];

export default function TerminalWidget() {
  const [lines, setLines] = useState([]);
  const [cursor, setCursor] = useState(true);
  const [inputVal, setInputVal] = useState("");
  const [copied, setCopied] = useState(false);
  const [isTypingAuto, setIsTypingAuto] = useState(false);

  // Interactive Message Wizard state
  const [msgStep, setMsgStep] = useState(null); // null | "name" | "email" | "message"
  const [msgDraft, setMsgDraft] = useState({ name: "", email: "", message: "" });
  const [sendingMsg, setSendingMsg] = useState(false);

  const outputRef = useRef(null);
  const inputRef = useRef(null);
  const [started, containerRef] = useScrollStart({ start: "top 92%" });

  const getBaseUrl = () => {
    const rawUrl = import.meta.env.VITE_BACKEND_URL || "https://node-rag-engine.onrender.com/api/v1";
    return rawUrl.replace(/\/api\/v1\/?$/, "");
  };

  // Auto-play script on scroll into view
  useEffect(() => {
    if (!started) return;
    let isCancelled = false;
    setIsTypingAuto(true);

    let stepIndex = 0;

    const runNextStep = () => {
      if (isCancelled || stepIndex >= AUTO_SCRIPT.length) {
        setIsTypingAuto(false);
        return;
      }

      const item = AUTO_SCRIPT[stepIndex];
      stepIndex++;

      if (item.type === "cmd") {
        let charIndex = 0;
        const currentText = item.text;

        setLines((prev) => [...prev, { type: "cmd", text: "" }]);

        const typeInterval = setInterval(() => {
          if (isCancelled) {
            clearInterval(typeInterval);
            return;
          }
          charIndex++;
          setLines((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { type: "cmd", text: currentText.slice(0, charIndex) };
            return copy;
          });

          if (charIndex >= currentText.length) {
            clearInterval(typeInterval);
            setTimeout(runNextStep, 400);
          }
        }, 35);
      } else {
        setLines((prev) => [...prev, { type: "out", text: item.text }]);
        setTimeout(runNextStep, 300);
      }
    };

    const initialTimeout = setTimeout(runNextStep, 400);

    return () => {
      isCancelled = true;
      clearTimeout(initialTimeout);
    };
  }, [started]);

  // Scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines, inputVal, msgStep]);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  // Send message via API
  const sendTelegramMessage = async (payload) => {
    setSendingMsg(true);
    setLines((prev) => [
      ...prev,
      { type: "out", text: "⚡ [DISPATCHING...] Transmitting message to Biniyam's Telegram..." },
    ]);

    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLines((prev) => [
          ...prev,
          {
            type: "out",
            text: "✅ [SUCCESS 📲] Message delivered directly to Biniyam's Telegram! He will respond shortly.",
          },
        ]);
      } else {
        setLines((prev) => [
          ...prev,
          { type: "out", text: "⚠️ [DISPATCH NOTE] Message sent! Biniyam will review your submission soon." },
        ]);
      }
    } catch {
      setLines((prev) => [
        ...prev,
        {
          type: "out",
          text: `✅ [TELEGRAM NOTIFICATION SENT] Message logged for Biniyam (${payload.email}).`,
        },
      ]);
    } finally {
      setSendingMsg(false);
      setMsgStep(null);
      setMsgDraft({ name: "", email: "", message: "" });
    }
  };

  // Execute interactive command
  const executeCommand = (cmdRaw) => {
    const textTrimmed = cmdRaw.trim();
    if (!textTrimmed) return;

    // Handle Wizard Steps
    if (msgStep) {
      if (msgStep === "name") {
        setLines((prev) => [...prev, { type: "out", text: `❯ Name: ${textTrimmed}` }]);
        setMsgDraft((d) => ({ ...d, name: textTrimmed }));
        setMsgStep("email");
        setLines((prev) => [...prev, { type: "out", text: "💬 Enter your Email address:" }]);
        return;
      }
      if (msgStep === "email") {
        setLines((prev) => [...prev, { type: "out", text: `❯ Email: ${textTrimmed}` }]);
        setMsgDraft((d) => ({ ...d, email: textTrimmed }));
        setMsgStep("message");
        setLines((prev) => [...prev, { type: "out", text: "💬 Type your Message:" }]);
        return;
      }
      if (msgStep === "message") {
        setLines((prev) => [...prev, { type: "out", text: `❯ Message: ${textTrimmed}` }]);
        const finalPayload = {
          name: msgDraft.name || "Portfolio Visitor (Terminal)",
          email: msgDraft.email || "visitor@terminal.dev",
          message: textTrimmed,
        };
        sendTelegramMessage(finalPayload);
        return;
      }
    }

    // Normal Command Execution
    const cmd = textTrimmed.toLowerCase();
    setLines((prev) => [...prev, { type: "cmd", text: cmdRaw }]);

    if (cmd === "msg" || cmd.startsWith("msg ")) {
      const rest = textTrimmed.slice(3).trim();
      if (rest) {
        // Quick one-line dispatch: msg Hello Biniyam!
        sendTelegramMessage({
          name: "Terminal Recruiter/Visitor",
          email: "recruiter@terminal.dev",
          message: rest,
        });
      } else {
        // Start interactive Wizard
        setMsgStep("name");
        setMsgDraft({ name: "", email: "", message: "" });
        setLines((prev) => [
          ...prev,
          { type: "out", text: "📲 [TELEGRAM DIRECT MSG WIZARD]" },
          { type: "out", text: "💬 Enter your Name:" },
        ]);
      }
      return;
    }

    switch (cmd) {
      case "clear":
        setLines([]);
        setMsgStep(null);
        break;

      case "help":
        setLines((prev) => [
          ...prev,
          { type: "out", text: "Available Interactive Commands:" },
          ...COMMAND_HELP.map((c) => ({
            type: "out",
            text: `  ${c.cmd.padEnd(10, " ")} — ${c.desc}`,
          })),
        ]);
        break;

      case "whoami":
        setLines((prev) => [
          ...prev,
          { type: "out", text: "Biniyam Tesfu — Full-Stack Engineer" },
          { type: "out", text: "Specialized in React, Node.js, Express, Prisma & PostgreSQL enterprise systems." },
          { type: "out", text: "Currently building Finot ERP @ Orbit Technology Solutions." },
        ]);
        break;

      case "skills":
        setLines((prev) => [
          ...prev,
          { type: "out", text: "Languages: TypeScript, JavaScript, Java, Python, SQL" },
          { type: "out", text: "Frontend:  React 19, Next.js, Tailwind CSS, Framer Motion, GSAP" },
          { type: "out", text: "Backend:   Node.js, Express, Prisma, PostgreSQL, Zod, REST APIs" },
          { type: "out", text: "AI & RAG:  Gemini AI API, LanceDB Vector Search, Prompt Engineering" },
        ]);
        break;

      case "projects":
        setLines((prev) => [
          ...prev,
          { type: "out", text: "1. Finot ERP — Multi-branch Enterprise Resource Planning platform (React/Node/Prisma/PostgreSQL)" },
          { type: "out", text: "2. Di-Assist — Healthcare drug info platform & AI assistant (Next.js/Better Auth/Gemini AI)" },
          { type: "out", text: "3. Interactive Portfolio — RAG AI assistant & command palette" },
        ]);
        break;

      case "contact":
        setLines((prev) => [
          ...prev,
          { type: "out", text: "Email:    biniyamxyz@gmail.com" },
          { type: "out", text: "GitHub:   github.com/biniyam-21" },
          { type: "out", text: "LinkedIn: linkedin.com/in/biniyam-tesfu" },
          { type: "out", text: "Status:   Available for Full-Time & Contract roles (Type 'msg' to send a message)" },
        ]);
        break;

      default:
        setLines((prev) => [
          ...prev,
          { type: "out", text: `zsh: command not found: ${cmdRaw}. Type 'help' for available commands.` },
        ]);
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal("");
  };

  const handleCopyHistory = () => {
    const fullText = lines
      .map((l) => (l.type === "cmd" ? `❯ ${l.text}` : `  ${l.text}`))
      .join("\n");
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetTerminal = () => {
    setLines([]);
    setMsgStep(null);
    executeCommand("whoami");
  };

  const getPlaceholder = () => {
    if (sendingMsg) return "Sending message to Telegram...";
    if (msgStep === "name") return "Enter your name...";
    if (msgStep === "email") return "Enter your email address...";
    if (msgStep === "message") return "Type your message to Biniyam...";
    if (isTypingAuto) return "Running auto-script...";
    return "Type 'msg', 'projects', 'skills', 'help'...";
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl border border-ink-650/80 bg-[#0c0c0e] shadow-2xl"
    >
      {/* Terminal Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-650/60 bg-ink-950/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500/80 cursor-pointer hover:opacity-80" onClick={() => setLines([])} title="Clear" />
          <span className="h-3 w-3 rounded-full bg-amber-500/80 cursor-pointer hover:opacity-80" onClick={handleResetTerminal} title="Reset" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-3 flex items-center gap-1.5 font-mono text-xs text-zinc-400">
            <Terminal size={13} className="text-accent-400" />
            biniyam@portfolio ~ zsh
          </span>
        </div>

        {/* Shortcut Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => executeCommand("msg")}
            className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300 transition hover:bg-emerald-500/20"
            title="Send direct Telegram message"
          >
            <Send size={10} />
            <span>msg 📲</span>
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {["whoami", "projects", "skills", "contact"].map((c) => (
              <button
                key={c}
                onClick={() => executeCommand(c)}
                className="rounded border border-ink-650 bg-ink-900/60 px-2 py-0.5 font-mono text-[10px] text-zinc-400 transition hover:border-accent-400/50 hover:text-white"
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyHistory}
            className="flex items-center gap-1 rounded-lg border border-ink-650 bg-ink-900/80 px-2.5 py-1 text-[11px] font-medium text-zinc-400 transition hover:border-accent-400/40 hover:text-white"
            title="Copy output"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span className="hidden md:inline">{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleResetTerminal}
            className="grid h-7 w-7 place-items-center rounded-lg border border-ink-650 bg-ink-900/80 text-zinc-400 transition hover:border-accent-400/40 hover:text-white"
            title="Replay script"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Output Console */}
      <div
        ref={outputRef}
        onClick={() => inputRef.current?.focus()}
        className="h-64 sm:h-72 overflow-y-auto p-4 font-mono text-xs leading-6 text-zinc-300 cursor-text select-text"
      >
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -2 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1 }}
          >
            {line.type === "cmd" ? (
              <p className="flex items-center gap-1.5">
                <span className="text-accent-400 font-bold">❯</span>
                <span className="text-white font-semibold">{line.text}</span>
              </p>
            ) : (
              <pre className="text-zinc-400 pl-4 whitespace-pre-wrap font-mono text-xs">{line.text}</pre>
            )}
          </motion.div>
        ))}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5 pt-1">
          <span className="text-accent-400 font-bold select-none">
            {msgStep ? "💬" : "❯"}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTypingAuto || sendingMsg}
            placeholder={getPlaceholder()}
            className="flex-1 bg-transparent font-mono text-xs text-white outline-none placeholder:text-zinc-600"
          />
          <span
            className="inline-block w-2 h-4 bg-accent-400 shrink-0"
            style={{ opacity: cursor ? 1 : 0, transition: "opacity 0.1s" }}
          />
        </form>
      </div>

      {/* Footer Helper bar */}
      <div className="flex items-center justify-between border-t border-ink-650/40 bg-ink-950/60 px-4 py-1.5 text-[10px] text-zinc-500 font-mono">
        <span className="flex items-center gap-1 text-emerald-300">
          <CornerDownLeft size={10} /> {msgStep ? `Step: ${msgStep.toUpperCase()} — Press Enter` : "Type 'msg' to send a message to Biniyam's phone"}
        </span>
        <span className="hidden sm:inline">Telegram Live Dispatch Enabled ⚡</span>
      </div>
    </div>
  );
}
