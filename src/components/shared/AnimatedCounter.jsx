import React, { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

export default function AnimatedCounter({ to, duration = 1.8, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        if (ref.current) {
          ref.current.textContent = Math.round(value).toLocaleString() + suffix;
        }
      },
    });
    return controls.stop;
  }, [isInView, to, duration, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}
