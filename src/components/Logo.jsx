import React from "react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-2xl border border-accent-400/40 bg-accent-500/15 shadow-glow">
        <div className="h-5 w-5 rotate-45 rounded-[6px] border-2 border-accent-300 bg-accent-500/50" />
      </div>
      <span className="font-display text-xl font-bold tracking-wide text-white">Stride</span>
    </div>
  );
}
