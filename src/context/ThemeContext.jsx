import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const ACCENTS = ["violet", "blue", "emerald", "rose", "amber"];
const AUTO_CYCLE_MS = 60_000; // 1 minute

const ThemeContext = createContext({
  theme: "dark",
  toggle: () => {},
  accent: "violet",
  setAccent: () => {},
  accents: ACCENTS,
  accentChanging: false,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("portfolio-theme") || "dark"
  );
  const [accent, setAccentState] = useState(
    () => localStorage.getItem("portfolio-accent") || "violet"
  );
  // Flash flag — true for ~400ms each time the accent cycles
  const [accentChanging, setAccentChanging] = useState(false);
  // Tracks whether the user manually picked an accent recently (pauses auto-cycle for 5 min)
  const manualOverrideUntil = useRef(0);

  /* ── Apply theme to DOM ── */
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.toggle("light", theme === "light");
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  /* ── Apply accent to DOM ── */
  useEffect(() => {
    const root = document.documentElement;
    if (accent === "violet") {
      root.removeAttribute("data-accent");
    } else {
      root.setAttribute("data-accent", accent);
    }
    localStorage.setItem("portfolio-accent", accent);
  }, [accent]);

  /* ── Auto-cycle accent every minute ── */
  useEffect(() => {
    const id = setInterval(() => {
      // Respect manual override grace period
      if (Date.now() < manualOverrideUntil.current) return;

      setAccentChanging(true);
      setTimeout(() => setAccentChanging(false), 600);

      setAccentState((prev) => {
        const idx = ACCENTS.indexOf(prev);
        return ACCENTS[(idx + 1) % ACCENTS.length];
      });
    }, AUTO_CYCLE_MS);

    return () => clearInterval(id);
  }, []);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const setAccent = useCallback((a) => {
    if (!ACCENTS.includes(a)) return;
    // Pause auto-cycle for 5 minutes after a manual pick
    manualOverrideUntil.current = Date.now() + 5 * 60_000;
    setAccentState(a);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle,
        isDark: theme === "dark",
        accent,
        setAccent,
        accents: ACCENTS,
        accentChanging,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
