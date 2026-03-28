import { useState, useRef, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Search, FileText, Brain, Loader2, Copy, Check,
  ChevronDown, ChevronUp, ArrowRight, Lightbulb, BookOpen, Scale
} from "lucide-react";

const SUMMARIZER_AGENTS = [
  { key: "researcher",  emoji: "🔬", name: "Legal Researcher AI",  color: "bg-violet-500", prompt: "Anda adalah Legal Researcher AI. Buat ringkasan akademis yang mendalam dari putusan/teks hukum berikut: identifikasi isu hukum, ratio decidendi, obiter dicta, dan implikasi yurisprudensial." },
  { key: "criminal",   emoji: "🛡️",  name: "Criminal Defense AI",  color: "bg-slate-500",  prompt: "Anda adalah Criminal Defense AI. Analisis teks hukum berikut dari perspektif hukum pidana: identifikasi unsur pidana, hak-hak terdakwa, dan strategi pembelaan yang relevan." },
  { key: "corporate",  emoji: "🏢", name: "Corporate Lawyer AI", color: "bg-blue-500",   prompt: "Anda adalah Corporate Lawyer AI. Analisis implikasi hukum bisnis dan korporasi dari teks berikut: risiko, kewajiban, dan saran kepatuhan." },
  { key: "drafter",    emoji: "✍️",  name: "Legal Drafter AI",    color: "bg-pink-500",   prompt: "Anda adalah Legal Drafter AI. Buat ringkasan terstruktur dari teks hukum berikut: poin utama, kaidah hukum yang ditetapkan, dan implikasi untuk drafting dokumen." },
];

const SEARCH_EXAMPLES = [
  "PHK tanpa pesangon apakah sah?",
  "Syarat mendirikan PT di Indonesia",
  "Hak waris anak luar kawin menurut hukum Indonesia",
  "Proses praperadilan KPK",
  "Peralihan hak atas tanah HGB ke SHM",
  "Tindak pidana korupsi gratifikasi",
];

interface AgentResult {
  key: string;
  emoji: string;
  name: string;
  color: string;
  content: string;
  done: boolean;
  error?: boolean;
}

export default function RisetAI() {
  const [activeTab, setActiveTab] = useState<"summarizer" | "search">("summarizer");
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [searchResult, setSearchResult] = useState("");
  const [searchDone, setSearchDone] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
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

  const streamAgentResult = useCallback(async (agentDef: typeof SUMMARIZER_AGENTS[0], text: string, convId: number, idx: number) => {
    const prompt = `${agentDef.prompt}\n\n---\nTEKS HUKUM:\n${text.slice(0, 4000)}`;
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

  const runSummarizer = async () => {
    if (!inputText.trim() || isProcessing) return;
    setIsProcessing(true);
    setAgentResults(SUMMARIZER_AGENTS.map(a => ({ ...a, content: "", done: false })));
    setExpandedAgent(SUMMARIZER_AGENTS[0].key);
    try {
      const convId = await getConvId();
      await Promise.all(SUMMARIZER_AGENTS.map((a, i) => streamAgentResult(a, inputText, convId, i)));
    } finally {
      setIsProcessing(false);
    }
  };

  const runSearch = async () => {
    if (!searchQuery.trim() || isProcessing) return;
    setIsProcessing(true);
    setSearchResult("");
    setSearchDone(false);
    const prompt = `Anda adalah asisten riset hukum Indonesia yang cerdas. Jawab pertanyaan berikut secara komprehensif dengan mengacu pada peraturan perundang-undangan, putusan pengadilan, dan doktrin hukum Indonesia yang relevan. Sertakan dasar hukum, contoh kasus, dan analisis mendalam:\n\nPERTANYAAN: ${searchQuery}`;
    try {
      const convId = await getConvId();
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
              setSearchResult(prev => prev + ev.content);
            }
          } catch {}
        }
      }
      setSearchDone(true);
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
      <main className="flex-1 pt-36 pb-16">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Brain className="w-4 h-4" /> Riset AI Multi-Agen
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Riset Hukum <span className="text-gradient">Ditenagai AI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Lebih dari sekadar ringkasan — 4 agen spesialis menganalisis teks hukum Anda secara paralel dari perspektif yang berbeda, menghasilkan wawasan yang jauh lebih kaya.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1 rounded-xl bg-white/5 border border-white/10 w-fit mx-auto">
            {[
              { key: "summarizer", icon: FileText, label: "Ringkasan Multi-Agen" },
              { key: "search", icon: Search, label: "Pencarian Semantik AI" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* SUMMARIZER */}
            {activeTab === "summarizer" && (
              <motion.div key="summarizer" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="glass-card rounded-2xl p-5 mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Paste teks putusan / peraturan / dokumen hukum:
                  </label>
                  <textarea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Paste isi putusan pengadilan, pasal undang-undang, kontrak, atau teks hukum apa pun di sini..."
                    className="w-full h-44 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">{inputText.length.toLocaleString()} karakter</span>
                    <button
                      onClick={runSummarizer}
                      disabled={!inputText.trim() || isProcessing}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-all"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {isProcessing ? "Menganalisis..." : "Analisis dengan 4 Agen"}
                    </button>
                  </div>
                </div>

                {/* Agent collaboration visualization */}
                {agentResults.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex -space-x-2">
                        {SUMMARIZER_AGENTS.map((a, i) => (
                          <div key={a.key} className={`w-8 h-8 rounded-full ${a.color} border-2 border-background flex items-center justify-center text-sm z-${10 - i}`}>
                            {a.emoji}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {isProcessing ? "4 agen sedang menganalisis secara paralel..." : "Analisis selesai dari 4 perspektif"}
                      </span>
                      {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                    </div>

                    <div className="space-y-3">
                      {agentResults.map((agent, i) => (
                        <motion.div
                          key={agent.key}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass-card rounded-2xl overflow-hidden border border-white/10"
                        >
                          <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setExpandedAgent(expandedAgent === agent.key ? null : agent.key)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl ${agent.color} flex items-center justify-center text-lg`}>
                                {agent.emoji}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground">{agent.name}</p>
                                {!agent.done && !agent.error ? (
                                  <p className="text-xs text-primary flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Sedang menganalisis...
                                  </p>
                                ) : agent.error ? (
                                  <p className="text-xs text-red-400">Gagal menganalisis</p>
                                ) : (
                                  <p className="text-xs text-emerald-400">✓ Selesai dianalisis</p>
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
                                <div className="p-4">
                                  {agent.content ? (
                                    <div className="prose prose-invert prose-sm max-w-none">
                                      <MarkdownRenderer content={agent.content} />
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                      <Loader2 className="w-4 h-4 animate-spin" /> Menunggu analisis...
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

                {/* Info jika belum ada hasil */}
                {agentResults.length === 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {SUMMARIZER_AGENTS.map(a => (
                      <div key={a.key} className="glass-card rounded-xl p-4 text-center border border-white/10">
                        <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center text-xl mx-auto mb-2`}>{a.emoji}</div>
                        <p className="text-xs font-semibold text-foreground">{a.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Menunggu teks...</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* SEARCH */}
            {activeTab === "search" && (
              <motion.div key="search" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="glass-card rounded-2xl p-5 mb-6">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && runSearch()}
                        placeholder="Tanya pertanyaan hukum apa saja dalam Bahasa Indonesia..."
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <button
                      onClick={runSearch}
                      disabled={!searchQuery.trim() || isProcessing}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-all"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {SEARCH_EXAMPLES.map(ex => (
                      <button
                        key={ex}
                        onClick={() => setSearchQuery(ex)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                {(searchResult || isProcessing) && (
                  <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Legal Researcher AI</p>
                          {isProcessing ? (
                            <p className="text-xs text-primary flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" /> Mencari & menganalisis...
                            </p>
                          ) : (
                            <p className="text-xs text-emerald-400">✓ Analisis selesai</p>
                          )}
                        </div>
                      </div>
                      {searchDone && (
                        <button onClick={() => copyText(searchResult, "search")} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                          {copied === "search" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                        </button>
                      )}
                    </div>
                    <div className="p-5 prose prose-invert prose-sm max-w-none">
                      <MarkdownRenderer content={searchResult || "..."} />
                    </div>
                  </div>
                )}

                {!searchResult && !isProcessing && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {[
                      { icon: Scale, title: "Peraturan Relevan", desc: "Temukan UU, PP, dan Perpres yang berlaku untuk masalah Anda" },
                      { icon: BookOpen, title: "Putusan Preseden", desc: "Analisis putusan MA, MK, dan PN yang relevan dengan konteks" },
                      { icon: Lightbulb, title: "Analisis Mendalam", desc: "Dapatkan analisis lintas-perspektif dari berbagai bidang hukum" },
                    ].map((item, i) => (
                      <div key={i} className="glass-card rounded-xl p-4 border border-white/10 text-center">
                        <item.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-xs font-bold mb-1">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
