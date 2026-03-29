import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, BookOpen, Award, Calendar, Clock, Users, ChevronRight,
  CheckCircle2, Sparkles, Zap, Star, ArrowRight, Play, FileText,
  Shield, Scale, PenLine, Building2, Gavel, Search, Globe,
  BadgeCheck, Layers, Hash, ChevronDown,
} from "lucide-react";

const PROFESI = [
  {
    id: "advokat",
    emoji: "⚖️",
    label: "Advokat",
    sub: "UU No. 18/2003 tentang Advokat",
    color: "from-violet-600 to-purple-700",
    border: "border-violet-500/25",
    bg: "bg-violet-500/5",
    accent: "text-violet-400",
    badge: "bg-violet-500/20 text-violet-300",
    peserta: "Calon Advokat, Advokat Magang, Advokat Aktif",
    sertifikat: "Sertifikat BimTek Advokat LexCom",
    modul: [
      {
        no: 1, judul: "Etika Profesi & Kode Etik Advokat",
        materi: ["Kode Etik Advokat Indonesia (KEAI)", "Larangan rangkap jabatan", "Hubungan dengan klien & pengadilan", "Sanksi pelanggaran etika", "Studi kasus pelanggaran nyata"],
      },
      {
        no: 2, judul: "Hukum Acara Pidana — Litigasi Praktis",
        materi: ["Alur perkara pidana P21 hingga vonis", "Teknik interogasi & BAP", "Strategi pledoi yang efektif", "Upaya hukum: banding, kasasi, PK", "KUHAP Baru (berlaku 2 Jan 2026)"],
      },
      {
        no: 3, judul: "Hukum Acara Perdata — Drafting & Strategi",
        materi: ["Gugatan & replik-duplik yang kuat", "Teknik pembuktian & alat bukti", "Eksekusi putusan pengadilan", "Sita jaminan & conservatoir beslag", "Mediasi wajib (PERMA No. 1/2016)"],
      },
      {
        no: 4, judul: "Legal Research & Penulisan Hukum",
        materi: ["Metodologi riset hukum dogmatik & empiris", "Riset yurisprudensi MA & MK", "Penulisan legal memorandum & opinion", "Sitasi & referensi standar hukum", "AI-assisted legal research dengan LexCom"],
      },
      {
        no: 5, judul: "Manajemen Firma Hukum & Billing",
        materi: ["Struktur firma: solo, partnership, law firm", "Perjanjian fee & billing arrangement", "Time tracking & invoice management", "Retainer agreement yang sah", "Pengembangan klien & marketing etis"],
      },
      {
        no: 6, judul: "Pembaruan Hukum: KUHP & KUHAP Baru 2026",
        materi: ["Materi baru KUHP UU No. 1/2023", "Perubahan signifikan vs KUHP lama", "Implikasi KUHAP baru bagi praktik litigasi", "Penyesuaian dokumen & template", "Simulasi perkara berbasis KUHP baru"],
      },
    ],
  },
  {
    id: "notaris",
    emoji: "🏛️",
    label: "Notaris & PPAT",
    sub: "UU No. 2/2014 tentang Jabatan Notaris",
    color: "from-amber-600 to-orange-700",
    border: "border-amber-500/25",
    bg: "bg-amber-500/5",
    accent: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300",
    peserta: "Notaris, Calon Notaris, PPAT, Staf Kantor Notaris",
    sertifikat: "Sertifikat BimTek Notaris LexCom",
    modul: [
      {
        no: 1, judul: "Jabatan Notaris: Kewenangan & Batas",
        materi: ["Kewenangan notaris berdasarkan UUJN 2014", "Wilayah jabatan & larangan", "Akta autentik vs akta di bawah tangan", "Tanggungjawab perdata & pidana notaris", "Protokol notaris & penyimpanan minuta"],
      },
      {
        no: 2, judul: "Pembuatan Akta Autentik",
        materi: ["Prosedur pembuatan akta yang sah", "Identifikasi & verifikasi penghadap", "Pembacaan akta & penandatanganan", "Akta yang bermasalah & pembatalan", "Akta pendirian PT, CV, Yayasan, Koperasi"],
      },
      {
        no: 3, judul: "Akta Hak Atas Tanah (PPAT)",
        materi: ["Perbedaan peran Notaris vs PPAT", "AJB, APHT, Fidusia, APH", "BPHTB & PPh transaksi tanah", "Pengecekan sertifikat BPN", "Sertifikat Hak Milik, HGB, HGU, HP"],
      },
      {
        no: 4, judul: "Akta Korporasi & Bisnis",
        materi: ["Akta pendirian & perubahan PT", "RUPS tahunan & luar biasa", "Akta Pengalihan Saham & GMS", "Merger, akuisisi & spin-off", "Corporate action di OSS & AHU Online"],
      },
      {
        no: 5, judul: "Hukum Waris & Keluarga",
        materi: ["Surat keterangan ahli waris", "Akta wasiat & codicil", "Akta perjanjian perkawinan", "Akta hibah & peruntukan", "Waris Islam vs perdata: perbedaan prosedur"],
      },
      {
        no: 6, judul: "Digitalisasi & E-Notariat",
        materi: ["Regulasi e-notariat di Indonesia", "Tanda tangan elektronik tersertifikasi (BSSN)", "OSS, AHU Online & SABH", "Verifikasi identitas digital (e-KYC)", "LexCom AI untuk drafting akta"],
      },
    ],
  },
  {
    id: "kepaniteraan",
    emoji: "🔨",
    label: "Kepaniteraan Pengadilan",
    sub: "Panitera, Panitera Muda, Panitera Pengganti",
    color: "from-sky-600 to-blue-700",
    border: "border-sky-500/25",
    bg: "bg-sky-500/5",
    accent: "text-sky-400",
    badge: "bg-sky-500/20 text-sky-300",
    peserta: "Panitera, Panitera Muda, Panitera Pengganti, Calon Panitera",
    sertifikat: "Sertifikat BimTek Kepaniteraan LexCom",
    modul: [
      {
        no: 1, judul: "Tugas & Fungsi Kepaniteraan",
        materi: ["Struktur kepaniteraan pengadilan", "Tugas panitera, panmud & panitera pengganti", "Sumpah jabatan & kode etik panitera", "Sistem administrasi peradilan (SIPP)", "Koordinasi dengan ketua pengadilan"],
      },
      {
        no: 2, judul: "Administrasi Perkara Perdata",
        materi: ["Penerimaan & pendaftaran gugatan", "Penetapan majelis hakim & PP", "Pemanggilan pihak (relaas)", "Penyusunan berita acara sidang", "Minutasi & arsip berkas perkara"],
      },
      {
        no: 3, judul: "Administrasi Perkara Pidana",
        materi: ["Pelimpahan berkas dari JPU", "Penanganan tahanan pengadilan", "BA persidangan pidana", "Ekspedisi putusan ke kejaksaan & LP", "Monitoring masa tahanan"],
      },
      {
        no: 4, judul: "Sistem Informasi Pengadilan (SIPP & e-Court)",
        materi: ["Input perkara di SIPP MA RI", "e-Court: pendaftaran & pembayaran online", "e-Summons (pemanggilan elektronik)", "e-Litigation & sidang online", "Pelaporan & statistik perkara"],
      },
      {
        no: 5, judul: "Eksekusi Putusan Pengadilan",
        materi: ["Aanmaning & peringatan", "Sita eksekusi & lelang", "Eksekusi putusan TUN", "Eksekusi grosse akta notaris", "Hambatan eksekusi & solusinya"],
      },
      {
        no: 6, judul: "Pengelolaan Keuangan Perkara",
        materi: ["Panjar biaya perkara & PNBP", "Biaya proses & radius", "Akuntansi perkara kepaniteraan", "Pelaporan keuangan ke MA", "Audit internal kepaniteraan"],
      },
    ],
  },
  {
    id: "ppat",
    emoji: "📜",
    label: "PPAT",
    sub: "Pejabat Pembuat Akta Tanah — PP No. 37/1998",
    color: "from-teal-600 to-green-700",
    border: "border-teal-500/25",
    bg: "bg-teal-500/5",
    accent: "text-teal-400",
    badge: "bg-teal-500/20 text-teal-300",
    peserta: "PPAT, Calon PPAT, PPAT Sementara (Camat)",
    sertifikat: "Sertifikat BimTek PPAT LexCom",
    modul: [
      {
        no: 1, judul: "Kewenangan & Wilayah Kerja PPAT",
        materi: ["Pengertian & dasar hukum PPAT", "Perbedaan PPAT, PPAT Sementara, & PPAT Khusus", "Wilayah kerja & larangan", "Pengangkatan & pemberhentian PPAT", "Majelis Pembina & Pengawas PPAT"],
      },
      {
        no: 2, judul: "Akta Hak Atas Tanah",
        materi: ["Jenis-jenis akta PPAT: AJB, APHT, APH, dll", "Persyaratan & dokumen yang diperlukan", "Prosedur pembuatan & penandatanganan", "Penolakan pembuatan akta", "Penyimpanan & protokol akta"],
      },
      {
        no: 3, judul: "Hak Tanggungan & Fidusia",
        materi: ["Akta Pemberian Hak Tanggungan (APHT)", "Penghapusan hak tanggungan (roya)", "Perbedaan HT vs fidusia vs gadai", "Lelang eksekusi HT", "HT dalam kredit perbankan"],
      },
      {
        no: 4, judul: "Perpajakan Transaksi Tanah",
        materi: ["PPh final atas pengalihan hak tanah", "BPHTB — Bea Perolehan Hak Tanah & Bangunan", "e-BPHTB & e-PPh online", "Nilai pasar vs NJOP dalam perpajakan", "Sanksi keterlambatan pembayaran"],
      },
      {
        no: 5, judul: "Pendaftaran Tanah & BPN",
        materi: ["Sistem pendaftaran tanah di Indonesia", "Proses balik nama sertifikat", "Pemisahan, penggabungan & pemecahan", "Sertifikat elektronik BPN", "Konflik & sengketa hak atas tanah"],
      },
      {
        no: 6, judul: "Praktik Digital PPAT",
        materi: ["AHU Online & BPN Online", "e-Sertifikat & verifikasi digital", "Pengecekan hak tanggungan online", "Integrasi PPAT dengan sistem bank", "LexCom AI untuk drafting akta PPAT"],
      },
    ],
  },
  {
    id: "kurator",
    emoji: "🏗️",
    label: "Kurator & Pengurus PKPU",
    sub: "UU No. 37/2004 tentang Kepailitan & PKPU",
    color: "from-red-600 to-rose-700",
    border: "border-red-500/25",
    bg: "bg-red-500/5",
    accent: "text-red-400",
    badge: "bg-red-500/20 text-red-300",
    peserta: "Kurator, Pengurus PKPU, Calon Kurator, Hakim Pengawas",
    sertifikat: "Sertifikat BimTek Kurator LexCom",
    modul: [
      {
        no: 1, judul: "Hukum Kepailitan & PKPU — Dasar",
        materi: ["Syarat permohonan kepailitan", "Perbedaan PKPU vs kepailitan", "Peran kurator vs pengurus PKPU", "Kreditur separatis, konkuren & preferen", "Hakim pengawas & pengadilan niaga"],
      },
      {
        no: 2, judul: "Tugas & Kewajiban Kurator",
        materi: ["Penetapan & sumpah kurator", "Inventarisasi & penilaian harta pailit", "Pengelolaan usaha debitor pailit", "Laporan kurator berkala", "Koordinasi dengan hakim pengawas"],
      },
      {
        no: 3, judul: "Verifikasi Utang & Rapat Kreditur",
        materi: ["Proses pencocokan piutang", "Daftar piutang tetap & sementara", "Tata cara rapat kreditur", "Voting & quorum rencana perdamaian", "Homologasi perdamaian PKPU"],
      },
      {
        no: 4, judul: "Pemberesan Harta Pailit",
        materi: ["Actio Pauliana (pembatalan perbuatan hukum)", "Penjualan harta pailit (lelang & BaS)", "Urutan distribusi hasil pemberesan", "Rehabilitasi debitor pailit", "Penutupan kepailitan"],
      },
      {
        no: 5, judul: "Akuntansi & Pelaporan Kepailitan",
        materi: ["Pembukuan harta pailit terpisah", "Laporan keuangan kepailitan", "Biaya kepailitan & honor kurator", "Audit harta pailit", "LexCom AI untuk laporan kurator"],
      },
      {
        no: 6, judul: "Restrukturisasi & Corporate Rescue",
        materi: ["PKPU sebagai jalan menghindari pailit", "Rencana perdamaian yang layak", "Negosiasi dengan kreditur mayoritas", "Perbandingan dengan Chapter 11 AS", "Studi kasus PKPU sukses di Indonesia"],
      },
    ],
  },
  {
    id: "hrd",
    emoji: "👷",
    label: "Legal & HRD Perusahaan",
    sub: "UU No. 13/2003, UU Cipta Kerja, dan PP turunan",
    color: "from-pink-600 to-fuchsia-700",
    border: "border-pink-500/25",
    bg: "bg-pink-500/5",
    accent: "text-pink-400",
    badge: "bg-pink-500/20 text-pink-300",
    peserta: "Legal Officer, HRD Manager, Corporate Secretary, Compliance Officer",
    sertifikat: "Sertifikat BimTek Legal HRD LexCom",
    modul: [
      {
        no: 1, judul: "Hukum Ketenagakerjaan — Update 2026",
        materi: ["UU No. 13/2003 & UU Cipta Kerja", "PKWT, PKWTT, & alih daya (outsourcing)", "Hak & kewajiban pengusaha vs pekerja", "Upah minimum & komponen upah", "Jamsostek, BPJS Ketenagakerjaan & Kesehatan"],
      },
      {
        no: 2, judul: "PHK, Pesangon & Penyelesaian Sengketa",
        materi: ["Alasan PHK yang sah secara hukum", "Rumus pesangon, UPMK, uang penggantian hak", "Prosedur PHK yang benar", "Mediasi Disnaker & PHI", "Bipartit & tripartit dalam sengketa kerja"],
      },
      {
        no: 3, judul: "Perjanjian Kerja, SOP & Peraturan Perusahaan",
        materi: ["Drafting PKWT & PKWTT yang sah", "Peraturan Perusahaan (PP) & PKB", "Non-compete & kerahasiaan karyawan", "SOP rekrutmen, onboarding, evaluasi", "Pengesahan PP ke Disnaker"],
      },
      {
        no: 4, judul: "Compliance Ketenagakerjaan",
        materi: ["Wajib lapor ketenagakerjaan (Wajib Lapor)", "Audit ketenagakerjaan oleh Disnaker", "Sanksi pelanggaran hukum kerja", "Keselamatan & Kesehatan Kerja (K3)", "Diversity, equity & inclusion dalam hukum"],
      },
      {
        no: 5, judul: "Corporate Legal untuk Non-Lawyer",
        materi: ["Review kontrak bisnis: apa yang perlu dicek", "Klausul risiko tinggi yang sering terlewat", "Negosiasi kontrak — perspektif perusahaan", "IP & perlindungan data perusahaan", "Perizinan usaha & OSS RBA"],
      },
      {
        no: 6, judul: "Digitalisasi HR & Legal Ops",
        materi: ["HRIS & HRMS dalam konteks hukum", "e-Contract & tanda tangan elektronik", "Perlindungan data karyawan (UU PDP)", "Pembuktian elektronik dalam sengketa kerja", "LexCom Legal Ops Suite untuk HR"],
      },
    ],
  },
];

const JADWAL = [
  { tanggal: "5–6 April 2026", profesi: "Advokat", format: "Online", slot: "18 tersisa", level: "Dasar & Lanjutan" },
  { tanggal: "12–13 April 2026", profesi: "Notaris & PPAT", format: "Online", slot: "22 tersisa", level: "Teknis & Praktis" },
  { tanggal: "19 April 2026", profesi: "Kepaniteraan", format: "Online", slot: "30 tersisa", level: "Dasar" },
  { tanggal: "26–27 April 2026", profesi: "Kurator & PKPU", format: "Online", slot: "15 tersisa", level: "Intensif" },
  { tanggal: "3 Mei 2026", profesi: "Legal & HRD", format: "Online", slot: "40 tersisa", level: "Praktis" },
  { tanggal: "10 Mei 2026", profesi: "PPAT", format: "Online", slot: "25 tersisa", level: "Lanjutan" },
];

export default function BimTek() {
  const [activeProfesi, setActiveProfesi] = useState("advokat");
  const [openModul, setOpenModul] = useState<number | null>(null);
  const profesi = PROFESI.find(p => p.id === activeProfesi)!;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-violet-600/7 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold mb-5">
              <GraduationCap className="w-3.5 h-3.5" />
              Bimbingan Teknis Profesi Hukum — Bersertifikat
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-foreground mb-4 leading-tight">
              BimTek
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Profesi Hukum
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-7">
              Program bimbingan teknis terakreditasi untuk seluruh profesi hukum di Indonesia — Advokat, Notaris, Panitera, PPAT, Kurator, hingga Legal Officer korporasi. Didukung AI LexCom untuk simulasi kasus nyata.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {[
                { val: "6", label: "Jalur Profesi", color: "text-violet-400" },
                { val: "36", label: "Modul BimTek", color: "text-purple-400" },
                { val: "AI", label: "Simulasi Kasus", color: "text-fuchsia-400" },
                { val: "CPD", label: "Kredit Poin Profesi", color: "text-pink-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/8 bg-white/4 p-3 text-center">
                  <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PROFESI TABS ─── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto scrollbar-hide">
          {PROFESI.map((p) => (
            <button
              key={p.id}
              onClick={() => { setActiveProfesi(p.id); setOpenModul(null); }}
              className={`flex-shrink-0 flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeProfesi === p.id
                  ? `${p.bg} ${p.accent} border ${p.border}`
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <span>{p.emoji}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── PROFESI CONTENT ─── */}
      <div className="flex-1 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProfesi}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className={`rounded-2xl border ${profesi.border} ${profesi.bg} p-6 mb-7`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${profesi.color} flex items-center justify-center text-2xl`}>{profesi.emoji}</div>
                    <div>
                      <h2 className="text-xl font-black text-foreground">{profesi.label}</h2>
                      <p className="text-xs text-muted-foreground mb-1">{profesi.sub}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${profesi.badge}`}>{profesi.sertifikat}</span>
                    </div>
                  </div>
                  <Link href="/masuk">
                    <button className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${profesi.color} text-white text-sm font-bold flex items-center gap-2 shadow-lg`}>
                      <GraduationCap className="w-4 h-4" /> Daftar BimTek
                    </button>
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t border-white/8 grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Peserta</p>
                    <p className="text-xs text-foreground">{profesi.peserta}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Jumlah Modul</p>
                    <p className={`text-xs font-bold ${profesi.accent}`}>{profesi.modul.length} Modul BimTek</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Metode</p>
                    <p className="text-xs text-foreground">Online + AI Simulasi Kasus + Sertifikasi</p>
                  </div>
                </div>
              </div>

              {/* Modul list */}
              <div className="mb-3 flex items-center gap-2">
                <Layers className={`w-4 h-4 ${profesi.accent}`} />
                <h3 className="text-sm font-black text-foreground">Kurikulum BimTek — {profesi.modul.length} Modul</h3>
              </div>
              <div className="space-y-3 mb-8">
                {profesi.modul.map((m) => (
                  <div key={m.no} className={`rounded-2xl border ${profesi.border} bg-white/2 overflow-hidden`}>
                    <button
                      onClick={() => setOpenModul(openModul === m.no ? null : m.no)}
                      className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/3 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${profesi.color} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-xs font-black text-white">{m.no}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">{m.judul}</p>
                        <p className="text-[11px] text-muted-foreground">{m.materi.length} topik bahasan</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${openModul === m.no ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openModul === m.no && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1 border-t border-white/5">
                            <div className="grid sm:grid-cols-2 gap-2">
                              {m.materi.map((t) => (
                                <div key={t} className="flex items-start gap-2">
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${profesi.accent} flex-shrink-0 mt-0.5`} />
                                  <span className="text-xs text-foreground/85">{t}</span>
                                </div>
                              ))}
                            </div>
                            <div className={`mt-4 rounded-xl border ${profesi.border} ${profesi.bg} p-3 flex items-center gap-2`}>
                              <Sparkles className={`w-3.5 h-3.5 ${profesi.accent} flex-shrink-0`} />
                              <p className="text-xs text-foreground/80">Dilengkapi simulasi kasus nyata berbasis AI LexCom — tekan kasus, AI analisis, diskusi langsung dengan fasilitator.</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* What you'll get */}
              <div className="rounded-2xl border border-white/8 bg-white/3 p-6 mb-7">
                <h3 className="text-sm font-black text-foreground mb-4">Yang Anda Dapatkan</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: Award, label: "Sertifikat BimTek", desc: "Sertifikat digital terverifikasi, dapat diunduh dan dibagikan" },
                    { icon: BookOpen, label: "Materi PDF Lengkap", desc: "Semua slide & handout BimTek tersedia setelah sesi selesai" },
                    { icon: Sparkles, label: "AI Simulasi Kasus", desc: "Latih kemampuan dengan studi kasus nyata dianalisis oleh AI" },
                    { icon: Users, label: "Komunitas Alumni", desc: "Bergabung dengan grup profesional hukum aktif LexCom" },
                    { icon: Play, label: "Rekaman Sesi", desc: "Akses ulang rekaman sesi selama 90 hari setelah BimTek" },
                    { icon: BadgeCheck, label: "CPD/SKP Points", desc: "Kredit poin pendidikan profesi berkelanjutan (sesuai asosiasi)" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${profesi.color} flex items-center justify-center flex-shrink-0`}>
                        <item.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{item.label}</p>
                        <p className="text-[11px] text-muted-foreground leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ─── JADWAL ─── */}
      <section className="py-12 border-t border-white/8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-foreground">Jadwal BimTek — April–Mei 2026</h2>
              <p className="text-xs text-muted-foreground">Semua sesi online via platform LexCom, 09.00–17.00 WIB</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {JADWAL.map((j) => (
              <div key={j.tanggal} className="rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-bold text-violet-400">{j.tanggal}</span>
                </div>
                <h3 className="font-bold text-foreground text-sm mb-0.5">{j.profesi}</h3>
                <p className="text-xs text-muted-foreground mb-3">{j.level}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-bold">{j.slot}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground bg-white/8 px-2 py-0.5 rounded-full">{j.format}</span>
                    <Link href="/masuk">
                      <button className="text-[10px] font-bold text-violet-400 hover:text-violet-300">Daftar →</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 relative overflow-hidden border-t border-white/8">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/25 via-background to-purple-950/15 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-black text-foreground mb-3">
            Tingkatkan Kompetensi Profesi Hukum
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Bersama LexCom BimTek</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            36 modul teknis untuk 6 jalur profesi. Dipandu praktisi berpengalaman, dilengkapi simulasi AI kasus nyata, bersertifikat, dan dapat diikuti sepenuhnya online.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/masuk">
              <button className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-violet-500/20 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Daftar BimTek Sekarang
              </button>
            </Link>
            <Link href="/akademi-advokat">
              <button className="px-7 py-3.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 transition flex items-center gap-2">
                Lihat Akademi Advokat <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
