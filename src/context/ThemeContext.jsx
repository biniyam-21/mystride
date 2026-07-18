import React, { createContext, useContext, useState, useEffect } from "react";

const ACCENTS = ["violet", "blue", "emerald", "rose", "amber"];

const ThemeContext = createContext({
  theme: "dark",
  toggle: () => {},
  accent: "violet",
  setAccent: () => {},
  accents: ACCENTS,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("portfolio-theme") || "dark"
  );
  const [accent, setAccentState] = useState(
    () => localStorage.getItem("portfolio-accent") || "violet"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (accent === "violet") {
      root.removeAttribute("data-accent");
    } else {
      root.setAttribute("data-accent", accent);
    }
    localStorage.setItem("portfolio-accent", accent);
  }, [accent]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const setAccent = (a) => ACCENTS.includes(a) && setAccentState(a);

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === "dark", accent, setAccent, accents: ACCENTS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
