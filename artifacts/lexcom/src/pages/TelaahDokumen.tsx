import { useState, useRef, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch, Loader2, Sparkles, Copy, Check, ChevronDown, ChevronUp,
  ShieldAlert, AlertTriangle, CheckCircle2, FileText, Scale, Brain
} from "lucide-react";

const REVIEW_AGENTS = [
  {
    key: "drafter",
    emoji: "✍️",
    name: "Legal Drafter AI",
    color: "bg-pink-600",
    role: "Struktur & Redaksi",
    desc: "Mengevaluasi struktur, klausul, dan redaksi dokumen",
    prompt: `Anda adalah Legal Drafter AI yang berpengalaman. Review dokumen hukum berikut secara menyeluruh dari sisi:
1. Kelengkapan dan konsistensi klausul
2. Kejelasan dan presisi redaksi
3. Potensi celah atau ambiguitas
4. Saran perbaikan konkret
Format respons: gunakan heading untuk setiap aspek, berikan penilaian Oke/Perhatian/Kritis pada tiap temuan.`,
  },
  {
    key: "corporate",
    emoji: "🏢",
    name: "Corporate Lawyer AI",
    color: "bg-blue-600",
    role: "Risiko Bisnis & Kepatuhan",
    desc: "Mengidentifikasi risiko hukum bisnis dan kepatuhan regulasi",
    prompt: `Anda adalah Corporate Lawyer AI. Review dokumen hukum berikut dari perspektif hukum bisnis dan korporasi:
1. Risiko hukum bagi setiap pihak
2. Kepatuhan terhadap regulasi bisnis Indonesia (UU PT, OSS, dll.)
3. Klausul yang tidak menguntungkan atau tidak wajar
4. Rekomendasi negosiasi dan perlindungan klien
Format: berikan rating risiko (Rendah/Sedang/Tinggi) dan saran konkret.`,
  },
  {
    key: "employment",
    emoji: "👔",
    name: "Employment Lawyer AI",
    color: "bg-emerald-600",
    role: "Ketenagakerjaan & Hak",
    desc: "Menilai aspek ketenagakerjaan, hak-hak pekerja, dan kewajiban",
    prompt: `Anda adalah Employment Lawyer AI. Jika dokumen berkaitan dengan hubungan kerja, review:
1. Kesesuaian dengan UU Cipta Kerja dan PP 35/2021
2. Hak-hak pekerja yang terlindungi atau dilanggar
3. Klausul ketenagakerjaan yang bermasalah
4. Rekomendasi agar dokumen comply dengan hukum ketenagakerjaan
Jika dokumen bukan terkait ketenagakerjaan, analisis dari sudut pandang perburuhan secara umum.`,
  },
  {
    key: "researcher",
    emoji: "🔬",
    name: "Legal Researcher AI",
    color: "bg-violet-600",
    role: "Dasar Hukum & Preseden",
    desc: "Memverifikasi dasar hukum dan mencari preseden relevan",
    prompt: `Anda adalah Legal Researcher AI. Analisis dokumen hukum berikut dari sisi:
1. Dasar hukum yang digunakan — apakah valid dan masih berlaku?
2. Preseden dan yurisprudensi relevan dari putusan MA/MK
3. Potensi sengketa hukum berdasarkan kasus serupa
4. Referensi peraturan tambahan yang harus dipertimbangkan
Berikan analisis akademis dan praktis yang komprehensif.`,
  },
  {
    key: "notaris",
    emoji: "📜",
    name: "Notaris & PPAT AI",
    color: "bg-amber-600",
    role: "Autentisitas & Prosedur",
    desc: "Menilai formalitas, autentisitas, dan prosedur notarial",
    prompt: `Anda adalah Notaris & PPAT AI. Review dokumen hukum berikut dari sisi notarial:
1. Apakah dokumen ini memerlukan akta notaris/PPAT?
2. Kelengkapan persyaratan formal (tanda tangan, meterai, saksi, dll.)
3. Kesesuaian dengan standar akta notaris Indonesia
4. Langkah legalisasi/pengesahan yang diperlukan
5. Risiko jika dokumen tidak dinotariskan`,
  },
];

interface AgentResult {
  key: string;
  emoji: string;
  name: string;
  color: string;
  role: string;
  content: string;
  done: boolean;
  error?: boolean;
}

const RISK_KEYWORDS = {
  high: ["kritis", "berbahaya", "tidak sah", "batal demi hukum", "melanggar", "pidana", "risiko tinggi", "segera"],
  medium: ["perhatian", "pertimbangkan", "disarankan", "potensi sengketa", "risiko sedang", "kurang jelas"],
  low: ["oke", "sesuai", "comply", "baik", "lengkap", "valid", "risiko rendah"],
};

function getRiskBadge(content: string) {
  const lower = content.toLowerCase();
  if (RISK_KEYWORDS.high.some(k => lower.includes(k))) return { label: "Kritis", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: ShieldAlert };
  if (RISK_KEYWORDS.medium.some(k => lower.includes(k))) return { label: "Perhatian", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: AlertTriangle };
  return { label: "Aman", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 };
}

export default function TelaahDokumen() {
  const [docText, setDocText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(REVIEW_AGENTS.map(a => a.key));
  const convIdRef = useRef<number | null>(null);

  const getConvId = useCallback(async () => {
    if (convIdRef.current) return convIdRef.current;
    const res = await fetch("/api/assistant/conversations", {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
    });
    const d = await res.json();
    convIdRef.current = d.id;
    return d.id as number;
  }, []);

  const streamAgentReview = useCallback(async (agent: typeof REVIEW_AGENTS[0], text: string, convId: number, idx: number) => {
    const prompt = `${agent.prompt}\n\n---\nDOKUMEN YANG DIREVIEW:\n${text.slice(0, 4000)}`;
    try {
      const res = await fetch(`/api/assistant/conversations/${convId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: prompt }),
      });
      if (!res.body) throw new Error("No body");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          const t = line.startsWith("data: ") ? line.slice(6).trim() : line.trim();
          if (!t || t === "[DONE]") continue;
          try {
            const ev = JSON.parse(t);
            if (ev.type === "content" && ev.content) {
              setAgentResults(prev => prev.map((r, i) =>
                i === idx ? { ...r, content: r.content + ev.content } : r
              ));
            }
          } catch {}
        }
      }
      setAgentResults(prev => prev.map((r, i) => i === idx ? { ...r, done: true } : r));
    } catch {
      setAgentResults(prev => prev.map((r, i) => i === idx ? { ...r, done: true, error: true } : r));
    }
  }, []);

  const runReview = async () => {
    if (!docText.trim() || isProcessing) return;
    const activeAgents = REVIEW_AGENTS.filter(a => selectedAgents.includes(a.key));
    setIsProcessing(true);
    setAgentResults(activeAgents.map(a => ({ ...a, content: "", done: false })));
    setExpandedAgent(activeAgents[0]?.key || null);
    try {
      const convId = await getConvId();
      await Promise.all(activeAgents.map((a, i) => streamAgentReview(a, docText, convId, i)));
    } finally {
      setIsProcessing(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleAgent = (key: string) => {
    setSelectedAgents(prev =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter(k => k !== key) : prev) : [...prev, key]
    );
  };

  const doneCount = agentResults.filter(r => r.done).length;
  const totalCount = agentResults.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <FileSearch className="w-4 h-4" /> Document Review Multi-Agen
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Telaah Dokumen <span className="text-gradient">5 Agen AI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Unggah atau paste dokumen hukum Anda — 5 agen spesialis menganalisis secara simultan dari perspektif berbeda: drafting, risiko bisnis, ketenagakerjaan, preseden, dan kenotariatan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Input */}
            <div className="lg:col-span-1 space-y-4">
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Dokumen
                </h3>
                <textarea
                  value={docText}
                  onChange={e => setDocText(e.target.value)}
                  placeholder="Paste isi kontrak, perjanjian, surat kuasa, akta, gugatan, atau dokumen hukum lainnya di sini..."
                  className="w-full h-52 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <div className="flex items-center justify-between mt-2 mb-4">
                  <span className="text-xs text-muted-foreground">{docText.length.toLocaleString()} karakter</span>
                </div>

                <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" /> Pilih Agen Pereview
                </h3>
                <div className="space-y-1.5 mb-4">
                  {REVIEW_AGENTS.map(agent => (
                    <label key={agent.key} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(agent.key)}
                        onChange={() => toggleAgent(agent.key)}
                        className="accent-primary w-3.5 h-3.5"
                      />
                      <span className="text-base">{agent.emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{agent.name}</p>
                        <p className="text-[10px] text-muted-foreground">{agent.role}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={runReview}
                  disabled={!docText.trim() || isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-all"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isProcessing
                    ? `Mereview... (${doneCount}/${totalCount})`
                    : `Telaah dengan ${selectedAgents.length} Agen`}
                </button>
              </div>

              {/* Tips */}
              <div className="glass-card rounded-xl p-4 border border-amber-500/20">
                <p className="text-xs font-bold text-amber-400 mb-2">💡 Tips Telaah Optimal</p>
                <ul className="text-[11px] text-muted-foreground space-y-1">
                  <li>• Paste teks lengkap untuk analisis terbaik</li>
                  <li>• Kontrak bisnis → pilih Corporate + Drafter</li>
                  <li>• Perjanjian kerja → aktifkan Employment AI</li>
                  <li>• Akta / notarial → tambahkan Notaris AI</li>
                </ul>
              </div>
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-2">
              {agentResults.length === 0 ? (
                <div className="glass-card rounded-2xl p-10 text-center border border-white/10 h-full flex flex-col items-center justify-center">
                  <FileSearch className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="font-semibold text-foreground mb-2">Belum ada dokumen untuk direview</p>
                  <p className="text-sm text-muted-foreground">Paste teks dokumen hukum Anda di sebelah kiri, lalu klik "Telaah"</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Progress */}
                  {isProcessing && (
                    <div className="glass-card rounded-xl p-3 border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-primary">{doneCount}/{totalCount} agen selesai</span>
                        <span className="text-xs text-muted-foreground">{Math.round((doneCount / totalCount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <motion.div
                          className="bg-primary rounded-full h-1.5"
                          animate={{ width: `${(doneCount / totalCount) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {agentResults.map((agent, i) => {
                    const risk = agent.done && !agent.error ? getRiskBadge(agent.content) : null;
                    return (
                      <motion.div
                        key={agent.key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-card rounded-2xl overflow-hidden border border-white/10"
                      >
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                          onClick={() => setExpandedAgent(expandedAgent === agent.key ? null : agent.key)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center text-xl`}>
                              {agent.emoji}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold">{agent.name}</p>
                                {risk && (
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${risk.color}`}>
                                    {risk.label}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground">{agent.role}</p>
                              {!agent.done ? (
                                <p className="text-xs text-primary flex items-center gap-1 mt-0.5">
                                  <Loader2 className="w-3 h-3 animate-spin" /> Mereview...
                                </p>
                              ) : agent.error ? (
                                <p className="text-xs text-red-400 mt-0.5">Gagal mereview</p>
                              ) : (
                                <p className="text-xs text-emerald-400 mt-0.5">✓ Review selesai</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {agent.done && !agent.error && (
                              <button
                                onClick={e => { e.stopPropagation(); copyText(agent.content, agent.key); }}
                                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                              >
                                {copied === agent.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                              </button>
                            )}
                            {expandedAgent === agent.key ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedAgent === agent.key && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-white/10"
                            >
                              <div className="p-4 prose prose-invert prose-sm max-w-none">
                                {agent.content ? (
                                  <MarkdownRenderer content={agent.content} />
                                ) : (
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Sedang menganalisis dokumen...
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
