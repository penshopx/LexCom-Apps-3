import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Library, Search, BookOpen, Star, ArrowRight, ChevronRight,
  Tag, Download, Zap, Sparkles, FileText, Shield, Brain,
  BookMarked, GraduationCap, Scale,
} from "lucide-react";

const KOLEKSI_KATEGORI = [
  { emoji: "⚖️", label: "Hukum Pidana", count: 14, color: "from-red-600 to-rose-700", highlight: ["KUHP Baru 2026", "KUHAP", "Hukum Pidana Khusus"] },
  { emoji: "📜", label: "Hukum Perdata", count: 11, color: "from-blue-600 to-cyan-700", highlight: ["KUHPerdata", "Hukum Waris", "Hukum Perikatan"] },
  { emoji: "🏢", label: "Hukum Korporasi", count: 12, color: "from-violet-600 to-purple-700", highlight: ["Hukum PT", "Kepailitan", "Pasar Modal"] },
  { emoji: "👷", label: "Ketenagakerjaan", count: 9, color: "from-orange-600 to-amber-700", highlight: ["UU Cipta Kerja", "PHI", "Serikat Pekerja"] },
  { emoji: "🏠", label: "Hukum Agraria", count: 8, color: "from-emerald-600 to-green-700", highlight: ["UUPA", "Hak Atas Tanah", "Sengketa Tanah"] },
  { emoji: "🧾", label: "Hukum Pajak", count: 7, color: "from-amber-600 to-yellow-700", highlight: ["PPh", "PPN", "Banding Pajak"] },
  { emoji: "🌐", label: "Hukum Bisnis Digital", count: 10, color: "from-teal-600 to-cyan-700", highlight: ["UU ITE", "Fintech", "Perlindungan Data"] },
  { emoji: "🏛️", label: "Hukum Administrasi", count: 8, color: "from-pink-600 to-rose-600", highlight: ["Hukum TUN", "Perizinan", "Hukum HTN"] },
  { emoji: "⚖️", label: "Hukum Syariah", count: 6, color: "from-indigo-600 to-blue-700", highlight: ["Hukum Keluarga Islam", "Ekonomi Syariah", "Wakaf"] },
  { emoji: "🌍", label: "Hukum Internasional", count: 5, color: "from-sky-600 to-blue-700", highlight: ["Perjanjian Internasional", "Arbitrase", "ASEAN"] },
  { emoji: "🔬", label: "Hukum Lingkungan", count: 4, color: "from-lime-600 to-green-700", highlight: ["AMDAL", "Hukum Pertambangan", "Kehutanan"] },
  { emoji: "👨‍⚕️", label: "Hukum Kesehatan", count: 3, color: "from-rose-600 to-pink-700", highlight: ["UU Kesehatan", "Malpraktek", "BPJS"] },
];

const EBOOK_FEATURED = [
  { title: "Panduan Praktis KUHP Baru 2026", cat: "Hukum Pidana", pages: 180, badge: "Terbaru", color: "border-red-500/30", badgeColor: "bg-red-500/20 text-red-300", desc: "Analisis mendalam KUHP baru yang berlaku 2 Januari 2026 — perubahan krusial, living law, dan dampak praktis untuk advokat." },
  { title: "UU Cipta Kerja: Analisis & Implementasi", cat: "Ketenagakerjaan", pages: 145, badge: "Populer", color: "border-orange-500/30", badgeColor: "bg-orange-500/20 text-orange-300", desc: "Perubahan UU Ketenagakerjaan pasca UU Cipta Kerja — PHK, pesangon, PKWT, outsourcing, dan PHI." },
  { title: "Hukum Kepailitan & PKPU Terapan", cat: "Korporasi", pages: 210, badge: "Bestseller", color: "border-violet-500/30", badgeColor: "bg-violet-500/20 text-violet-300", desc: "Panduan praktis PKPU dan Kepailitan — dari permohonan, kurator, rencana perdamaian, hingga eksekusi." },
  { title: "Sengketa Tanah & Agraria Indonesia", cat: "Agraria", pages: 162, badge: null, color: "border-emerald-500/30", badgeColor: "", desc: "HGB, SHM, sengketa batas tanah, dan proses penyelesaian sengketa agraria di BPN dan Pengadilan." },
  { title: "Banding Pajak di Pengadilan Pajak", cat: "Pajak", pages: 134, badge: "Langka", color: "border-amber-500/30", badgeColor: "bg-amber-500/20 text-amber-300", desc: "Prosedur banding pajak dari keberatan hingga PK di MA — untuk pengacara pajak dan konsultan pajak." },
  { title: "Hukum Kontrak & Perjanjian Bisnis", cat: "Perdata", pages: 198, badge: null, color: "border-blue-500/30", badgeColor: "", desc: "Drafting kontrak profesional, klausul penting, force majeure, wanprestasi, dan penyelesaian sengketa." },
];

const SEARCH_SUGGESTIONS = ["PKPU", "pesangon", "non-kompetisi", "KUHP baru", "hak atas tanah", "kontrak kerja", "opini hukum", "banding pajak"];

export default function PerpustakaanHukum() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/25 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6">
              <Library className="w-3.5 h-3.5" />
              Perpustakaan Hukum Digital Indonesia
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-foreground mb-4 leading-tight">
              Perpustakaan
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Hukum Digital
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
              96+ e-book dan panduan hukum terlengkap dalam satu platform. Bukan sekadar PDF — setiap buku dapat dicari, dianalisis, dan diintegrasikan langsung dengan AI LexCom.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari topik, nama UU, atau kata kunci hukum..."
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-white/12 bg-white/5 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-indigo-500/40 focus:bg-white/8 transition"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> AI Cari
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {SEARCH_SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => setQuery(s)} className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 text-muted-foreground hover:border-indigo-500/30 hover:text-indigo-300 transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
              {[
                { val: "96+", label: "E-Book Hukum", icon: BookOpen },
                { val: "12", label: "Bidang Hukum", icon: Tag },
                { val: "AI", label: "Terintegrasi", icon: Brain },
                { val: "∞", label: "Akses Lifetime", icon: Star },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/8 bg-white/4 p-3 text-center">
                  <s.icon className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <p className="text-xl font-black text-foreground">{s.val}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-12 border-t border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-foreground">12 Bidang Hukum</h2>
            <span className="text-xs text-muted-foreground">96+ e-book</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {KOLEKSI_KATEGORI.map((cat) => (
              <motion.button
                key={cat.label}
                whileHover={{ y: -2 }}
                onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  activeCategory === cat.label
                    ? "border-indigo-500/40 bg-indigo-500/10"
                    : "border-white/8 bg-white/3 hover:border-white/15"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-[10px] font-bold text-muted-foreground bg-white/8 px-1.5 py-0.5 rounded-full">{cat.count} buku</span>
                </div>
                <p className="font-bold text-foreground text-xs mb-2">{cat.label}</p>
                <div className="space-y-0.5">
                  {cat.highlight.map((h) => (
                    <p key={h} className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-indigo-400/50 flex-shrink-0" />
                      {h}
                    </p>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED E-BOOKS ─── */}
      <section className="py-12 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-foreground">E-Book Pilihan</h2>
              <p className="text-xs text-muted-foreground">Buku paling relevan berdasarkan tren kebutuhan hukum 2026</p>
            </div>
            <Link href="/masuk">
              <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Lihat Semua 96+ <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EBOOK_FEATURED.map((book) => (
              <motion.div
                key={book.title}
                whileHover={{ y: -3 }}
                className={`rounded-2xl border ${book.color} bg-white/2 hover:bg-white/4 transition-all p-5 cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-14 rounded-lg bg-gradient-to-b from-white/12 to-white/5 border border-white/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                  </div>
                  {book.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${book.badgeColor}`}>{book.badge}</span>
                  )}
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1 leading-snug">{book.title}</h3>
                <p className="text-[11px] text-indigo-400 font-semibold mb-2">{book.cat} · {book.pages} hal</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{book.desc}</p>
                <div className="flex items-center justify-between">
                  <Link href="/masuk">
                    <button className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                      Baca & Analisis AI <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                  <Link href="/masuk">
                    <button className="text-muted-foreground hover:text-foreground transition">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI KEUNGGULAN ─── */}
      <section className="py-12 border-t border-white/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Bukan Sekadar E-Book Biasa</h2>
            <p className="text-muted-foreground text-sm">Setiap buku di Perpustakaan LexCom terintegrasi penuh dengan ekosistem AI hukum kami.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                emoji: "🔍",
                title: "Pencarian Semantik AI",
                desc: "Cari dengan pertanyaan natural, bukan kata kunci. AI memahami konteks dan mencari di seluruh 96+ buku sekaligus.",
              },
              {
                emoji: "💬",
                title: "Tanya Jawab Buku",
                desc: "Ajukan pertanyaan spesifik ke setiap buku. AI menjawab berdasarkan isi buku + regulasi terbaru yang berlaku.",
              },
              {
                emoji: "🔗",
                title: "Integrasi dengan Kasus Anda",
                desc: "Sambungkan teori dalam buku langsung ke dokumen atau kasus yang sedang Anda kerjakan di LexCom.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/8 bg-white/3 p-6 text-center">
                <span className="text-3xl block mb-3">{f.emoji}</span>
                <h3 className="font-bold text-foreground text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/25 via-background to-violet-950/20 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-black text-foreground mb-3">
            96 E-Book Hukum.
            <br />
            <span className="text-indigo-400">Satu Ekosistem AI Hukum.</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            Dapatkan akses ke seluruh perpustakaan hukum digital LexCom — termasuk buku terbaru, analisis AI, dan integrasi penuh dengan semua fitur platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/masuk">
              <button className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                <Library className="w-4 h-4" /> Akses Perpustakaan
              </button>
            </Link>
            <Link href="/harga">
              <button className="px-7 py-3.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 transition flex items-center gap-2">
                Lihat Paket <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
