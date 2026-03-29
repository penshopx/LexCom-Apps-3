import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Gavel, FileText, Search, Shield, Clock, Users, TrendingUp,
  Scale, BookOpen, Zap, ChevronRight, CheckCircle2, ArrowRight,
  BarChart3, Calendar, MessageSquare, Layers, Bot, Sparkles,
  FolderOpen, AlertCircle, Star, Play, Briefcase, Target,
  Activity, Lock, Globe, Database, Cpu, Network,
} from "lucide-react";

const MODULES = [
  {
    id: "command",
    icon: Cpu,
    emoji: "🖥️",
    title: "Komando Perkara AI",
    subtitle: "Pusat Kendali Real-Time",
    color: "from-violet-600 to-purple-700",
    glow: "shadow-violet-500/30",
    border: "border-violet-500/20 hover:border-violet-500/40",
    desc: "Dashboard command center yang menyajikan semua perkara aktif, jadwal sidang, tenggat waktu, dan status klien dalam satu tampilan real-time. AI secara proaktif mengingatkan risiko keterlambatan dan menyarankan prioritas tindakan.",
    features: [
      "Kanban perkara multi-pengadilan",
      "Countdown otomatis tenggat legal",
      "Alert risiko & rekomendasi tindakan",
      "Sinkronisasi kalender sidang PN/PT/MA",
    ],
  },
  {
    id: "brief",
    icon: FileText,
    emoji: "📝",
    title: "Legal Brief Generator",
    subtitle: "Draf Dokumen Hukum Otomatis",
    color: "from-blue-600 to-cyan-700",
    glow: "shadow-blue-500/30",
    border: "border-blue-500/20 hover:border-blue-500/40",
    desc: "AI menghasilkan surat gugatan, jawaban, replik, duplik, memori banding, kontra memori, dan kasasi — sesuai format Mahkamah Agung RI, dilengkapi referensi pasal dan yurisprudensi yang relevan secara otomatis.",
    features: [
      "Gugatan, jawaban, replik, duplik",
      "Memori banding & kasasi",
      "Format MA RI terstandar",
      "Auto-insert pasal & yurisprudensi",
    ],
  },
  {
    id: "hearing",
    icon: Gavel,
    emoji: "⚖️",
    title: "Persiapan Sidang AI",
    subtitle: "Simulasi & Strategi Persidangan",
    color: "from-amber-600 to-orange-700",
    glow: "shadow-amber-500/30",
    border: "border-amber-500/20 hover:border-amber-500/40",
    desc: "AI berperan sebagai kuasa hukum lawan dan mensimulasikan argumen, bantahan, dan pertanyaan saksi. Hasilkan checklist persidangan, dalil penguatan, dan strategi cross-examination berbasis profil hakim & riwayat putusan.",
    features: [
      "Simulasi persidangan interaktif",
      "Profil hakim & pola putusannya",
      "Strategi cross-examination saksi",
      "Checklist dokumen & bukti",
    ],
  },
  {
    id: "evidence",
    icon: Search,
    emoji: "🔬",
    title: "Analisis Bukti AI",
    subtitle: "Telaah Dokumen & Alat Bukti",
    color: "from-emerald-600 to-green-700",
    glow: "shadow-emerald-500/30",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    desc: "Upload kontrak, akta, kuitansi, atau dokumen apapun. AI mengidentifikasi klausa kritis, potensi sengketa, inkonsistensi, dan kelemahan argumen lawan — serta menyusun analisis hukum komprehensif siap pakai di persidangan.",
    features: [
      "Ekstraksi otomatis klausul kritis",
      "Deteksi inkonsistensi & celah hukum",
      "Analisis kekuatan & kelemahan bukti",
      "Sinkronisasi dengan Legal Brief",
    ],
  },
  {
    id: "research",
    icon: BookOpen,
    emoji: "🧠",
    title: "Riset Yurisprudensi AI",
    subtitle: "30.000+ Putusan Terindeks",
    color: "from-pink-600 to-rose-700",
    glow: "shadow-pink-500/30",
    border: "border-pink-500/20 hover:border-pink-500/40",
    desc: "Cari preseden yang menang, identifikasi pola putusan hakim tertentu, dan temukan yurisprudensi MA yang mendukung posisi hukum klien — semuanya dalam hitungan detik menggunakan pencarian semantik AI.",
    features: [
      "Pencarian semantik 30.000+ putusan",
      "Filter hakim, majelis, PN/PT/MA",
      "Rangkuman ratio decidendi otomatis",
      "Ekspor sitasi format hukum Indonesia",
    ],
  },
  {
    id: "client",
    icon: Users,
    emoji: "👤",
    title: "Intelijen Klien",
    subtitle: "Profil & Wawasan Klien 360°",
    color: "from-teal-600 to-cyan-700",
    glow: "shadow-teal-500/30",
    border: "border-teal-500/20 hover:border-teal-500/40",
    desc: "AI membangun profil risiko klien lengkap: riwayat perkara, eksposur hukum, sentimen komunikasi, dan prediksi kebutuhan layanan berikutnya. Kelola hubungan klien dan riwayat konsultasi dalam satu tempat terenkripsi.",
    features: [
      "Profil risiko hukum klien",
      "Riwayat perkara terintegrasi",
      "Analisis sentimen komunikasi",
      "Prediksi kebutuhan layanan",
    ],
  },
  {
    id: "billing",
    icon: Clock,
    emoji: "⏱️",
    title: "Manajemen Waktu & Tagihan",
    subtitle: "Time Tracking Otomatis berbasis AI",
    color: "from-indigo-600 to-violet-700",
    glow: "shadow-indigo-500/30",
    border: "border-indigo-500/20 hover:border-indigo-500/40",
    desc: "AI mendeteksi dan mencatat aktivitas hukum otomatis — riset, drafting, pertemuan klien — lalu menyusun tagihan profesional dengan breakdown hourly rate. Analisis profitabilitas per perkara dan per klien secara real-time.",
    features: [
      "Time tracking otomatis AI",
      "Invoice klien satu klik",
      "Analisis profitabilitas perkara",
      "Laporan keuangan kantor",
    ],
  },
  {
    id: "strategy",
    icon: Target,
    emoji: "🎯",
    title: "Strategi Hukum AI",
    subtitle: "Prediksi Hasil & Rekomendasi Jalur",
    color: "from-red-600 to-rose-700",
    glow: "shadow-red-500/30",
    border: "border-red-500/20 hover:border-rose-500/40",
    desc: "Berdasarkan fakta perkara dan database 30.000+ putusan, AI memprediksi probabilitas menang/kalah, merekomendasikan strategi optimal (litigasi vs mediasi vs negosiasi), dan memetakan potensi risiko setiap jalur.",
    features: [
      "Probabilitas menang berbasis data",
      "Analisis cost-benefit strategi",
      "Rekomendasi mediasi vs litigasi",
      "Skenario what-if otomatis",
    ],
  },
  {
    id: "compliance",
    icon: Shield,
    emoji: "🛡️",
    title: "Radar Regulasi & Kepatuhan",
    subtitle: "Monitor Perubahan Hukum Real-Time",
    color: "from-slate-600 to-gray-700",
    glow: "shadow-slate-500/30",
    border: "border-slate-500/20 hover:border-slate-500/40",
    desc: "AI memantau 53+ regulasi Indonesia secara real-time dan mengirim alert ketika ada perubahan yang relevan dengan perkara aktif klien. Analisis dampak otomatis terhadap posisi hukum yang sedang berjalan.",
    features: [
      "Monitor 53+ regulasi aktif",
      "Alert dampak terhadap perkara",
      "Analisis KUHP Baru 2026",
      "Komparasi aturan lama vs baru",
    ],
  },
];

const WORKFLOW = [
  { time: "07:00", icon: Activity, title: "Morning Brief AI", desc: "OS merangkum semua perkara aktif, sidang hari ini, tenggat mendesak, dan perubahan regulasi semalam — disajikan dalam 2 menit baca.", color: "text-violet-400" },
  { time: "08:30", icon: Users, title: "Konsultasi Klien", desc: "AI menyiapkan ringkasan riwayat klien, konteks perkara, dan poin-poin diskusi yang perlu dibahas — sebelum pertemuan dimulai.", color: "text-blue-400" },
  { time: "10:00", icon: Search, title: "Riset Otomatis", desc: "AI mencari preseden, yurisprudensi, dan pasal relevan secara paralel — hasil riset 3 jam selesai dalam 8 menit.", color: "text-emerald-400" },
  { time: "11:30", icon: FileText, title: "Drafting Dokumen", desc: "AI menghasilkan draf gugatan pertama berdasarkan fakta yang diinput — advokat tinggal review, edit, dan finalisasi.", color: "text-amber-400" },
  { time: "14:00", icon: Gavel, title: "Persiapan Sidang", desc: "AI mensimulasikan argumen lawan, menyiapkan checklist bukti, dan memberikan strategi cross-examination berdasarkan profil hakim.", color: "text-pink-400" },
  { time: "17:00", icon: Clock, title: "Billing Otomatis", desc: "AI merekap semua aktivitas hari ini, menghitung jam kerja, dan menyiapkan draft invoice klien — tanpa input manual apapun.", color: "text-teal-400" },
];

const STATS = [
  { value: "73%", label: "Waktu riset dihemat", icon: TrendingUp },
  { value: "9", label: "Modul AI terintegrasi", icon: Layers },
  { value: "30K+", label: "Putusan terindeks", icon: Database },
  { value: "24/7", label: "OS aktif membantu", icon: Zap },
];

export default function AdvOkatOS() {
  const [activeModule, setActiveModule] = useState("command");
  const active = MODULES.find(m => m.id === activeModule) ?? MODULES[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold mb-6">
              <Cpu className="w-3.5 h-3.5" />
              Fitur Eksklusif Tier Advokat
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-foreground mb-4 leading-tight">
              Advokat OS
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sistem Operasi Pengacara
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Bukan sekadar AI chatbot. LexCom Advokat OS adalah sistem kecerdasan terpadu yang menjadi
              tulang punggung seluruh praktik hukum Anda — dari riset, drafting, strategi, hingga billing — semua terotomasi.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <Link href="/masuk">
                <button className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Aktifkan Advokat OS
                </button>
              </Link>
              <Link href="/harga">
                <button className="px-7 py-3.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 transition flex items-center gap-2">
                  Lihat Paket Advokat <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
                  <s.icon className="w-4 h-4 text-violet-400 mx-auto mb-1" />
                  <p className="text-2xl font-black text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── INTERACTIVE MODULE EXPLORER ─── */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-foreground mb-3">9 Modul AI Terintegrasi</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Setiap modul bekerja sendiri atau berkolaborasi — hasil satu modul otomatis menjadi input modul lain.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Module list */}
            <div className="lg:col-span-1 space-y-2">
              {MODULES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${
                    activeModule === m.id
                      ? `bg-gradient-to-r ${m.color} border-transparent text-white shadow-lg ${m.glow}`
                      : `bg-white/3 ${m.border} text-muted-foreground hover:text-foreground`
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{m.emoji}</span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${activeModule === m.id ? "text-white" : ""}`}>{m.title}</p>
                    <p className={`text-[10px] truncate ${activeModule === m.id ? "text-white/75" : "text-muted-foreground/70"}`}>{m.subtitle}</p>
                  </div>
                  {activeModule === m.id && <ChevronRight className="w-4 h-4 flex-shrink-0 ml-auto" />}
                </button>
              ))}
            </div>

            {/* Module detail */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className={`h-full rounded-3xl border bg-gradient-to-br ${active.color} p-1`}
                >
                  <div className="h-full bg-card/90 backdrop-blur-sm rounded-[20px] p-8 flex flex-col justify-between min-h-[380px]">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${active.color} flex items-center justify-center shadow-lg text-2xl`}>
                          {active.emoji}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-foreground">{active.title}</h3>
                          <p className="text-xs text-muted-foreground">{active.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-6 text-sm">{active.desc}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Fitur Modul</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {active.features.map((f) => (
                          <div key={f} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground/85">{f}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex gap-3">
                        <Link href="/masuk">
                          <button className={`text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r ${active.color} text-white flex items-center gap-1.5 shadow-md`}>
                            Coba Modul Ini <ArrowRight className="w-3 h-3" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DAY IN THE LIFE WORKFLOW ─── */}
      <section className="py-16 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold mb-4">
              <Play className="w-3 h-3" /> Sehari dengan Advokat OS
            </div>
            <h2 className="text-3xl font-black text-foreground mb-3">Satu Hari, Tanpa Kerja Manual</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Lihat bagaimana Advokat OS mengotomasi seluruh alur kerja harian seorang pengacara profesional.</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[60px] top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-purple-500/30 to-transparent hidden sm:block" />

            <div className="space-y-6">
              {WORKFLOW.map((step, i) => (
                <motion.div
                  key={step.time}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 flex flex-col items-center sm:w-[120px]">
                    <div className={`w-10 h-10 rounded-xl bg-card border border-white/10 flex items-center justify-center z-10`}>
                      <step.icon className={`w-4 h-4 ${step.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground mt-1">{step.time}</span>
                  </div>
                  <div className="flex-1 rounded-2xl border border-white/8 bg-white/3 px-5 py-4 hover:border-white/15 transition-colors">
                    <p className="font-bold text-foreground text-sm mb-1">{step.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIFFERENTIATORS ─── */}
      <section className="py-16 border-t border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-foreground mb-3">Mengapa Advokat OS Berbeda?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Bukan tool terpisah. Bukan chatbot biasa. Ini sistem operasi yang semua modulnya saling terhubung.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Network,
                title: "Modul Saling Terhubung",
                desc: "Hasil riset yurisprudensi langsung menjadi referensi di Legal Brief Generator. Analisis bukti otomatis memperkuat strategi persidangan. Tidak perlu copy-paste manual.",
                color: "text-violet-400",
                bg: "bg-violet-500/10",
              },
              {
                icon: Brain,
                title: "Belajar dari Praktik Anda",
                desc: "OS mempelajari pola kerja, preferensi argumen, dan gaya drafting Anda — semakin lama dipakai, semakin personal dan akurat outputnya.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                icon: Lock,
                title: "Keamanan Data Advokat",
                desc: "Semua data perkara, klien, dan dokumen dienkripsi end-to-end dan tersimpan di server Indonesia. Kepatuhan penuh pada kerahasiaan profesi advokat (Pasal 19 UU Advokat).",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Globe,
                title: "Cakupan Semua Pengadilan",
                desc: "Dari Pengadilan Negeri kelas I sampai Mahkamah Agung — format dokumen, referensi hukum, dan yurisprudensi disesuaikan secara otomatis berdasarkan tingkat peradilan.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
              {
                icon: Zap,
                title: "Respons Real-Time",
                desc: "Tidak ada loading lama. Streaming AI menghasilkan draf hukum kata per kata secara langsung — respons terasa seperti bekerja dengan asisten peneliti bergelar S3 hukum.",
                color: "text-pink-400",
                bg: "bg-pink-500/10",
              },
              {
                icon: BarChart3,
                title: "Analitik Kinerja Kantor",
                desc: "Pantau profitabilitas per klien, per jenis perkara, per pengacara. Identifikasi klien paling menguntungkan dan optimalkan strategi bisnis kantor hukum Anda.",
                color: "text-teal-400",
                bg: "bg-teal-500/10",
              },
            ].map((item) => (
              <div key={item.title} className={`rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-colors p-6`}>
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTEGRATION WITH LEXCOM ─── */}
      <section className="py-16 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-foreground mb-3">Terintegrasi Penuh dengan Ekosistem LexCom</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">Advokat OS bukan produk tersendiri — ini lapisan kecerdasan di atas seluruh ekosistem LexCom yang sudah ada.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "53+ Regulasi",         icon: "📜", href: "/peraturan",           desc: "Database peraturan" },
              { label: "30K+ Putusan",         icon: "🏛️", href: "/putusan",             desc: "Yurisprudensi MA" },
              { label: "Peta Preseden",         icon: "🗺️", href: "/peta-preseden",       desc: "Analisis hakim" },
              { label: "Intelijen Regulasi",   icon: "📊", href: "/intelijen-regulasi",  desc: "Monitor real-time" },
              { label: "Telaah Dokumen",       icon: "🔬", href: "/telaah-dokumen",      desc: "Analisis kontrak" },
              { label: "19 Pakar Hukum AI",    icon: "⚖️", href: "/agents",              desc: "Spesialis hukum" },
              { label: "Penulis Cerdas",       icon: "✍️", href: "/penulis-cerdas",      desc: "Studio penulisan" },
              { label: "Chaesa Lexbot",        icon: "✨", href: "/lexbot",              desc: "Asisten utama" },
            ].map((item) => (
              <Link key={item.label} href={item.href}>
                <div className="rounded-2xl border border-white/8 bg-white/3 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all p-4 cursor-pointer group">
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <p className="text-xs font-bold text-foreground group-hover:text-violet-300 transition-colors leading-tight">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-background to-purple-950/30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold mb-6">
            <Star className="w-3.5 h-3.5 fill-violet-400" />
            Tersedia di Paket Advokat — Rp499.000/bulan
          </div>
          <h2 className="text-4xl font-black text-foreground mb-4">
            Transformasi Praktik Hukum Anda
            <br />
            <span className="text-violet-400">Mulai Hari Ini</span>
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Bergabunglah dengan ratusan advokat yang telah menghemat 73% waktu riset dan meningkatkan kapasitas penanganan perkara — tanpa menambah staf.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/masuk">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold hover:from-violet-500 hover:to-purple-500 transition-all shadow-xl shadow-violet-500/30 flex items-center gap-2 justify-center">
                <Sparkles className="w-5 h-5" /> Aktifkan Advokat OS Sekarang
              </button>
            </Link>
            <Link href="/harga">
              <button className="px-8 py-4 rounded-xl border border-white/15 text-foreground font-semibold hover:bg-white/5 transition flex items-center gap-2 justify-center">
                Bandingkan Semua Paket <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Garansi uang kembali 7 hari · Tanpa kontrak jangka panjang · Aktif instan
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
