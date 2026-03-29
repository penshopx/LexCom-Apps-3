import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel, FileText, Users, ChevronRight, ArrowRight, Sparkles,
  CheckCircle2, AlertCircle, Clock, Scale, Shield, Calculator,
  MessageSquare, Brain, Target, Zap, BookOpen, TrendingUp,
} from "lucide-react";

const PHI_STAGES = [
  {
    id: "bipartit",
    step: "01",
    label: "Perundingan Bipartit",
    emoji: "🤝",
    duration: "Maks. 30 hari",
    basis: "Pasal 6–7 UU No. 2/2004",
    color: "from-blue-600 to-cyan-700",
    border: "border-blue-500/20",
    glow: "shadow-blue-500/20",
    desc: "Perundingan wajib antara pekerja/serikat dengan pengusaha sebelum proses tripartit. Risalah perundingan menjadi bukti di tahap selanjutnya.",
    docs: ["Surat Undangan Bipartit", "Risalah Perundingan Bipartit", "Daftar Hadir", "Surat Pernyataan Deadlock"],
    tips: "Jika tidak tercapai kesepakatan dalam 30 hari, wajib dibuat risalah deadlock untuk dasar pencatatan ke Disnaker.",
  },
  {
    id: "mediasi",
    step: "02",
    label: "Mediasi Disnaker",
    emoji: "🏛️",
    duration: "Maks. 30 hari",
    basis: "Pasal 8–16 UU No. 2/2004",
    color: "from-violet-600 to-purple-700",
    border: "border-violet-500/20",
    glow: "shadow-violet-500/20",
    desc: "Mediator dari Dinas Tenaga Kerja memfasilitasi perundingan. Jika tercapai kesepakatan, dibuat Perjanjian Bersama yang didaftarkan di PHI.",
    docs: ["Surat Permohonan Mediasi ke Disnaker", "Bukti Pelaksanaan Bipartit (Risalah)", "Perjanjian Bersama (jika sepakat)", "Anjuran Mediator (jika gagal)"],
    tips: "Anjuran mediator yang tidak diterima salah satu pihak menjadi dasar pengajuan gugatan ke PHI.",
  },
  {
    id: "gugatan",
    step: "03",
    label: "Gugatan ke PHI",
    emoji: "📋",
    duration: "Diajukan dalam 1 tahun",
    basis: "Pasal 83–85 UU No. 2/2004",
    color: "from-amber-600 to-orange-700",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/20",
    desc: "Gugatan diajukan ke Pengadilan Hubungan Industrial di PN setempat. Wajib melampirkan risalah mediasi dan anjuran mediator.",
    docs: ["Surat Gugatan PHI (format resmi)", "Risalah Bipartit & Mediasi", "Anjuran Mediator", "Bukti-bukti Pendukung"],
    tips: "Gugatan harus menyebutkan jenis perselisihan secara jelas: PHK, perselisihan hak, perselisihan kepentingan, atau perselisihan antar serikat.",
  },
  {
    id: "sidang",
    step: "04",
    label: "Persidangan PHI",
    emoji: "⚖️",
    duration: "50 hari kerja",
    basis: "Pasal 87–101 UU No. 2/2004",
    color: "from-emerald-600 to-green-700",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/20",
    desc: "Persidangan PHI bersifat cepat. Hakim majelis terdiri dari hakim karir + hakim ad hoc unsur pekerja dan pengusaha.",
    docs: ["Jawaban Tergugat", "Replik Penggugat", "Duplik Tergugat", "Kesimpulan Para Pihak", "Daftar Bukti"],
    tips: "Putusan PHI wajib dibacakan dalam 50 hari kerja sejak sidang pertama. Eksekusi putusan provisionil dapat dimintakan terlebih dahulu.",
  },
  {
    id: "kasasi",
    step: "05",
    label: "Kasasi ke Mahkamah Agung",
    emoji: "🏅",
    duration: "14 hari pengajuan",
    basis: "Pasal 110–115 UU No. 2/2004",
    color: "from-pink-600 to-rose-700",
    border: "border-pink-500/20",
    glow: "shadow-pink-500/20",
    desc: "Kasasi hanya untuk perselisihan PHK. Perselisihan hak yang memenuhi syarat dapat langsung dikasasi tanpa banding.",
    docs: ["Memori Kasasi", "Kontra Memori Kasasi", "Relaas Pemberitahuan Putusan", "Akta Pernyataan Kasasi"],
    tips: "Tenggang waktu 14 hari kalender dari pemberitahuan putusan. Persiapkan memori kasasi dengan argumen hukum yang kuat — tidak ada pembuktian ulang di MA.",
  },
];

const JENIS_PERKARA = [
  {
    id: "phk",
    emoji: "🔴",
    title: "Perselisihan PHK",
    desc: "Perselisihan antara pengusaha dan pekerja/buruh karena pengakhiran hubungan kerja yang tidak dibenarkan.",
    examples: ["PHK sepihak tanpa alasan sah", "PHK tanpa pesangon sesuai UU", "PHK karena aktivitas serikat pekerja"],
    aiAction: "Hitung pesangon & kompensasi optimal",
    href: "/kalkulator",
  },
  {
    id: "hak",
    emoji: "🟡",
    title: "Perselisihan Hak",
    desc: "Perselisihan akibat perbedaan pelaksanaan ketentuan UU, PP, Permen, perjanjian kerja, atau PKB.",
    examples: ["Upah tidak dibayar sesuai UMR", "Lembur tidak dibayarkan", "Cuti tidak diberikan sesuai hak"],
    aiAction: "Hitung hak pekerja yang belum dibayar",
    href: "/kalkulator",
  },
  {
    id: "kepentingan",
    emoji: "🟠",
    title: "Perselisihan Kepentingan",
    desc: "Perselisihan dalam proses perundingan pembuatan/perubahan PKB yang tidak mencapai kesepakatan.",
    examples: ["Deadlock negosiasi PKB baru", "Perubahan syarat kerja sepihak", "Penolakan tuntutan kenaikan upah"],
    aiAction: "Analisis posisi hukum negosiasi",
    href: "/agents",
  },
  {
    id: "serikat",
    emoji: "🟢",
    title: "Perselisihan Antar Serikat",
    desc: "Perselisihan antar serikat pekerja dalam satu perusahaan mengenai pelaksanaan hak dan kewajiban.",
    examples: ["Sengketa representasi PKB", "Perebutan hak perundingan", "Konflik keanggotaan serikat"],
    aiAction: "Analisis hak representasi serikat",
    href: "/agents",
  },
];

const AI_DOCS = [
  { label: "Surat Somasi PHK", stage: "Pra-Bipartit", icon: "📨", color: "text-blue-400" },
  { label: "Risalah Bipartit", stage: "Bipartit", icon: "📋", color: "text-violet-400" },
  { label: "Permohonan Mediasi Disnaker", stage: "Mediasi", icon: "📩", color: "text-amber-400" },
  { label: "Surat Gugatan PHI", stage: "Gugatan", icon: "⚖️", color: "text-emerald-400" },
  { label: "Jawaban Tergugat PHI", stage: "Persidangan", icon: "📄", color: "text-pink-400" },
  { label: "Replik Penggugat", stage: "Persidangan", icon: "📝", color: "text-cyan-400" },
  { label: "Duplik Tergugat", stage: "Persidangan", icon: "📃", color: "text-orange-400" },
  { label: "Kesimpulan Para Pihak", stage: "Persidangan", icon: "📊", color: "text-rose-400" },
  { label: "Memori Kasasi PHI", stage: "Kasasi", icon: "🏛️", color: "text-indigo-400" },
  { label: "Kontra Memori Kasasi", stage: "Kasasi", icon: "🔄", color: "text-teal-400" },
  { label: "Perjanjian Bersama PHI", stage: "Kesepakatan", icon: "🤝", color: "text-emerald-400" },
  { label: "Perhitungan Pesangon AI", stage: "Kalkulasi", icon: "🧮", color: "text-amber-400" },
];

const PHK_ALASAN = [
  { id: "efisiensi", label: "Efisiensi / Restrukturisasi", multiplier: 1 },
  { id: "pelanggaran", label: "Pelanggaran Berat (SP3)", multiplier: 1 },
  { id: "sakit", label: "Sakit Berkepanjangan (>12 bln)", multiplier: 2 },
  { id: "pensiun", label: "Pensiun", multiplier: 1 },
  { id: "meninggal", label: "Meninggal Dunia", multiplier: 2 },
  { id: "cacat", label: "Cacat Akibat Kecelakaan Kerja", multiplier: 2 },
  { id: "pekerja_resign", label: "Mengundurkan Diri", multiplier: 0 },
  { id: "pkwt", label: "PKWT Berakhir", multiplier: 0 },
];

function getPesangon(masaKerja: number): number {
  if (masaKerja < 1) return 1;
  if (masaKerja < 2) return 1;
  if (masaKerja < 3) return 2;
  if (masaKerja < 4) return 3;
  if (masaKerja < 5) return 4;
  if (masaKerja < 6) return 5;
  if (masaKerja < 7) return 6;
  if (masaKerja < 8) return 7;
  if (masaKerja < 9) return 8;
  return 9;
}

function getUPMK(masaKerja: number): number {
  if (masaKerja < 3) return 0;
  if (masaKerja < 6) return 2;
  if (masaKerja < 9) return 3;
  if (masaKerja < 12) return 4;
  if (masaKerja < 15) return 5;
  if (masaKerja < 18) return 6;
  if (masaKerja < 21) return 7;
  if (masaKerja < 24) return 8;
  return 10;
}

function PesangonKalkulator() {
  const [upah, setUpah] = useState("");
  const [masaKerja, setMasaKerja] = useState("");
  const [alasan, setAlasan] = useState("efisiensi");
  const [result, setResult] = useState<null | { pesangon: number; upmk: number; uph: number; total: number; multiplier: number }>(null);

  function hitung() {
    const upahNum = parseFloat(upah.replace(/\D/g, ""));
    const masaNum = parseInt(masaKerja);
    if (!upahNum || !masaNum) return;
    const alasanObj = PHK_ALASAN.find((a) => a.id === alasan)!;
    const m = alasanObj.multiplier;
    const bulanPesangon = getPesangon(masaNum);
    const bulanUPMK = getUPMK(masaNum);
    const pesangon = upahNum * bulanPesangon * m;
    const upmk = upahNum * bulanUPMK;
    const uph = upahNum * 0.15;
    setResult({ pesangon, upmk, uph, total: pesangon + upmk + uph, multiplier: m });
  }

  function formatRp(n: number) {
    return "Rp " + Math.round(n).toLocaleString("id-ID");
  }

  function handleUpahChange(val: string) {
    const num = val.replace(/\D/g, "");
    setUpah(num ? parseInt(num).toLocaleString("id-ID") : "");
  }

  return (
    <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-orange-950/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/8 bg-amber-500/5 flex items-center gap-3">
        <Calculator className="w-4 h-4 text-amber-400" />
        <div>
          <p className="font-black text-foreground text-sm">Kalkulator Pesangon — PP No. 35/2021</p>
          <p className="text-[10px] text-muted-foreground">Berdasarkan UU Cipta Kerja — estimasi. Konsultasikan dengan advokat untuk kepastian hukum.</p>
        </div>
      </div>
      <div className="p-6 grid sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Upah Terakhir (Gaji Pokok + Tunjangan Tetap)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">Rp</span>
              <input
                value={upah}
                onChange={(e) => handleUpahChange(e.target.value)}
                placeholder="Contoh: 10.000.000"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-amber-500/40 transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Masa Kerja (tahun penuh)</label>
            <input
              type="number"
              value={masaKerja}
              onChange={(e) => setMasaKerja(e.target.value)}
              placeholder="Contoh: 5"
              min="0"
              max="40"
              className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-amber-500/40 transition"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Alasan PHK</label>
            <select
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-card text-foreground text-sm focus:outline-none focus:border-amber-500/40 transition"
            >
              {PHK_ALASAN.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={hitung}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-sm flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" /> Hitung Pesangon
          </button>
        </div>
        <div>
          {result ? (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Hasil Estimasi Pesangon</p>
                <div className="space-y-2.5">
                  {[
                    { label: `Uang Pesangon (${result.multiplier}x ketentuan)`, val: result.pesangon, note: result.multiplier === 0 ? "Tidak berhak" : "" },
                    { label: "Uang Penghargaan Masa Kerja (UPMK)", val: result.upmk },
                    { label: "Uang Penggantian Hak (UPH) ~15%", val: result.uph },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground leading-tight">{r.label}</span>
                      <span className="text-xs font-black text-foreground text-right flex-shrink-0">
                        {r.note || formatRp(r.val)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm font-black text-foreground">TOTAL ESTIMASI</span>
                    <span className="text-lg font-black text-amber-400">{formatRp(result.total)}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-3">
                <p className="text-[10px] text-amber-300 leading-relaxed">
                  ⚠️ Hasil ini merupakan estimasi berdasarkan PP 35/2021. Besaran aktual dapat berbeda tergantung perjanjian kerja, PKB, dan putusan PHI. Konsultasikan dengan Employment Lawyer AI kami.
                </p>
              </div>
              <Link href="/agents">
                <button className="w-full py-2.5 rounded-xl border border-orange-500/30 text-orange-400 text-xs font-bold hover:bg-orange-500/5 transition flex items-center justify-center gap-2">
                  <Brain className="w-3.5 h-3.5" /> Analisis Mendalam dengan Employment AI
                </button>
              </Link>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="text-5xl mb-4">🧮</div>
              <p className="text-sm font-bold text-foreground mb-1">Isi formulir dan klik Hitung</p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                Hasil estimasi pesangon, UPMK, dan UPH akan tampil di sini sesuai PP 35/2021.
              </p>
              <div className="mt-5 space-y-2 text-left w-full max-w-[240px]">
                {["Pesangon max 9x upah", "UPMK max 10x upah", "UPH penggantian hak"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400/60 flex-shrink-0" /> {f}
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

const FAQ_PHI = [
  {
    q: "Apakah pekerja PKWT berhak atas pesangon jika kontrak tidak diperpanjang?",
    a: "Pekerja PKWT tidak berhak atas pesangon konvensional, namun berhak atas uang kompensasi (Pasal 61A UU Cipta Kerja) yang dihitung berdasarkan masa kerja PKWT yang telah dilalui — 1/12 upah per bulan yang telah dilalui.",
  },
  {
    q: "Berapa lama batas waktu mengajukan gugatan ke PHI setelah PHK?",
    a: "Gugatan ke PHI harus diajukan dalam 1 (satu) tahun sejak tanggal PHK atau sejak terjadi perselisihan. Lewat dari 1 tahun, gugatan dapat dinyatakan daluarsa oleh majelis hakim (Pasal 82 UU No. 2/2004).",
  },
  {
    q: "Apakah pesangon bisa lebih dari ketentuan UU?",
    a: "Ya, berdasarkan Pasal 1338 KUH Perdata dan prinsip kebebasan berkontrak, pengusaha dan pekerja dapat menyepakati pesangon yang lebih tinggi dari ketentuan minimum dalam UU melalui Perjanjian Kerja atau PKB.",
  },
  {
    q: "Apa perbedaan PHK efisiensi 1x dan 2x pesangon?",
    a: "PHK karena efisiensi umumnya memberikan pesangon 1x ketentuan. PHK karena perusahaan merugi selama 2 tahun berturut-turut yang dibuktikan dengan laporan keuangan yang diaudit juga 1x. Namun PHK karena peleburan/penggabungan/perubahan status yang tidak bersedia dilanjutkan oleh pekerja mendapat 1.5x.",
  },
  {
    q: "Apakah biaya pengacara dalam perkara PHI ditanggung negara?",
    a: "Perkara perselisihan hubungan industrial di PHI tidak dipungut biaya perkara (Pasal 58 UU No. 2/2004). Namun biaya kuasa hukum dan biaya transportasi/akomodasi ditanggung pihak masing-masing, kecuali ditetapkan lain oleh hakim.",
  },
  {
    q: "Bagaimana jika mediator Disnaker tidak mengeluarkan anjuran dalam 30 hari?",
    a: "Jika mediator tidak menyelesaikan tugas dalam 30 hari kerja, para pihak dapat melanjutkan ke PHI tanpa anjuran mediator (Pasal 15 ayat 2 UU No. 2/2004). Risalah ketidakhadiran mediasi atau keterlambatan dapat dilampirkan sebagai bukti.",
  },
];

function FaqPHI() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_PHI.map((faq, i) => (
        <motion.div
          key={i}
          className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
          >
            <span className="text-sm font-semibold text-foreground leading-snug">{faq.q}</span>
            <ChevronRight className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

export default function KlinikPHI() {
  const [activeStage, setActiveStage] = useState("bipartit");
  const stage = PHI_STAGES.find((s) => s.id === activeStage) ?? PHI_STAGES[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950/20 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-orange-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs font-semibold mb-6">
              <Scale className="w-3.5 h-3.5" />
              Spesialisasi Hukum Ketenagakerjaan & PHI
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4 leading-tight">
              Klinik Hukum Perburuhan
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                & PHI
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Panduan alur perkara PHI lengkap dari Bipartit hingga Kasasi Mahkamah Agung —
              dengan generator dokumen AI di setiap tahap, kalkulator pesangon otomatis, dan analisis kekuatan perkara berbasis data.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
              {[
                { val: "5", label: "Tahap PHI", icon: "🗺️" },
                { val: "12", label: "Template Dokumen", icon: "📄" },
                { val: "4", label: "Jenis Perselisihan", icon: "⚖️" },
                { val: "AI", label: "Kalkulator Pesangon", icon: "🧮" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/8 bg-white/4 p-3 text-center">
                  <span className="text-xl">{s.icon}</span>
                  <p className="text-lg font-black text-foreground">{s.val}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── ALUR PHI INTERACTIVE ─── */}
      <section className="py-14 border-t border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Alur Perkara PHI — 5 Tahap</h2>
            <p className="text-muted-foreground text-sm">Klik setiap tahap untuk melihat panduan, basis hukum, dan dokumen yang diperlukan.</p>
          </div>

          {/* Stage selector — horizontal scrollable */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6 justify-center">
            {PHI_STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStage(s.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border transition-all text-center min-w-[110px] ${
                  activeStage === s.id
                    ? `bg-gradient-to-br ${s.color} border-transparent text-white shadow-lg ${s.glow}`
                    : `${s.border} bg-white/3 text-muted-foreground hover:text-foreground`
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-[11px] font-bold leading-tight">{s.label}</span>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${activeStage === s.id ? "bg-white/20 text-white" : "bg-white/8"}`}>
                  {s.duration}
                </span>
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
              transition={{ duration: 0.2 }}
              className={`rounded-3xl border bg-gradient-to-br ${stage.color} p-1`}
            >
              <div className="bg-card/90 backdrop-blur-sm rounded-[20px] p-6 sm:p-8 grid sm:grid-cols-2 gap-6">
                {/* Left */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center text-2xl`}>{stage.emoji}</div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tahap {stage.step}</p>
                      <h3 className="font-black text-foreground text-lg">{stage.label}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{stage.desc}</p>
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                    <p className="text-[10px] font-bold text-amber-400 mb-1">💡 Tips Praktik</p>
                    <p className="text-xs text-foreground/80 leading-relaxed">{stage.tips}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3">
                    <span className="font-bold text-foreground">Dasar Hukum:</span> {stage.basis}
                  </p>
                </div>
                {/* Right */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Dokumen yang Dibutuhkan</p>
                  <div className="space-y-2 mb-5">
                    {stage.docs.map((doc) => (
                      <div key={doc} className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/3 hover:border-white/15 transition-colors cursor-pointer group">
                        <FileText className="w-4 h-4 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                        <span className="text-sm text-foreground/85 flex-1">{doc}</span>
                        <Link href="/masuk">
                          <span className="text-[10px] font-bold text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 whitespace-nowrap">
                            Buat AI <Sparkles className="w-3 h-3" />
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <Link href="/masuk">
                    <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${stage.color} text-white font-bold text-sm flex items-center justify-center gap-2`}>
                      <Sparkles className="w-4 h-4" /> Generate Semua Dokumen Tahap Ini
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── JENIS PERKARA PHI ─── */}
      <section className="py-14 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">4 Jenis Perselisihan PHI</h2>
            <p className="text-muted-foreground text-sm">Pilih jenis perkara untuk analisis AI, strategi, dan dokumen yang relevan.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {JENIS_PERKARA.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-white/8 bg-white/3 hover:border-orange-500/20 transition-all p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <h3 className="font-black text-foreground text-sm">{p.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.desc}</p>
                <div className="space-y-1 mb-4">
                  {p.examples.map((e) => (
                    <div key={e} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-orange-400/60" />
                      {e}
                    </div>
                  ))}
                </div>
                <Link href={p.href}>
                  <button className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5" /> {p.aiAction} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI DOCUMENT GENERATOR ─── */}
      <section className="py-14 border-t border-white/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">12 Template Dokumen PHI — AI Generator</h2>
            <p className="text-muted-foreground text-sm">Dari somasi pra-bipartit hingga memori kasasi — semua dibuat AI berdasarkan fakta perkara yang Anda input.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {AI_DOCS.map((doc) => (
              <Link key={doc.label} href="/masuk">
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="rounded-xl border border-white/8 bg-white/3 hover:border-orange-500/20 hover:bg-orange-500/3 p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{doc.icon}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/8 ${doc.color}`}>{doc.stage}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-orange-300 transition-colors leading-tight">{doc.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KALKULASI & AI AGENTS ─── */}
      <section className="py-14 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Kalkulator Pesangon */}
            <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-orange-950/20 p-6">
              <div className="text-2xl mb-3">🧮</div>
              <h3 className="font-black text-foreground text-lg mb-2">Kalkulator Pesangon & Kompensasi</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Hitung pesangon, uang penghargaan masa kerja, dan uang penggantian hak secara otomatis berdasarkan UU Cipta Kerja (UU No. 11/2020) dan peraturan turunannya.
              </p>
              <div className="space-y-2 mb-5">
                {["Pesangon (1x atau 2x ketentuan)", "Uang penghargaan masa kerja", "Uang penggantian hak (cuti, dll)", "Uang pisah (jika diperjanjikan)"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-foreground/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
              <Link href="/kalkulator">
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm flex items-center gap-2">
                  <Calculator className="w-4 h-4" /> Hitung Pesangon Sekarang
                </button>
              </Link>
            </div>

            {/* Employment Lawyer AI */}
            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-green-950/20 p-6">
              <div className="text-2xl mb-3">⚖️</div>
              <h3 className="font-black text-foreground text-lg mb-2">Employment Lawyer AI</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Konsultasi langsung dengan AI spesialis hukum ketenagakerjaan — analisis kekuatan perkara PHK, strategi negosiasi pesangon, dan panduan prosedur PHI.
              </p>
              <div className="space-y-2 mb-5">
                {["Analisis legalitas PHK", "Strategi negosiasi pesangon", "Review perjanjian kerja & PKB", "Simulasi argumen persidangan"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-foreground/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
              <Link href="/agents/employment">
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Konsultasi Employment AI
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── KALKULATOR PESANGON INTERAKTIF ─── */}
      <section className="py-14 border-t border-white/8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">🧮 Kalkulator Pesangon Interaktif</h2>
            <p className="text-muted-foreground text-sm">Berdasarkan UU Cipta Kerja (PP No. 35/2021) — hitung otomatis pesangon, UPMK, dan UPH.</p>
          </div>
          <PesangonKalkulator />
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-14 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Pertanyaan yang Sering Ditanyakan</h2>
          </div>
          <FaqPHI />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950/30 via-background to-amber-950/20 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-black text-foreground mb-3">
            Tangani Perkara PHI dengan
            <br />
            <span className="text-orange-400">Presisi dan Kecepatan AI</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            Gugatan PHI ditolak bukan karena hukumnya lemah — tapi karena salah alur dan salah dokumen. LexCom memastikan setiap langkah benar, setiap dokumen tepat.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/masuk">
              <button className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Mulai Perkara PHI Sekarang
              </button>
            </Link>
            <Link href="/agents/employment">
              <button className="px-7 py-3.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 transition flex items-center gap-2">
                Konsultasi Employment AI <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
