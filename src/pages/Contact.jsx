import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import { mockData } from "../data/mockData";
import { useScrollReveal, useStaggerReveal } from "../hooks/gsapUtils";

function IconGithub() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>;
}
function IconLinkedin() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
}
function IconTwitterX() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

const socials = [
  { label: "GitHub", href: mockData.user.social.github,   icon: IconGithub,   color: "hover:border-zinc-400/40 hover:text-zinc-200" },
  { label: "LinkedIn", href: mockData.user.social.linkedin, icon: IconLinkedin, color: "hover:border-blue-400/40 hover:text-blue-300" },
  { label: "Twitter/X", href: mockData.user.social.twitter, icon: IconTwitterX, color: "hover:border-sky-400/40 hover:text-sky-300" },
  { label: "Email", href: `mailto:${mockData.user.social.email}`, icon: () => <Mail size={18} />, color: "hover:border-accent-400/40 hover:text-accent-300" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const headerRef  = useScrollReveal({ y: 18, duration: 0.5 });
  const cardsRef   = useStaggerReveal({ stagger: 0.16, y: 28 });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl space-y-6">
        <div ref={headerRef}>
          <h1 className="text-2xl font-bold text-white">Contact</h1>
          <p className="mt-1 text-sm text-zinc-400">Let's build something great together</p>
        </div>

        {/* Info + Form — stagger revealed together */}
        <div ref={cardsRef} className="space-y-6">
        <Card className="p-5 sm:p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <MapPin size={16} className="text-accent-400 shrink-0" />
              {mockData.user.location}
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <Mail size={16} className="text-accent-400 shrink-0" />
              {mockData.user.email}
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            {socials.map(({ label, href, icon: Icon, color }) => (
              <a
                key={label}
                href={href}
                title={label}
                target="_blank"
                rel="noreferrer"
                className={`group grid h-10 w-10 place-items-center rounded-xl border border-ink-650 bg-ink-950/40 text-zinc-400 transition-all duration-200 hover:scale-105 ${color}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </Card>

        {/* Form */}
        <Card className="p-5 sm:p-6">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <CheckCircle size={40} className="text-emerald-400" />
              <h3 className="font-semibold text-white">Message sent!</h3>
              <p className="text-sm text-zinc-400">I'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="mt-2 text-sm text-accent-400 hover:underline">
                Send another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { id: "name", label: "Name", type: "text", placeholder: "Your name" },
                  { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[id]}
                      onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                      className="w-full rounded-xl border border-ink-650 bg-ink-950/40 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-accent-400/60 focus:ring-1 focus:ring-accent-400/20"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="What's on your mind?"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full resize-none rounded-xl border border-ink-650 bg-ink-950/40 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-accent-400/60 focus:ring-1 focus:ring-accent-400/20"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-500 active:scale-[0.98]"
              >
                <Send size={15} />
                Send Message
              </button>
            </form>
          )}
        </Card>
        </div>{/* end cardsRef */}
      </div>
    </PageWrapper>
  );
}
