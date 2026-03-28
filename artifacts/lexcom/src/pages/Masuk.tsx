import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@workspace/replit-auth-web";
import {
  Sparkles, Shield, Zap, BookOpen, Scale, Bot, Users,
  GraduationCap, Briefcase, ArrowRight, Check, LogIn
} from "lucide-react";

const BENEFITS = [
  { icon: Bot,          label: "19 Pakar Hukum AI",     desc: "Spesialis pidana, perdata, bisnis, syariah & lebih" },
  { icon: Sparkles,     label: "Studio AI Lengkap",     desc: "Penulis Cerdas, Chatbot Builder, Ebook Builder" },
  { icon: BookOpen,     label: "Database 53+ Peraturan", desc: "UU, PP, Perpres, Permen terbaru termasuk KUHP Baru" },
  { icon: Scale,        label: "30+ Putusan Pengadilan", desc: "MA, MK, PN, PA — referensi preseden terlengkap" },
  { icon: Zap,          label: "Riset AI Instan",       desc: "4 agen paralel meringkas topik hukum dalam sekejap" },
  { icon: Shield,       label: "Aman & Privat",         desc: "Data terenkripsi, disimpan di server Indonesia" },
];

const USERS = [
  { icon: GraduationCap, label: "Mahasiswa Hukum",      desc: "Skripsi, makalah, riset hukum lebih cepat" },
  { icon: Briefcase,     label: "Praktisi & Advokat",   desc: "Legal memo, draft kontrak, analisis kasus" },
  { icon: BookOpen,      label: "Akademisi & Dosen",    desc: "Riset mendalam, opini hukum, artikel ilmiah" },
  { icon: Users,         label: "Masyarakat Umum",       desc: "Pahami hak & kewajiban hukum dengan mudah" },
];

const FREE_FEATURES = [
  "LexBot AI (konsultasi hukum dasar)",
  "Database peraturan, putusan & panduan",
  "6 kalkulator hukum (pesangon, waris, dll)",
  "Glosarium 120+ istilah hukum",
  "Forum komunitas hukum",
];

export default function Masuk() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/profil");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
                <Sparkles className="w-3.5 h-3.5" /> Platform AI Hukum Terlengkap Indonesia
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
                Bergabung dengan <br />
                <span className="text-gradient">Ekosistem AI Hukum</span>
              </h1>

              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Akses 19 Pakar AI Hukum, Studio Penulisan, Chatbot Builder, Riset AI, dan database hukum terlengkap Indonesia — mulai gratis, tanpa kartu kredit.
              </p>

              {/* Free features list */}
              <div className="glass-card rounded-2xl p-5 mb-6">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Gratis Selamanya:</p>
                <div className="space-y-2">
                  {FREE_FEATURES.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target users */}
              <div className="grid grid-cols-2 gap-2">
                {USERS.map((u, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <u.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{u.label}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{u.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Login Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              <div className="glass-card rounded-3xl p-8 border border-primary/20 shadow-2xl shadow-primary/10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold">LexCom</p>
                    <p className="text-xs text-muted-foreground">Ekosistem AI Hukum Indonesia</p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-2">Masuk atau Daftar</h2>
                <p className="text-sm text-muted-foreground mb-7">
                  Gunakan akun Anda untuk masuk. Jika belum punya akun, proses pendaftaran selesai dalam 30 detik.
                </p>

                {/* Main CTA */}
                <button
                  onClick={login}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base hover:opacity-90 transition-all shadow-lg shadow-primary/30 mb-4"
                >
                  <LogIn className="w-5 h-5" />
                  {isLoading ? "Memuat..." : "Masuk / Daftar Sekarang"}
                </button>

                <div className="text-center text-xs text-muted-foreground mb-6">
                  Dengan masuk, Anda menyetujui <a href="/syarat" className="text-primary hover:underline">Syarat & Ketentuan</a> dan <a href="/privasi" className="text-primary hover:underline">Kebijakan Privasi</a> LexCom.
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-muted-foreground">Yang Anda dapatkan</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  {BENEFITS.slice(0, 4).map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <b.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{b.label}</p>
                        <p className="text-[11px] text-muted-foreground">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing link */}
                <div className="mt-6 pt-5 border-t border-white/10 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Ingin lebih banyak? Lihat paket berbayar kami</p>
                  <a href="/harga" className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                    Lihat Paket & Harga <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-6 mt-5 text-center">
                {[
                  { num: "10.000+", label: "Pengguna" },
                  { num: "4.9★", label: "Rating" },
                  { num: "53+", label: "Peraturan" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-xl font-bold text-gradient">{s.num}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
