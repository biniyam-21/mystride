import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export default function PageWrapper({ children }) {
  // After each page transition completes, refresh ScrollTrigger so all
  // triggers recalculate their positions relative to the new page layout.
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 320);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
