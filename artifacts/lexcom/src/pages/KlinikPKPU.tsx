import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingDown, FileText, Users, ChevronRight, ArrowRight, Sparkles,
  CheckCircle2, AlertCircle, Clock, Scale, Shield, Calculator,
  MessageSquare, Brain, Target, Zap, BarChart3, Building2,
  Gavel, BookOpen, RefreshCcw,
} from "lucide-react";

const PKPU_STAGES = [
  {
    id: "permohonan",
    step: "01",
    label: "Permohonan PKPU",
    emoji: "📋",
    duration: "1 hari sidang",
    basis: "Pasal 222–224 UU No. 37/2004",
    color: "from-blue-600 to-cyan-700",
    border: "border-blue-500/20",
    desc: "Permohonan diajukan oleh debitor atau satu/lebih kreditor ke Pengadilan Niaga. Sidang ditetapkan paling lambat 3 hari setelah permohonan masuk.",
    docs: ["Surat Permohonan PKPU", "Daftar Utang & Kreditor", "Rencana Perdamaian (draft awal)", "Laporan Keuangan Debitor", "Akta Pendirian & RUPS"],
    tips: "Debitor harus dapat membuktikan bahwa dirinya memiliki prospek usaha yang baik dan mampu melunasi utang melalui restrukturisasi.",
  },
  {
    id: "sementara",
    step: "02",
    label: "PKPU Sementara",
    emoji: "⏸️",
    duration: "Maks. 45 hari",
    basis: "Pasal 225–228 UU No. 37/2004",
    color: "from-violet-600 to-purple-700",
    border: "border-violet-500/20",
    desc: "Pengadilan menetapkan PKPU Sementara dan mengangkat Hakim Pengawas serta Pengurus. Debitor dilarang memindahkan aset tanpa persetujuan Pengurus.",
    docs: ["Penetapan PKPU Sementara", "Laporan Pengurus (mingguan)", "Daftar Tagihan Kreditor", "Berita Acara Rapat Kreditor", "Permohonan Perpanjangan (jika perlu)"],
    tips: "Dalam periode ini, Pengurus memverifikasi daftar piutang dan Debitor menyusun rencana perdamaian yang akan diajukan kepada kreditor.",
  },
  {
    id: "tetap",
    step: "03",
    label: "PKPU Tetap",
    emoji: "🔒",
    duration: "Maks. 270 hari total",
    basis: "Pasal 229 UU No. 37/2004",
    color: "from-amber-600 to-orange-700",
    border: "border-amber-500/20",
    desc: "Diperpanjang berdasarkan keputusan rapat kreditor. Seluruh tagihan diverifikasi, rencana perdamaian dibahas dan direvisi sesuai negosiasi.",
    docs: ["Penetapan PKPU Tetap", "Rencana Perdamaian Final", "Daftar Piutang Tetap", "Laporan Pengurus Bulanan", "Proposal Revisi Rencana Perdamaian"],
    tips: "Rencana perdamaian harus mendapat persetujuan lebih dari 1/2 jumlah kreditor konkuren yang mewakili 2/3 jumlah tagihan.",
  },
  {
    id: "perdamaian",
    step: "04",
    label: "Rencana Perdamaian",
    emoji: "🤝",
    duration: "Voting & homologasi",
    basis: "Pasal 281–289 UU No. 37/2004",
    color: "from-emerald-600 to-green-700",
    border: "border-emerald-500/20",
    desc: "Rapat pemungutan suara kreditor. Jika tercapai quorum, pengadilan melakukan homologasi (pengesahan) rencana perdamaian yang menjadi perjanjian mengikat.",
    docs: ["Rencana Perdamaian Final", "Berita Acara Pemungutan Suara", "Daftar Hadir Kreditor", "Penetapan Homologasi", "Perjanjian Perdamaian yang Disahkan"],
    tips: "Homologasi menciptakan akta autentik yang mengikat semua kreditor — termasuk yang tidak hadir atau menolak — untuk menerima pola pembayaran yang disepakati.",
  },
  {
    id: "pailit",
    step: "05",
    label: "Kepailitan / Eksekusi",
    emoji: "⚖️",
    duration: "Jika perdamaian gagal",
    basis: "Pasal 289–302 UU No. 37/2004",
    color: "from-red-600 to-rose-700",
    border: "border-red-500/20",
    desc: "Jika rencana perdamaian ditolak atau debitor wanprestasi, pengadilan menyatakan debitor pailit. Kurator mengambil alih pengurusan dan pemberesan harta.",
    docs: ["Putusan Pailit", "Penetapan Kurator", "Inventaris Harta Pailit", "Laporan Kurator", "Daftar Pembagian Harta Pailit"],
    tips: "Kurator memiliki kewenangan penuh untuk mengurus dan membereskan harta pailit. Urutan pembayaran: biaya kepailitan → kreditor separatis → kreditor preferen → kreditor konkuren.",
  },
];

const KURATOR_TOOLS = [
  { emoji: "📊", title: "Kalkulator Voting Kreditor", desc: "Hitung otomatis apakah rencana perdamaian memenuhi quorum: >½ jumlah kreditor & 2/3 jumlah tagihan", tag: "Pasal 281" },
  { emoji: "💰", title: "Kalkulator Distribusi Harta", desc: "Urutan pembayaran harta pailit: biaya kepailitan, separatis, preferen, konkuren — otomatis proporsional", tag: "Pasal 189" },
  { emoji: "📅", title: "Timeline PKPU Tracker", desc: "Monitor hari berjalan PKPU Sementara & Tetap, alert otomatis mendekati batas waktu 270 hari", tag: "Pasal 229" },
  { emoji: "📋", title: "Generator Laporan Kurator", desc: "Template laporan pengurus/kurator untuk Hakim Pengawas — mingguan, bulanan, dan laporan akhir", tag: "Standar PN Niaga" },
];

const KEPAILITAN_DOCS = [
  { label: "Surat Permohonan PKPU (Debitor)", stage: "Permohonan", color: "text-blue-400" },
  { label: "Surat Permohonan PKPU (Kreditor)", stage: "Permohonan", color: "text-blue-400" },
  { label: "Daftar Utang & Piutang", stage: "Permohonan", color: "text-blue-400" },
  { label: "Rencana Perdamaian (Draft)", stage: "PKPU Sementara", color: "text-violet-400" },
  { label: "Laporan Pengurus Mingguan", stage: "PKPU Sementara", color: "text-violet-400" },
  { label: "Berita Acara Rapat Kreditor", stage: "PKPU Tetap", color: "text-amber-400" },
  { label: "Rencana Perdamaian Final", stage: "PKPU Tetap", color: "text-amber-400" },
  { label: "Akta Perdamaian Homologasi", stage: "Perdamaian", color: "text-emerald-400" },
  { label: "Laporan Kurator Bulanan", stage: "Kepailitan", color: "text-red-400" },
  { label: "Inventaris Harta Pailit", stage: "Kepailitan", color: "text-red-400" },
  { label: "Daftar Pembagian Harta", stage: "Kepailitan", color: "text-red-400" },
  { label: "Permohonan Rehabilitasi", stage: "Pasca Pailit", color: "text-pink-400" },
];

const STATS = [
  { val: "1.200+", label: "Kasus PKPU/Pailit per tahun", sub: "rata-rata PN Niaga Indonesia" },
  { val: "270 hari", label: "Batas waktu PKPU Tetap", sub: "termasuk PKPU Sementara 45 hr" },
  { val: "UU 37/2004", label: "Dasar hukum utama", sub: "Kepailitan & PKPU" },
];

function KalkulatorVoting() {
  const [totalKreditor, setTotalKreditor] = useState("");
  const [kreditorSetuju, setKreditorSetuju] = useState("");
  const [totalTagihan, setTotalTagihan] = useState("");
  const [tagihanSetuju, setTagihanSetuju] = useState("");
  const [result, setResult] = useState<null | { pctKreditor: number; pctTagihan: number; quorumKreditor: boolean; quorumTagihan: boolean; lolos: boolean }>(null);

  function hitung() {
    const tk = parseInt(totalKreditor);
    const ks = parseInt(kreditorSetuju);
    const tt = parseFloat(totalTagihan.replace(/\D/g, ""));
    const ts = parseFloat(tagihanSetuju.replace(/\D/g, ""));
    if (!tk || !ks || !tt || !ts) return;
    const pctKreditor = (ks / tk) * 100;
    const pctTagihan = (ts / tt) * 100;
    const quorumKreditor = pctKreditor > 50;
    const quorumTagihan = pctTagihan >= 66.67;
    setResult({ pctKreditor, pctTagihan, quorumKreditor, quorumTagihan, lolos: quorumKreditor && quorumTagihan });
  }

  function formatAngka(val: string) {
    const num = val.replace(/\D/g, "");
    return num ? parseInt(num).toLocaleString("id-ID") : "";
  }

  return (
    <div className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/20 to-orange-950/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/8 bg-red-500/5 flex items-center gap-3">
        <BarChart3 className="w-4 h-4 text-red-400" />
        <div>
          <p className="font-black text-foreground text-sm">Kalkulator Quorum Voting — Pasal 281 UU 37/2004</p>
          <p className="text-[10px] text-muted-foreground">Persyaratan: lebih dari ½ jumlah kreditor konkuren yang mewakili ≥ ⅔ total tagihan konkuren.</p>
        </div>
      </div>
      <div className="p-6 grid sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Total Kreditor</label>
              <input type="number" value={totalKreditor} onChange={(e) => setTotalKreditor(e.target.value)} placeholder="Misal: 20" className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-red-500/40 transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Kreditor Setuju</label>
              <input type="number" value={kreditorSetuju} onChange={(e) => setKreditorSetuju(e.target.value)} placeholder="Misal: 12" className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-red-500/40 transition" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Total Nilai Tagihan (Rp)</label>
            <input value={totalTagihan} onChange={(e) => setTotalTagihan(formatAngka(e.target.value))} placeholder="Misal: 50.000.000.000" className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-red-500/40 transition" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Nilai Tagihan Kreditor Setuju (Rp)</label>
            <input value={tagihanSetuju} onChange={(e) => setTagihanSetuju(formatAngka(e.target.value))} placeholder="Misal: 35.000.000.000" className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-red-500/40 transition" />
          </div>
          <button onClick={hitung} className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-sm flex items-center justify-center gap-2">
            <Calculator className="w-4 h-4" /> Hitung Quorum
          </button>
        </div>
        <div>
          {result ? (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
              <div className={`rounded-2xl border p-5 text-center ${result.lolos ? "border-emerald-500/30 bg-emerald-500/8" : "border-red-500/30 bg-red-500/8"}`}>
                <div className="text-4xl mb-2">{result.lolos ? "✅" : "❌"}</div>
                <p className={`text-lg font-black mb-1 ${result.lolos ? "text-emerald-400" : "text-red-400"}`}>
                  {result.lolos ? "QUORUM TERPENUHI" : "QUORUM TIDAK TERPENUHI"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.lolos ? "Rencana perdamaian dapat dihomologasi pengadilan." : "Rencana perdamaian belum memenuhi syarat Pasal 281 UU 37/2004."}
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Kreditor setuju", pct: result.pctKreditor, target: 50, ok: result.quorumKreditor, unit: "% (min. >50%)" },
                  { label: "Nilai tagihan setuju", pct: result.pctTagihan, target: 66.67, ok: result.quorumTagihan, unit: "% (min. ≥66,67%)" },
                ].map((r) => (
                  <div key={r.label} className={`rounded-xl border p-3 ${r.ok ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{r.label}</span>
                      <span className={`text-sm font-black ${r.ok ? "text-emerald-400" : "text-red-400"}`}>{r.pct.toFixed(1)}{r.unit}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${r.ok ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(r.pct, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {!result.lolos && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <p className="text-[10px] text-amber-300 leading-relaxed">
                    💡 Jika quorum tidak terpenuhi, rencana perdamaian ditolak dan debitor dapat dinyatakan pailit. Pertimbangkan merevisi rencana perdamaian dan melakukan pendekatan ulang kepada kreditor konkuren.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="text-5xl mb-4">🗳️</div>
              <p className="text-sm font-bold text-foreground mb-1">Isi data voting dan klik Hitung</p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">Hasil quorum berdasarkan Pasal 281 UU No. 37/2004 akan tampil di sini.</p>
              <div className="mt-5 space-y-2 text-left w-full max-w-[240px]">
                {["Syarat 1: >50% jumlah kreditor", "Syarat 2: ≥⅔ nilai tagihan", "Keduanya wajib terpenuhi"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400/60 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const FAQ_PKPU = [
  {
    q: "Apa perbedaan PKPU dan Pailit? Kapan sebaiknya memilih PKPU?",
    a: "PKPU (Penundaan Kewajiban Pembayaran Utang) adalah mekanisme restrukturisasi — debitor masih mengoperasikan usahanya di bawah pengawasan pengurus, sambil menegosiasikan rencana perdamaian. Pailit adalah likuidasi: aset dilelang dan dibagikan kepada kreditor. PKPU tepat dipilih jika debitor memiliki prospek usaha yang baik namun mengalami kesulitan likuiditas sementara.",
  },
  {
    q: "Siapa saja yang dapat mengajukan permohonan PKPU?",
    a: "PKPU dapat diajukan oleh: (1) Debitor sendiri yang memperkirakan tidak dapat melanjutkan pembayaran utang yang jatuh tempo; (2) Satu atau lebih kreditor yang memiliki tagihan yang telah jatuh tempo; atau (3) Bank Indonesia/OJK untuk lembaga keuangan tertentu. Permohonan diajukan ke Pengadilan Niaga yang berwenang.",
  },
  {
    q: "Apakah seluruh tagihan kreditor tertanggung selama PKPU berlangsung?",
    a: "Selama PKPU berlangsung, debitor tidak boleh melakukan pembayaran utang kepada kreditor konkuren tanpa persetujuan pengurus. Namun kreditor separatis (pemegang jaminan kebendaan seperti hak tanggungan, fidusia) tetap dapat mengeksekusi jaminannya setelah 90 hari sejak penetapan PKPU, kecuali pengadilan memperpanjang penangguhan.",
  },
  {
    q: "Apa konsekuensi jika rencana perdamaian ditolak dalam voting?",
    a: "Jika rencana perdamaian tidak memenuhi quorum voting (>½ kreditor yang mewakili ≥⅔ tagihan), pengadilan akan menyatakan debitor pailit secara otomatis berdasarkan Pasal 289 UU No. 37/2004. Kurator kemudian ditunjuk untuk melakukan pemberesan harta pailit.",
  },
  {
    q: "Berapa lama proses homologasi setelah voting berhasil?",
    a: "Setelah voting berhasil, Hakim Pengawas melaporkan hasil kepada Pengadilan Niaga. Pengadilan kemudian menetapkan homologasi (pengesahan rencana perdamaian) dalam sidang. Proses ini biasanya berlangsung 7-14 hari setelah voting. Rencana perdamaian yang dihomologasi memiliki kekuatan hukum mengikat semua kreditor.",
  },
  {
    q: "Apa yang dimaksud dengan kreditor separatis, preferen, dan konkuren?",
    a: "Kreditor separatis adalah pemegang jaminan kebendaan (HT, fidusia, gadai, hipotek) — diutamakan dari hasil eksekusi jaminan. Kreditor preferen adalah yang diistimewakan UU (pajak, upah pekerja, biaya perkara). Kreditor konkuren adalah kreditor tanpa jaminan khusus — mereka yang menjadi subjek utama voting rencana perdamaian PKPU.",
  },
];

function FaqPKPU() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_PKPU.map((faq, i) => (
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

export default function KlinikPKPU() {
  const [activeStage, setActiveStage] = useState("permohonan");
  const stage = PKPU_STAGES.find((s) => s.id === activeStage) ?? PKPU_STAGES[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-red-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-semibold mb-6">
              <TrendingDown className="w-3.5 h-3.5" />
              Hukum Kepailitan & Restrukturisasi Utang
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4 leading-tight">
              Klinik PKPU &
              <br />
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Kepailitan
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Panduan lengkap PKPU dan Kepailitan berdasarkan UU No. 37/2004 — dari permohonan, PKPU sementara, voting perdamaian, hingga pemberesan harta pailit. Dilengkapi generator dokumen AI dan alat bantu kurator.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/8 bg-white/4 p-3 text-center">
                  <p className="text-base font-black text-red-400">{s.val}</p>
                  <p className="text-[10px] text-foreground font-semibold leading-tight">{s.label}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PKPU STAGES INTERACTIVE ─── */}
      <section className="py-14 border-t border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Alur PKPU & Kepailitan — 5 Tahap</h2>
            <p className="text-muted-foreground text-sm">Klik setiap tahap untuk panduan, basis hukum, dan dokumen yang diperlukan.</p>
          </div>

          {/* Stage selector */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6 justify-center">
            {PKPU_STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStage(s.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border transition-all text-center min-w-[120px] ${
                  activeStage === s.id
                    ? `bg-gradient-to-br ${s.color} border-transparent text-white shadow-lg`
                    : `${s.border} bg-white/3 text-muted-foreground hover:text-foreground`
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-[11px] font-bold leading-tight">{s.label}</span>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${activeStage === s.id ? "bg-white/20" : "bg-white/8"}`}>{s.duration}</span>
              </button>
            ))}
          </div>

          {/* Stage detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-3xl border bg-gradient-to-br ${stage.color} p-1`}
            >
              <div className="bg-card/90 backdrop-blur-sm rounded-[20px] p-6 sm:p-8 grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center text-2xl`}>{stage.emoji}</div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tahap {stage.step}</p>
                      <h3 className="font-black text-foreground text-lg">{stage.label}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{stage.desc}</p>
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 mb-3">
                    <p className="text-[10px] font-bold text-amber-400 mb-1">💡 Tips Praktik Kurator</p>
                    <p className="text-xs text-foreground/80 leading-relaxed">{stage.tips}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground"><span className="font-bold text-foreground">Dasar Hukum:</span> {stage.basis}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Dokumen yang Dibutuhkan</p>
                  <div className="space-y-2 mb-5">
                    {stage.docs.map((doc) => (
                      <div key={doc} className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/3 hover:border-white/15 transition group cursor-pointer">
                        <FileText className="w-4 h-4 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                        <span className="text-sm text-foreground/85 flex-1">{doc}</span>
                        <Link href="/masuk">
                          <span className="text-[10px] font-bold text-red-400 opacity-0 group-hover:opacity-100 transition flex items-center gap-0.5 whitespace-nowrap">
                            Buat AI <Sparkles className="w-3 h-3" />
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <Link href="/masuk">
                    <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${stage.color} text-white font-bold text-sm flex items-center justify-center gap-2`}>
                      <Sparkles className="w-4 h-4" /> Generate Dokumen Tahap Ini
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── KURATOR TOOLS ─── */}
      <section className="py-14 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Alat Bantu Kurator & Pengurus AI</h2>
            <p className="text-muted-foreground text-sm">Kalkulasi, tracking, dan pelaporan otomatis — untuk kurator, pengurus PKPU, dan pengacara kepailitan.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {KURATOR_TOOLS.map((tool) => (
              <motion.div
                key={tool.title}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-white/8 bg-white/3 hover:border-red-500/20 transition-all p-5 flex gap-4"
              >
                <span className="text-2xl flex-shrink-0">{tool.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground text-sm">{tool.title}</h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">{tool.tag}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{tool.desc}</p>
                  <Link href="/masuk">
                    <button className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1">
                      Gunakan Alat <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DOCUMENT GENERATOR ─── */}
      <section className="py-14 border-t border-white/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">12 Template Dokumen PKPU/Kepailitan</h2>
            <p className="text-muted-foreground text-sm">AI mengisi setiap dokumen berdasarkan fakta kasus — dari permohonan hingga laporan kurator akhir.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {KEPAILITAN_DOCS.map((doc) => (
              <Link key={doc.label} href="/masuk">
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="rounded-xl border border-white/8 bg-white/3 hover:border-red-500/20 hover:bg-red-500/3 p-4 cursor-pointer transition-all group"
                >
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/8 ${doc.color} block w-fit mb-2`}>{doc.stage}</span>
                  <p className="text-xs font-semibold text-foreground group-hover:text-red-300 transition-colors leading-tight">{doc.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI AGENTS ─── */}
      <section className="py-14 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Kepailitan AI */}
            <div className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/30 to-orange-950/20 p-6">
              <span className="text-3xl mb-3 block">⚖️</span>
              <h3 className="font-black text-foreground text-lg mb-2">Kepailitan & PKPU AI</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Konsultasi dengan AI spesialis kepailitan — analisis kelayakan permohonan PKPU, strategi restrukturisasi utang, dan panduan hukum bagi debitor maupun kreditor.
              </p>
              {["Analisis kelayakan PKPU vs pailit", "Strategi negosiasi rencana perdamaian", "Hak-hak kreditor separatis vs konkuren", "Konsekuensi hukum kepailitan korporasi"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-foreground/80 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 flex-shrink-0" /> {f}
                </div>
              ))}
              <Link href="/agents">
                <button className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Konsultasi Kepailitan AI
                </button>
              </Link>
            </div>

            {/* Kalkulator Voting */}
            <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-yellow-950/20 p-6">
              <span className="text-3xl mb-3 block">🗳️</span>
              <h3 className="font-black text-foreground text-lg mb-2">Kalkulator Voting & Quorum</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Hitung otomatis apakah rencana perdamaian memenuhi syarat sahnya voting berdasarkan Pasal 281 UU No. 37/2004 — lebih dari ½ jumlah kreditor yang mewakili ≥ 2/3 total tagihan.
              </p>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xl font-black text-amber-400">½+</p>
                    <p className="text-[10px] text-muted-foreground">Jumlah kreditor</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-amber-400">⅔</p>
                    <p className="text-[10px] text-muted-foreground">Total nilai tagihan</p>
                  </div>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2">Keduanya harus terpenuhi bersamaan</p>
              </div>
              <Link href="/kalkulator">
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold text-sm flex items-center gap-2">
                  <Calculator className="w-4 h-4" /> Hitung Quorum Voting
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── KALKULATOR VOTING QUORUM INTERAKTIF ─── */}
      <section className="py-14 border-t border-white/8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">🗳️ Kalkulator Voting Quorum Rencana Perdamaian</h2>
            <p className="text-muted-foreground text-sm">Berdasarkan Pasal 281 UU No. 37/2004 — hitung otomatis apakah rencana perdamaian memenuhi persyaratan voting.</p>
          </div>
          <KalkulatorVoting />
        </div>
      </section>

      {/* ─── FAQ PKPU ─── */}
      <section className="py-14 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Pertanyaan yang Sering Ditanyakan</h2>
            <p className="text-muted-foreground text-sm">Panduan praktis PKPU & Kepailitan dari perspektif kurator dan advokat berpengalaman.</p>
          </div>
          <FaqPKPU />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/25 via-background to-orange-950/20 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-black text-foreground mb-3">
            Kuasai PKPU & Kepailitan
            <br />
            <span className="text-red-400">dengan Ketepatan Hukum Berbasis AI</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            Kasus kepailitan membutuhkan presisi hukum dan kecepatan dokumen yang tinggi. LexCom memastikan setiap tahap PKPU ditangani dengan benar — dari permohonan hingga homologasi perdamaian.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/masuk">
              <button className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-sm shadow-lg shadow-red-500/20 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Mulai Perkara PKPU/Kepailitan
              </button>
            </Link>
            <Link href="/agents">
              <button className="px-7 py-3.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 transition flex items-center gap-2">
                Konsultasi AI <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
