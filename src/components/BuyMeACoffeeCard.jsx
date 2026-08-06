import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Heart, Sparkles, Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import Card from "./Card";

const TIERS = [
  { id: "espresso", name: "Espresso", price: 3, icon: "☕", label: "Quick Shot" },
  { id: "cappuccino", name: "Cappuccino", price: 5, icon: "☕", label: "Full Cup" },
  { id: "double", name: "Double Shot", price: 10, icon: "⚡", label: "Super Fuel" },
];

export default function BuyMeACoffeeCard({ compact = false }) {
  const [selectedTier, setSelectedTier] = useState(TIERS[1]);
  const [cups, setCups] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const total = selectedTier.price * cups;
  const coffeeUrl = "https://buymeacoffee.com/biniyam";

  const handleCopy = () => {
    navigator.clipboard.writeText(coffeeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border border-accent-400/25 bg-gradient-to-r from-accent-500/10 via-accent-500/5 to-transparent px-3.5 py-2.5 transition-all hover:border-accent-400/50 hover:bg-accent-500/15"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Coffee cup icon keeps warm amber coffee color */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/20 text-amber-400 shadow-glow">
              <Coffee size={16} className="transition-transform group-hover:scale-110" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-semibold text-white group-hover:text-accent-200 truncate">Buy Me a Coffee</p>
              <p className="text-[10px] text-zinc-400 truncate">Fuel coding sessions ☕</p>
            </div>
          </div>
          <span className="shrink-0 rounded-xl border border-accent-400/30 bg-accent-500/20 px-2.5 py-1 text-[10px] font-semibold text-accent-300">
            Support
          </span>
        </button>

        <CoffeeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          selectedTier={selectedTier}
          setSelectedTier={setSelectedTier}
          cups={cups}
          setCups={setCups}
          total={total}
          coffeeUrl={coffeeUrl}
          copied={copied}
          onCopy={handleCopy}
        />
      </>
    );
  }

  return (
    <>
      <Card className="relative overflow-hidden p-3.5 sm:p-4 border-accent-400/25 bg-gradient-to-r from-accent-500/10 via-ink-950/60 to-ink-950/90 shadow-panel">
        {/* Theme dynamic ambient background light */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent-500/10 blur-xl" />

        {/* Card Content Layout */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-3 relative z-10 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            {/* Coffee cup icon keeps warm amber coffee color */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400 shadow-glow">
              <Coffee size={18} className="animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                Buy Me a Coffee
                <Sparkles size={12} className="text-accent-400 shrink-0" />
              </h3>
              <p className="text-[11px] text-zinc-400 truncate">Fuel late-night engineering & open source</p>
            </div>
          </div>

          {/* Support button - whitespace-nowrap & shrink-0 guaranteed no cropping */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white px-3.5 py-2 text-xs font-semibold shadow-glow transition-all active:scale-95 shrink-0 whitespace-nowrap"
          >
            <Coffee size={14} className="text-amber-300 shrink-0" />
            <span>Support ☕</span>
          </button>
        </div>
      </Card>

      <CoffeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedTier={selectedTier}
        setSelectedTier={setSelectedTier}
        cups={cups}
        setCups={setCups}
        total={total}
        coffeeUrl={coffeeUrl}
        copied={copied}
        onCopy={handleCopy}
      />
    </>
  );
}

function CoffeeModal({ isOpen, onClose, selectedTier, setSelectedTier, cups, setCups, total, coffeeUrl, copied, onCopy }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-accent-400/30 bg-ink-950 p-5 sm:p-6 shadow-panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ink-650/60 pb-3.5">
            <div className="flex items-center gap-3">
              {/* Coffee cup icon container keeps warm amber coffee color */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/20 text-amber-400 shadow-glow">
                <Coffee size={20} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">Buy Biniyam a Coffee ☕</h3>
                <p className="text-xs text-zinc-400">Select coffee variant & contribution</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-zinc-400 hover:bg-ink-800 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="my-4 space-y-4">
            {/* Tier variant selector */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                Select Coffee Variant
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIERS.map((tier) => {
                  const isSelected = selectedTier.id === tier.id;
                  return (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`relative flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                        isSelected
                          ? "border-accent-400/70 bg-accent-500/20 text-white shadow-glow"
                          : "border-ink-650/70 bg-ink-950/40 text-zinc-400 hover:border-accent-400/30 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{tier.icon}</span>
                      <span className="mt-1 text-xs font-semibold">{tier.name}</span>
                      <span className="text-[10px] text-accent-300 font-mono font-medium">${tier.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cup Stepper & Total */}
            <div className="flex items-center justify-between rounded-xl border border-ink-650/60 bg-ink-950/60 p-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-400">Quantity:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCups(Math.max(1, cups - 1))}
                    className="grid h-6 w-6 place-items-center rounded-md border border-ink-650 bg-ink-900 text-xs text-zinc-300 hover:border-accent-400/50 hover:text-white"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-mono font-bold text-white">{cups}</span>
                  <button
                    onClick={() => setCups(cups + 1)}
                    className="grid h-6 w-6 place-items-center rounded-md border border-ink-650 bg-ink-900 text-xs text-zinc-300 hover:border-accent-400/50 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block">Total Contribution</span>
                <span className="text-sm font-bold font-mono text-accent-300">${total} USD</span>
              </div>
            </div>

            {/* Action buttons using context theme colors */}
            <div className="flex flex-col gap-2 pt-1">
              <a
                href={coffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white py-3 text-xs sm:text-sm font-bold shadow-glow transition-all active:scale-95"
              >
                <span>Proceed on BuyMeACoffee.com (${total})</span>
                <ExternalLink size={15} />
              </a>

              <button
                onClick={onCopy}
                className="flex items-center justify-center gap-2 rounded-xl border border-ink-650 bg-ink-900 py-2.5 text-xs font-semibold text-zinc-300 transition hover:border-accent-400/40 hover:text-white"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? "Direct Link Copied!" : "Copy Support Link"}</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 pt-1">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Safe & Secure payment via BuyMeACoffee platform</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
