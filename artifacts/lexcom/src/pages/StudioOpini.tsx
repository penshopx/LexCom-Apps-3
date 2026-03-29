import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Sparkles, ChevronRight, ArrowRight, Brain, CheckCircle2,
  Zap, Shield, Star, Clock, Download, Copy, RotateCcw, PenLine,
  Briefcase, Building2, Scale, Users, Gavel, Globe, BookOpen,
} from "lucide-react";

const OPINI_CATEGORIES = [
  { id: "korporasi", emoji: "🏢", label: "Korporasi & Bisnis", desc: "M&A, due diligence, struktur holding, joint venture, GCG", color: "from-blue-600 to-cyan-700", examples: ["Legalitas akuisisi saham mayoritas", "Struktur holding optimal untuk grup usaha", "Due diligence pra-akuisisi perusahaan"] },
  { id: "properti", emoji: "🏠", label: "Properti & Real Estate", desc: "HGB, HGU, SHM, PPJB, sengketa tanah, perizinan", color: "from-emerald-600 to-green-700", examples: ["Legalitas PPJB apartemen off-plan", "Konversi HGU menjadi SHGB", "Sengketa batas tanah warisan"] },
  { id: "ketenagakerjaan", emoji: "👷", label: "Ketenagakerjaan", desc: "PHK, PKWT, outsourcing, serikat pekerja, pesangon", color: "from-orange-600 to-amber-700", examples: ["Legalitas PHK efisiensi massal", "Klausul non-kompetisi dalam kontrak kerja", "Kewajiban hukum alih daya (outsourcing)"] },
  { id: "pajak", emoji: "🧾", label: "Hukum Pajak", desc: "Sengketa pajak, banding Pengadilan Pajak, kepabeanan", color: "from-violet-600 to-purple-700", examples: ["Dasar hukum banding PPh Badan", "Sengketa bea masuk kepabeanan", "Transfer pricing dan risiko pajak"] },
  { id: "pidana", emoji: "⚖️", label: "Pidana Bisnis", desc: "Korupsi, fraud, tindak pidana korporasi, TPPU", color: "from-red-600 to-rose-700", examples: ["Tanggung jawab pidana direksi atas korupsi", "Analisis unsur TPPU dalam transaksi bisnis", "Dakwaan fraud pengadaan barang/jasa"] },
  { id: "kontrak", emoji: "📝", label: "Kontrak & Perjanjian", desc: "Review kontrak, force majeure, wanprestasi, penalti", color: "from-pink-600 to-rose-600", examples: ["Klausul penalti dalam kontrak konstruksi", "Force majeure pasca pandemi dalam kontrak", "Analisis risiko kontrak EPC proyek infrastruktur"] },
];

const OPINI_STEPS = [
  { id: 1, label: "Pilih Bidang", desc: "Tentukan area hukum" },
  { id: 2, label: "Input Fakta", desc: "Uraikan duduk perkara" },
  { id: 3, label: "Isu Hukum", desc: "Identifikasi pertanyaan" },
  { id: 4, label: "Generate", desc: "AI analisis mendalam" },
  { id: 5, label: "Hasil Opini", desc: "Dokumen profesional" },
];

const SAMPLE_OPINI = {
  judul: "Opini Hukum: Legalitas Klausul Non-Kompetisi dalam Perjanjian Kerja",
  tanggal: "29 Maret 2026",
  bidang: "Hukum Ketenagakerjaan",
  sections: [
    {
      title: "I. POKOK PERMASALAHAN",
      content: "Apakah klausul non-kompetisi (non-compete clause) yang melarang pekerja bekerja di perusahaan sejenis selama 2 (dua) tahun setelah pemutusan hubungan kerja dapat diterapkan dan mengikat secara hukum di Indonesia?",
    },
    {
      title: "II. DASAR HUKUM",
      content: "1. Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan jo. UU No. 11/2020 Cipta Kerja\n2. KUH Perdata Pasal 1320 (syarat sah perjanjian) dan Pasal 1338\n3. Putusan MA No. 2498 K/Pdt/2018 tentang pembatasan kebebasan bekerja\n4. Surat Edaran Menaker tentang perjanjian kerja yang memuat klausul pembatasan",
    },
    {
      title: "III. ANALISIS HUKUM",
      content: "Berdasarkan kajian mendalam terhadap peraturan perundang-undangan yang berlaku:\n\n**A. Posisi Hukum Indonesia**\nIndonesia tidak memiliki regulasi khusus yang secara eksplisit melarang atau memperbolehkan non-compete clause. Namun, berdasarkan Pasal 1320 KUH Perdata, klausul ini dapat berlaku jika memenuhi syarat sahnya perjanjian: kesepakatan, kecakapan, hal tertentu, dan sebab yang halal.\n\n**B. Batasan Konstitusional**\nMahkamah Konstitusi dalam Putusan No. 012/PUU-I/2003 menegaskan bahwa setiap orang berhak mendapatkan imbalan dan perlakuan yang adil dan layak dalam hubungan kerja. Klausul yang terlalu membatasi hak mencari nafkah berpotensi bertentangan dengan hak konstitusional.\n\n**C. Syarat Validitas**\nUntuk dapat diterapkan, non-compete clause harus memenuhi: (i) jangka waktu yang wajar (umumnya maks. 1 tahun), (ii) cakupan geografis yang spesifik, (iii) kompensasi yang memadai kepada pekerja, dan (iv) tidak bertentangan dengan kepentingan umum.",
    },
    {
      title: "IV. KESIMPULAN & REKOMENDASI",
      content: "Klausul non-kompetisi selama 2 (dua) tahun tanpa kompensasi tambahan berpotensi tidak dapat ditegakkan secara hukum di Indonesia karena:\n\n1. Melampaui batas waktu yang dianggap wajar berdasarkan praktik yurisprudensi\n2. Tidak disertai kompensasi yang memadai sebagai imbalan pembatasan\n3. Berpotensi melanggar hak konstitusional pekerja\n\n**Rekomendasi:** Revisi klausul menjadi maksimal 12 bulan, sertakan kompensasi garden leave sebesar 50-100% gaji terakhir, dan batasi pada perusahaan kompetitor langsung dalam wilayah geografis tertentu.",
    },
  ],
};

const PRICE_COMPARISON = [
  { label: "Opini Hukum Firma Besar", price: "Rp 5–25 jt", per: "per opini", color: "text-red-400", icon: "🏢" },
  { label: "Konsultan Hukum Independen", price: "Rp 2–5 jt", per: "per opini", color: "text-orange-400", icon: "👤" },
  { label: "LexCom Studio Opini AI", price: "Rp 199rb/bln", per: "tak terbatas", color: "text-emerald-400", icon: "⚡", highlight: true },
];

const FAQ_STUDIO = [
  { q: "Apakah opini hukum yang dihasilkan AI dapat langsung digunakan secara resmi?", a: "Opini hukum dari Studio Opini AI berfungsi sebagai kerangka analisis profesional yang sangat lengkap dan siap dipakai. Untuk keperluan formal (pengajuan ke pengadilan, pihak ketiga, atau klien institusional), disarankan untuk ditinjau dan ditandatangani oleh advokat terdaftar sebagai advisor. Produk AI LexCom adalah alat bantu, bukan pengganti tanggung jawab hukum advokat." },
  { q: "Apakah fakta perkara saya aman dan terjaga kerahasiaannya?", a: "Ya. Seluruh data yang Anda masukkan di Studio Opini dienkripsi end-to-end dengan AES-256. LexCom tidak menyimpan data perkara klien untuk melatih AI, tidak membagikan data ke pihak ketiga, dan seluruh sesi dapat dihapus permanen kapan saja dari akun Anda." },
  { q: "Berapa lama proses generate opini hukum?", a: "Rata-rata 60–120 detik untuk opini standar 4–6 halaman. Opini yang membutuhkan analisis lintas-bidang atau melibatkan yurisprudensi yang kompleks mungkin memerlukan 2–4 menit. Semua proses berjalan di background — Anda akan mendapat notifikasi ketika selesai." },
  { q: "Apakah AI dapat membuat opini dalam format bilingual (Indonesia-Inggris)?", a: "Ya, Studio Opini AI mendukung output bilingual (Bahasa Indonesia dan Bahasa Inggris) untuk kebutuhan transaksi internasional, kontrak lintas batas, atau arbitrase internasional. Pilih opsi bahasa di langkah Generate sebelum proses dimulai." },
  { q: "Berapa banyak opini yang bisa dibuat per bulan?", a: "Paket Gratis: 3 opini/bulan (dengan watermark). Paket Starter: 15 opini/bulan. Paket Pro: tak terbatas. Paket Advokat: tak terbatas + fitur kolaborasi tim dan branding firma hukum pada output opini." },
];

function StudioOpiniFaq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_STUDIO.map((faq, i) => (
        <motion.div key={i} className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-foreground leading-snug">{faq.q}</span>
            <ChevronRight className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-3">{faq.a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

export default function StudioOpini() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fakta, setFakta] = useState("");
  const [pertanyaan, setPertanyaan] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowSample(true);
      setStep(5);
    }, 2200);
  }

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/25 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold mb-6">
              <FileText className="w-3.5 h-3.5" />
              Opini Hukum Profesional — Dipercepat AI
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-foreground mb-4 leading-tight">
              Studio Opini Hukum
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                AI
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
              Opini hukum setara firma hukum kelas satu — dalam hitungan menit, bukan minggu.
              Tanpa antrean, tanpa biaya Rp 5 juta per dokumen.
            </p>

            {/* Price comparison */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {PRICE_COMPARISON.map((p) => (
                <div key={p.label} className={`rounded-2xl border px-4 py-3 text-center min-w-[160px] ${p.highlight ? "border-emerald-500/40 bg-emerald-500/10" : "border-white/8 bg-white/3"}`}>
                  <span className="text-lg">{p.icon}</span>
                  <p className={`text-lg font-black ${p.color}`}>{p.price}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{p.per}</p>
                  <p className="text-[10px] text-foreground/70 mt-0.5 leading-tight">{p.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Buat Opini Hukum Sekarang
              </button>
              <button
                onClick={() => { setShowSample(true); setStep(5); }}
                className="px-6 py-3 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 transition flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Lihat Contoh Output
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STEP WIZARD ─── */}
      <section className="py-12 border-t border-white/8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10 overflow-x-auto scrollbar-hide gap-1">
            {OPINI_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
                <div className={`flex flex-col items-center gap-1 cursor-pointer`} onClick={() => step >= s.id && setStep(s.id)}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                    step > s.id ? "bg-blue-500/30 text-blue-400" : step === s.id ? "bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30" : "bg-white/8 text-muted-foreground"
                  }`}>
                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                  </div>
                  <p className="text-[10px] font-bold text-foreground hidden sm:block">{s.label}</p>
                </div>
                {i < OPINI_STEPS.length - 1 && <div className={`h-px w-8 sm:w-14 flex-shrink-0 ${step > s.id ? "bg-blue-500/40" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* STEP 1: Choose category */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-black text-foreground mb-2">Pilih Bidang Hukum</h2>
                <p className="text-sm text-muted-foreground mb-6">AI akan menyesuaikan kerangka analisis berdasarkan bidang yang Anda pilih.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {OPINI_CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-left p-5 rounded-2xl border transition-all ${
                        selectedCategory === cat.id
                          ? "border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                          : "border-white/8 bg-white/3 hover:border-white/15"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl mb-3`}>{cat.emoji}</div>
                      <h3 className="font-bold text-foreground text-sm mb-1">{cat.label}</h3>
                      <p className="text-[11px] text-muted-foreground mb-3 leading-snug">{cat.desc}</p>
                      <div className="space-y-1">
                        {cat.examples.map((e) => (
                          <p key={e} className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-blue-400/50 flex-shrink-0" />
                            {e}
                          </p>
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={() => selectedCategory && setStep(2)}
                  disabled={!selectedCategory}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Lanjut — Input Fakta <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Input fakta */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-black text-foreground mb-2">Uraikan Duduk Perkara</h2>
                <p className="text-sm text-muted-foreground mb-6">Jelaskan fakta-fakta yang relevan secara kronologis. Semakin detail, semakin akurat analisis AI.</p>
                <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden mb-4">
                  <div className="px-4 py-2.5 border-b border-white/8 flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-semibold text-muted-foreground">Fakta & Kronologi Perkara</span>
                  </div>
                  <textarea
                    value={fakta}
                    onChange={(e) => setFakta(e.target.value)}
                    placeholder={`Contoh:\n\nPT ABC adalah perusahaan teknologi yang memiliki 50 karyawan. Pada Januari 2026, PT ABC mempekerjakan Budi sebagai Head of Engineering dengan gaji Rp 30 juta/bulan. Dalam kontrak kerjanya terdapat klausul non-kompetisi yang melarang Budi bekerja di perusahaan teknologi sejenis selama 2 tahun setelah resign tanpa kompensasi tambahan...\n\nPada Maret 2026, Budi mengundurkan diri dan bergabung dengan startup kompetitor. PT ABC berniat menuntut Budi berdasarkan klausul tersebut.`}
                    className="w-full h-52 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl border border-white/10 text-muted-foreground text-sm font-semibold hover:bg-white/5 transition">
                    ← Kembali
                  </button>
                  <button
                    onClick={() => fakta.length > 20 && setStep(3)}
                    disabled={fakta.length < 20}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm flex items-center gap-2 disabled:opacity-40"
                  >
                    Lanjut — Isu Hukum <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Legal questions */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-black text-foreground mb-2">Rumuskan Isu Hukum</h2>
                <p className="text-sm text-muted-foreground mb-6">Apa pertanyaan hukum yang ingin dijawab dalam opini ini? AI akan menyusun kerangka analisis berdasarkan isu yang Anda rumuskan.</p>
                <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden mb-4">
                  <div className="px-4 py-2.5 border-b border-white/8 flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-semibold text-muted-foreground">Pertanyaan Hukum (1–3 isu utama)</span>
                  </div>
                  <textarea
                    value={pertanyaan}
                    onChange={(e) => setPertanyaan(e.target.value)}
                    placeholder={`Contoh pertanyaan hukum:\n\n1. Apakah klausul non-kompetisi selama 2 tahun tanpa kompensasi sah dan dapat ditegakkan secara hukum di Indonesia?\n\n2. Apa langkah hukum yang dapat ditempuh PT ABC jika klausul dianggap sah?\n\n3. Apa risiko hukum bagi PT ABC jika klausul tersebut dianggap tidak sah?`}
                    className="w-full h-40 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none outline-none"
                  />
                </div>

                {/* Quick add */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs text-muted-foreground self-center">Tambah cepat:</span>
                  {["Dasar hukum", "Risiko & mitigasi", "Langkah hukum", "Perbandingan yurisprudensi"].map((q) => (
                    <button key={q} onClick={() => setPertanyaan(p => p + `\n• ${q}`)} className="text-xs px-2.5 py-1 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition">
                      + {q}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-4 py-2.5 rounded-xl border border-white/10 text-muted-foreground text-sm font-semibold hover:bg-white/5 transition">← Kembali</button>
                  <button
                    onClick={() => pertanyaan.length > 5 && setStep(4)}
                    disabled={pertanyaan.length < 5}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm flex items-center gap-2 disabled:opacity-40"
                  >
                    Lanjut — Generate Opini <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Generating */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mx-auto mb-6 relative">
                  <Brain className="w-7 h-7 text-white" />
                  <span className="absolute inset-0 rounded-2xl bg-blue-500/30 animate-ping" />
                </div>
                <h2 className="text-xl font-black text-foreground mb-2">AI sedang menganalisis...</h2>
                <p className="text-sm text-muted-foreground mb-8">Menyusun opini hukum berdasarkan UU, PP, peraturan terkait, dan yurisprudensi MA RI</p>
                <div className="max-w-xs mx-auto space-y-3 text-left">
                  {[
                    { label: "Identifikasi regulasi relevan", done: true },
                    { label: "Analisis yurisprudensi & putusan MA", done: true },
                    { label: "Menyusun kerangka opini hukum", done: generating },
                    { label: "Finalisasi kesimpulan & rekomendasi", done: false },
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${item.done ? "bg-emerald-500/30" : "bg-white/10"}`}>
                        {item.done && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <span className={`text-sm ${item.done ? "text-foreground" : "text-muted-foreground/50"}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
                {!showSample && (
                  <button onClick={handleGenerate} className="mt-8 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm flex items-center gap-2 mx-auto">
                    <Zap className="w-4 h-4" /> Generate Opini Hukum
                  </button>
                )}
              </motion.div>
            )}

            {/* STEP 5: Output */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div>
                    <h2 className="text-xl font-black text-foreground">Opini Hukum Tersedia</h2>
                    <p className="text-xs text-muted-foreground">Dokumen siap diunduh atau disalin</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCopy} className="text-xs font-bold px-3 py-2 rounded-xl border border-white/10 text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition">
                      <Copy className="w-3.5 h-3.5" /> {copied ? "Tersalin!" : "Salin"}
                    </button>
                    <Link href="/masuk">
                      <button className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 flex items-center gap-1.5 transition">
                        <Download className="w-3.5 h-3.5" /> Unduh PDF
                      </button>
                    </Link>
                    <button onClick={() => { setStep(1); setSelectedCategory(null); setFakta(""); setPertanyaan(""); setShowSample(false); }} className="text-xs font-bold px-3 py-2 rounded-xl border border-white/10 text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition">
                      <RotateCcw className="w-3.5 h-3.5" /> Buat Baru
                    </button>
                  </div>
                </div>

                {/* Document preview */}
                <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-950/20 to-card/40 overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/8 bg-blue-500/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">OPINI HUKUM — KONFIDENSIAL</p>
                      <p className="text-xs font-bold text-foreground mt-0.5">{SAMPLE_OPINI.judul}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">{SAMPLE_OPINI.tanggal}</p>
                      <p className="text-[10px] text-blue-400 font-semibold">{SAMPLE_OPINI.bidang}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto scrollbar-hide">
                    {SAMPLE_OPINI.sections.map((sec) => (
                      <div key={sec.title}>
                        <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">{sec.title}</h3>
                        <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{sec.content}</div>
                      </div>
                    ))}
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">✅ Verifikasi AI</p>
                      <p className="text-xs text-muted-foreground">Opini ini telah diverifikasi terhadap 53+ regulasi aktif dan 30.000+ putusan MA dalam basis data LexCom per 29 Maret 2026.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 flex-wrap">
                  <Link href="/masuk">
                    <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Simpan ke Dokumen Saya
                    </button>
                  </Link>
                  <button onClick={() => { setStep(1); setSelectedCategory(null); setFakta(""); setPertanyaan(""); setShowSample(false); }} className="px-5 py-2.5 rounded-xl border border-white/10 text-muted-foreground font-semibold text-sm flex items-center gap-2 hover:bg-white/5 transition">
                    <RotateCcw className="w-4 h-4" /> Buat Opini Baru
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── FITUR & KEUNGGULAN ─── */}
      <section className="py-14 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-foreground mb-2">Opini Hukum Standar Profesional</h2>
            <p className="text-muted-foreground text-sm">Setiap opini mencakup komponen analisis hukum yang lengkap — sama seperti yang dibuat firma hukum kelas satu.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: "⚖️", title: "Kerangka IRAC", desc: "Issue, Rule, Analysis, Conclusion — standar penulisan opini hukum profesional internasional" },
              { emoji: "📚", title: "Dasar Hukum Lengkap", desc: "Mengacu pada 53+ peraturan aktif, UU terbaru, PP, Permen, dan regulasi turunan yang berlaku" },
              { emoji: "🏛️", title: "Yurisprudensi Relevan", desc: "Terintegrasi dengan 30.000+ putusan MA, MK, dan pengadilan lainnya sebagai preseden" },
              { emoji: "🔒", title: "Kerahasiaan Klien", desc: "Semua input fakta dienkripsi end-to-end. Tidak ada data klien yang dibagikan ke pihak ketiga" },
              { emoji: "📄", title: "Format Profesional", desc: "Output siap cetak dalam format standar — kop surat, penomoran, dan tanda tangan digital tersedia" },
              { emoji: "⚡", title: "Revisi Tak Terbatas", desc: "Minta revisi, tambah isu hukum, atau perbarui analisis kapan saja dalam hitungan detik" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/8 bg-white/3 p-5">
                <span className="text-2xl">{f.emoji}</span>
                <h3 className="font-bold text-foreground text-sm mt-2 mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTOH OUTPUT PER BIDANG ─── */}
      <section className="py-14 border-t border-white/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Bidang Hukum × Contoh Topik Opini</h2>
            <p className="text-muted-foreground text-sm">Studio Opini AI mampu menghasilkan analisis mendalam untuk ratusan topik hukum spesifik.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { bidang: "Korporasi & Bisnis", icon: "🏢", warna: "text-blue-400", topik: ["Legalitas skema kepemilikan saham asing", "Analisis risiko due diligence akuisisi startup", "Struktur holding optimal pasca UU Cipta Kerja"] },
              { bidang: "Ketenagakerjaan", icon: "👷", warna: "text-orange-400", topik: ["Legalitas program pensiun dini", "Klausul non-solicit vs non-compete", "PHK massal prosedur dan kewajiban pesangon"] },
              { bidang: "Properti & Real Estate", icon: "🏠", warna: "text-emerald-400", topik: ["Risiko hukum PPJB apartemen off-plan", "Konversi HGB menjadi SHM bagi WNA", "Sengketa jual beli tanah warisan ahli waris"] },
              { bidang: "Kontrak & Perjanjian", icon: "📝", warna: "text-pink-400", topik: ["Force majeure dalam kontrak EPC infrastruktur", "Klausul penalti dan batas ganti rugi", "Analisis risiko kontrak SaaS dengan vendor asing"] },
              { bidang: "Pidana Bisnis", icon: "⚖️", warna: "text-red-400", topik: ["Tanggung jawab pidana direksi atas korupsi korporasi", "Unsur TPPU dalam transaksi bisnis", "Analisis dakwaan fraud pengadaan barang & jasa"] },
              { bidang: "Hukum Pajak", icon: "🧾", warna: "text-violet-400", topik: ["Dasar hukum banding PPh Badan ke Pengadilan Pajak", "Transfer pricing dan risiko hukum pajak internasional", "Keberatan dan banding bea masuk kepabeanan"] },
            ].map((b) => (
              <div key={b.bidang} className="rounded-2xl border border-white/8 bg-white/3 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{b.icon}</span>
                  <h3 className={`font-bold text-sm ${b.warna}`}>{b.bidang}</h3>
                </div>
                <div className="space-y-1.5">
                  {b.topik.map((t) => (
                    <div key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <ChevronRight className="w-3 h-3 flex-shrink-0 mt-0.5 text-muted-foreground/50" />
                      <span className="leading-snug">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ STUDIO OPINI ─── */}
      <section className="py-14 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Pertanyaan yang Sering Ditanyakan</h2>
          </div>
          <StudioOpiniFaq />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-background to-violet-950/20 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-black text-foreground mb-3">
            Opini Hukum Rp 5 Juta
            <br />
            <span className="text-blue-400">Kini Tak Terbatas untuk Subscriber</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            Paket Pro Rp 199.000/bulan — buat opini hukum tak terbatas, simpan riwayat, unduh PDF profesional, dan akses semua 19 Pakar AI LexCom.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/harga">
              <button className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Mulai dengan Paket Pro
              </button>
            </Link>
            <Link href="/masuk">
              <button className="px-7 py-3.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 transition flex items-center gap-2">
                Coba Gratis Dulu <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
