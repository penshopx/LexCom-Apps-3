import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, BookOpen, Brain, Target, Clock, CheckCircle2,
  ChevronRight, ArrowRight, Sparkles, FileText, BarChart3,
  Star, Zap, Shield, Trophy, PlayCircle, Layers, PenLine,
  Users, Calendar, TrendingUp, AlertCircle, Lock,
} from "lucide-react";

const UPA_SUBJECTS = [
  { id: "kuhp", label: "KUHP & KUHAP", emoji: "⚖️", soal: 120, color: "from-violet-600 to-purple-700", pct: 88, desc: "Hukum Pidana Materiil & Formil, KUHP Baru UU No.1/2023" },
  { id: "perdata", label: "KUHPerdata & HAPer", emoji: "📜", soal: 95, color: "from-blue-600 to-cyan-700", pct: 74, desc: "Hukum Perdata Materiil & Acara Perdata" },
  { id: "htn", label: "Hukum Tata Negara", emoji: "🏛️", soal: 68, color: "from-emerald-600 to-green-700", pct: 60, desc: "UUD 1945, Kelembagaan Negara, Hukum Administrasi Negara" },
  { id: "dagang", label: "Hukum Dagang", emoji: "💼", soal: 80, color: "from-amber-600 to-orange-700", pct: 71, desc: "PT, Kepailitan, Perbankan, Pasar Modal, PKPU" },
  { id: "perburuhan", label: "Hukum Ketenagakerjaan", emoji: "🏗️", soal: 72, color: "from-red-600 to-rose-700", pct: 55, desc: "UU Ketenagakerjaan, PHI, Hubungan Industrial" },
  { id: "etika", label: "Etika Profesi Advokat", emoji: "🎓", soal: 85, color: "from-pink-600 to-rose-600", pct: 92, desc: "Kode Etik Advokat Indonesia, UU No. 18/2003" },
  { id: "pajak", label: "Hukum Pajak & Adat", emoji: "📋", soal: 60, color: "from-teal-600 to-cyan-700", pct: 48, desc: "Hukum Pajak, Hukum Adat, Perlindungan Konsumen" },
  { id: "internasional", label: "Hukum Internasional", emoji: "🌐", soal: 50, color: "from-indigo-600 to-blue-700", pct: 40, desc: "Hukum Perjanjian Internasional, Arbitrase Internasional" },
];

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    subject: "Etika Profesi",
    difficulty: "Menengah",
    diffColor: "text-amber-400",
    q: "Seorang advokat yang sebelumnya pernah menjadi hakim di Pengadilan Negeri Jakarta Pusat hendak menerima perkara yang pernah ia tangani saat menjadi hakim. Berdasarkan Kode Etik Advokat Indonesia, tindakan yang paling tepat adalah...",
    options: [
      "A. Menerima perkara tersebut karena sudah tidak menjabat sebagai hakim",
      "B. Menolak perkara tersebut karena berpotensi menimbulkan konflik kepentingan",
      "C. Menerima perkara dengan syarat mendapat izin dari PERADI",
      "D. Menerima perkara asal klien menandatangani surat pernyataan",
    ],
    answer: 1,
    explanation: "Kode Etik Advokat Indonesia Pasal 4 huruf j melarang advokat merangkap jabatan yang bertentangan dengan kepentingan tugas dan martabat profesinya. Mantan hakim yang menerima perkara yang pernah ditanganinya sendiri berpotensi menimbulkan konflik kepentingan yang melanggar prinsip independensi advokat.",
  },
  {
    id: 2,
    subject: "KUHP Baru 2026",
    difficulty: "Mahir",
    diffColor: "text-red-400",
    q: "Berdasarkan KUHP Baru (UU No. 1/2023) yang berlaku per 2 Januari 2026, ketentuan 'living law' (hukum yang hidup dalam masyarakat) diatur dalam...",
    options: [
      "A. Pasal 1 ayat (3) KUHP Baru sebagai pengecualian asas legalitas",
      "B. Pasal 2 ayat (1) KUHP Baru yang memungkinkan penerapan hukum adat",
      "C. Pasal 6 KUHP Baru sebagai sumber hukum pidana tambahan",
      "D. Pasal 12 KUHP Baru sebagai dasar pemidanaan alternatif",
    ],
    answer: 1,
    explanation: "Pasal 2 ayat (1) KUHP Baru menyatakan bahwa ketentuan pidana dalam peraturan perundang-undangan berlaku juga bagi hukum yang hidup dalam masyarakat (living law) yang menentukan bahwa seseorang patut dipidana walaupun perbuatan tersebut tidak diatur dalam peraturan perundang-undangan. Ini merupakan salah satu terobosan penting KUHP Baru yang mengakui hukum adat.",
  },
  {
    id: 3,
    subject: "Hukum Acara Perdata",
    difficulty: "Pemula",
    diffColor: "text-emerald-400",
    q: "Dalam perkara perdata, tenggang waktu untuk mengajukan permohonan banding setelah putusan Pengadilan Negeri diucapkan adalah...",
    options: [
      "A. 7 hari kalender",
      "B. 14 hari kalender",
      "C. 14 hari kerja",
      "D. 21 hari kalender",
    ],
    answer: 1,
    explanation: "Berdasarkan Pasal 7 ayat (1) Undang-Undang Nomor 20 Tahun 1947 tentang Peradilan Ulangan (Banding), tenggang waktu untuk mengajukan permohonan banding adalah 14 hari kalender terhitung sejak putusan diucapkan atau diberitahukan kepada yang tidak hadir.",
  },
];

const SOP_LIBRARY = [
  { icon: "📋", title: "SOP Konsultan Hukum", desc: "7 bagian SOP lengkap untuk konsultan hukum profesional — intake klien, due diligence, pelaporan.", badge: "Populer", items: 24 },
  { icon: "🤝", title: "SOP Lawyer Retainer", desc: "Sistem kerja retainer dari negosiasi fee, perjanjian, pelaporan bulanan, hingga perpanjangan.", badge: "Baru", items: 18 },
  { icon: "⚖️", title: "SOP Litigasi", desc: "Alur persidangan lengkap dari gugatan hingga eksekusi — PN, PT, MA, MK.", badge: null, items: 31 },
  { icon: "📝", title: "SOP Pendampingan Klien", desc: "Protokol komunikasi, update perkembangan perkara, dan manajemen ekspektasi klien.", badge: null, items: 12 },
  { icon: "💼", title: "SOP Due Diligence Bisnis", desc: "Standar audit hukum perusahaan: legal review, analisis kontrak, penilaian risiko.", badge: null, items: 16 },
  { icon: "🏦", title: "SOP Restrukturisasi & PKPU", desc: "Langkah-langkah PKPU, homologasi rencana perdamaian, dan monitoring eksekusi.", badge: null, items: 20 },
];

const RETAINER_MODULES = [
  { icon: "🧮", title: "Kalkulator Fee Retainer", desc: "Hitung tarif retainer optimal berdasarkan lingkup layanan, volume perkara, dan standar pasar.", cta: "Hitung Sekarang" },
  { icon: "📄", title: "Generator Perjanjian Retainer", desc: "AI membuat draf perjanjian retainer profesional dengan klausul perlindungan hukum yang tepat.", cta: "Buat Perjanjian" },
  { icon: "📊", title: "Template Laporan Bulanan", desc: "Template laporan kerja bulanan kepada klien retainer — terstruktur, profesional, siap kirim.", cta: "Unduh Template" },
  { icon: "📅", title: "Jadwal Layanan Retainer", desc: "Rancang scope layanan: berapa jam konsultasi, jenis dokumen yang tercakup, respons time.", cta: "Rancang Sekarang" },
];

const ROADMAP_WEEKS = [
  { week: "Minggu 1–2", focus: "Fondasi Hukum Pidana", tasks: ["KUHP Baru UU 1/2023 (living law, pemidanaan)", "KUHAP & hukum acara pidana", "Latihan soal 80 soal"], done: true },
  { week: "Minggu 3–4", focus: "Hukum Perdata & Acara", tasks: ["KUHPerdata: perikatan, benda, waris", "Hukum Acara Perdata: gugatan hingga eksekusi", "Latihan soal 80 soal"], done: true },
  { week: "Minggu 5–6", focus: "Hukum Publik", tasks: ["Hukum Tata Negara & HAN", "Hukum Administrasi Negara", "Latihan soal 60 soal"], done: false },
  { week: "Minggu 7–8", focus: "Hukum Bisnis & Khusus", tasks: ["Hukum Dagang, Kepailitan, PKPU", "Hukum Ketenagakerjaan & PHI", "Latihan soal 80 soal"], done: false },
  { week: "Minggu 9–10", focus: "Etika & Praktek Advokat", tasks: ["Kode Etik Advokat Indonesia", "UU Advokat No. 18/2003", "Latihan soal 85 soal"], done: false },
  { week: "Minggu 11–12", focus: "Simulasi Ujian Penuh", tasks: ["3 sesi mock exam (3 jam/sesi)", "Review kesalahan dengan AI", "Final review materi lemah"], done: false },
];

export default function AkademiAdvokat() {
  const [activeQ, setActiveQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeTab, setActiveTab] = useState<"upa" | "sop" | "retainer" | "roadmap">("upa");

  const question = SAMPLE_QUESTIONS[activeQ];

  function handleAnswer(idx: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setTimeout(() => setShowExplanation(true), 400);
  }

  function nextQuestion() {
    setActiveQ((p) => (p + 1) % SAMPLE_QUESTIONS.length);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-600/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-6">
              <GraduationCap className="w-3.5 h-3.5" />
              Pendidikan & Pengembangan Profesional Hukum
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-foreground mb-4 leading-tight">
              Akademi Advokat
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                LexCom
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Dari persiapan Ujian Profesi Advokat (UPA) hingga membangun sistem kerja retainer profesional —
              semua dibantu AI secara adaptif, terstruktur, dan terukur.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
              {[
                { val: "680+", label: "Latihan Soal UPA", icon: Brain },
                { val: "8", label: "Bidang Hukum", icon: BookOpen },
                { val: "6+", label: "SOP Profesional", icon: FileText },
                { val: "12W", label: "Roadmap Terstruktur", icon: Calendar },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/8 bg-white/4 p-3 text-center">
                  <s.icon className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-xl font-black text-foreground">{s.val}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveTab("upa")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" /> Mulai Latihan Soal
              </button>
              <button
                onClick={() => setActiveTab("roadmap")}
                className="px-6 py-3 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 transition flex items-center gap-2"
              >
                Lihat Roadmap 12 Minggu <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TAB NAV ─── */}
      <section className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-white/8">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 py-2">
          {[
            { id: "upa", label: "🎓 UPA Prep", desc: "Latihan soal adaptif" },
            { id: "sop", label: "📋 SOP Library", desc: "SOP siap pakai" },
            { id: "retainer", label: "🤝 Retainer Builder", desc: "Sistem retainer AI" },
            { id: "roadmap", label: "🗺️ Roadmap", desc: "12 minggu terstruktur" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <span className="block">{t.label}</span>
              <span className="hidden sm:block text-[10px] font-normal opacity-70">{t.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── TAB CONTENT ─── */}
      <div className="flex-1">
        <AnimatePresence mode="wait">

          {/* UPA PREP TAB */}
          {activeTab === "upa" && (
            <motion.div key="upa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Subject grid */}
              <section className="py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-2xl font-black text-foreground mb-2">8 Bidang UPA</h2>
                  <p className="text-muted-foreground mb-8 text-sm">Pilih topik untuk mulai latihan. Progress Anda tersimpan otomatis.</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {UPA_SUBJECTS.map((s) => (
                      <motion.div
                        key={s.id}
                        whileHover={{ y: -4 }}
                        className="rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all p-5 cursor-pointer group"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3`}>
                          {s.emoji}
                        </div>
                        <h3 className="font-bold text-foreground text-sm mb-1">{s.label}</h3>
                        <p className="text-[11px] text-muted-foreground mb-3 leading-snug">{s.desc}</p>
                        <div className="mb-1 flex justify-between items-center">
                          <span className="text-[10px] text-muted-foreground">{s.soal} soal</span>
                          <span className="text-[10px] font-bold text-emerald-400">{s.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${s.color}`} style={{ width: `${s.pct}%` }} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Interactive question demo */}
              <section className="py-10 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-black text-foreground">Latihan Soal Interaktif</h2>
                      <p className="text-xs text-muted-foreground">AI memberikan penjelasan mendalam setelah setiap jawaban</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {activeQ + 1} / {SAMPLE_QUESTIONS.length}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-card/60 p-6">
                    {/* Question header */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 ${question.diffColor}`}>
                        {question.difficulty}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{question.subject}</span>
                    </div>

                    <p className="text-sm text-foreground leading-relaxed mb-6">{question.q}</p>

                    {/* Options */}
                    <div className="space-y-2 mb-4">
                      {question.options.map((opt, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrect = idx === question.answer;
                        const revealed = selectedAnswer !== null;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-all ${
                              !revealed
                                ? "border-white/10 bg-white/3 hover:border-emerald-500/40 hover:bg-emerald-500/5"
                                : isCorrect
                                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                                : isSelected
                                ? "border-red-500/50 bg-red-500/10 text-red-300"
                                : "border-white/8 bg-white/2 text-muted-foreground"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-400">Penjelasan AI</span>
                          </div>
                          <p className="text-sm text-foreground/85 leading-relaxed">{question.explanation}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Tingkat kesulitan meningkat sesuai kemampuan</span>
                      {selectedAnswer !== null && (
                        <button
                          onClick={nextQuestion}
                          className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                        >
                          Soal Berikutnya <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <Link href="/masuk">
                      <button className="text-sm font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                        Daftar untuk akses 680+ soal lengkap →
                      </button>
                    </Link>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* SOP LIBRARY TAB */}
          {activeTab === "sop" && (
            <motion.div key="sop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <section className="py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-foreground mb-2">SOP Library — Siap Pakai</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                      SOP profesional yang telah digunakan ratusan advokat. Bukan sekadar template — AI menyesuaikan dengan profil kantor hukum Anda.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {SOP_LIBRARY.map((sop) => (
                      <motion.div
                        key={sop.title}
                        whileHover={{ y: -3 }}
                        className="rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 p-6 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-2xl">{sop.icon}</span>
                          {sop.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sop.badge === "Populer" ? "bg-violet-500/20 text-violet-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                              {sop.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-foreground mb-1.5 text-sm">{sop.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{sop.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">{sop.items} dokumen</span>
                          <button className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                            Gunakan AI <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 to-teal-950/40 p-8 text-center">
                    <h3 className="text-lg font-black text-foreground mb-2">Butuh SOP Kustom untuk Kantor Hukum Anda?</h3>
                    <p className="text-sm text-muted-foreground mb-4">AI kami dapat membuat SOP khusus berdasarkan profil kantor, spesialisasi bidang hukum, dan alur kerja yang sudah berjalan.</p>
                    <Link href="/penulis-cerdas">
                      <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm flex items-center gap-2 mx-auto">
                        <PenLine className="w-4 h-4" /> Buat SOP Kustom dengan AI
                      </button>
                    </Link>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* RETAINER BUILDER TAB */}
          {activeTab === "retainer" && (
            <motion.div key="retainer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <section className="py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold mb-4">
                      <Star className="w-3 h-3 fill-amber-400" />
                      Pendapatan Bulanan Stabil untuk Advokat
                    </div>
                    <h2 className="text-2xl font-black text-foreground mb-2">Retainer Builder AI</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                      Bangun sistem kerja Lawyer Retainer dari nol hingga kontrak berjalan — semuanya dipandu AI. Dari penentuan fee, perjanjian, SOP, hingga laporan bulanan.
                    </p>
                  </div>

                  {/* Value proposition */}
                  <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 mb-8">
                    <div className="grid sm:grid-cols-3 gap-6 text-center">
                      {[
                        { val: "Rp5–25jt", label: "Kisaran fee retainer/bulan", sub: "berdasarkan data pasar" },
                        { val: "3–5", label: "Klien retainer ideal", sub: "untuk stabilitas pendapatan" },
                        { val: "70%", label: "Waktu lebih efisien", sub: "vs model per-perkara" },
                      ].map((s) => (
                        <div key={s.label}>
                          <p className="text-2xl font-black text-amber-400">{s.val}</p>
                          <p className="text-sm font-bold text-foreground">{s.label}</p>
                          <p className="text-[11px] text-muted-foreground">{s.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Retainer modules */}
                  <div className="grid sm:grid-cols-2 gap-5 mb-8">
                    {RETAINER_MODULES.map((m) => (
                      <div key={m.title} className="rounded-2xl border border-white/8 bg-white/3 hover:border-amber-500/20 transition-all p-5 flex gap-4">
                        <span className="text-2xl flex-shrink-0">{m.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground text-sm mb-1">{m.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{m.desc}</p>
                          <Link href="/masuk">
                            <button className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                              {m.cta} <ArrowRight className="w-3 h-3" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Step-by-step retainer builder preview */}
                  <div className="rounded-3xl border border-white/10 bg-card/50 p-6">
                    <h3 className="font-black text-foreground mb-5">Langkah Membangun Sistem Retainer</h3>
                    <div className="space-y-4">
                      {[
                        { step: "01", title: "Tentukan Scope Layanan", desc: "Jenis layanan yang dicakup: konsultasi, review dokumen, negosiasi, atau representasi penuh", done: true },
                        { step: "02", title: "Hitung Fee dengan AI", desc: "Masukkan estimasi jam kerja, kompleksitas, dan profil klien — AI menyarankan kisaran fee optimal", done: true },
                        { step: "03", title: "Generate Perjanjian Retainer", desc: "AI membuat draf perjanjian lengkap dengan klausul kerahasiaan, lingkup kerja, dan dispute resolution", done: false },
                        { step: "04", title: "Susun SOP Komunikasi", desc: "Template laporan bulanan, protokol respons, dan format update perkembangan untuk klien", done: false },
                        { step: "05", title: "Sistem Billing Otomatis", desc: "Integrasi dengan Advokat OS untuk time tracking dan invoice otomatis setiap bulan", done: false },
                      ].map((s) => (
                        <div key={s.step} className="flex gap-4 items-start">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${s.done ? "bg-emerald-500/20 text-emerald-400" : "bg-white/8 text-muted-foreground"}`}>
                            {s.done ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{s.title}</p>
                            <p className="text-xs text-muted-foreground">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex gap-3">
                      <Link href="/masuk">
                        <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm flex items-center gap-2">
                          <Zap className="w-4 h-4" /> Mulai Retainer Builder
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* ROADMAP TAB */}
          {activeTab === "roadmap" && (
            <motion.div key="roadmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-foreground mb-2">Roadmap Lulus UPA — 12 Minggu</h2>
                    <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                      Belajar terstruktur, bukan acak. Setiap minggu ada fokus materi, target soal, dan checkpoint AI.
                    </p>
                  </div>

                  {/* Progress overview */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { label: "Minggu Selesai", val: "2/12", color: "text-emerald-400" },
                      { label: "Soal Dikerjakan", val: "160/680", color: "text-blue-400" },
                      { label: "Estimasi Kesiapan", val: "38%", color: "text-amber-400" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-2xl border border-white/8 bg-white/3 p-4 text-center">
                        <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Weekly roadmap */}
                  <div className="space-y-4">
                    {ROADMAP_WEEKS.map((week, i) => (
                      <motion.div
                        key={week.week}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        className={`rounded-2xl border p-5 ${week.done ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/8 bg-white/2"}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${week.done ? "bg-emerald-500/20" : "bg-white/8"}`}>
                            {week.done
                              ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              : <span className="text-xs font-black text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-muted-foreground">{week.week}</span>
                              <span className="text-sm font-black text-foreground">{week.focus}</span>
                              {week.done && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Selesai</span>}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {week.tasks.map((t) => (
                                <span key={t} className="text-xs text-muted-foreground flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          {!week.done && (
                            <button className="flex-shrink-0 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                              Mulai <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Link href="/masuk">
                      <button className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm flex items-center gap-2 mx-auto shadow-lg shadow-emerald-500/20">
                        <Target className="w-4 h-4" /> Mulai Roadmap Saya
                      </button>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-2">AI menyesuaikan roadmap berdasarkan kecepatan belajar dan nilai latihan Anda</p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ─── CTA ─── */}
      <section className="py-16 border-t border-white/8 bg-gradient-to-b from-background to-emerald-950/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-foreground mb-3">
            Investasi Terbaik untuk Karir Hukum Anda
          </h2>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            Bergabunglah dengan ribuan calon advokat dan advokat aktif yang menggunakan LexCom Akademi untuk lulus UPA, membangun sistem retainer, dan mengembangkan praktik profesional mereka.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/masuk">
              <button className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Daftar Gratis Sekarang
              </button>
            </Link>
            <Link href="/harga">
              <button className="px-7 py-3.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 transition flex items-center gap-2">
                Lihat Paket Lengkap <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
