import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, MessageSquare, Bot, BookOpen, ArrowRight, TrendingUp } from "lucide-react";

interface RecentThread {
  id: number;
  title: string;
  category: string;
  authorName: string;
  createdAt: string;
  replyCount: number;
}

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
  return `${Math.floor(hrs / 24)} hari lalu`;
}

const STATS = [
  { icon: Users, label: "Member Aktif", value: "12.400+", color: "text-blue-400" },
  { icon: MessageSquare, label: "Thread Diskusi", value: "3.800+", color: "text-purple-400" },
  { icon: Bot, label: "Pertanyaan Terjawab", value: "9.200+", color: "text-primary" },
  { icon: BookOpen, label: "Artikel Panduan", value: "500+", color: "text-green-400" },
];

const HIGHLIGHTS = [
  { emoji: "💬", title: "Forum Diskusi", description: "Ajukan pertanyaan hukum dan dapatkan jawaban dari komunitas.", href: "/forum" },
  { emoji: "🤖", title: "AI Legal Agents", description: "Konsultasi langsung dengan 11 agen hukum AI spesialis.", href: "/agents" },
  { emoji: "📖", title: "Panduan Hukum", description: "Artikel panduan praktis hukum Indonesia.", href: "/panduan" },
  { emoji: "👨‍⚖️", title: "Direktori Pengacara", description: "Temukan pengacara terpercaya di kota Anda.", href: "/pengacara" },
];

export default function Komunitas() {
  const [recentThreads, setRecentThreads] = useState<RecentThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/forum/threads", { credentials: "include" })
      .then(r => r.json())
      .then(data => setRecentThreads(data.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Users className="w-4 h-4" /> Komunitas LexCom
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Bersama Memahami <span className="text-gradient">Hukum Indonesia</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Bergabung dengan ribuan pengguna, praktisi hukum, dan akademisi dalam platform LegalTech terdepan di Indonesia.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl border border-white/10 p-5 text-center"
              >
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-2xl font-display font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Forum */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Diskusi Terbaru
                </h2>
                <Link href="/forum">
                  <button className="text-xs text-primary hover:underline flex items-center gap-1">
                    Lihat Semua <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="glass-card rounded-xl border border-white/10 p-4 animate-pulse">
                      <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : recentThreads.length === 0 ? (
                <div className="glass-card rounded-xl border border-white/10 p-8 text-center text-muted-foreground">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Belum ada diskusi. Jadilah yang pertama!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentThreads.map(thread => (
                    <Link key={thread.id} href={`/forum/${thread.id}`}>
                      <div className="glass-card rounded-xl border border-white/10 hover:border-primary/30 transition-all p-4 cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[thread.category] || CATEGORY_COLORS.Umum}`}>
                                {thread.category}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">{thread.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span>{thread.authorName}</span>
                              <span>{timeAgo(thread.createdAt)}</span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-2.5 h-2.5" /> {thread.replyCount}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <Link href="/forum" className="block mt-4">
                <Button variant="outline" className="w-full rounded-xl gap-2">
                  <MessageSquare className="w-4 h-4" /> Buka Forum Diskusi
                </Button>
              </Link>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="font-display text-lg font-bold mb-4">Jelajahi LexCom</h2>
              <div className="space-y-3">
                {HIGHLIGHTS.map(h => (
                  <Link key={h.href} href={h.href}>
                    <div className="glass-card rounded-xl border border-white/10 hover:border-primary/30 transition-all p-4 cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{h.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{h.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{h.description}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
