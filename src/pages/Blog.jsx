import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Clock, Pin, Plus, X, Image as ImageIcon, Heart, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import { blogPosts as fallbackPosts } from "../data/blogPosts";

const POSTS_PER_PAGE = 10;

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36 } },
};

export default function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(fallbackPosts);
  const [activeTag, setActiveTag] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New post form state
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "Backend, Engineering",
    readTime: "5 min",
    coverImage: "",
    pinned: false,
  });

  const getBaseUrl = () => {
    const rawUrl = import.meta.env.VITE_BACKEND_URL || "https://node-rag-engine.onrender.com/api/v1";
    return rawUrl.replace(/\/api\/v1\/?$/, "");
  };

  const fetchPosts = async () => {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/blogs`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setPosts(data.data);
      }
    } catch (err) {
      console.warn("Could not fetch blogs from API, using fallback data:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
    setCurrentPage(1);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPost((p) => ({ ...p, coverImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    setSubmitting(true);
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPost,
          tags: newPost.tags.split(",").map((t) => t.trim()),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowCreateModal(false);
        setNewPost({
          title: "",
          excerpt: "",
          content: "",
          tags: "Backend, Engineering",
          readTime: "5 min",
          coverImage: "",
          pinned: false,
        });
        await fetchPosts();
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Error creating blog post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))];
  const filtered =
    activeTag === "All" ? posts : posts.filter((p) => p.tags?.includes(activeTag));

  // Pagination Math
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filtered.slice(startIndex, endIndex);

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Title + Action */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Blog</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Thoughts on engineering, systems, and craft
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-accent-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-accent-500 shadow-glow"
          >
            <Plus size={14} />
            Create Post
          </button>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2">
          {["All", ...allTags].map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
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

        {/* Articles List */}
        <motion.div key={currentPage} variants={stagger} initial="initial" animate="animate" className="space-y-4">
          {paginatedPosts.map((post) => (
            <motion.article key={post.id} variants={item}>
              <Card
                onClick={() => navigate(`/blog/${post.id}`)}
                className="group cursor-pointer p-5 transition-all hover:border-accent-400/40 hover:shadow-panel"
              >
                {post.coverImage && (
                  <div className="mb-4 overflow-hidden rounded-xl h-44 w-full">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {post.pinned && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                          <Pin size={10} />
                          Pinned
                        </span>
                      )}
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-ink-650 bg-ink-950/60 px-2 py-0.5 text-[10px] font-medium text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-semibold text-white group-hover:text-accent-200 transition-colors">
                      {post.title}
                    </h2>
                  </div>
                </div>

                <p className="mt-2 text-sm leading-6 text-zinc-400 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-650/40 pt-3">
                  {/* Left first: Real Views & Likes */}
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="flex items-center gap-1.5 rounded-lg border border-accent-400/20 bg-accent-500/10 px-2 py-1 text-accent-300">
                      <Eye size={13} className="text-accent-400" />
                      {post.views?.toLocaleString() || 0} views
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-rose-300">
                      <Heart size={13} className="fill-rose-500 text-rose-500" />
                      {post.likes || 0} likes
                    </span>
                  </div>

                  {/* Right side: Read time & Date */}
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </Card>
            </motion.article>
          ))}
        </motion.div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-ink-650/60 pt-4 text-xs text-zinc-400">
            <span>
              Showing <strong className="text-zinc-200">{startIndex + 1}–{Math.min(endIndex, filtered.length)}</strong> of <strong className="text-zinc-200">{filtered.length}</strong> articles
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-ink-650 bg-ink-900 px-3 py-1.5 font-medium text-zinc-300 transition hover:border-accent-400/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                    currentPage === page
                      ? "bg-accent-500 text-white shadow-glow"
                      : "border border-ink-650 bg-ink-900 text-zinc-400 hover:border-accent-400/30 hover:text-zinc-200"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-ink-650 bg-ink-900 px-3 py-1.5 font-medium text-zinc-300 transition hover:border-accent-400/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-ink-650 bg-ink-900 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-ink-650/60 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-accent-400" />
                  Publish New Article
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-ink-700 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Article Title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                    className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Excerpt / Short Summary</label>
                  <input
                    type="text"
                    placeholder="Brief summary..."
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost((p) => ({ ...p, excerpt: e.target.value }))}
                    className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Full Content (Markdown)</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Write your article here..."
                    value={newPost.content}
                    onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                    className="w-full resize-none rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, Backend, AI"
                      value={newPost.tags}
                      onChange={(e) => setNewPost((p) => ({ ...p, tags: e.target.value }))}
                      className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Read Time</label>
                    <input
                      type="text"
                      placeholder="5 min"
                      value={newPost.readTime}
                      onChange={(e) => setNewPost((p) => ({ ...p, readTime: e.target.value }))}
                      className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                    />
                  </div>
                </div>

                {/* Optional Picture Upload */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400 flex items-center gap-1">
                    <ImageIcon size={13} className="text-accent-400" />
                    Optional Cover Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-zinc-400 file:mr-3 file:rounded-xl file:border-0 file:bg-ink-800 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-accent-300 hover:file:bg-ink-700 cursor-pointer"
                  />
                  {newPost.coverImage && (
                    <div className="mt-2 h-20 w-32 overflow-hidden rounded-lg border border-accent-400/40">
                      <img src={newPost.coverImage} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-ink-650/60">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-accent-600 px-5 py-2 text-xs font-semibold text-white hover:bg-accent-500 disabled:opacity-50"
                  >
                    {submitting ? "Publishing..." : "Publish Article"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
