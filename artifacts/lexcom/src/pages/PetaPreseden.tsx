import { useState, useRef, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network, Search, Loader2, Sparkles, ArrowRight, Scale,
  ExternalLink, ChevronRight, BookOpen, Copy, Check
} from "lucide-react";

const EXAMPLE_QUERIES = [
  "Putusan tentang PHK sepihak tanpa pesangon",
  "Tindak pidana korupsi pengadaan barang jasa",
  "Sengketa hak cipta musik Indonesia",
  "Wanprestasi kontrak jual beli tanah",
  "Pencemaran lingkungan oleh korporasi",
  "Judicial review UU di Mahkamah Konstitusi",
];

const PRECEDENT_AGENTS = [
  {
    key: "researcher",
    emoji: "🔬",
    name: "Legal Researcher AI",
    color: "bg-violet-600",
    role: "Temuan Preseden",
    prompt: `Anda adalah Legal Researcher AI Indonesia. Untuk topik hukum berikut, identifikasi dan jelaskan:
1. **5-8 Putusan Mahkamah Agung (MA) yang paling relevan** — sebutkan nomor putusan, tahun, isu hukum, dan amar putusan kunci
2. **Putusan Mahkamah Konstitusi (MK) yang relevan** jika ada
3. **Kaidah/Ratio Decidendi** yang ditetapkan
4. **Tren putusan** — apakah konsisten atau ada perbedaan antar majelis?
Topik: `,
  },
  {
    key: "criminal",
    emoji: "🛡️",
    name: "Criminal Defense AI",
    color: "bg-slate-600",
    role: "Preseden Pidana",
    prompt: `Anda adalah Criminal Defense AI. Jika topik berkaitan dengan hukum pidana, petakan:
1. **Putusan pidana penting** yang menjadi preseden (PN, PT, MA)
2. **Perbedaan putusan** antar instansi
3. **Strategi pembelaan** yang berhasil berdasarkan preseden
4. **Implikasi untuk kasus serupa**
Jika tidak berkaitan pidana, analisis dari perspektif perlindungan hak-hak dalam konteks ini.
Topik: `,
  },
  {
    key: "corporate",
    emoji: "🏢",
    name: "Corporate Lawyer AI",
    color: "bg-blue-600",
    role: "Preseden Bisnis",
    prompt: `Anda adalah Corporate Lawyer AI. Petakan preseden dari perspektif hukum bisnis:
1. **Putusan Pengadilan Niaga** yang relevan
2. **Putusan terkait kepailitan/PKPU** jika ada
3. **Implikasi bisnis** dari preseden yang ada
4. **Saran praktis** untuk pelaku usaha berdasarkan putusan-putusan ini
Topik: `,
  },
];

interface PrecedentResult {
  key: string;
  emoji: string;
  name: string;
  color: string;
  role: string;
  content: string;
  done: boolean;
  error?: boolean;
}

const NODE_POSITIONS = [
  { x: 50, y: 50 },
  { x: 20, y: 20 }, { x: 80, y: 20 },
  { x: 10, y: 55 }, { x: 90, y: 55 },
  { x: 25, y: 82 }, { x: 75, y: 82 },
  { x: 50, y: 92 },
];

const MOCK_NODES = [
  { label: "Putusan MA\n1234/Pid.B/2023", type: "central", color: "#8b5cf6" },
  { label: "MA\n567/Pid/2021", type: "related", color: "#3b82f6" },
  { label: "MK No.\n023/2020", type: "mk", color: "#ef4444" },
  { label: "PN Jakarta\n890/Pid/2022", type: "lower", color: "#10b981" },
  { label: "PN Surabaya\n234/Pid/2023", type: "lower", color: "#10b981" },
  { label: "MA\n456/Pid/2019", type: "related", color: "#3b82f6" },
  { label: "MA\n789/Pid/2018", type: "related", color: "#3b82f6" },
  { label: "PN Bandung\n012/Pid/2020", type: "lower", color: "#10b981" },
];

export default function PetaPreseden() {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<PrecedentResult[]>([]);
  const [activeResult, setActiveResult] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
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

  const streamResult = useCallback(async (agent: typeof PRECEDENT_AGENTS[0], topic: string, convId: number, idx: number) => {
    const prompt = `${agent.prompt}${topic}`;
    try {
      const res = await fetch(`/api/assistant/conversations/${convId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: prompt }),
      });
      if (!res.body) throw new Error();
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
              setResults(prev => prev.map((r, i) => i === idx ? { ...r, content: r.content + ev.content } : r));
            }
          } catch {}
        }
      }
      setResults(prev => prev.map((r, i) => i === idx ? { ...r, done: true } : r));
    } catch {
      setResults(prev => prev.map((r, i) => i === idx ? { ...r, done: true, error: true } : r));
    }
  }, []);

  const runSearch = async () => {
    if (!query.trim() || isProcessing) return;
    setIsProcessing(true);
    setShowMap(false);
    setResults(PRECEDENT_AGENTS.map(a => ({ ...a, content: "", done: false })));
    setActiveResult(PRECEDENT_AGENTS[0].key);
    try {
      const convId = await getConvId();
      await Promise.all(PRECEDENT_AGENTS.map((a, i) => streamResult(a, query, convId, i)));
      setShowMap(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Network className="w-4 h-4" /> Peta Preseden AI
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Peta Preseden <span className="text-gradient">Yurisprudensi</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Temukan dan visualisasikan hubungan antar putusan pengadilan. 3 agen AI memetakan preseden secara paralel dari perspektif yang berbeda — lebih dalam dari sekadar pencarian keyword.
            </p>
          </div>

          {/* Search */}
          <div className="glass-card rounded-2xl p-5 mb-8">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && runSearch()}
                  placeholder="Masukkan topik hukum atau jenis kasus untuk dipetakan presedennnya..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <button
                onClick={runSearch}
                disabled={!query.trim() || isProcessing}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-all"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Network className="w-4 h-4" /> Petakan</>}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLE_QUERIES.map(ex => (
                <button
                  key={ex}
                  onClick={() => setQuery(ex)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {results.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* Precedent Map Visualization */}
              <div className="lg:col-span-2">
                <div className="glass-card rounded-2xl p-5 border border-white/10 sticky top-28">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Network className="w-4 h-4 text-primary" /> Jaringan Preseden
                  </h3>

                  <div className="relative h-56 w-full mb-4">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {NODE_POSITIONS.slice(1).map((pos, i) => (
                        <line key={i} x1="50" y1="50" x2={pos.x} y2={pos.y}
                          stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2,2" />
                      ))}
                    </svg>
                    {MOCK_NODES.map((node, i) => {
                      const pos = NODE_POSITIONS[i];
                      return (
                        <AnimatePresence key={i}>
                          {(showMap || i === 0) && (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: i * 0.08, type: "spring" }}
                              className="absolute transform -translate-x-1/2 -translate-y-1/2"
                              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                            >
                              <div
                                className={`rounded-lg border border-white/20 flex items-center justify-center text-center shadow-lg cursor-pointer hover:scale-110 transition-transform ${
                                  i === 0 ? "w-16 h-16 text-[8px]" : "w-12 h-12 text-[7px]"
                                }`}
                                style={{ backgroundColor: node.color + "20", borderColor: node.color + "50" }}
                              >
                                <span className="text-foreground leading-tight px-0.5" style={{ fontSize: i === 0 ? "7px" : "6px" }}>
                                  {node.label}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      );
                    })}
                    {!showMap && isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {[
                      { color: "#8b5cf6", label: "Putusan Utama (Central)" },
                      { color: "#3b82f6", label: "Putusan MA Terkait" },
                      { color: "#ef4444", label: "Putusan MK" },
                      { color: "#10b981", label: "Putusan Pengadilan Negeri" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <a
                      href="https://putusan3.mahkamahagung.go.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> Cari di Direktori Putusan MA
                    </a>
                    <a
                      href="https://www.mkri.id/perkara/persidangan/putusan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-primary hover:underline mt-1.5"
                    >
                      <ExternalLink className="w-3 h-3" /> Cari di Database Putusan MK
                    </a>
                  </div>
                </div>
              </div>

              {/* Agent Results */}
              <div className="lg:col-span-3 space-y-3">
                {results.map((agent, i) => (
                  <motion.div
                    key={agent.key}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-2xl overflow-hidden border border-white/10"
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => setActiveResult(activeResult === agent.key ? null : agent.key)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center text-lg`}>
                          {agent.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{agent.name}</p>
                          <p className="text-[11px] text-muted-foreground">{agent.role}</p>
                          {!agent.done ? (
                            <p className="text-xs text-primary flex items-center gap-1 mt-0.5">
                              <Loader2 className="w-3 h-3 animate-spin" /> Memetakan preseden...
                            </p>
                          ) : agent.error ? (
                            <p className="text-xs text-red-400 mt-0.5">Gagal</p>
                          ) : (
                            <p className="text-xs text-emerald-400 mt-0.5">✓ Peta selesai</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {agent.done && !agent.error && (
                          <button onClick={e => { e.stopPropagation(); copyText(agent.content, agent.key); }} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                            {copied === agent.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                          </button>
                        )}
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeResult === agent.key ? "rotate-90" : ""}`} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {activeResult === agent.key && (
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
                                <Loader2 className="w-4 h-4 animate-spin" /> Memetakan preseden untuk topik ini...
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {results.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRECEDENT_AGENTS.map((agent, i) => (
                <div key={agent.key} className="glass-card rounded-xl p-5 border border-white/10 text-center">
                  <div className={`w-12 h-12 rounded-xl ${agent.color} flex items-center justify-center text-2xl mx-auto mb-3`}>{agent.emoji}</div>
                  <p className="text-sm font-bold mb-1">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
