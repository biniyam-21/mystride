import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Eye, Heart, Calendar, User, Tag, Sparkles } from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import { useScrollReveal } from "../hooks/gsapUtils";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [error, setError] = useState(null);

  const headerRef = useScrollReveal({ y: 18, duration: 0.5 });

  const getBaseUrl = () => {
    const rawUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/v1";
    return rawUrl.replace(/\/api\/v1\/?$/, "");
  };

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/blogs/${id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setBlog(data.data);
          setLikesCount(data.data.likes || 0);
        } else {
          setError(data.message || "Blog post not found.");
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (liked) return; // Prevent spam liking

    setLiked(true);
    setLikesCount((prev) => prev + 1);

    try {
      const baseUrl = getBaseUrl();
      await fetch(`${baseUrl}/api/v1/blogs/${id}/like`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Error liking blog post:", err);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="mx-auto max-w-3xl space-y-6 py-12 text-center">
          <div className="flex flex-col items-center justify-center gap-3 text-accent-400">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent-400 border-t-transparent" />
            <p className="text-sm font-medium text-zinc-400">Loading article...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !blog) {
    return (
      <PageWrapper>
        <div className="mx-auto max-w-2xl py-12 text-center">
          <Card className="p-8">
            <h2 className="text-xl font-bold text-white">Article Not Found</h2>
            <p className="mt-2 text-sm text-zinc-400">{error || "The article you are looking for does not exist."}</p>
            <button
              onClick={() => navigate("/blog")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-500"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </button>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <article className="mx-auto max-w-3xl space-y-6 pb-12">
        {/* Navigation & Header */}
        <div ref={headerRef} className="space-y-4">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition hover:text-accent-300"
          >
            <ArrowLeft size={14} />
            Back to Articles
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {blog.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-accent-400/30 bg-accent-500/10 px-2.5 py-0.5 text-xs font-medium text-accent-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-extrabold text-white sm:text-4xl leading-tight">
            {blog.title}
          </h1>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 border-y border-ink-650/60 py-3">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <User size={13} className="text-accent-400" />
              <span>{blog.author || "Biniyam Belay"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={13} />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} />
              <span>{blog.readTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye size={13} />
              <span>{blog.views?.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {/* Optional Cover Image */}
        {blog.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="overflow-hidden rounded-2xl border border-ink-650 shadow-2xl"
          >
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="h-64 sm:h-80 w-full object-cover"
            />
          </motion.div>
        )}

        {/* Blog Content Card */}
        <Card className="p-6 sm:p-8">
          <div className="prose prose-invert max-w-none space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
            {blog.content ? (
              blog.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-xl font-bold text-white mt-6 mb-2">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-accent-300 mt-4 mb-1">
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("```")) {
                  const codeContent = paragraph.replace(/```[a-z]*/g, "").trim();
                  return (
                    <pre
                      key={index}
                      className="overflow-x-auto rounded-xl border border-ink-650 bg-ink-950 p-4 font-mono text-xs text-emerald-300"
                    >
                      <code>{codeContent}</code>
                    </pre>
                  );
                }
                return <p key={index}>{paragraph}</p>;
              })
            ) : (
              <p>{blog.excerpt}</p>
            )}
          </div>

          {/* Like Button Section */}
          <div className="mt-8 flex items-center justify-between border-t border-ink-650/60 pt-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-xs font-medium text-zinc-400">
                Found this helpful? Send a reaction to Biniyam!
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleLike}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                liked
                  ? "bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40"
                  : "bg-ink-800 text-zinc-300 border border-ink-650 hover:border-rose-500/40 hover:text-rose-400"
              }`}
            >
              <motion.span
                animate={liked ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart size={16} className={liked ? "fill-rose-500 text-rose-500" : "text-rose-400"} />
              </motion.span>
              <span>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
            </motion.button>
          </div>
        </Card>
      </article>
    </PageWrapper>
  );
}
