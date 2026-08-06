import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Clock, Pin, Plus, X, Image as ImageIcon, Heart, Sparkles, ChevronLeft, ChevronRight, Lock, Pencil, Trash2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import { blogPosts as fallbackPosts } from "../data/blogPosts";

const POSTS_PER_PAGE = 5;

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

  // Auth & Modal States
  const [isAuthorized, setIsAuthorized] = useState(
    () => sessionStorage.getItem("blog-auth") === "1"
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state for Create & Edit
  const [formPost, setFormPost] = useState({
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

  // Authorization helper
  const requireAuthThen = (action) => {
    if (isAuthorized) {
      action();
    } else {
      setPasswordInput("");
      setAuthError("");
      setPendingAction(() => action);
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === "biniyam") {
      setIsAuthorized(true);
      sessionStorage.setItem("blog-auth", "1");
      setShowAuthModal(false);
      setAuthError("");
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setAuthError("Incorrect password. Author authorization required.");
    }
  };

  // Create triggers
  const handleCreateClick = () => {
    requireAuthThen(() => {
      setFormPost({
        title: "",
        excerpt: "",
        content: "",
        tags: "Backend, Engineering",
        readTime: "5 min",
        coverImage: "",
        pinned: false,
      });
      setShowCreateModal(true);
    });
  };

  // Edit triggers
  const handleEditClick = (e, post) => {
    e.stopPropagation();
    requireAuthThen(() => {
      setEditingPost(post);
      setFormPost({
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
        readTime: post.readTime || "5 min",
        coverImage: post.coverImage || "",
        pinned: !!post.pinned,
      });
      setShowEditModal(true);
    });
  };

  // Delete triggers
  const handleDeleteClick = (e, post) => {
    e.stopPropagation();
    requireAuthThen(() => {
      setDeletingPost(post);
      setShowDeleteModal(true);
    });
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormPost((p) => ({ ...p, coverImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Submit Create
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formPost.title.trim() || !formPost.content.trim()) return;

    setSubmitting(true);
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formPost,
          tags: formPost.tags.split(",").map((t) => t.trim()),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowCreateModal(false);
        await fetchPosts();
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Error creating blog post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingPost || !formPost.title.trim() || !formPost.content.trim()) return;

    setSubmitting(true);
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/blogs/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formPost,
          tags: formPost.tags.split(",").map((t) => t.trim()),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowEditModal(false);
        setEditingPost(null);
        await fetchPosts();
      }
    } catch (err) {
      console.error("Error updating blog post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingPost) return;
    setSubmitting(true);
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/blogs/${deletingPost.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowDeleteModal(false);
        setDeletingPost(null);
        setPosts((prev) => prev.filter((p) => String(p.id) !== String(deletingPost.id)));
      }
    } catch (err) {
      console.error("Error deleting blog post:", err);
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-white">Blog</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-400/30 bg-accent-500/15 px-3 py-1 text-xs font-semibold text-accent-300 shadow-glow">
                <Sparkles size={13} className="text-accent-400 animate-pulse" />
                <span>{posts.length} {posts.length === 1 ? "Article Available" : "Articles Available"}</span>
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              Thoughts on engineering, systems, architecture, and craft
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1.5 rounded-xl bg-accent-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-accent-500 shadow-glow w-fit shrink-0"
          >
            <Plus size={14} />
            Create Post
          </button>
        </div>

        {/* Aesthetic Stats & Tag Bar */}
        <div className="rounded-2xl border border-ink-650/80 bg-ink-950/60 p-3 sm:p-3.5 space-y-3 shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-650/40 pb-2.5 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <BookOpen size={14} className="text-accent-400" />
                <span>{filtered.length} {filtered.length === 1 ? "Post" : "Posts"} Available</span>
              </span>
              {activeTag !== "All" && (
                <span className="text-[11px] text-zinc-500 font-mono">
                  (Filtered by <span className="text-accent-300">#{activeTag}</span>)
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-zinc-400">
                <Pin size={11} className="text-amber-400" />
                <strong className="text-white">{posts.filter((p) => p.pinned).length}</strong> Pinned
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <Sparkles size={11} className="text-accent-400" />
                <strong className="text-white">{allTags.length}</strong> Topics
              </span>
            </div>
          </div>

          {/* Tag filter chips */}
          <div className="flex flex-wrap gap-1.5">
            {["All", ...allTags].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  activeTag === tag
                    ? "bg-accent-500/20 text-accent-200 ring-1 ring-accent-400/40 shadow-glow"
                    : "border border-ink-650/80 bg-ink-900/60 text-zinc-400 hover:border-accent-400/30 hover:text-white"
                }`}
              >
                {tag} {tag === "All" ? `(${posts.length})` : `(${posts.filter((p) => p.tags?.includes(tag)).length})`}
              </button>
            ))}
          </div>
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
                  <div className="min-w-0 flex-1">
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

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleEditClick(e, post)}
                      title="Edit Article"
                      className="grid h-7 w-7 place-items-center rounded-lg border border-ink-650 bg-ink-800/80 text-zinc-400 transition hover:border-accent-400/50 hover:bg-accent-500/10 hover:text-accent-300"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, post)}
                      title="Delete Article"
                      className="grid h-7 w-7 place-items-center rounded-lg border border-ink-650 bg-ink-800/80 text-zinc-400 transition hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <Trash2 size={12} />
                    </button>
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

      {/* Password Authorization Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-ink-650 bg-ink-900 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-ink-650/60 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock size={16} className="text-amber-400" />
                  Author Verification
                </h3>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-ink-700 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                <p className="text-xs text-zinc-400">
                  Please enter the author password to create a new blog post.
                </p>

                <div>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter password..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError("");
                    }}
                    className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                  />
                  {authError && (
                    <p className="mt-1.5 text-xs text-rose-400 font-medium">{authError}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="rounded-xl px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-accent-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent-500 shadow-glow"
                  >
                    Verify & Unlock
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    value={formPost.title}
                    onChange={(e) => setFormPost((p) => ({ ...p, title: e.target.value }))}
                    className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Excerpt / Short Summary</label>
                  <input
                    type="text"
                    placeholder="Brief summary..."
                    value={formPost.excerpt}
                    onChange={(e) => setFormPost((p) => ({ ...p, excerpt: e.target.value }))}
                    className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Full Content (Markdown)</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Write your article here..."
                    value={formPost.content}
                    onChange={(e) => setFormPost((p) => ({ ...p, content: e.target.value }))}
                    className="w-full resize-none rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, Backend, AI"
                      value={formPost.tags}
                      onChange={(e) => setFormPost((p) => ({ ...p, tags: e.target.value }))}
                      className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Read Time</label>
                    <input
                      type="text"
                      placeholder="5 min"
                      value={formPost.readTime}
                      onChange={(e) => setFormPost((p) => ({ ...p, readTime: e.target.value }))}
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
                  {formPost.coverImage && (
                    <div className="mt-2 h-20 w-32 overflow-hidden rounded-lg border border-accent-400/40">
                      <img src={formPost.coverImage} alt="Preview" className="h-full w-full object-cover" />
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

      {/* Edit Post Modal */}
      <AnimatePresence>
        {showEditModal && (
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
                  <Pencil size={18} className="text-accent-400" />
                  Edit Article
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-ink-700 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Title</label>
                  <input
                    type="text"
                    required
                    value={formPost.title}
                    onChange={(e) => setFormPost((p) => ({ ...p, title: e.target.value }))}
                    className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Excerpt / Short Summary</label>
                  <input
                    type="text"
                    value={formPost.excerpt}
                    onChange={(e) => setFormPost((p) => ({ ...p, excerpt: e.target.value }))}
                    className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Full Content (Markdown)</label>
                  <textarea
                    required
                    rows={6}
                    value={formPost.content}
                    onChange={(e) => setFormPost((p) => ({ ...p, content: e.target.value }))}
                    className="w-full resize-none rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formPost.tags}
                      onChange={(e) => setFormPost((p) => ({ ...p, tags: e.target.value }))}
                      className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Read Time</label>
                    <input
                      type="text"
                      value={formPost.readTime}
                      onChange={(e) => setFormPost((p) => ({ ...p, readTime: e.target.value }))}
                      className="w-full rounded-xl border border-ink-650 bg-ink-950/60 px-3.5 py-2 text-sm text-white outline-none focus:border-accent-400/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400 flex items-center gap-1">
                    <ImageIcon size={13} className="text-accent-400" />
                    Cover Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-zinc-400 file:mr-3 file:rounded-xl file:border-0 file:bg-ink-800 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-accent-300 hover:file:bg-ink-700 cursor-pointer"
                  />
                  {formPost.coverImage && (
                    <div className="mt-2 h-20 w-32 overflow-hidden rounded-lg border border-accent-400/40">
                      <img src={formPost.coverImage} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-ink-650/60">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-accent-600 px-5 py-2 text-xs font-semibold text-white hover:bg-accent-500 disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deletingPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-ink-650 bg-ink-900 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-ink-650/60 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trash2 size={16} className="text-rose-400" />
                  Delete Article?
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-ink-700 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">"{deletingPost.title}"</strong>? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-xl px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={submitting}
                  className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
                >
                  {submitting ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
