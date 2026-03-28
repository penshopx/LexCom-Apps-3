import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@workspace/replit-auth-web";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MessageSquare, Send, Tag } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Perdata: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Pidana: "bg-red-500/20 text-red-400 border-red-500/30",
  Keluarga: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Bisnis: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Umum: "bg-green-500/20 text-green-400 border-green-500/30",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  return `${days} hari lalu`;
}

export default function ForumThread() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const [thread, setThread] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchThread();
  }, [id]);

  async function fetchThread() {
    try {
      const res = await fetch(`/api/forum/threads/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setThread(data.thread);
      setReplies(data.replies);
    } catch {
      toast({ title: "Gagal memuat thread", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function submitReply() {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/forum/threads/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: replyContent }),
      });
      if (!res.ok) throw new Error();
      const newReply = await res.json();
      setReplies(prev => [...prev, newReply]);
      setThread((t: any) => t ? { ...t, replyCount: t.replyCount + 1 } : t);
      setReplyContent("");
      toast({ title: "Balasan berhasil dikirim!" });
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      toast({ title: "Gagal mengirim balasan", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-16 px-4 max-w-3xl mx-auto w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-white/10 rounded w-32" />
            <div className="h-8 bg-white/10 rounded w-3/4" />
            <div className="h-32 bg-white/5 rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-16 px-4 text-center">
          <p className="text-muted-foreground">Thread tidak ditemukan.</p>
          <Link href="/forum"><Button className="mt-4">Kembali ke Forum</Button></Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link href="/forum">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Forum
            </button>
          </Link>

          {/* Thread */}
          <div className="glass-card rounded-2xl border border-white/15 p-6 mb-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[thread.category] || CATEGORY_COLORS.Umum}`}>
                <Tag className="w-2.5 h-2.5 inline mr-1" />{thread.category}
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold mb-4">{thread.title}</h1>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap mb-6">{thread.content}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-white/10">
              <span className="font-medium text-foreground/70">{thread.authorName}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(thread.createdAt)}</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {thread.replyCount} balasan</span>
            </div>
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="space-y-4 mb-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {replies.length} Balasan
              </h2>
              {replies.map((reply, i) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card rounded-xl border border-white/10 p-5"
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap mb-4">{reply.content}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/70">{reply.authorName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(reply.createdAt)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Reply form */}
          <div ref={bottomRef} className="glass-card rounded-2xl border border-white/15 p-5">
            <h3 className="font-semibold mb-3 text-sm">Tulis Balasan</h3>
            <div className="space-y-3">
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Tulis balasan Anda..."
                rows={4}
                className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <div className="flex items-center gap-3">
                <Button
                  onClick={submitReply}
                  disabled={!replyContent.trim() || submitting}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Mengirim..." : "Kirim Balasan"}
                </Button>
                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground">atau <button onClick={login} className="text-primary hover:underline">masuk</button> agar nama Anda tampil</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
