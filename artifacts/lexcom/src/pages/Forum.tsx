import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@workspace/replit-auth-web";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { MessageSquare, Plus, Clock, Tag, X, ChevronRight } from "lucide-react";

const CATEGORIES = ["Semua", "Perdata", "Pidana", "Keluarga", "Bisnis", "Umum"];

const CATEGORY_COLORS: Record<string, string> = {
  Perdata: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Pidana: "bg-red-500/20 text-red-400 border-red-500/30",
  Keluarga: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Bisnis: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Umum: "bg-green-500/20 text-green-400 border-green-500/30",
};

interface Thread {
  id: number;
  authorName: string;
  title: string;
  content: string;
  category: string;
  replyCount: number;
  createdAt: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  return `${days} hari lalu`;
}

export default function Forum() {
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [filtered, setFiltered] = useState<Thread[]>([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "", category: "Umum" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (activeCategory === "Semua") {
      setFiltered(threads);
    } else {
      setFiltered(threads.filter(t => t.category === activeCategory));
    }
  }, [activeCategory, threads]);

  async function fetchThreads() {
    try {
      const res = await fetch("/api/forum/threads", { credentials: "include" });
      const data = await res.json();
      setThreads(data);
    } catch {
      toast({ title: "Gagal memuat thread", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function submitThread() {
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const newThread = await res.json();
      setThreads(prev => [newThread, ...prev]);
      setShowModal(false);
      setForm({ title: "", content: "", category: "Umum" });
      toast({ title: "Thread berhasil dibuat!" });
    } catch {
      toast({ title: "Gagal membuat thread", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
                <MessageSquare className="w-3 h-3" /> Forum Diskusi
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                Diskusi <span className="text-gradient">Hukum</span>
              </h1>
              <p className="text-muted-foreground mt-2">Tanya, diskusi, dan berbagi pengetahuan hukum bersama komunitas.</p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="rounded-xl gap-2 flex-shrink-0"
            >
              <Plus className="w-4 h-4" /> Buat Thread
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${
                  activeCategory === cat
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Thread List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass-card rounded-xl border border-white/10 p-5 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Belum ada thread. Jadilah yang pertama!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((thread, i) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={`/forum/${thread.id}`}>
                    <div className="group glass-card rounded-xl border border-white/10 hover:border-primary/30 transition-all p-5 cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[thread.category] || CATEGORY_COLORS.Umum}`}>
                              <Tag className="w-2.5 h-2.5 inline mr-1" />{thread.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                            {thread.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {thread.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground/70">{thread.authorName}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {timeAgo(thread.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> {thread.replyCount} balasan
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Thread Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass-card rounded-2xl border border-white/15 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Buat Thread Baru</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Kategori</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter(c => c !== "Semua").map(cat => (
                    <button
                      key={cat}
                      onClick={() => setForm(f => ({ ...f, category: cat }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        form.category === cat
                          ? "bg-primary/20 text-primary border-primary/40"
                          : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Judul</label>
                <Input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Tulis judul pertanyaan atau diskusi..."
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Isi</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Jelaskan pertanyaan atau masalah hukum Anda secara detail..."
                  rows={5}
                  className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  Batal
                </Button>
                <Button
                  onClick={submitThread}
                  disabled={!form.title.trim() || !form.content.trim() || submitting}
                  className="flex-1"
                >
                  {submitting ? "Memposting..." : "Posting Thread"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
