import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { BorderBeam } from "@stianlarsen/border-beam";

export default function Card({ children, className = "", beam = false, beamProps = {}, noHover = false }) {
  const { opacity = 1, colorFrom = "#9d6cff", colorTo = "#6366f1",
          duration = 10, borderWidth = 1.5, delay = 0, size = 220 } = beamProps;

  const cardRef = useRef(null);
  const [glow, setGlow] = useState({ x: "50%", y: "30%", visible: false });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setGlow({
      x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
      visible: true,
    });
  };

  return (
    <motion.section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setGlow((g) => ({ ...g, visible: false }))}
      whileHover={noHover ? {} : { y: -3, transition: { duration: 0.22, ease: "easeOut" } }}
      className={`group card-accent-hover relative overflow-hidden rounded-2xl border border-ink-650/80 bg-ink-800/[0.88] shadow-panel backdrop-blur transition-[border-color,box-shadow] duration-300 hover:border-accent-400/25 ${className}`}
    >
      {beam && (
        <div style={{ opacity }}>
          <BorderBeam
            colorFrom={colorFrom}
            colorTo={colorTo}
            duration={duration}
            borderWidth={borderWidth}
            delay={delay}
            size={size}
          />
        </div>
      )}

      {/* Mouse-tracked radial light reflection */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: glow.visible ? 1 : 0,
          background: `radial-gradient(circle at ${glow.x} ${glow.y}, rgb(var(--accent-500) / 0.09) 0%, transparent 60%)`,
        }}
      />

      {/* Static top-edge light sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Light sweep shimmer on hover */}
      <div className="card-shimmer-wrap" />

      {children}
    </motion.section>
  );
}
