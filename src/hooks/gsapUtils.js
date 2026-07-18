import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
// Fades + slides an element in when it enters the viewport.
// Returns a ref to attach to the target element.
export function useScrollReveal({
  y = 28,
  duration = 0.7,
  delay = 0,
  ease = "power3.out",
  start = "top 90%",
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    // Start invisible so there's no flash of unstyled content
    gsap.set(el, { opacity: 0, y });

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return ref;
}

// ─── Staggered Scroll Reveal ──────────────────────────────────────────────────
// Reveals a list of children with a stagger.
// Returns a ref to attach to the *parent* container.
export function useStaggerReveal({
  selector = ":scope > *",
  y = 24,
  duration = 0.6,
  stagger = 0.1,
  start = "top 88%",
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || prefersReduced()) return;

    const items = container.querySelectorAll(selector);
    if (!items.length) return;

    gsap.set(items, { opacity: 0, y });

    const ctx = gsap.context(() => {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return ref;
}

// ─── Parallax ────────────────────────────────────────────────────────────────
// Applies a vertical parallax offset tied to scroll position.
// speed: 0.1 = subtle, 0.3 = noticeable. Negative inverts direction.
export function useParallax(speed = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * -80,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return ref;
}

// ─── Scroll Start ─────────────────────────────────────────────────────────────
// Returns [started, ref] — `started` flips true when ref element enters viewport.
// Used for the terminal: delays animation until element is actually visible.
export function useScrollStart({ start = "top 92%" } = {}) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If already in view on mount (very short pages), start immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      setStarted(true);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      onEnter: () => setStarted(true),
      once: true,
    });

    return () => trigger.kill();
  }, []);

  return [started, ref];
}
