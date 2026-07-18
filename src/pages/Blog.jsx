import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Clock, Pin } from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import { blogPosts } from "../data/blogPosts";

const allTags = [...new Set(blogPosts.flatMap((p) => p.tags))];

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36 } },
};

export default function Blog() {
  const [activeTag, setActiveTag] = useState("All");
  const filtered = activeTag === "All" ? blogPosts : blogPosts.filter((p) => p.tags.includes(activeTag));

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="mt-1 text-sm text-zinc-400">Thoughts on engineering, systems, and craft</p>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2">
          {["All", ...allTags].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                activeTag === tag
                  ? "bg-accent-500/20 text-accent-200 ring-1 ring-accent-400/30"
                  : "border border-ink-650 bg-ink-950/50 text-zinc-400 hover:text-zinc-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
          {filtered.map((post) => (
            <motion.article key={post.id} variants={item}>
              <Card className="group cursor-pointer p-5 transition-all hover:border-accent-400/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {post.pinned && (
                      <span className="mb-2 inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                        <Pin size={10} />
                        Pinned
                      </span>
                    )}
                    <h2 className="font-semibold text-white group-hover:text-accent-200 transition-colors">
                      {post.title}
                    </h2>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-md border border-ink-650 bg-ink-950/40 px-2 py-0.5 text-xs text-zinc-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="ml-auto flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={11} />
                      {post.views.toLocaleString()}
                    </span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
