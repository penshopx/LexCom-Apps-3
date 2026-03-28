import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import {
  Bot, FileText, Briefcase, Users, BookOpen, Scale, Calculator, Library,
  MessageSquare, ArrowRight, CheckCircle, Star, Shield, Zap, Clock, Globe, ExternalLink,
} from "lucide-react";

const SUMBER_PEMERINTAH = [
  {
    label: "Kemenkum — Layanan Publik",
    desc: "Layanan publik resmi Kementerian Hukum RI: AHU, Notariat, DJKI, Imigrasi",
    url: "https://kemenkum.go.id/layananpublik",
    badge: "Kemenkum",
    color: "border-red-500/30 hover:border-red-500/50 bg-red-500/5",
    badgeColor: "bg-red-500/20 text-red-400",
  },
  {
    label: "Peraturan.go.id",
    desc: "Portal resmi seluruh peraturan perundang-undangan Indonesia",
    url: "https://peraturan.go.id/",
    badge: "Pemerintah",
    color: "border-green-500/30 hover:border-green-500/50 bg-green-500/5",
    badgeColor: "bg-green-500/20 text-green-400",
  },
  {
    label: "JDIH Mahkamah Agung",
    desc: "Peraturan, SEMA, PERMA, dan kebijakan Mahkamah Agung RI",
    url: "https://jdih.mahkamahagung.go.id/",
    badge: "MA",
    color: "border-blue-500/30 hover:border-blue-500/50 bg-blue-500/5",
    badgeColor: "bg-blue-500/20 text-blue-400",
  },
  {
    label: "Direktori Putusan MA",
    desc: "Database putusan lengkap Mahkamah Agung RI sejak 2010",
    url: "https://putusan3.mahkamahagung.go.id/",
    badge: "MA",
    color: "border-purple-500/30 hover:border-purple-500/50 bg-purple-500/5",
    badgeColor: "bg-purple-500/20 text-purple-400",
  },
  {
    label: "Putusan Mahkamah Konstitusi",
    desc: "Seluruh putusan MK sejak berdiri tahun 2003",
    url: "https://www.mkri.id/perkara/persidangan/putusan",
    badge: "MK",
    color: "border-orange-500/30 hover:border-orange-500/50 bg-orange-500/5",
    badgeColor: "bg-orange-500/20 text-orange-400",
  },
  {
    label: "Penelusuran Perkara PN",
    desc: "Cari perkara di seluruh Pengadilan Negeri se-Indonesia",
    url: "https://badilum.mahkamahagung.go.id/publik/pelayanan-informasi/penelusuran-perkara.html",
    badge: "PN",
    color: "border-cyan-500/30 hover:border-cyan-500/50 bg-cyan-500/5",
    badgeColor: "bg-cyan-500/20 text-cyan-400",
  },
];

const LAYANAN = [
  {
    icon: Bot,
    title: "Konsultasi AI 24/7",
    subtitle: "LexBot & Pakar Hukum AI",
    desc: "Konsultasi hukum kapan saja dengan 19 Pakar AI yang terspecialisasi: hukum pidana, perdata, ketenagakerjaan, perpajakan, syariah, dan banyak lagi.",
    features: ["19 spesialis AI hukum", "Streaming real-time", "Riwayat percakapan tersimpan", "Analisis legal reasoning"],
    link: "/pengacara",
    cta: "Konsultasi Sekarang",
    badge: "Populer",
    color: "border-violet-500/30 bg-violet-500/5",
    badgeColor: "bg-violet-500/20 text-violet-400",
    iconBg: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: FileText,
    title: "Generator Dokumen AI",
    subtitle: "Drafting Otomatis",
    desc: "Buat draf dokumen hukum dalam hitungan menit: surat gugatan, jawaban, replik, duplik, surat kuasa, kontrak, dan legal opinion.",
    features: ["10+ jenis dokumen hukum", "AI drafting kontekstual", "Simpan & kelola dokumen", "Copy & export"],
    link: "/documents",
    cta: "Buat Dokumen",
    badge: null,
    color: "border-blue-500/30 bg-blue-500/5",
    badgeColor: "",
    iconBg: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: Scale,
    title: "Database Peraturan",
    subtitle: "Hukum Positif Indonesia",
    desc: "Akses database peraturan perundang-undangan Indonesia: UU, PP, Perpres, Permen, dan Perda. Termasuk KUHP Baru (UU 1/2023) yang berlaku 2026.",
    features: ["50+ peraturan terupdate", "KUHP 2026 tersedia", "Filter & pencarian canggih", "Ringkasan & isi pokok"],
    link: "/peraturan",
    cta: "Cari Peraturan",
    badge: "Update KUHP 2026",
    color: "border-green-500/30 bg-green-500/5",
    badgeColor: "bg-green-500/20 text-green-400",
    iconBg: "bg-green-500/10 text-green-400",
  },
  {
    icon: Library,
    title: "Yurisprudensi & Putusan",
    subtitle: "Database Putusan Pengadilan",
    desc: "Telusuri putusan landmark dari Mahkamah Konstitusi, Mahkamah Agung, Pengadilan Negeri, dan Pengadilan Agama.",
    features: ["MK, MA, PN, PA", "Yurisprudensi MA terbaru", "Amar putusan lengkap", "Filter per tahun & jenis"],
    link: "/putusan",
    cta: "Lihat Putusan",
    badge: null,
    color: "border-yellow-500/30 bg-yellow-500/5",
    badgeColor: "",
    iconBg: "bg-yellow-500/10 text-yellow-400",
  },
  {
    icon: Briefcase,
    title: "Manajemen Perkara",
    subtitle: "Case Management System",
    desc: "Lacak dan kelola seluruh perkara Anda: status, tanggal sidang, jenis perkara, dan dokumentasi. Cocok untuk advokat dan firma hukum.",
    features: ["CRUD perkara lengkap", "Tracker status & jadwal", "Multi jenis perkara", "Pengingat otomatis (coming soon)"],
    link: "/cases",
    cta: "Kelola Perkara",
    badge: null,
    color: "border-orange-500/30 bg-orange-500/5",
    badgeColor: "",
    iconBg: "bg-orange-500/10 text-orange-400",
  },
  {
    icon: Calculator,
    title: "Kalkulator Hukum",
    subtitle: "Hitung Biaya & Hak Hukum",
    desc: "6 kalkulator hukum: biaya perkara, pesangon PHK, masa daluwarsa, masa penahanan, bagian waris, dan honorarium notaris.",
    features: ["Kalkulator pesangon (PP 35/2021)", "Biaya perkara PN", "Daluwarsa pidana & perdata", "Kalkulator waris & notaris"],
    link: "/kalkulator",
    cta: "Buka Kalkulator",
    badge: "Baru",
    color: "border-cyan-500/30 bg-cyan-500/5",
    badgeColor: "bg-cyan-500/20 text-cyan-400",
    iconBg: "bg-cyan-500/10 text-cyan-400",
  },
  {
    icon: BookOpen,
    title: "Glosarium Hukum",
    subtitle: "Kamus Istilah Hukum",
    desc: "200+ istilah hukum Indonesia dengan definisi lengkap, contoh penerapan, dan dasar hukum. Dari A–Z untuk semua cabang hukum.",
    features: ["200+ istilah tersedia", "Semua cabang hukum", "Filter per kategori", "Pencarian instan A–Z"],
    link: "/glosarium",
    cta: "Buka Glosarium",
    badge: "Baru",
    color: "border-pink-500/30 bg-pink-500/5",
    badgeColor: "bg-pink-500/20 text-pink-400",
    iconBg: "bg-pink-500/10 text-pink-400",
  },
  {
    icon: Users,
    title: "Direktori Pengacara",
    subtitle: "Temukan Pengacara Terpercaya",
    desc: "Direktori pengacara berlisensi di seluruh Indonesia. Filter berdasarkan spesialisasi, kota, dan ulasan klien.",
    features: ["Pengacara terverifikasi", "Filter spesialisasi", "Rating & ulasan", "Kontak langsung"],
    link: "/pengacara#direktori",
    cta: "Cari Pengacara",
    badge: null,
    color: "border-indigo-500/30 bg-indigo-500/5",
    badgeColor: "",
    iconBg: "bg-indigo-500/10 text-indigo-400",
  },
  {
    icon: MessageSquare,
    title: "Forum Hukum",
    subtitle: "Komunitas & Diskusi",
    desc: "Bergabung dengan ribuan praktisi dan mahasiswa hukum. Ajukan pertanyaan, berbagi pengalaman, dan berdiskusi tentang isu hukum terkini.",
    features: ["Forum berdasarkan kategori", "Thread & reply", "Komunitas aktif", "Moderasi profesional"],
    link: "/forum",
    cta: "Masuk Forum",
    badge: null,
    color: "border-emerald-500/30 bg-emerald-500/5",
    badgeColor: "",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: Globe,
    title: "Panduan Hukum",
    subtitle: "Artikel & Tutorial",
    desc: "Panduan langkah demi langkah tentang prosedur hukum: cara gugat perdata, hak tersangka, pembuatan PT, sengketa tanah, dan banyak lagi.",
    features: ["30+ artikel panduan", "Bahasa mudah dipahami", "Update berkala", "Kategori lengkap"],
    link: "/panduan",
    cta: "Baca Panduan",
    badge: null,
    color: "border-teal-500/30 bg-teal-500/5",
    badgeColor: "",
    iconBg: "bg-teal-500/10 text-teal-400",
  },
];

const KEUNGGULAN = [
  { icon: Shield, title: "Hukum Indonesia", desc: "Semua konten berbasis peraturan hukum positif Indonesia yang terupdate" },
  { icon: Zap, title: "AI Terdepan", desc: "Teknologi AI terbaru yang memahami konteks dan nuansa hukum Indonesia" },
  { icon: Clock, title: "Tersedia 24/7", desc: "Akses kapan saja dan di mana saja tanpa perlu menunggu jam kerja" },
  { icon: Star, title: "Dipercaya Ribuan Pengguna", desc: "Lebih dari 12.000 advokat, mahasiswa, dan profesional hukum" },
];

export default function Layanan() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
              <Scale className="w-3 h-3" /> Platform Hukum Terpadu
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Layanan LexCom</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ekosistem hukum digital terlengkap untuk advokat, konsultan hukum, mahasiswa, dan semua yang membutuhkan akses hukum Indonesia.
            </p>
          </motion.div>

          {/* Layanan Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {LAYANAN.map((l, i) => (
              <motion.div
                key={l.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`border rounded-2xl p-5 flex flex-col ${l.color}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${l.iconBg}`}>
                    <l.icon className="w-5 h-5" />
                  </div>
                  {l.badge && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${l.badgeColor}`}>
                      {l.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-foreground text-base mb-0.5">{l.title}</h3>
                <p className="text-xs text-primary font-medium mb-2">{l.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{l.desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {l.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={l.link} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mt-auto">
                  {l.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Keunggulan */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-10">
            <h2 className="font-bold text-2xl text-center mb-8">Mengapa Memilih LexCom?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {KEUNGGULAN.map((k) => (
                <div key={k.title} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                    <k.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">{k.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{k.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sumber Resmi Pemerintah */}
          <div className="mb-10 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <ExternalLink className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-base text-foreground">Sumber Hukum Resmi Pemerintah</h2>
              <span className="text-xs text-muted-foreground ml-auto hidden sm:block">Akses langsung website resmi RI</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SUMBER_PEMERINTAH.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all group ${s.color}`}
                >
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full mb-1 ${s.badgeColor}`}>{s.badge}</span>
                    <p className="text-xs font-semibold text-foreground leading-tight mb-0.5 group-hover:text-primary transition-colors">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight hidden sm:block">{s.desc}</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/lexbot" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition text-base">
              <Bot className="w-5 h-5" /> Mulai dengan LexBot Gratis
            </Link>
            <p className="text-xs text-muted-foreground mt-3">Tidak perlu kartu kredit. Daftar dan konsultasi langsung.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
