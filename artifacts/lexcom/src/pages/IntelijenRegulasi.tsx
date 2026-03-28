import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Shield, CheckCircle2, ChevronDown, ChevronRight,
  Search, Filter, Brain, FileText, Bell, Download, Share2,
  TrendingUp, Zap, Clock, Building2, Bot, Lock, Smartphone,
  Coins, Server, BarChart3, ArrowRight, BookOpen, CheckSquare,
  Square, RefreshCw, Info, ExternalLink, Sparkles, X,
  AlertCircle, CircleCheck, Target, List,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import {
  DATA_ISU, KATEGORI_FILTER,
  type IsuRegulasi, type RisikoLevel,
} from "@/data/intelijenRegulasiData";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RISIKO_CONFIG: Record<RisikoLevel, { label: string; color: string; bg: string; border: string; dot: string; icon: typeof AlertTriangle }> = {
  KRITIS: { label: "Kritis", color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30", dot: "bg-red-500", icon: AlertTriangle },
  TINGGI: { label: "Tinggi", color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30", dot: "bg-orange-500", icon: AlertCircle },
  SEDANG: { label: "Sedang", color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/30", dot: "bg-yellow-500", icon: Info },
  RENDAH: { label: "Rendah", color: "text-green-400", bg: "bg-green-500/15", border: "border-green-500/30", dot: "bg-green-500", icon: CircleCheck },
};

const KATEGORI_ICON_MAP: Record<string, typeof Building2> = {
  oss: Building2,
  ai: Bot,
  pdp: Lock,
  platform: Smartphone,
  insentif: Coins,
  pusatdata: Server,
};

function RisikoMeter({ skor }: { skor: number }) {
  const color = skor >= 80 ? "from-red-500 to-red-600" : skor >= 65 ? "from-orange-500 to-orange-600" : skor >= 45 ? "from-yellow-500 to-yellow-600" : "from-green-500 to-green-600";
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-muted-foreground">Skor Risiko Kepatuhan</span>
        <span className="text-[10px] font-bold text-foreground">{skor}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skor}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}

function ChecklistPanel({ isu, checked, onToggle }: {
  isu: IsuRegulasi;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const done = isu.checklist.filter(c => checked[c.id]).length;
  const total = isu.checklist.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="mt-4 p-3 rounded-xl bg-white/3 border border-white/8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-primary" />
          Checklist Kepatuhan
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pct === 100 ? "bg-green-500/20 text-green-400" : "bg-white/10 text-muted-foreground"}`}>
          {done}/{total} selesai
        </span>
      </div>
      <div className="h-1 rounded-full bg-white/10 mb-3 overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>
      <div className="space-y-2">
        {isu.checklist.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className="w-full flex items-start gap-2.5 text-left hover:bg-white/5 rounded-lg p-1.5 transition-colors group"
          >
            {checked[item.id] ? (
              <CheckSquare className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0 group-hover:text-foreground transition-colors" />
            )}
            <div className="flex-1">
              <p className={`text-xs leading-relaxed ${checked[item.id] ? "line-through text-muted-foreground" : "text-foreground/80"}`}>
                {item.label}
              </p>
              {item.deadline && (
                <span className="text-[10px] text-primary/70 flex items-center gap-1 mt-0.5">
                  <Clock className="w-2.5 h-2.5" /> {item.deadline}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AIAnalysisPanel({ isu, open }: { isu: IsuRegulasi; open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="mt-4 space-y-3">
            {/* AI Analysis */}
            <div className="p-3 rounded-xl bg-primary/8 border border-primary/15">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[11px] font-semibold text-primary">Analisis AI LexCom</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">{isu.analisisAI}</p>
            </div>

            {/* Recommendations */}
            <div className="p-3 rounded-xl bg-white/3 border border-white/8">
              <div className="flex items-center gap-2 mb-2.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-[11px] font-semibold text-foreground">Rekomendasi Tindakan</span>
              </div>
              <ol className="space-y-1.5">
                {isu.rekomendasiAI.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/75">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ol>
            </div>

            {/* Sanksi */}
            {isu.sanksi && (
              <div className="p-2.5 rounded-xl bg-red-500/8 border border-red-500/15 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-semibold text-red-400 block mb-0.5">Potensi Sanksi</span>
                  <span className="text-[11px] text-foreground/70">{isu.sanksi}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IsuCard({ isu }: { isu: IsuRegulasi }) {
  const [expanded, setExpanded] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const cfg = RISIKO_CONFIG[isu.risikoLevel];
  const Icon = cfg.icon;

  const toggle = (id: string) => setChecked(p => ({ ...p, [id]: !p[id] }));
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel rounded-2xl border ${cfg.border} overflow-hidden`}
    >
      {/* Risk accent bar */}
      <div className={`h-0.5 w-full bg-gradient-to-r ${isu.risikoLevel === "KRITIS" ? "from-red-500 to-red-600" : isu.risikoLevel === "TINGGI" ? "from-orange-500 to-orange-600" : isu.risikoLevel === "SEDANG" ? "from-yellow-500 to-yellow-600" : "from-green-500 to-green-600"}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-8 h-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${cfg.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
                ● {cfg.label.toUpperCase()}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-muted-foreground">
                {isu.kategoriIcon} {KATEGORI_FILTER.find(k => k.id === isu.kategori)?.label}
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground leading-snug">{isu.judul}</h3>
          </div>
        </div>

        {/* Regulation ref & date */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <FileText className="w-3 h-3" /> {isu.regulasiRef}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> Berlaku: {isu.tanggalEfektif}
          </span>
        </div>

        {/* Risk Meter */}
        <div className="mb-3">
          <RisikoMeter skor={isu.risikoSkor} />
        </div>

        {/* Summary */}
        <p className="text-xs text-foreground/70 leading-relaxed mb-3">{isu.ringkasan}</p>

        {/* Affected entities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {isu.entitasTerdampak.slice(0, 4).map((e, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
              {e}
            </span>
          ))}
          {isu.entitasTerdampak.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
              +{isu.entitasTerdampak.length - 4} lainnya
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setExpanded(!expanded); setShowChecklist(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${expanded ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
          >
            <Brain className="w-3.5 h-3.5" />
            {expanded ? "Tutup Analisis" : "Analisis AI"}
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>

          <button
            onClick={() => { setShowChecklist(!showChecklist); setExpanded(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showChecklist ? "bg-green-500/20 text-green-400" : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Checklist
            {doneCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary text-[9px] font-bold text-white">{doneCount}</span>
            )}
          </button>

          {isu.sumberRef && (
            <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {isu.sumberRef.split(",")[0]}
            </span>
          )}
        </div>

        {/* Analysis Panel */}
        <AIAnalysisPanel isu={isu} open={expanded} />

        {/* Checklist Panel */}
        <AnimatePresence>
          {showChecklist && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <ChecklistPanel isu={isu} checked={checked} onToggle={toggle} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Isu Aktif", value: DATA_ISU.length.toString(), icon: AlertTriangle, color: "text-orange-400", subLabel: "dipantau" },
  { label: "Kritis / Tinggi", value: DATA_ISU.filter(d => d.risikoLevel === "KRITIS" || d.risikoLevel === "TINGGI").length.toString(), icon: AlertCircle, color: "text-red-400", subLabel: "butuh tindakan segera" },
  { label: "Sektor Dipantau", value: (KATEGORI_FILTER.length - 1).toString(), icon: Target, color: "text-primary", subLabel: "industri & sektor" },
  { label: "Update Terakhir", value: "28 Mar 2026", icon: RefreshCw, color: "text-green-400", subLabel: "data terkini" },
];

// ─── AI Ask Panel ────────────────────────────────────────────────────────────

const QUICK_QUESTIONS = [
  "Apa yang harus dilakukan bisnis saya menghadapi UU PDP?",
  "Bagaimana cara daftar PSE di Kominfo?",
  "Apa insentif pajak yang tersedia untuk startup AI?",
  "Apa saja sanksi pelanggaran PDP?",
  "Bagaimana perubahan Permenkum 49/2025 memengaruhi PT saya?",
];

function AIAskPanel() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const DEMO_ANSWERS: Record<string, string> = {
    default: "Berdasarkan analisis regulasi terkini, bisnis Anda perlu memperhatikan beberapa hal penting. Pertama, pastikan compliance dengan UU PDP (No. 27/2022) yang sudah berlaku penuh sejak Oktober 2024 — denda hingga 2% pendapatan tahunan. Kedua, verifikasi pendaftaran PSE Anda di portal OSS. Ketiga, jika menggunakan AI, kembangkan kebijakan AI Governance internal sebelum regulasi mengikat hadir. Rekomendasi saya: mulai dengan audit compliance internal, tunjuk DPO (Data Protection Officer), dan jadwalkan review regulasi kuartalan.",
    pdp: "UU PDP No. 27/2022 sudah berlaku penuh sejak Oktober 2024. Langkah segera yang harus dilakukan: (1) Tunjuk Data Protection Officer (DPO) atau person-in-charge PDP; (2) Buat ROPA (Record of Processing Activities) — daftar semua aktivitas pengolahan data pribadi; (3) Perbarui Privacy Policy dalam bahasa Indonesia yang mudah dipahami; (4) Implementasikan consent management yang valid; (5) Siapkan prosedur respons kebocoran data (notifikasi 72 jam). Sanksi: administratif Rp 2% pendapatan tahunan + pidana hingga 6 tahun.",
    pse: "Pendaftaran PSE dilakukan di portal OSS (oss.go.id). Langkahnya: (1) Login ke portal OSS dengan akun perusahaan; (2) Pilih menu 'Perizinan Berusaha' → 'PSE'; (3) Isi formulir data sistem elektronik yang dioperasikan; (4) Upload dokumen: akta pendirian, NPWP, dan informasi teknis sistem; (5) Tunggu verifikasi Kominfo (biasanya 7-14 hari kerja). Penting: setiap sistem elektronik baru harus didaftarkan sebelum diluncurkan ke publik. Kegagalan mendaftar berisiko pemblokiran platform.",
    insentif: "Indonesia menawarkan beberapa insentif menarik untuk startup AI: (1) Tax Holiday: 0% PPh Badan selama 5-20 tahun untuk investasi minimum Rp 500 miliar di sektor prioritas (termasuk AI); (2) Investment Allowance: pengurangan 30-50% dari nilai investasi dari penghasilan kena pajak; (3) Super Deduction R&D: setiap Rp 1 pengeluaran R&D mengurangi pajak sebesar Rp 2-3 (200-300%); (4) Pembebasan PPN untuk impor peralatan teknologi tertentu. Daftar melalui BKPM dan konsultasikan dengan konsultan pajak untuk memaksimalkan manfaat.",
    sanksi: "Sanksi pelanggaran UU PDP No. 27/2022 terbagi dua: (A) Sanksi Administratif: teguran tertulis, penghentian sementara pemrosesan data, penghapusan data, atau denda administratif maksimal 2% dari pendapatan tahunan; (B) Sanksi Pidana: (i) pelanggaran penggunaan data tidak sah: 5 tahun penjara + denda Rp 5 miliar; (ii) pengambilan data ilegal: 6 tahun + denda Rp 6 miliar; (iii) pemalsuan data: 6 tahun + denda Rp 6 miliar. Pelaporan kebocoran data kepada otoritas wajib dilakukan maksimal 14 hari setelah diketahui.",
    permenkum: "Permenkum 49/2025 mengubah prosedur perubahan data PT di sistem SABH secara signifikan. Perubahan utama: (1) Verifikasi substantif manual via telepon/email untuk perubahan direksi, komisaris, transfer saham — proses bisa 14 hari kerja; (2) Mekanisme ganda: perubahan AD penting butuh persetujuan, perubahan lain cukup pemberitahuan; (3) Wajib laporan tahunan RUPS ke Menkum via SABH dalam 30 hari kerja; (4) Dokumen pendukung lebih banyak. Tindakan segera: update data kontak direksi/komisaris di SABH dan siapkan lead time 21 hari untuk setiap perubahan korporasi.",
  };

  const getAnswer = (q: string) => {
    const lower = q.toLowerCase();
    if (lower.includes("pdp") || lower.includes("data pribadi")) return DEMO_ANSWERS.pdp;
    if (lower.includes("pse") || lower.includes("daftar") || lower.includes("kominfo")) return DEMO_ANSWERS.pse;
    if (lower.includes("insentif") || lower.includes("pajak")) return DEMO_ANSWERS.insentif;
    if (lower.includes("sanksi")) return DEMO_ANSWERS.sanksi;
    if (lower.includes("permenkum") || lower.includes("pt ") || lower.includes("sabh")) return DEMO_ANSWERS.permenkum;
    return DEMO_ANSWERS.default;
  };

  const send = async (q?: string) => {
    const text = q ?? question.trim();
    if (!text || loading) return;
    setQuestion("");
    setMessages(p => [...p, { role: "user", text }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setMessages(p => [...p, { role: "ai", text: getAnswer(text) }]);
    setLoading(false);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Tanya Pakar Regulasi AI</p>
            <p className="text-[10px] text-muted-foreground">Powered by LexCom AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[380px]">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-[11px] text-muted-foreground text-center py-2">Tanyakan pertanyaan regulasi Anda:</p>
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => send(q)}
                className="w-full text-left text-[11px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground/80 hover:bg-white/10 hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ChevronRight className="w-3 h-3 text-primary flex-shrink-0" /> {q}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "ai" && (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <Brain className="w-3 h-3 text-white" />
              </div>
            )}
            <div className={`max-w-[85%] px-3 py-2 rounded-xl ${m.role === "user" ? "bg-primary text-white rounded-br-sm text-xs leading-relaxed" : "bg-white/8 border border-white/10 text-foreground/85 rounded-bl-sm"}`}>
              {m.role === "user" ? m.text : <MarkdownRenderer content={m.text} compact className="text-xs" />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Brain className="w-3 h-3 text-white" />
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/8 border border-white/10 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Tanya tentang regulasi..."
            className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <button
            onClick={() => send()}
            disabled={!question.trim() || loading}
            className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-medium disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function IntelijenRegulasi() {
  const [activeKategori, setActiveKategori] = useState("semua");
  const [search, setSearch] = useState("");
  const [risikoFilter, setRisikoFilter] = useState<RisikoLevel | "SEMUA">("SEMUA");
  const [sortBy, setSortBy] = useState<"skor" | "terbaru">("skor");
  const [issueSortOpen, setIssueSortOpen] = useState(false);

  const filtered = DATA_ISU
    .filter(isu => activeKategori === "semua" || isu.kategori === activeKategori)
    .filter(isu => risikoFilter === "SEMUA" || isu.risikoLevel === risikoFilter)
    .filter(isu => !search || isu.judul.toLowerCase().includes(search.toLowerCase()) || isu.regulasiRef.toLowerCase().includes(search.toLowerCase()) || isu.ringkasan.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "skor" ? b.risikoSkor - a.risikoSkor : 0);

  const kritisCount = DATA_ISU.filter(d => d.risikoLevel === "KRITIS").length;
  const tinggiCount = DATA_ISU.filter(d => d.risikoLevel === "TINGGI").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-28 pb-8 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/15" />
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-1">
              {/* Breadcrumb-style badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 font-semibold flex items-center gap-1.5">
                  <Bell className="w-3 h-3" /> {kritisCount} isu kritis · {tinggiCount} risiko tinggi aktif
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground font-medium">
                  📅 Edisi Maret 2026 — Issue #964
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-3 leading-tight">
                Intelijen Regulasi
                <span className="block bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
                  Bisnis & Teknologi AI
                </span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                Pemantauan dampak regulasi hukum Indonesia secara real-time — analisis isu bisnis, skor risiko kepatuhan, dan rekomendasi tindakan berbasis AI untuk pelaku usaha teknologi, digital, dan data.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2 flex-wrap">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
                <Bell className="w-3.5 h-3.5" /> Langganan Alert
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            {STATS.map((s, i) => (
              <div key={i} className="glass-panel rounded-xl p-3 border border-white/10 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0`}>
                  <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-6">

          {/* Left: Issues Feed */}
          <div className="flex-1 min-w-0">
            {/* Kategori Tabs */}
            <div className="flex gap-1.5 flex-wrap mb-4">
              {KATEGORI_FILTER.map(k => {
                const count = k.id === "semua" ? DATA_ISU.length : DATA_ISU.filter(d => d.kategori === k.id).length;
                return (
                  <button
                    key={k.id}
                    onClick={() => setActiveKategori(k.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${activeKategori === k.id ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"}`}
                  >
                    <span>{k.icon}</span>
                    <span>{k.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeKategori === k.id ? "bg-white/20" : "bg-white/10"}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Search + filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari isu, regulasi, peraturan..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {/* Risiko filter */}
              {(["SEMUA", "KRITIS", "TINGGI", "SEDANG", "RENDAH"] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRisikoFilter(r)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all border ${risikoFilter === r
                    ? r === "SEMUA" ? "bg-white/10 border-white/20 text-foreground" : `${RISIKO_CONFIG[r as RisikoLevel]?.bg} ${RISIKO_CONFIG[r as RisikoLevel]?.border} ${RISIKO_CONFIG[r as RisikoLevel]?.color}`
                    : "bg-white/3 border-white/8 text-muted-foreground hover:bg-white/8"
                  }`}
                >
                  {r === "SEMUA" ? "Semua Level" : r}
                </button>
              ))}

              {/* Sort */}
              <div className="relative">
                <button onClick={() => setIssueSortOpen(!issueSortOpen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-foreground">
                  <BarChart3 className="w-3.5 h-3.5" /> Urutkan <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {issueSortOpen && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                      className="absolute right-0 top-full mt-1 w-36 glass-panel rounded-xl border border-white/10 p-1 z-20">
                      {[["skor", "Skor Risiko"], ["terbaru", "Terbaru"]].map(([v, l]) => (
                        <button key={v} onClick={() => { setSortBy(v as "skor" | "terbaru"); setIssueSortOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${sortBy === v ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                          {l}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Result count */}
            <p className="text-[11px] text-muted-foreground mb-3">
              Menampilkan <strong className="text-foreground">{filtered.length}</strong> dari {DATA_ISU.length} isu regulasi
            </p>

            {/* Issue cards */}
            <div className="space-y-4">
              <AnimatePresence>
                {filtered.map(isu => (
                  <IsuCard key={isu.id} isu={isu} />
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">Tidak ada isu ditemukan untuk filter ini.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="xl:w-80 flex-shrink-0 space-y-4">
            {/* AI Ask Panel */}
            <AIAskPanel />

            {/* Risiko Summary */}
            <div className="glass-panel rounded-2xl border border-white/10 p-4">
              <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-primary" /> Distribusi Risiko
              </h3>
              {(["KRITIS", "TINGGI", "SEDANG", "RENDAH"] as RisikoLevel[]).map(r => {
                const cnt = DATA_ISU.filter(d => d.risikoLevel === r).length;
                const cfg = RISIKO_CONFIG[r];
                return (
                  <div key={r} className="mb-2">
                    <div className="flex justify-between mb-0.5">
                      <span className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-[10px] text-muted-foreground">{cnt} isu</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cfg.dot}`}
                        style={{ width: `${(cnt / DATA_ISU.length) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Links */}
            <div className="glass-panel rounded-2xl border border-white/10 p-4">
              <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                <List className="w-3.5 h-3.5 text-primary" /> Navigasi Cepat
              </h3>
              <div className="space-y-1">
                {KATEGORI_FILTER.filter(k => k.id !== "semua").map(k => {
                  const Icon = KATEGORI_ICON_MAP[k.id] || Target;
                  const count = DATA_ISU.filter(d => d.kategori === k.id).length;
                  const kritis = DATA_ISU.filter(d => d.kategori === k.id && d.risikoLevel === "KRITIS").length;
                  return (
                    <button
                      key={k.id}
                      onClick={() => { setActiveKategori(k.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-white/5 transition-colors group"
                    >
                      <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="flex-1 text-left text-muted-foreground group-hover:text-foreground transition-colors">{k.label}</span>
                      <div className="flex items-center gap-1">
                        {kritis > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold">{kritis}K</span>}
                        <span className="text-[10px] text-muted-foreground">{count}</span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-white/3 border border-white/8">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground/60">Disclaimer:</strong> Analisis ini bersifat informatif dan tidak menggantikan nasihat hukum profesional. Selalu konsultasikan dengan konsultan hukum untuk keputusan kepatuhan bisnis Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
