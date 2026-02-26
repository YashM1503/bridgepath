import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, MessageSquare, ThumbsUp, Send, ExternalLink, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageToggle from "@/components/LanguageToggle";

interface ForumPost {
  id: string;
  author_name: string;
  title: string;
  body: string;
  category: string;
  corridor: string | null;
  upvotes: number;
  created_at: string;
}

interface ForumReply {
  id: string;
  post_id: string;
  author_name: string;
  body: string;
  upvotes: number;
  created_at: string;
}

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "banking", label: "Banking" },
  { key: "credit", label: "Credit Building" },
  { key: "documents", label: "Documents" },
  { key: "housing", label: "Housing" },
  { key: "experiences", label: "Experiences" },
  { key: "reddit", label: "Reddit Threads" },
  { key: "general", label: "General" },
];

const REDDIT_SUBS = [
  { name: "r/immigration", url: "https://reddit.com/r/immigration", desc: "US immigration discussions" },
  { name: "r/personalfinance", url: "https://reddit.com/r/personalfinance", desc: "Financial planning advice" },
  { name: "r/h1b", url: "https://reddit.com/r/h1b", desc: "H-1B visa community" },
  { name: "r/f1visa", url: "https://reddit.com/r/f1visa", desc: "F-1 student visa community" },
  { name: "r/DACA", url: "https://reddit.com/r/DACA", desc: "DACA recipients community" },
  { name: "r/ImmigrationCanada", url: "https://reddit.com/r/ImmigrationCanada", desc: "Broader immigration discussions" },
];

export default function Forum() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [category, setCategory] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", author_name: "", category: "general", corridor: "" });
  const [newReply, setNewReply] = useState({ body: "", author_name: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    const channel = supabase
      .channel("forum-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_posts" }, () => fetchPosts())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data } = await supabase.from("forum_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }

  async function fetchReplies(postId: string) {
    const { data } = await supabase.from("forum_replies").select("*").eq("post_id", postId).order("created_at", { ascending: true });
    setReplies(data || []);
  }

  async function handleCreatePost() {
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    await supabase.from("forum_posts").insert({
      title: newPost.title,
      body: newPost.body,
      author_name: newPost.author_name || "Anonymous",
      category: newPost.category,
      corridor: newPost.corridor || null,
    });
    setNewPost({ title: "", body: "", author_name: "", category: "general", corridor: "" });
    setShowNewPost(false);
    fetchPosts();
  }

  async function handleCreateReply() {
    if (!selectedPost || !newReply.body.trim()) return;
    await supabase.from("forum_replies").insert({
      post_id: selectedPost.id,
      body: newReply.body,
      author_name: newReply.author_name || "Anonymous",
    });
    setNewReply({ body: "", author_name: "" });
    fetchReplies(selectedPost.id);
  }

  async function handleUpvotePost(postId: string) {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    await supabase.from("forum_posts").update({ upvotes: post.upvotes + 1 }).eq("id", postId);
    fetchPosts();
  }

  async function handleUpvoteReply(replyId: string) {
    const reply = replies.find((r) => r.id === replyId);
    if (!reply) return;
    await supabase.from("forum_replies").update({ upvotes: reply.upvotes + 1 }).eq("id", replyId);
    fetchReplies(selectedPost!.id);
  }

  function selectPost(post: ForumPost) {
    setSelectedPost(post);
    fetchReplies(post.id);
  }

  const filteredPosts = category === "all" ? posts : posts.filter((p) => p.category === category);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-3 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-foreground font-bold text-lg hover:opacity-80">BridgePath</Link>
            <span className="text-xs text-muted-foreground border-l border-border pl-4">Community Forum</span>
          </div>
          <LanguageToggle />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <button
              onClick={() => setShowNewPost(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all"
            >
              <Plus size={16} /> New Post
            </button>

            {/* Categories */}
            <div className="bp-card p-3 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categories</p>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => { setCategory(cat.key); setSelectedPost(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    category === cat.key ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Reddit subs */}
            <div className="bp-card p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Related Communities</p>
              <div className="space-y-2">
                {REDDIT_SUBS.map((sub) => (
                  <a
                    key={sub.name}
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-all group"
                  >
                    <ExternalLink size={12} className="mt-0.5 flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                    <div>
                      <p className="text-xs font-medium text-foreground">{sub.name}</p>
                      <p className="text-[10px] text-muted-foreground">{sub.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* New post form */}
            {showNewPost && (
              <div className="bp-card p-4 mb-4 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Create a Post</h3>
                  <button onClick={() => setShowNewPost(false)} className="text-muted-foreground hover:text-foreground text-xs">Cancel</button>
                </div>
                <input
                  value={newPost.author_name}
                  onChange={(e) => setNewPost({ ...newPost, author_name: e.target.value })}
                  placeholder="Your name (optional)"
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Post title"
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <textarea
                  value={newPost.body}
                  onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                  placeholder="Share your experience, tips, or questions…"
                  rows={4}
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                />
                <div className="flex gap-2">
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORIES.filter((c) => c.key !== "all").map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                  <select
                    value={newPost.corridor}
                    onChange={(e) => setNewPost({ ...newPost, corridor: e.target.value })}
                    className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Any corridor</option>
                    <option value="india">India</option>
                    <option value="china">China</option>
                    <option value="latam">Latin America</option>
                  </select>
                </div>
                <button onClick={handleCreatePost} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                  Post
                </button>
              </div>
            )}

            {/* Post detail */}
            {selectedPost ? (
              <div className="animate-fade-in">
                <button onClick={() => setSelectedPost(null)} className="text-sm text-muted-foreground hover:text-foreground mb-3 flex items-center gap-1">
                  <ArrowLeft size={14} /> Back to posts
                </button>
                <div className="bp-card p-4 mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{selectedPost.title}</h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {selectedPost.author_name} • {new Date(selectedPost.created_at).toLocaleDateString()} • {selectedPost.category}
                      </p>
                    </div>
                    <button onClick={() => handleUpvotePost(selectedPost.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                      <ThumbsUp size={14} /> {selectedPost.upvotes}
                    </button>
                  </div>
                  <p className="text-sm text-foreground mt-3 whitespace-pre-wrap">{selectedPost.body}</p>
                </div>

                {/* Replies */}
                <div className="space-y-2 mb-4">
                  {replies.map((reply) => (
                    <div key={reply.id} className="bp-card p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-foreground">{reply.author_name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(reply.created_at).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleUpvoteReply(reply.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                          <ThumbsUp size={12} /> {reply.upvotes}
                        </button>
                      </div>
                      <p className="text-sm text-foreground mt-2 whitespace-pre-wrap">{reply.body}</p>
                    </div>
                  ))}
                </div>

                {/* Reply form */}
                <div className="bp-card p-3 space-y-2">
                  <input
                    value={newReply.author_name}
                    onChange={(e) => setNewReply({ ...newReply, author_name: e.target.value })}
                    placeholder="Your name (optional)"
                    className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex gap-2">
                    <input
                      value={newReply.body}
                      onChange={(e) => setNewReply({ ...newReply, body: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleCreateReply()}
                      placeholder="Write a reply…"
                      className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button onClick={handleCreateReply} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Post list */
              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-10">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-10">
                    <MessageSquare size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No posts yet. Be the first to share!</p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => selectPost(post)}
                      className="w-full text-left bp-card p-4 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-foreground">{post.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.body}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{post.category}</span>
                            {post.corridor && <span className="text-[10px] text-muted-foreground">{post.corridor}</span>}
                            <span className="text-[10px] text-muted-foreground">{post.author_name}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground ml-4">
                          <ThumbsUp size={12} /> {post.upvotes}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
