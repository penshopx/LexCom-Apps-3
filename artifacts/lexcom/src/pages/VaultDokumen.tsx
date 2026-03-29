import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Archive, Search, FileText, Download, Sparkles, Star, ChevronRight,
  ArrowRight, BookOpen, Filter, Zap, Shield, Clock, CheckCircle2,
  PenLine, Scale, Gavel, Briefcase, Users, Building2, Heart,
  Globe, BookMarked, Tag,
} from "lucide-react";

const KATEGORI = [
  {
    id: "litigasi",
    emoji: "⚖️",
    label: "Litigasi Lengkap",
    count: 180,
    color: "from-violet-600 to-purple-700",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
    sub: [
      { label: "Hukum Pidana", docs: ["Surat Dakwaan", "Pledoi (Pembelaan)", "Eksepsi", "Replik Jaksa", "Tuntutan Pidana", "Permohonan PK Pidana", "Surat Kuasa Pidana", "Duplik Terdakwa"] },
      { label: "Hukum Perdata", docs: ["Gugatan Perdata", "Jawaban Tergugat", "Replik Penggugat", "Duplik Tergugat", "Kesimpulan", "Memori Banding", "Kontra Memori Banding", "Memori Kasasi"] },
      { label: "Upaya Hukum", docs: ["Permohonan Banding", "Permohonan Kasasi", "Permohonan PK", "Permohonan Grasi", "Permohonan Amnesti"] },
    ],
  },
  {
    id: "perjanjian",
    emoji: "🤝",
    label: "Perjanjian Bisnis",
    count: 250,
    color: "from-blue-600 to-cyan-700",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    sub: [
      { label: "Kerjasama & Investasi", docs: ["Perjanjian Kerjasama Bisnis", "Joint Venture Agreement", "Shareholders Agreement", "Investment Agreement", "Term Sheet", "LOI (Letter of Intent)", "MOU"] },
      { label: "Jual Beli & Pengadaan", docs: ["Perjanjian Jual Beli", "Perjanjian Pengadaan Barang", "Purchase Order", "Perjanjian Distribusi", "Franchise Agreement"] },
      { label: "Sewa & Jasa", docs: ["Perjanjian Sewa Menyewa", "Perjanjian Sewa Guna Usaha", "Perjanjian Jasa Konsultansi", "SLA (Service Level Agreement)", "Maintenance Agreement"] },
    ],
  },
  {
    id: "notariil",
    emoji: "🏛️",
    label: "Akta Notariil",
    count: 400,
    color: "from-amber-600 to-orange-700",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    sub: [
      { label: "Akta Pendirian & Perubahan", docs: ["Akta Pendirian PT", "Akta Pendirian CV", "Akta Pendirian Yayasan", "Akta Pendirian Koperasi", "Akta Perubahan Anggaran Dasar"] },
      { label: "Akta Perjanjian", docs: ["Akta Perjanjian Kredit", "Akta PPJB Tanah & Bangunan", "Akta Jual Beli", "Akta Sewa Menyewa", "Akta Fidusia", "Akta Hak Tanggungan"] },
      { label: "Akta Waris & Keluarga", docs: ["Akta Keterangan Waris", "Akta Wasiat", "Akta Perjanjian Perkawinan", "Akta Hibah", "Surat Keterangan Ahli Waris"] },
    ],
  },
  {
    id: "ketenagakerjaan",
    emoji: "👷",
    label: "Ketenagakerjaan & HRD",
    count: 120,
    color: "from-orange-600 to-red-700",
    border: "border-orange-500/20",
    bg: "bg-orange-500/5",
    sub: [
      { label: "Kontrak Kerja", docs: ["PKWT Standar", "PKWTT Standar", "Kontrak Direksi/Komisaris", "Kontrak Konsultan/Freelancer", "NDA Karyawan", "Non-Compete Agreement"] },
      { label: "SOP HRD & Perusahaan", docs: ["SOP Rekrutmen", "SOP Onboarding", "SOP Evaluasi Kinerja", "SOP Disiplin & PHK", "Peraturan Perusahaan", "PKB (Perjanjian Kerja Bersama)"] },
      { label: "PHK & Pesangon", docs: ["Surat PHK", "Kesepakatan Bersama PHK", "Perhitungan Pesangon", "Surat Perjanjian Pemisahan", "Kuitansi Pesangon"] },
    ],
  },
  {
    id: "khusus",
    emoji: "🔬",
    label: "Peradilan Khusus",
    count: 140,
    color: "from-emerald-600 to-green-700",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    sub: [
      { label: "Peradilan Agama", docs: ["Gugatan Perceraian (PA)", "Permohonan Itsbat Nikah", "Gugatan Harta Gono-Gini", "Permohonan Hak Asuh Anak", "Gugatan Waris Islam"] },
      { label: "Peradilan TUN", docs: ["Gugatan TUN", "Permohonan Penundaan Keputusan TUN", "Gugatan Fiktif Positif", "Memori Banding TUN"] },
      { label: "Peradilan Pajak", docs: ["Surat Keberatan Pajak", "Permohonan Banding Pajak", "Permohonan PK Pajak", "Sengketa Kepabeanan & Cukai"] },
    ],
  },
  {
    id: "surat",
    emoji: "📨",
    label: "Surat & Somasi",
    count: 95,
    color: "from-pink-600 to-rose-700",
    border: "border-pink-500/20",
    bg: "bg-pink-500/5",
    sub: [
      { label: "Surat Kuasa", docs: ["Surat Kuasa Litigasi", "Surat Kuasa Khusus Perdata", "Surat Kuasa Notariil", "Surat Kuasa Ketenagakerjaan", "Surat Kuasa Pajak"] },
      { label: "Somasi & Teguran", docs: ["Somasi Wanprestasi", "Somasi PHK", "Somasi Hutang Piutang", "Teguran I/II/III", "Somasi Sebelum Gugatan"] },
      { label: "Surat Pernyataan", docs: ["Surat Pernyataan Hutang", "Surat Pengakuan Utang", "Berita Acara Serah Terima", "Surat Pernyataan Perdamaian"] },
    ],
  },
  {
    id: "korporat",
    emoji: "🏢",
    label: "Dokumen Korporat",
    count: 110,
    color: "from-indigo-600 to-blue-700",
    border: "border-indigo-500/20",
    bg: "bg-indigo-500/5",
    sub: [
      { label: "RUPS & Governance", docs: ["Risalah RUPS Tahunan", "Risalah RUPS Luar Biasa", "Keputusan Direksi", "Keputusan Pemegang Saham", "Perjanjian Pemegang Saham"] },
      { label: "M&A & Due Diligence", docs: ["Due Diligence Checklist", "SPA (Share Purchase Agreement)", "APA (Asset Purchase Agreement)", "Merger Plan", "Disclosure Letter"] },
      { label: "IP & Data", docs: ["NDA Komprehensif", "IP Assignment Agreement", "Data Processing Agreement", "Privacy Policy", "Terms of Service"] },
    ],
  },
  {
    id: "properti",
    emoji: "🏠",
    label: "Properti & Agraria",
    count: 75,
    color: "from-teal-600 to-cyan-700",
    border: "border-teal-500/20",
    bg: "bg-teal-500/5",
    sub: [
      { label: "Jual Beli Properti", docs: ["PPJB Tanah & Bangunan", "Perjanjian Pengikatan Jual Beli", "Kuitansi Pembayaran", "Pernyataan Ahli Waris", "Akta Jual Beli Tanah"] },
      { label: "Sengketa Tanah", docs: ["Gugatan Kepemilikan Tanah", "Permohonan Penertiban BPN", "Somasi Pengosongan", "Bantahan Sertifikat Ganda"] },
      { label: "Developer & Investasi", docs: ["Perjanjian Kerjasama Pembangunan", "Perjanjian Bagi Hasil Properti", "KSO Developer", "PPJB Apartemen Off-Plan"] },
    ],
  },
];

const FEATURED_DOCS = [
  { title: "Gugatan Wanprestasi Kontrak Bisnis", cat: "Litigasi Perdata", badge: "Populer", color: "border-violet-500/30" },
  { title: "PKWT Standar dengan Klausul Probasi", cat: "Ketenagakerjaan", badge: "Banyak Diunduh", color: "border-orange-500/30" },
  { title: "NDA Bisnis Komprehensif (Bilingual)", cat: "Perjanjian", badge: "Pro", color: "border-blue-500/30" },
  { title: "Surat Somasi Hutang Piutang", cat: "Surat & Somasi", badge: null, color: "border-pink-500/30" },
  { title: "Akta Pendirian PT (Format Terbaru)", cat: "Akta Notariil", badge: "Update 2026", color: "border-amber-500/30" },
  { title: "Surat PHK Efisiensi dengan Pesangon", cat: "Ketenagakerjaan", badge: "Sering Dicari", color: "border-red-500/30" },
];

const FAQ_VAULT = [
  { q: "Apakah template Vault LexCom dibuat oleh pengacara berpengalaman?", a: "Ya, semua template disusun oleh tim advokat LexCom dengan pengalaman rata-rata 15+ tahun dan diperbarui setiap kuartal mengikuti regulasi terbaru — termasuk KUHP Baru 2026, UU Cipta Kerja, dan peraturan turunannya." },
  { q: "Bisakah saya mengedit template setelah diunduh?", a: "Tentu. Template tersedia dalam format .docx (Microsoft Word) yang sepenuhnya dapat diedit, serta PDF untuk keperluan resmi. Anda juga dapat menggunakan fitur AI Editor di LexCom untuk merevisi langsung dalam platform." },
  { q: "Apakah template berlaku untuk semua yurisdiksi di Indonesia?", a: "Template dirancang untuk hukum positif Indonesia berlaku nasional. Untuk transaksi yang melibatkan regulasi daerah (Perda) atau kekhususan seperti Aceh atau Papua, kami menyediakan catatan adaptasi yang diperlukan." },
  { q: "Seberapa sering template diperbarui?", a: "Template diperbarui setiap kuartal (3 bulan sekali) atau segera setelah ada perubahan regulasi signifikan. Peserta Pro & Advokat mendapat notifikasi langsung setiap kali template yang pernah mereka unduh diperbarui." },
  { q: "Apakah bisa request template yang belum tersedia?", a: "Ya! Pengguna Pro dan Advokat dapat mengajukan permintaan template baru melalui fitur Custom Template Request. Tim LexCom akan memprioritaskan pembuatan dalam 7 hari kerja dan memberitahu pemohon ketika selesai." },
];

function VaultFaq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_VAULT.map((faq, i) => (
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

export default function VaultDokumen() {
  const [activeKat, setActiveKat] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showGenerator, setShowGenerator] = useState<string | null>(null);
  const [genStep, setGenStep] = useState(0);
  const [genDone, setGenDone] = useState(false);

  const kat = KATEGORI.find(k => k.id === activeKat);

  function handleGenerate(docName: string) {
    setShowGenerator(docName);
    setGenStep(0);
    setGenDone(false);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setGenStep(step);
      if (step >= 3) {
        clearInterval(interval);
        setGenDone(true);
      }
    }, 700);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[320px] bg-amber-600/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold mb-6">
              <Archive className="w-3.5 h-3.5" />
              Vault Template Dokumen Hukum — Terlengkap di Indonesia
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-foreground mb-4 leading-tight">
              Vault
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                1.500+ Template
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
              Semua template dokumen hukum yang Anda butuhkan — dari gugatan hingga akta notariil, dari NDA hingga PKB.
              AI langsung mengisi berdasarkan fakta kasus Anda. Bukan sekadar Word kosong.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari template: gugatan, NDA, PKWT, akta pendirian PT..."
                  className="w-full pl-11 pr-28 py-4 rounded-2xl border border-white/12 bg-white/5 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-amber-500/40 focus:bg-white/8 transition"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> AI Cari
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 max-w-xl mx-auto">
              {[
                { val: "1.500+", label: "Total Template" },
                { val: "8", label: "Kategori" },
                { val: "AI", label: "Auto-Fill" },
                { val: "DOC+PDF", label: "Format Output" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/8 bg-white/4 p-2.5 text-center">
                  <p className="text-base font-black text-amber-400">{s.val}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CATEGORY GRID ─── */}
      <section className="py-12 border-t border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-foreground">8 Kategori Dokumen</h2>
            {activeKat && (
              <button onClick={() => setActiveKat(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                ← Semua Kategori
              </button>
            )}
          </div>

          {!activeKat ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {KATEGORI.map((k) => (
                <motion.button
                  key={k.id}
                  whileHover={{ y: -3 }}
                  onClick={() => setActiveKat(k.id)}
                  className={`text-left p-5 rounded-2xl border ${k.border} ${k.bg} hover:border-white/20 transition-all`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center text-xl mb-3`}>{k.emoji}</div>
                  <h3 className="font-bold text-foreground text-sm mb-0.5">{k.label}</h3>
                  <p className="text-[11px] text-muted-foreground mb-3">{k.count}+ template</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{k.sub.length} sub-kategori</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </motion.button>
              ))}
            </div>
          ) : kat && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kat.color} flex items-center justify-center text-xl`}>{kat.emoji}</div>
                  <div>
                    <h3 className="font-black text-foreground">{kat.label}</h3>
                    <p className="text-xs text-muted-foreground">{kat.count}+ template dalam {kat.sub.length} sub-kategori</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  {kat.sub.map((sub) => (
                    <div key={sub.label} className={`rounded-2xl border ${kat.border} ${kat.bg} p-5`}>
                      <h4 className="font-bold text-foreground text-sm mb-3">{sub.label}</h4>
                      <div className="space-y-1.5">
                        {sub.docs.map((doc) => (
                          <div key={doc} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-foreground/85">{doc}</span>
                            </div>
                            <button
                              onClick={() => handleGenerate(doc)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-amber-400 flex items-center gap-0.5 whitespace-nowrap"
                            >
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </button>
                          </div>
                        ))}
                      </div>
                      <Link href="/masuk">
                        <button className="mt-4 w-full py-2 rounded-xl border border-white/10 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-white/20 transition flex items-center justify-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" /> Generate Semua
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ─── FEATURED TEMPLATES ─── */}
      <section className="py-12 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-foreground">Template Paling Dicari</h2>
            <Link href="/masuk">
              <button className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">Lihat Semua 1.500+ <ChevronRight className="w-3.5 h-3.5" /></button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_DOCS.map((doc) => (
              <motion.div key={doc.title} whileHover={{ y: -2 }} className={`rounded-2xl border ${doc.color} bg-white/2 hover:bg-white/4 transition-all p-4 cursor-pointer group`}>
                <div className="flex items-start justify-between mb-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  {doc.badge && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300">{doc.badge}</span>}
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{doc.title}</h3>
                <p className="text-[11px] text-amber-400 mb-3">{doc.cat}</p>
                <div className="flex items-center justify-between">
                  <button onClick={() => handleGenerate(doc.title)} className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Generate AI
                  </button>
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

      {/* ─── AI GENERATOR MODAL ─── */}
      <AnimatePresence>
        {showGenerator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && setShowGenerator(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border border-white/12 rounded-3xl p-7 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center mx-auto mb-3 relative">
                  <Sparkles className="w-5 h-5 text-white" />
                  {!genDone && <span className="absolute inset-0 rounded-2xl bg-amber-500/30 animate-ping" />}
                </div>
                <h3 className="font-black text-foreground text-lg mb-1">Generate: {showGenerator}</h3>
                <p className="text-xs text-muted-foreground">AI sedang menyiapkan template sesuai kebutuhan Anda</p>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { label: "Analisis jenis & struktur dokumen", done: genStep >= 1 },
                  { label: "Menyesuaikan dengan regulasi terbaru 2026", done: genStep >= 2 },
                  { label: "Mengisi klausul standar & variabel", done: genStep >= 3 },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${s.done ? "bg-emerald-500/25" : "bg-white/8"}`}>
                      {s.done ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <span className="w-2 h-2 rounded-full bg-white/20" />}
                    </div>
                    <span className={`text-sm ${s.done ? "text-foreground" : "text-muted-foreground/50"}`}>{s.label}</span>
                  </div>
                ))}
              </div>

              {genDone && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 text-center">
                    <p className="text-sm font-bold text-emerald-400">✅ Template siap! Daftar untuk mengunduh.</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/masuk" className="flex-1">
                      <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> Unduh Sekarang
                      </button>
                    </Link>
                    <button onClick={() => setShowGenerator(null)} className="px-4 py-2.5 rounded-xl border border-white/10 text-muted-foreground text-sm hover:bg-white/5 transition">
                      Tutup
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── KEUNGGULAN ─── */}
      <section className="py-12 border-t border-white/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Bukan Template Kosong. Template Cerdas.</h2>
            <p className="text-muted-foreground text-sm">AI LexCom mengubah template generik menjadi dokumen hukum yang presisi dan siap pakai.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { emoji: "🤖", title: "AI Auto-Fill", desc: "Input nama pihak, tanggal, dan fakta kasus. AI mengisi seluruh klausul, pasal, dan referensi hukum yang relevan secara otomatis." },
              { emoji: "⚖️", title: "Sesuai Regulasi 2026", desc: "Setiap template diperbarui mengikuti KUHP Baru, UU Cipta Kerja, dan regulasi terbaru — bukan template lama yang sudah kadaluarsa." },
              { emoji: "📄", title: "DOC + PDF Profesional", desc: "Unduh dalam format Word untuk edit lanjutan, atau PDF untuk keperluan resmi. Format surat resmi dengan kop dan penomoran standar." },
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

      {/* ─── PERBANDINGAN BIAYA ─── */}
      <section className="py-14 border-t border-white/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Berapa yang Anda Hemat?</h2>
            <p className="text-muted-foreground text-sm">Bandingkan biaya membuat dokumen hukum secara konvensional vs. menggunakan Vault LexCom.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { dok: "Perjanjian Jual Beli Tanah", konvensional: "Rp 3–8 jt", lexcom: "Gratis s.d. Rp 49rb", saving: "Hemat s.d. Rp 7,9 jt" },
              { dok: "Gugatan Perdata Lengkap", konvensional: "Rp 5–20 jt", lexcom: "Rp 49–99rb/template", saving: "Hemat s.d. Rp 19,9 jt" },
              { dok: "Akta Pendirian PT (notariil)", konvensional: "Rp 2–5 jt", lexcom: "Rp 49rb/draft", saving: "Hemat s.d. Rp 4,9 jt" },
            ].map((row) => (
              <div key={row.dok} className="rounded-2xl border border-white/8 bg-white/3 p-5">
                <p className="text-xs font-bold text-foreground mb-3 leading-snug">{row.dok}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Konvensional</span>
                    <span className="text-[11px] font-bold text-red-400">{row.konvensional}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">LexCom Vault</span>
                    <span className="text-[11px] font-bold text-emerald-400">{row.lexcom}</span>
                  </div>
                  <div className="pt-1.5 border-t border-white/8">
                    <span className="text-[11px] font-black text-amber-400">{row.saving}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-orange-950/10 p-6 grid sm:grid-cols-3 gap-5">
            {[
              { tier: "Gratis", harga: "Rp 0", fitur: "50 template akses terbatas, watermark", highlight: false },
              { tier: "Starter", harga: "Rp 79.000/bln", fitur: "500+ template, no watermark, DOC+PDF", highlight: false },
              { tier: "Pro & Advokat", harga: "Rp 199rb–499rb/bln", fitur: "1.500+ template + AI generator tak terbatas", highlight: true },
            ].map((t) => (
              <div key={t.tier} className={`rounded-2xl border p-4 text-center ${t.highlight ? "border-amber-500/30 bg-amber-500/8" : "border-white/8 bg-white/3"}`}>
                <p className={`text-xs font-bold mb-1 ${t.highlight ? "text-amber-400" : "text-muted-foreground"}`}>Paket {t.tier}</p>
                <p className="text-lg font-black text-foreground mb-2">{t.harga}</p>
                <p className="text-[11px] text-muted-foreground leading-snug">{t.fitur}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ VAULT ─── */}
      <section className="py-14 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Pertanyaan yang Sering Ditanyakan</h2>
          </div>
          <VaultFaq />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/25 via-background to-orange-950/20 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-black text-foreground mb-3">
            1.500+ Template Hukum
            <br />
            <span className="text-amber-400">Langsung Pakai, Tanpa Repot</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            Hemat jutaan biaya konsultan. Hemat berjam-jam waktu drafting. Fokus pada strategi hukum — biarkan AI menangani template.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/masuk">
              <button className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2">
                <Archive className="w-4 h-4" /> Akses Vault Sekarang
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
