import React from "react";
import { Sun, Moon, Check, Bell, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";

function Row({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-ink-650/60 last:border-0">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        {desc && <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${value ? "bg-accent-500" : "bg-ink-650"}`}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow"
        animate={{ x: value ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

const ACCENT_SWATCHES = [
  { key: "violet", label: "Violet",  bg: "bg-violet-500",  ring: "ring-violet-400" },
  { key: "blue",   label: "Blue",    bg: "bg-blue-500",    ring: "ring-blue-400"   },
  { key: "emerald",label: "Emerald", bg: "bg-emerald-500", ring: "ring-emerald-400"},
  { key: "rose",   label: "Rose",    bg: "bg-rose-500",    ring: "ring-rose-400"   },
  { key: "amber",  label: "Amber",   bg: "bg-amber-500",   ring: "ring-amber-400"  },
];

export default function Settings() {
  const { isDark, toggle, accent, setAccent } = useTheme();
  const [notifs, setNotifs] = React.useState(true);
  const [publicProfile, setPublicProfile] = React.useState(true);

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage your preferences</p>
        </div>

        <Card className="px-5 divide-y-0">
          <div className="border-b border-ink-650/60 pb-3 pt-5 px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Appearance</p>
          </div>
          <div className="px-1">
            <Row
              label="Theme"
              desc={isDark ? "Currently using dark mode" : "Currently using light mode"}
            >
              <div className="flex items-center gap-2 rounded-xl border border-ink-650 bg-ink-950/40 p-1">
                {[
                  { icon: Moon, value: true, label: "Dark" },
                  { icon: Sun,  value: false, label: "Light" },
                ].map(({ icon: Icon, value, label }) => (
                  <button
                    key={label}
                    onClick={() => { if (value !== isDark) toggle(); }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      isDark === value
                        ? "bg-accent-500/20 text-accent-200"
                        : "text-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
            </Row>

            {/* Accent color row */}
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-zinc-200">Accent Color</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Personalise the highlight color across the interface
                </p>
              </div>
              <div className="flex items-center gap-2">
                {ACCENT_SWATCHES.map(({ key, label, bg, ring }) => (
                  <motion.button
                    key={key}
                    title={label}
                    aria-label={`Set accent to ${label}`}
                    onClick={() => setAccent(key)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className={`relative h-7 w-7 rounded-full ${bg} transition-shadow ${
                      accent === key
                        ? `ring-2 ring-offset-2 ring-offset-ink-900 ${ring}`
                        : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    {accent === key && (
                      <Check
                        size={12}
                        className="absolute inset-0 m-auto text-white"
                        strokeWidth={3}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="px-5">
          <div className="border-b border-ink-650/60 pb-3 pt-5 px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Notifications</p>
          </div>
          <div className="px-1">
            <Row label="Email Notifications" desc="Receive digest emails for activity">
              <Toggle value={notifs} onChange={setNotifs} />
            </Row>
          </div>
        </Card>

        <Card className="px-5">
          <div className="border-b border-ink-650/60 pb-3 pt-5 px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Privacy</p>
          </div>
          <div className="px-1">
            <Row label="Public Profile" desc="Allow others to view your profile">
              <Toggle value={publicProfile} onChange={setPublicProfile} />
            </Row>
          </div>
        </Card>

        <Card className="px-5">
          <div className="border-b border-ink-650/60 pb-3 pt-5 px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <Trash2 size={11} className="text-rose-500" /> Danger Zone
            </p>
          </div>
          <div className="px-1">
            <Row label="Delete Account" desc="Permanently remove your account and data">
              <button className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20">
                Delete
              </button>
            </Row>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
