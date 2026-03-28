import { motion } from "framer-motion";
import { Sparkles, FileText, Search, Bot, Calculator, BookOpen, Crown } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";

const BADGES = [
  { icon: "🤖", text: "19 Agen AI Spesialis" },
  { icon: "✍️", text: "Penulis Cerdas AI" },
  { icon: "🤖", text: "Chatbot Builder" },
  { icon: "📚", text: "Ebook Builder AI" },
  { icon: "🧠", text: "Riset & Peta Preseden" },
  { icon: "📜", text: "Database 53+ Peraturan" },
  { icon: "🧮", text: "6 Kalkulator Hukum" },
  { icon: "⚖️", text: "KUHP Baru 2026" },
];

export function Hero() {
  const { isAuthenticated, login } = useAuth();
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Abstract Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <span className="animate-pulse">⚡</span>
            <span className="text-sm font-medium text-primary">Satu Ekosistem. Semua Kekuatan AI Hukum.</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
          >
            Riset. Tulis. Konsultasi. <br className="hidden md:block" />
            <span className="text-gradient">Bangun dengan AI Hukum.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
          >
            LexCom menghadirkan ekosistem AI hukum terlengkap — 19 pakar AI, Penulis Cerdas, Chatbot Builder, Ebook Builder, Riset AI, database hukum, dan kalkulator — untuk mahasiswa, akademisi, praktisi, dan publik.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {BADGES.map((badge, i) => (
              <div key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center"
          >
            {isAuthenticated ? (
              <Link href="/lexbot" className="w-full sm:w-auto">
                <button className="w-full px-7 py-4 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-15px_rgba(124,58,237,0.7)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Buka LexBot AI
                </button>
              </Link>
            ) : (
              <Link href="/masuk" className="w-full sm:w-auto">
                <button className="w-full px-7 py-4 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-15px_rgba(124,58,237,0.7)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Daftar Gratis Sekarang
                </button>
              </Link>
            )}

            <Link href="/peraturan" className="w-full sm:w-auto">
              <button className="w-full px-7 py-4 rounded-xl font-semibold glass-card text-foreground hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Search className="w-5 h-5 text-muted-foreground" />
                Cari Peraturan
              </button>
            </Link>

            <Link href="/harga" className="w-full sm:w-auto">
              <button className="w-full px-7 py-4 rounded-xl font-semibold border border-white/20 text-foreground hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                <Crown className="w-5 h-5 text-muted-foreground" />
                Lihat Paket
              </button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-xs text-muted-foreground"
          >
            Gratis selamanya · Tidak perlu kartu kredit · Upgrade kapan saja
          </motion.p>
        </div>
      </div>
    </section>
  );
}
