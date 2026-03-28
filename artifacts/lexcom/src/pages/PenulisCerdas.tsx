import { useState, useRef, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine, Sparkles, Loader2, Copy, Check, Download,
  BookOpen, FileText, Scale, GraduationCap, Briefcase,
  ChevronRight, Brain, Edit3, Search
} from "lucide-react";

const DOC_TYPES = [
  { key: "artikel",    icon: BookOpen,      label: "Artikel Hukum",       desc: "Artikel ilmiah atau populer bidang hukum",        color: "bg-blue-500/10 border-blue-500/30",   badge: "bg-blue-500/20 text-blue-400" },
  { key: "laporan",    icon: FileText,      label: "Laporan Penelitian",  desc: "Laporan riset hukum terstruktur",                  color: "bg-violet-500/10 border-violet-500/30", badge: "bg-violet-500/20 text-violet-400" },
  { key: "memo",       icon: Scale,         label: "Legal Memorandum",    desc: "Memo hukum formal untuk klien atau internal",       color: "bg-amber-500/10 border-amber-500/30",  badge: "bg-amber-500/20 text-amber-400" },
  { key: "makalah",    icon: GraduationCap, label: "Makalah Akademik",    desc: "Makalah untuk seminar atau jurnal hukum",           color: "bg-emerald-500/10 border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-400" },
  { key: "opini",      icon: Edit3,         label: "Opini Hukum",         desc: "Legal opinion atas suatu permasalahan hukum",       color: "bg-pink-500/10 border-pink-500/30",    badge: "bg-pink-500/20 text-pink-400" },
  { key: "abstrak",    icon: Brain,         label: "Abstrak & Ringkasan", desc: "Abstrak penelitian atau ringkasan eksekutif",        color: "bg-cyan-500/10 border-cyan-500/30",    badge: "bg-cyan-500/20 text-cyan-400" },
  { key: "skripsi",    icon: GraduationCap, label: "Bab Skripsi/Tesis",   desc: "Bab pendahuluan, tinjauan pustaka, metodologi",     color: "bg-orange-500/10 border-orange-500/30", badge: "bg-orange-500/20 text-orange-400" },
  { key: "kontrak",    icon: Briefcase,     label: "Draft Kontrak/MOU",   desc: "Draft kontrak atau nota kesepahaman",               color: "bg-rose-500/10 border-rose-500/30",    badge: "bg-rose-500/20 text-rose-400" },
];

const AUDIENCES = ["Umum / Masyarakat", "Mahasiswa Hukum", "Praktisi / Advokat", "Akademisi / Dosen", "Eksekutif / Manajer", "Pemerintah / Instansi"];
const STYLES = ["Akademis & Formal", "Semi-Formal & Profesional", "Populer & Mudah Dipahami", "Teknis & Detail"];
const LENGTHS = [
  { key: "short",  label: "Singkat", desc: "~500 kata" },
  { key: "medium", label: "Sedang",  desc: "~1.000 kata" },
  { key: "long",   label: "Panjang", desc: "~2.000 kata" },
];

const WRITING_AGENTS = [
  { key: "researcher", emoji: "🔬", name: "Legal Researcher",  color: "bg-violet-600", step: 1, role: "Menggali referensi hukum, undang-undang, dan preseden" },
  { key: "drafter",    emoji: "✍️",  name: "Legal Drafter",     color: "bg-blue-600",   step: 2, role: "Menulis konten utama berdasarkan riset dan panduan" },
  { key: "editor",     emoji: "📝",  name: "Legal Editor",      color: "bg-pink-600",   step: 3, role: "Memperbaiki gaya, struktur, dan kualitas tulisan final" },
];

type Step = 1 | 2 | 3;

interface AgentPhase { key: string; active: boolean; done: boolean; }

export default function PenulisCerdas() {
  const [step, setStep] = useState<Step>(1);
  const [docType, setDocType] = useState("");
  const [topic, setTopic] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [style, setStyle] = useState(STYLES[1]);
  const [length, setLength] = useState("medium");
  const [isWriting, setIsWriting] = useState(false);
  const [agentPhases, setAgentPhases] = useState<AgentPhase[]>([]);
  const [result, setResult] = useState("");
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const streamWrite = useCallback(async (convId: number, prompt: string, onChunk: (t: string) => void, onDone: () => void) => {
    const res = await fetch(`/api/assistant/conversations/${convId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content: prompt }),
    });
    if (!res.body) { onDone(); return; }
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
        try { const ev = JSON.parse(t); if (ev.type === "content" && ev.content) onChunk(ev.content); } catch {}
      }
    }
    onDone();
  }, []);

  const selectedType = DOC_TYPES.find(d => d.key === docType);
  const selectedLen = LENGTHS.find(l => l.key === length);

  const startWriting = async () => {
    if (!topic.trim() || !docType) return;
    setIsWriting(true);
    setResult("");
    setDone(false);
    setStep(3);
    setAgentPhases([
      { key: "researcher", active: true,  done: false },
      { key: "drafter",    active: false, done: false },
      { key: "editor",     active: false, done: false },
    ]);

    try {
      const convId = await getConvId();

      // Phase 1: Researcher
      let researchContext = "";
      await streamWrite(
        convId,
        `Anda adalah Legal Researcher AI. Lakukan riset singkat namun mendalam untuk topik hukum berikut. Temukan:
1. Dasar hukum utama (UU, PP, Perpres, Permen) yang relevan
2. Putusan MA/MK yang berkaitan
3. Doktrin dan teori hukum yang relevan  
4. Isu-isu kontroversial atau perkembangan terbaru

Topik: ${topic}
Poin kunci yang harus dicakup: ${keyPoints || "tidak ada instruksi spesifik"}
Target pembaca: ${audience}

Sajikan dalam format terstruktur singkat sebagai bahan riset.`,
        (chunk) => { researchContext += chunk; },
        () => {
          setAgentPhases(prev => prev.map(a => a.key === "researcher" ? { ...a, done: true, active: false } : a.key === "drafter" ? { ...a, active: true } : a));
        }
      );

      // Phase 2: Drafter — streams directly to result
      let draftContent = "";
      await streamWrite(
        convId,
        `Anda adalah Legal Drafter AI yang ahli. Tulis ${selectedType?.label || docType} berkualitas tinggi berdasarkan bahan riset berikut.

INSTRUKSI PENULISAN:
- Tipe dokumen: ${selectedType?.label || docType}
- Topik: ${topic}
- Target pembaca: ${audience}
- Gaya penulisan: ${style}
- Panjang: ${selectedLen?.desc || "sedang"}
- Poin kunci: ${keyPoints || "sesuai topik"}

BAHAN RISET:
${researchContext.slice(0, 2000)}

Tulis dokumen lengkap dengan struktur yang jelas, sub-judul yang tepat, dan konten yang kaya. Gunakan Bahasa Indonesia yang baik dan benar.`,
        (chunk) => {
          draftContent += chunk;
          setResult(prev => prev + chunk);
        },
        () => {
          setAgentPhases(prev => prev.map(a => a.key === "drafter" ? { ...a, done: true, active: false } : a.key === "editor" ? { ...a, active: true } : a));
        }
      );

      // Phase 3: Editor — refines and appends note
      await streamWrite(
        convId,
        `Anda adalah Legal Editor AI berpengalaman. Review draft berikut dan beri catatan singkat (1-2 paragraf) berisi:
1. Kekuatan dokumen ini
2. Saran pengembangan lebih lanjut
3. Referensi tambahan yang disarankan

Draft yang telah ditulis sudah ditampilkan. Tambahkan bagian "📝 Catatan Editor" di bawah ini:`,
        (chunk) => { setResult(prev => prev + chunk); },
        () => {
          setAgentPhases(prev => prev.map(a => a.key === "editor" ? { ...a, done: true, active: false } : a));
          setDone(true);
          setIsWriting(false);
        }
      );
    } catch {
      setIsWriting(false);
      setDone(true);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => { setStep(1); setDocType(""); setTopic(""); setKeyPoints(""); setResult(""); setDone(false); setAgentPhases([]); convIdRef.current = null; };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-36 pb-16">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <PenLine className="w-4 h-4" /> Penulis Cerdas AI
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Penulis Cerdas <span className="text-gradient">Berbasis AI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              3 agen AI bekerja secara berurutan — Researcher menggali referensi hukum, Drafter menulis konten, Editor menyempurnakan hasil. Untuk mahasiswa, akademisi, praktisi, dan publik.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[
              { n: 1, label: "Jenis Dokumen" },
              { n: 2, label: "Detail & Instruksi" },
              { n: 3, label: "Proses Penulisan" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  step === s.n ? "bg-primary text-white" :
                  step > s.n ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                  "bg-white/5 text-muted-foreground border border-white/10"
                }`}>
                  <span>{step > s.n ? "✓" : s.n}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* Step 1: Pilih Jenis */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {DOC_TYPES.map(dt => (
                    <button
                      key={dt.key}
                      onClick={() => setDocType(dt.key)}
                      className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] ${
                        docType === dt.key ? `${dt.color} scale-[1.02]` : "glass-card border-white/10 hover:border-white/20"
                      }`}
                    >
                      <dt.icon className="w-6 h-6 mb-2 text-foreground" />
                      <p className="text-sm font-bold text-foreground mb-1">{dt.label}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight">{dt.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => docType && setStep(2)}
                    disabled={!docType}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-all"
                  >
                    Lanjut — Isi Detail <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Detail */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
                <div className="glass-card rounded-2xl p-6 mb-5">
                  <div className="flex items-center gap-3 mb-5">
                    {selectedType && <selectedType.icon className="w-5 h-5 text-primary" />}
                    <h3 className="font-bold">{selectedType?.label}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedType?.badge}`}>{selectedType?.desc}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Judul / Topik <span className="text-red-400">*</span></label>
                      <input
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder={`Contoh: Analisis Hukum Terhadap Penggunaan AI dalam Praktik Hukum di Indonesia`}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Poin-poin Kunci yang Harus Dicakup</label>
                      <textarea
                        value={keyPoints}
                        onChange={e => setKeyPoints(e.target.value)}
                        placeholder="Contoh:&#10;- Definisi dan regulasi AI di Indonesia&#10;- Tanggung jawab hukum sistem AI&#10;- Perbandingan hukum dengan negara lain&#10;- Rekomendasi kebijakan"
                        className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">Target Pembaca</label>
                        <select
                          value={audience}
                          onChange={e => setAudience(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        >
                          {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">Gaya Penulisan</label>
                        <select
                          value={style}
                          onChange={e => setStyle(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        >
                          {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">Panjang Tulisan</label>
                        <div className="flex gap-2">
                          {LENGTHS.map(l => (
                            <button
                              key={l.key}
                              onClick={() => setLength(l.key)}
                              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${length === l.key ? "bg-primary text-white" : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground"}`}
                            >
                              <div>{l.label}</div>
                              <div className="opacity-60">{l.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between">
                  <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-all">
                    ← Ganti Jenis
                  </button>
                  <button
                    onClick={startWriting}
                    disabled={!topic.trim()}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                  >
                    <Sparkles className="w-4 h-4" /> Tulis dengan 3 Agen AI
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Writing Process + Result */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Agent Pipeline */}
                <div className="glass-card rounded-2xl p-5 mb-5 border border-primary/20">
                  <h3 className="text-sm font-bold mb-4 text-foreground">Pipeline Penulisan AI</h3>
                  <div className="flex items-center gap-3">
                    {WRITING_AGENTS.map((agent, i) => {
                      const phase = agentPhases.find(p => p.key === agent.key);
                      return (
                        <div key={agent.key} className="flex items-center gap-3">
                          <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all ${
                            phase?.active ? "bg-primary/20 border border-primary/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]" :
                            phase?.done ? "bg-emerald-500/10 border border-emerald-500/30" :
                            "bg-white/5 border border-white/10 opacity-50"
                          }`}>
                            <div className={`w-7 h-7 rounded-lg ${agent.color} flex items-center justify-center text-base`}>
                              {phase?.done ? "✓" : agent.emoji}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">{agent.name}</p>
                              <p className="text-[10px] text-muted-foreground">{agent.role.split(" ").slice(0, 3).join(" ")}...</p>
                            </div>
                            {phase?.active && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary ml-1" />}
                          </div>
                          {i < WRITING_AGENTS.length - 1 && (
                            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${phase?.done ? "text-emerald-400" : "text-muted-foreground/30"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Result */}
                <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <PenLine className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">{selectedType?.label} — {topic.slice(0, 50)}{topic.length > 50 ? "..." : ""}</span>
                      {isWriting && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
                      {done && <span className="text-xs text-emerald-400">✓ Selesai</span>}
                    </div>
                    {done && (
                      <div className="flex gap-2">
                        <button onClick={copyResult} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-colors">
                          {copied ? <><Check className="w-3 h-3 text-emerald-400" /> Disalin</> : <><Copy className="w-3 h-3" /> Salin</>}
                        </button>
                        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                          <PenLine className="w-3 h-3" /> Tulis Baru
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-6 prose prose-invert prose-sm max-w-none min-h-48">
                    {result ? (
                      <MarkdownRenderer content={result} />
                    ) : (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span>Memulai proses penulisan...</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
