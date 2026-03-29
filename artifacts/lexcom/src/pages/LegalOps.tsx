import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, BarChart3, FileText, Shield, Scale, Users, Clock,
  CheckCircle2, AlertCircle, ArrowRight, ChevronRight, Sparkles,
  Zap, TrendingUp, TrendingDown, Bell, Calendar, PenLine,
  Briefcase, RefreshCcw, Download, Plus, Filter, Search,
  CircleDot, GitBranch, Layers, Globe, Lock, LayoutDashboard,
} from "lucide-react";

const MODULES = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Ringkasan seluruh aktivitas legal" },
  { id: "clm", label: "CLM Kontrak", icon: GitBranch, desc: "Contract Lifecycle Management" },
  { id: "litigation", label: "Sengketa", icon: Scale, desc: "Monitoring perkara aktif" },
  { id: "compliance", label: "Compliance", icon: Shield, desc: "Obligation register & kalender" },
  { id: "intake", label: "Legal Intake", icon: Bell, desc: "Triage permintaan internal" },
  { id: "counsel", label: "External Counsel", icon: Users, desc: "Manajemen pengacara eksternal" },
];

const MOCK_CONTRACTS = [
  { id: "K-2026-041", title: "Perjanjian Distribusi – PT Maju Jaya", type: "Distribusi", status: "review", risk: "medium", expire: "31 Agt 2026", counterparty: "PT Maju Jaya Tbk", value: "Rp 4,2M/thn" },
  { id: "K-2026-038", title: "NDA – Proyek Akuisisi Hotel Permata", type: "NDA", status: "signed", risk: "low", expire: "30 Jun 2026", counterparty: "Konsorsium ABC", value: "–" },
  { id: "K-2026-035", title: "Perjanjian Kerja PKWT – Batch Q1", type: "Ketenagakerjaan", status: "active", risk: "low", expire: "31 Mar 2027", counterparty: "Internal", value: "32 pekerja" },
  { id: "K-2026-029", title: "Kontrak EPC Gedung Kantor Pusat", type: "Konstruksi", status: "negotiation", risk: "high", expire: "15 Apr 2027", counterparty: "PT Konstruksi Prima", value: "Rp 48M" },
  { id: "K-2026-022", title: "SLA IT Services – Cloud Infrastructure", type: "IT/SaaS", status: "active", risk: "medium", expire: "28 Feb 2027", counterparty: "CloudVelocity Inc.", value: "USD 120K/yr" },
];

const MOCK_LITIGATION = [
  { id: "L-2026-008", title: "Gugatan Wanprestasi – PT Sumber Alam", court: "PN Jakarta Selatan", type: "Perdata", status: "sidang", nextDate: "3 Apr 2026", stage: "Pembuktian", risk: "high" },
  { id: "L-2026-005", title: "Sengketa Merek Dagang – LogoX", court: "PN Niaga Jakarta", type: "HKI", status: "gugatan", nextDate: "10 Apr 2026", stage: "Sidang Pertama", risk: "medium" },
  { id: "L-2025-041", title: "PHK Massal – 12 Karyawan", court: "PHI Jakarta", type: "Ketenagakerjaan", status: "mediasi", nextDate: "7 Apr 2026", stage: "Mediasi Disnaker", risk: "medium" },
  { id: "L-2025-033", title: "Banding Pajak PPh Badan 2023", court: "Pengadilan Pajak", type: "Pajak", status: "banding", nextDate: "22 Apr 2026", stage: "Memori Banding", risk: "high" },
];

const MOCK_COMPLIANCE = [
  { id: "C-001", title: "Laporan GCG Tahunan ke OJK", category: "Regulasi OJK", deadline: "30 Apr 2026", status: "ontrack", owner: "Legal & Compliance" },
  { id: "C-002", title: "Pembaruan Kebijakan PDP Internal", category: "Data Privacy", deadline: "15 Apr 2026", status: "overdue", owner: "DPO" },
  { id: "C-003", title: "Perpanjangan Izin Usaha SIUP", category: "Perizinan", deadline: "31 Mei 2026", status: "ontrack", owner: "Corporate Secretary" },
  { id: "C-004", title: "Audit Internal Kepatuhan UU Anti-Suap", category: "Anti-Korupsi", deadline: "1 Jun 2026", status: "ontrack", owner: "Legal" },
  { id: "C-005", title: "RUPS Tahunan — Persetujuan Laporan", category: "Corporate Gov.", deadline: "30 Apr 2026", status: "urgent", owner: "Corporate Secretary" },
];

const MOCK_INTAKE = [
  { id: "LI-089", title: "Review kontrak vendor IT baru", requestor: "Divisi IT", priority: "high", type: "Review Kontrak", status: "pending", created: "28 Mar 2026" },
  { id: "LI-088", title: "Advice klausul kerahasiaan kemitraan", requestor: "Divisi Bisnis", priority: "medium", type: "Legal Advice", status: "inprogress", created: "27 Mar 2026" },
  { id: "LI-087", title: "Drafting addendum perjanjian sewa gedung", requestor: "GA/Aset", priority: "low", type: "Drafting", status: "inprogress", created: "26 Mar 2026" },
  { id: "LI-086", title: "Analisis risiko hukum ekspansi ke Vietnam", requestor: "CEO Office", priority: "high", type: "Legal Memo", status: "pending", created: "25 Mar 2026" },
];

const statusBadge: Record<string, string> = {
  review: "bg-amber-500/20 text-amber-300",
  signed: "bg-emerald-500/20 text-emerald-300",
  active: "bg-blue-500/20 text-blue-300",
  negotiation: "bg-violet-500/20 text-violet-300",
  expired: "bg-red-500/20 text-red-300",
  sidang: "bg-violet-500/20 text-violet-300",
  gugatan: "bg-amber-500/20 text-amber-300",
  mediasi: "bg-blue-500/20 text-blue-300",
  banding: "bg-orange-500/20 text-orange-300",
  ontrack: "bg-emerald-500/20 text-emerald-300",
  overdue: "bg-red-500/20 text-red-300",
  urgent: "bg-orange-500/20 text-orange-300",
  pending: "bg-amber-500/20 text-amber-300",
  inprogress: "bg-blue-500/20 text-blue-300",
};
const statusLabel: Record<string, string> = {
  review: "Review", signed: "Ditandatangani", active: "Aktif", negotiation: "Negosiasi",
  sidang: "Berjalan", gugatan: "Tahap Gugatan", mediasi: "Mediasi", banding: "Banding",
  ontrack: "On Track", overdue: "Terlambat", urgent: "Mendesak",
  pending: "Menunggu", inprogress: "Dikerjakan",
};
const riskBadge: Record<string, string> = {
  low: "text-emerald-400", medium: "text-amber-400", high: "text-red-400",
};

export default function LegalOps() {
  const [activeModule, setActiveModule] = useState("dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-sky-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs font-semibold mb-5">
              <Building2 className="w-3.5 h-3.5" />
              Suite Legal Korporasi — Didukung AI
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-foreground mb-4 leading-tight">
              Legal Ops
              <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">AI Suite</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Satu platform untuk seluruh operasi departemen legal perusahaan — dari manajemen kontrak, monitoring sengketa, compliance calendar, hingga triage permintaan legal internal.
            </p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { val: "6", label: "Modul Terintegrasi", color: "text-sky-400" },
              { val: "CLM", label: "Contract Lifecycle", color: "text-violet-400" },
              { val: "AI", label: "Risk Auto-Scoring", color: "text-emerald-400" },
              { val: "∞", label: "Kontrak & Perkara", color: "text-amber-400" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/8 bg-white/4 p-3 text-center">
                <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MODULE NAV ─── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto scrollbar-hide">
          {MODULES.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`flex-shrink-0 flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                activeModule === m.id
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <m.icon className="w-3.5 h-3.5" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── MODULE CONTENT ─── */}
      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">

            {/* DASHBOARD */}
            {activeModule === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-foreground">Dashboard Legal Ops</h2>
                    <p className="text-xs text-muted-foreground">Per 29 Maret 2026 — diperbarui real-time</p>
                  </div>
                  <Link href="/masuk">
                    <button className="text-xs font-bold px-3 py-2 rounded-xl bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 flex items-center gap-1.5 transition">
                      <Plus className="w-3.5 h-3.5" /> Input Data
                    </button>
                  </Link>
                </div>

                {/* KPI grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Kontrak Aktif", val: "47", sub: "+3 bulan ini", icon: FileText, color: "text-blue-400", trend: "up" },
                    { label: "Perkara Berjalan", val: "8", sub: "4 risiko tinggi", icon: Scale, color: "text-violet-400", trend: "up" },
                    { label: "Compliance Due", val: "5", sub: "2 mendesak", icon: Shield, color: "text-amber-400", trend: "down" },
                    { label: "Legal Intake", val: "12", sub: "4 belum ditangani", icon: Bell, color: "text-sky-400", trend: "up" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <s.icon className={`w-4 h-4 ${s.color}`} />
                        {s.trend === "up" ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
                      </div>
                      <p className="text-2xl font-black text-foreground">{s.val}</p>
                      <p className="text-xs font-bold text-foreground">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Two-column: alerts + upcoming */}
                <div className="grid sm:grid-cols-2 gap-5 mb-6">
                  {/* Risk Alerts */}
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
                    <h3 className="text-sm font-black text-foreground mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" /> Perlu Perhatian Segera
                    </h3>
                    <div className="space-y-2.5">
                      {[
                        { label: "Kontrak EPC – risiko tinggi belum disetujui", type: "Kontrak", color: "border-red-500/30 bg-red-500/5" },
                        { label: "Kebijakan PDP belum diperbarui — deadline 15 Apr", type: "Compliance", color: "border-orange-500/30 bg-orange-500/5" },
                        { label: "RUPS Tahunan perlu persiapan dokumen", type: "Corporate", color: "border-amber-500/30 bg-amber-500/5" },
                        { label: "Banding Pajak PPh – memori banding 22 Apr", type: "Litigasi", color: "border-violet-500/30 bg-violet-500/5" },
                      ].map((a) => (
                        <div key={a.label} className={`rounded-xl border ${a.color} p-3 flex items-start gap-2.5`}>
                          <CircleDot className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-foreground leading-snug">{a.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{a.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming deadlines */}
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
                    <h3 className="text-sm font-black text-foreground mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-400" /> Tenggat Minggu Ini
                    </h3>
                    <div className="space-y-2.5">
                      {[
                        { date: "3 Apr", label: "Sidang Pembuktian – PN Jakarta Selatan", type: "Litigasi" },
                        { date: "7 Apr", label: "Mediasi PHI – 12 Karyawan", type: "Ketenagakerjaan" },
                        { date: "10 Apr", label: "Sidang Pertama Sengketa Merek", type: "HKI" },
                        { date: "15 Apr", label: "Deadline PDP Update Policy", type: "Compliance" },
                      ].map((d) => (
                        <div key={d.label} className="flex items-start gap-3">
                          <span className="text-[10px] font-black text-sky-400 bg-sky-500/10 rounded-lg px-2 py-1 flex-shrink-0 w-12 text-center">{d.date}</span>
                          <div>
                            <p className="text-xs text-foreground leading-snug">{d.label}</p>
                            <p className="text-[10px] text-muted-foreground">{d.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span className="text-sm font-black text-sky-300">Ringkasan Legal AI — 29 Maret 2026</span>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    Departemen legal memiliki <strong>2 isu risiko tinggi</strong> yang memerlukan perhatian segera: kontrak EPC Rp 48M yang masih dalam tahap negosiasi tanpa review final, dan deadline kepatuhan PDP pada 15 April yang belum ditindaklanjuti. Sengketa Banding Pajak memerlukan persiapan memori banding sebelum 22 April. Disarankan untuk memprioritaskan penyelesaian 4 legal intake yang tertunda sebelum akhir minggu.
                  </p>
                </div>
              </motion.div>
            )}

            {/* CLM */}
            {activeModule === "clm" && (
              <motion.div key="clm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-foreground">Contract Lifecycle Management</h2>
                    <p className="text-xs text-muted-foreground">Draft → Review → Negosiasi → Tanda Tangan → Monitoring → Perpanjangan</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-2 rounded-xl border border-white/10 text-muted-foreground flex items-center gap-1.5 hover:bg-white/5 transition">
                      <Filter className="w-3.5 h-3.5" /> Filter
                    </button>
                    <Link href="/masuk">
                      <button className="text-xs font-bold px-3 py-2 rounded-xl bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 flex items-center gap-1.5 transition">
                        <Plus className="w-3.5 h-3.5" /> Kontrak Baru
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Pipeline view */}
                <div className="grid grid-cols-5 gap-2 mb-6 overflow-x-auto">
                  {["Draft", "Review", "Negosiasi", "Tanda Tangan", "Aktif"].map((stage, i) => (
                    <div key={stage} className="min-w-[120px]">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">{stage}</div>
                      <div className="space-y-1.5">
                        {MOCK_CONTRACTS.filter((_, idx) => idx === i).map((c) => (
                          <div key={c.id} className="rounded-xl border border-white/8 bg-white/4 p-2.5">
                            <p className="text-[10px] font-bold text-foreground leading-snug mb-1">{c.title}</p>
                            <p className="text-[9px] text-muted-foreground">{c.counterparty}</p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${riskBadge[c.risk]}`}>
                              ● {c.risk === "high" ? "Risiko Tinggi" : c.risk === "medium" ? "Sedang" : "Rendah"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/8 text-muted-foreground text-[10px] uppercase tracking-widest">
                          <th className="text-left px-4 py-3">ID / Judul</th>
                          <th className="text-left px-4 py-3">Tipe</th>
                          <th className="text-left px-4 py-3">Pihak</th>
                          <th className="text-left px-4 py-3">Nilai</th>
                          <th className="text-left px-4 py-3">Expire</th>
                          <th className="text-left px-4 py-3">Status</th>
                          <th className="text-left px-4 py-3">Risiko</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_CONTRACTS.map((c) => (
                          <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-bold text-foreground text-xs leading-snug">{c.title}</p>
                              <p className="text-[10px] text-muted-foreground">{c.id}</p>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{c.type}</td>
                            <td className="px-4 py-3 text-muted-foreground">{c.counterparty}</td>
                            <td className="px-4 py-3 text-foreground font-semibold">{c.value}</td>
                            <td className="px-4 py-3 text-muted-foreground">{c.expire}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[c.status]}`}>{statusLabel[c.status]}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`font-bold text-[10px] ${riskBadge[c.risk]}`}>● {c.risk === "high" ? "Tinggi" : c.risk === "medium" ? "Sedang" : "Rendah"}</span>
                            </td>
                            <td className="px-4 py-3">
                              <Link href="/masuk">
                                <button className="text-[10px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-0.5">
                                  Review AI <Sparkles className="w-2.5 h-2.5" />
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CLM AI features */}
                <div className="grid sm:grid-cols-3 gap-4 mt-5">
                  {[
                    { emoji: "🔍", title: "Review Klausul AI", desc: "Analisis otomatis klausul berisiko: penalti, force majeure, IP, kerahasiaan, dispute resolution" },
                    { emoji: "🔔", title: "Alert Perpanjangan", desc: "Notifikasi otomatis 90/60/30 hari sebelum kontrak berakhir, dengan rekomendasi tindakan" },
                    { emoji: "📊", title: "Spend Analytics", desc: "Analisis nilai kontrak per kategori, counterparty, dan divisi — untuk negosiasi leverage yang lebih baik" },
                  ].map((f) => (
                    <div key={f.title} className="rounded-xl border border-white/8 bg-white/3 p-4">
                      <span className="text-xl">{f.emoji}</span>
                      <h4 className="text-sm font-bold text-foreground mt-2 mb-1">{f.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-snug">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LITIGATION */}
            {activeModule === "litigation" && (
              <motion.div key="litigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-foreground">Litigation Tracker</h2>
                    <p className="text-xs text-muted-foreground">Monitor semua perkara & sengketa yang sedang berjalan</p>
                  </div>
                  <Link href="/masuk">
                    <button className="text-xs font-bold px-3 py-2 rounded-xl bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 flex items-center gap-1.5 transition">
                      <Plus className="w-3.5 h-3.5" /> Tambah Perkara
                    </button>
                  </Link>
                </div>

                <div className="space-y-3 mb-6">
                  {MOCK_LITIGATION.map((l) => (
                    <div key={l.id} className="rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-[10px] text-muted-foreground">{l.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[l.status]}`}>{statusLabel[l.status]}</span>
                            <span className={`text-[10px] font-bold ${riskBadge[l.risk]}`}>● {l.risk === "high" ? "Risiko Tinggi" : "Sedang"}</span>
                          </div>
                          <h3 className="font-bold text-foreground text-sm mb-1">{l.title}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                            <span>🏛️ {l.court}</span>
                            <span>📋 {l.type}</span>
                            <span>📍 {l.stage}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] text-muted-foreground">Sidang Berikutnya</p>
                          <p className="text-sm font-black text-foreground">{l.nextDate}</p>
                          <Link href="/masuk">
                            <button className="mt-2 text-[10px] font-bold text-violet-400 hover:text-violet-300 flex items-center gap-0.5 justify-end">
                              Buka AI <Sparkles className="w-2.5 h-2.5" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-4 gap-3">
                  {[
                    { val: "4", label: "Total Perkara", color: "text-violet-400" },
                    { val: "2", label: "Risiko Tinggi", color: "text-red-400" },
                    { val: "Rp 48M+", label: "Nilai at Risk", color: "text-amber-400" },
                    { val: "7 hari", label: "Sidang Terdekat", color: "text-sky-400" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-white/8 bg-white/3 p-3 text-center">
                      <p className={`text-lg font-black ${s.color}`}>{s.val}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* COMPLIANCE */}
            {activeModule === "compliance" && (
              <motion.div key="compliance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-foreground">Compliance Obligation Register</h2>
                    <p className="text-xs text-muted-foreground">Monitor semua kewajiban regulasi dan deadline kepatuhan</p>
                  </div>
                  <Link href="/masuk">
                    <button className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 flex items-center gap-1.5 transition">
                      <Plus className="w-3.5 h-3.5" /> Tambah Kewajiban
                    </button>
                  </Link>
                </div>

                <div className="space-y-2.5 mb-6">
                  {MOCK_COMPLIANCE.map((c) => (
                    <div key={c.id} className={`rounded-2xl border p-4 flex items-center gap-4 flex-wrap ${c.status === "overdue" ? "border-red-500/30 bg-red-500/5" : c.status === "urgent" ? "border-orange-500/30 bg-orange-500/5" : "border-white/8 bg-white/3"}`}>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[c.status]}`}>{statusLabel[c.status]}</span>
                          <span className="text-[10px] text-muted-foreground">{c.category}</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{c.title}</p>
                        <p className="text-[11px] text-muted-foreground">Owner: {c.owner}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] text-muted-foreground">Deadline</p>
                        <p className={`text-sm font-black ${c.status === "overdue" ? "text-red-400" : c.status === "urgent" ? "text-orange-400" : "text-foreground"}`}>{c.deadline}</p>
                        <Link href="/masuk">
                          <button className="mt-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 justify-end">
                            AI Guide <Sparkles className="w-2.5 h-2.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compliance calendar preview */}
                <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
                  <h3 className="text-sm font-black text-foreground mb-4">Kalender Kepatuhan — April 2026</h3>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground mb-2">
                    {["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map(d => <span key={d}>{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                      const hasEvent = [3, 7, 10, 15, 22, 30].includes(day);
                      const isUrgent = [15, 22].includes(day);
                      return (
                        <div key={day} className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-semibold ${hasEvent ? isUrgent ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-sky-500/15 text-sky-300" : "text-muted-foreground hover:bg-white/5"}`}>
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 mt-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-sky-500/40" /> Deadline reguler</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500/40" /> Mendesak</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* INTAKE */}
            {activeModule === "intake" && (
              <motion.div key="intake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-foreground">Legal Intake & Triage</h2>
                    <p className="text-xs text-muted-foreground">Kelola permintaan legal dari seluruh divisi perusahaan</p>
                  </div>
                  <Link href="/masuk">
                    <button className="text-xs font-bold px-3 py-2 rounded-xl bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 flex items-center gap-1.5 transition">
                      <Plus className="w-3.5 h-3.5" /> Submit Request
                    </button>
                  </Link>
                </div>

                <div className="space-y-3 mb-6">
                  {MOCK_INTAKE.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 p-4 transition-all flex items-center gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-[10px] text-muted-foreground">{item.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[item.status]}`}>{statusLabel[item.status]}</span>
                          <span className={`text-[10px] font-bold ${item.priority === "high" ? "text-red-400" : item.priority === "medium" ? "text-amber-400" : "text-emerald-400"}`}>
                            ● {item.priority === "high" ? "Prioritas Tinggi" : item.priority === "medium" ? "Sedang" : "Rendah"}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{item.title}</p>
                        <div className="flex gap-3 text-[11px] text-muted-foreground mt-0.5">
                          <span>👤 {item.requestor}</span>
                          <span>📋 {item.type}</span>
                          <span>📅 {item.created}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link href="/masuk">
                          <button className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 flex items-center gap-1 transition">
                            <Sparkles className="w-3 h-3" /> AI Assign
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
                  <h3 className="text-sm font-black text-sky-300 mb-2">🤖 AI Triage Otomatis</h3>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    Setiap permintaan legal yang masuk dianalisis otomatis oleh AI untuk: menentukan jenis legal work, estimasi waktu penyelesaian, tingkat prioritas, dan assignment rekomendasi ke anggota tim legal yang paling tepat berdasarkan workload dan keahlian.
                  </p>
                </div>
              </motion.div>
            )}

            {/* COUNSEL */}
            {activeModule === "counsel" && (
              <motion.div key="counsel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-foreground">External Counsel Management</h2>
                    <p className="text-xs text-muted-foreground">Kelola law firm, engagement, anggaran, dan kinerja pengacara eksternal</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    { firm: "Rajah & Partners Law Office", city: "Jakarta", specialty: "Litigasi Perdata & Pidana", retainer: "Rp 25jt/bln", matters: 3, rating: 4.8, status: "Aktif" },
                    { firm: "Kartika Tax Law Firm", city: "Jakarta", specialty: "Hukum Pajak & Kepabeanan", retainer: "Per-matter", matters: 1, rating: 4.6, status: "Aktif" },
                    { firm: "Prayitno & Associates", city: "Surabaya", specialty: "Hukum Properti & Agraria", retainer: "Per-matter", matters: 0, rating: 4.3, status: "Standby" },
                  ].map((f) => (
                    <div key={f.firm} className="rounded-2xl border border-white/8 bg-white/3 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-sm font-black text-foreground">{f.firm[0]}</div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.status === "Aktif" ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-muted-foreground"}`}>{f.status}</span>
                      </div>
                      <h3 className="font-bold text-foreground text-sm mb-0.5">{f.firm}</h3>
                      <p className="text-[11px] text-muted-foreground mb-1">{f.city} · {f.specialty}</p>
                      <div className="flex items-center gap-2 text-[11px] mb-3">
                        <span className="text-amber-400">★ {f.rating}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{f.matters} perkara aktif</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-foreground">{f.retainer}</span>
                        <Link href="/masuk">
                          <button className="text-[10px] font-bold text-sky-400 hover:text-sky-300">Detail →</button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { emoji: "💰", title: "Budget Tracking", desc: "Monitor biaya pengacara eksternal per perkara, per law firm, dan per bulan — dengan alert budget overrun" },
                    { emoji: "📊", title: "Performance Scorecard", desc: "Evaluasi kinerja law firm: win rate, waktu penyelesaian, responsivitas, dan value for money" },
                    { emoji: "📋", title: "Engagement Letter AI", desc: "Generate engagement letter, scope of work, dan fee arrangement yang tepat untuk setiap penugasan" },
                  ].map((f) => (
                    <div key={f.title} className="rounded-xl border border-white/8 bg-white/3 p-4">
                      <span className="text-2xl">{f.emoji}</span>
                      <h4 className="text-sm font-bold text-foreground mt-2 mb-1">{f.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-snug">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <section className="py-16 border-t border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950/25 via-background to-blue-950/20 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-black text-foreground mb-3">
            Departemen Legal Anda,
            <br />
            <span className="text-sky-400">Dikelola seperti Perusahaan Fortune 500</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            Blueprint manajemen legal korporat yang biasanya hanya dimiliki perusahaan besar — kini tersedia untuk semua ukuran perusahaan, didukung AI LexCom.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/masuk">
              <button className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-sky-500/20 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Mulai Legal Ops Suite
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
