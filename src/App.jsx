import React, { useState, useEffect, useCallback, Component } from "react";
import { Analytics } from "@vercel/analytics/react";

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, background: "#0d0d0f", color: "#f4f4f5", fontFamily: "monospace", minHeight: "100vh" }}>
          <h2 style={{ color: "#f87171" }}>Runtime Error</h2>
          <pre style={{ color: "#a1a1aa", whiteSpace: "pre-wrap", marginTop: 12 }}>
            {this.state.error?.message}{"\n\n"}{this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MobileBrand from "./components/MobileBrand";
import AuroraBackground from "./components/shared/AuroraBackground";
import CommandPalette from "./components/shared/CommandPalette";
import AskMeWidget from "./components/shared/AskMeWidget";
import BootLoader from "./components/shared/BootLoader";
import Footer from "./components/shared/Footer";

import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Stats from "./pages/Stats";
import Achievements from "./pages/Achievements";
import LearningJourney from "./pages/LearningJourney";
import Skills from "./pages/Skills";
import Certifications from "./pages/Certifications";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import AskMe from "./pages/AskMe";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"               element={<Dashboard />}       />
        <Route path="/about"          element={<About />}           />
        <Route path="/projects"       element={<Projects />}        />
        <Route path="/blog"           element={<Blog />}            />
        <Route path="/stats"          element={<Stats />}           />
        <Route path="/achievements"   element={<Achievements />}    />
        <Route path="/learning"       element={<LearningJourney />} />
        <Route path="/skills"         element={<Skills />}          />
        <Route path="/certifications" element={<Certifications />}  />
        <Route path="/resume"         element={<Resume />}          />
        <Route path="/contact"        element={<Contact />}         />
        <Route path="/settings"       element={<Settings />}        />
        <Route path="/ask"            element={<AskMe />}           />
      </Routes>
    </AnimatePresence>
  );
}

function Shell() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") {
        if (mobileMenuOpen) closeMobileMenu();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileMenuOpen, closeMobileMenu]);

  return (
    <>
      <ScrollToTop />
      <AuroraBackground />
      <div className="app-shell min-h-screen bg-ink-950/90 text-zinc-100">
        <Sidebar onSearchOpen={openPalette} mobileOpen={mobileMenuOpen} onClose={closeMobileMenu} />
        <Header onSearchOpen={openPalette} onMenuOpen={openMobileMenu} />
        <AskMeWidget />
        <CommandPalette open={paletteOpen} onClose={closePalette} />

        <main className="flex min-h-screen flex-col px-3 py-4 sm:px-6 sm:py-6 lg:ml-80 lg:px-8">
          <div className="mx-auto w-full max-w-7xl flex-1">
            <MobileBrand />
            <AnimatedRoutes />
          </div>
          <Footer />
        </main>
      </div>
      <Analytics />
    </>
  );
}

function AppInner() {
  const [showBoot, setShowBoot] = useState(
    () => !sessionStorage.getItem("portfolio-booted")
  );

  const handleBootDone = useCallback(() => {
    sessionStorage.setItem("portfolio-booted", "1");
    setShowBoot(false);
  }, []);

  return (
    <>
      {showBoot && <BootLoader onDone={handleBootDone} />}
      <Shell />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
