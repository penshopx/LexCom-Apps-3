import { useState, useRef, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Sparkles, Send, Loader2, Copy, Check, ChevronRight,
  Settings, MessageSquare, Palette, Database, Code2, Scale,
  BookOpen, Briefcase, GraduationCap, Users
} from "lucide-react";

const SPECIALTIES = [
  { key: "corporate",   emoji: "🏢", label: "Hukum Korporasi",        prompt: "Anda adalah asisten hukum korporasi yang membantu menjawab pertanyaan seputar pendirian perusahaan, kontrak bisnis, merger & akuisisi, dan kepatuhan perusahaan." },
  { key: "employment",  emoji: "👔", label: "Hukum Ketenagakerjaan",  prompt: "Anda adalah asisten hukum ketenagakerjaan yang membantu menjawab pertanyaan PHK, pesangon, kontrak kerja, BPJS, dan perselisihan industrial." },
  { key: "criminal",    emoji: "🛡️",  label: "Hukum Pidana",           prompt: "Anda adalah asisten hukum pidana yang membantu memahami KUHP Baru, hak tersangka, proses peradilan pidana, dan pembelaan." },
  { key: "family",      emoji: "👨‍👩‍👧", label: "Hukum Keluarga",         prompt: "Anda adalah asisten hukum keluarga yang membantu pertanyaan perceraian, hak asuh anak, waris, dan perkawinan." },
  { key: "property",    emoji: "🏠", label: "Hukum Properti",          prompt: "Anda adalah asisten hukum properti yang membantu pertanyaan jual beli tanah, sertifikasi, sengketa agraria, dan PPJB." },
  { key: "syariah",     emoji: "🕌", label: "Hukum Syariah",           prompt: "Anda adalah asisten hukum syariah yang membantu pertanyaan ekonomi Islam, waris faraidh, zakat, wakaf, dan KHI." },
  { key: "general",     emoji: "⚖️",  label: "Hukum Umum",             prompt: "Anda adalah asisten hukum umum yang membantu pertanyaan hukum Indonesia dari berbagai bidang." },
  { key: "academic",    emoji: "🎓", label: "Pendidikan Hukum",        prompt: "Anda adalah asisten pendidikan hukum yang membantu mahasiswa dan akademisi dengan teori, doktrin, dan riset hukum." },
];

const PERSONALITIES = [
  { key: "professional", label: "Profesional & Formal",    desc: "Bahasa resmi dan terstruktur" },
  { key: "friendly",     label: "Ramah & Mudah Dipahami",  desc: "Bahasa mudah untuk masyarakat umum" },
  { key: "academic",     label: "Akademis & Mendalam",     desc: "Analitis dan berbasis teori" },
  { key: "concise",      label: "Singkat & Padat",          desc: "Jawaban ringkas dan langsung" },
];

const KB_OPTIONS = [
  { key: "peraturan", icon: BookOpen,  label: "Database Peraturan",   desc: "53 UU, PP, Perpres, Permen" },
  { key: "putusan",   icon: Scale,     label: "Database Putusan",     desc: "30+ putusan MA, MK, PN" },
  { key: "panduan",   icon: Database,  label: "Panduan Prosedur",     desc: "30+ panduan hukum praktis" },
  { key: "glosarium", icon: BookOpen,  label: "Glosarium Hukum",      desc: "120+ istilah hukum" },
];

interface Message { role: "user" | "bot"; content: string; id: string; }

export default function ChatbotBuilder() {
  const [currentTab, setCurrentTab] = useState<"config" | "preview" | "embed">("config");

  // Config state
  const [botName, setBotName] = useState("Asisten Hukum");
  const [greeting, setGreeting] = useState("Halo! Saya siap membantu Anda dengan pertanyaan hukum. Silakan tanyakan apa saja.");
  const [specialty, setSpecialty] = useState("general");
  const [personality, setPersonality] = useState("professional");
  const [knowledgeBase, setKnowledgeBase] = useState<string[]>(["peraturan", "putusan"]);
  const [customInstructions, setCustomInstructions] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#8b5cf6");

  // Preview chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [previewStarted, setPreviewStarted] = useState(false);
  const convIdRef = useRef<number | null>(null);
  const msgCounter = useRef(0);

  const [copied, setCopied] = useState(false);

  const selectedSpecialty = SPECIALTIES.find(s => s.key === specialty);
  const selectedPersonality = PERSONALITIES.find(p => p.key === personality);

  const buildSystemPrompt = () => {
    const kb = KB_OPTIONS.filter(k => knowledgeBase.includes(k.key)).map(k => k.label).join(", ");
    return `${selectedSpecialty?.prompt}

KEPRIBADIAN: ${selectedPersonality?.label} — ${selectedPersonality?.desc}
SUMBER PENGETAHUAN: ${kb}
NAMA ASISTEN: ${botName}
${customInstructions ? `\nINSTRUKSI KHUSUS:\n${customInstructions}` : ""}

Selalu jawab dalam Bahasa Indonesia. Jika pertanyaan di luar bidang hukum, arahkan kembali ke topik hukum.`;
  };

  const startPreview = () => {
    setPreviewStarted(true);
    setMessages([{ id: `sys-${++msgCounter.current}`, role: "bot", content: greeting }]);
    setCurrentTab("preview");
    convIdRef.current = null;
  };

  const getConvId = useCallback(async () => {
    if (convIdRef.current) return convIdRef.current;
    const res = await fetch("/api/assistant/conversations", {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
    });
    const d = await res.json();
    convIdRef.current = d.id;
    return d.id as number;
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: `u-${++msgCounter.current}`, role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const botMsgId = `b-${++msgCounter.current}`;
    setMessages(prev => [...prev, { id: botMsgId, role: "bot", content: "" }]);

    try {
      const convId = await getConvId();
      const systemContext = buildSystemPrompt();
      const prompt = `[SISTEM KONTEKS CHATBOT]\n${systemContext}\n\n[PESAN PENGGUNA]\n${userMsg.content}`;

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
              setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: m.content + ev.content } : m));
            }
          } catch {}
        }
      }
    } catch {}
    setIsTyping(false);
  };

  const toggleKB = (key: string) => {
    setKnowledgeBase(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const embedCode = `<!-- LexCom Chatbot Widget -->
<script>
  window.LexComBot = {
    name: "${botName}",
    specialty: "${specialty}",
    color: "${primaryColor}",
    greeting: "${greeting}"
  };
</script>
<script src="https://lexcom.ai/widget.js" async></script>`;

  const copyEmbed = () => { navigator.clipboard.writeText(embedCode); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Bot className="w-4 h-4" /> Chatbot Builder
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Bangun Chatbot Hukum <span className="text-gradient">Sendiri</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Konfigurasi, preview, dan deploy chatbot hukum kustom dengan kekuatan AI LexCom. Cocok untuk firma hukum, kampus, instansi pemerintah, dan bisnis.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10 w-fit mx-auto mb-8">
            {[
              { key: "config",  icon: Settings,      label: "Konfigurasi" },
              { key: "preview", icon: MessageSquare,  label: "Preview Chat" },
              { key: "embed",   icon: Code2,          label: "Kode Embed" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => tab.key === "preview" ? startPreview() : setCurrentTab(tab.key as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${currentTab === tab.key ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* CONFIG */}
            {currentTab === "config" && (
              <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  <div className="space-y-5">
                    {/* Identitas Bot */}
                    <div className="glass-card rounded-2xl p-5">
                      <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Bot className="w-4 h-4 text-primary" /> Identitas Bot</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Nama Chatbot</label>
                          <input value={botName} onChange={e => setBotName(e.target.value)} placeholder="Contoh: Asisten Hukum LexFirm" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Pesan Sambutan</label>
                          <textarea value={greeting} onChange={e => setGreeting(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Warna Tema</label>
                          <div className="flex items-center gap-3">
                            <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                            <span className="text-sm text-muted-foreground">{primaryColor}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spesialisasi */}
                    <div className="glass-card rounded-2xl p-5">
                      <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Scale className="w-4 h-4 text-primary" /> Spesialisasi Hukum</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {SPECIALTIES.map(s => (
                          <button key={s.key} onClick={() => setSpecialty(s.key)}
                            className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${specialty === s.key ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"}`}>
                            <span className="text-base">{s.emoji}</span>
                            <span className="text-xs font-semibold">{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Kepribadian */}
                    <div className="glass-card rounded-2xl p-5">
                      <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Kepribadian & Gaya</h3>
                      <div className="space-y-2">
                        {PERSONALITIES.map(p => (
                          <button key={p.key} onClick={() => setPersonality(p.key)}
                            className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${personality === p.key ? "bg-primary/20 border-primary/50" : "bg-white/5 border-white/10 hover:border-white/20"}`}>
                            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${personality === p.key ? "border-primary bg-primary" : "border-muted-foreground"}`} />
                            <div>
                              <p className="text-xs font-bold text-foreground">{p.label}</p>
                              <p className="text-[11px] text-muted-foreground">{p.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Knowledge Base */}
                    <div className="glass-card rounded-2xl p-5">
                      <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Database className="w-4 h-4 text-primary" /> Knowledge Base</h3>
                      <div className="space-y-2">
                        {KB_OPTIONS.map(kb => (
                          <label key={kb.key} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                            <input type="checkbox" checked={knowledgeBase.includes(kb.key)} onChange={() => toggleKB(kb.key)} className="accent-primary w-3.5 h-3.5" />
                            <kb.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-foreground">{kb.label}</p>
                              <p className="text-[10px] text-muted-foreground">{kb.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Custom Instructions */}
                    <div className="glass-card rounded-2xl p-5">
                      <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> Instruksi Khusus</h3>
                      <textarea value={customInstructions} onChange={e => setCustomInstructions(e.target.value)} rows={4} placeholder="Contoh: Selalu sarankan untuk berkonsultasi langsung dengan advokat untuk kasus yang kompleks. Fokus hanya pada hukum Indonesia..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button onClick={startPreview} className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/25">
                    <MessageSquare className="w-5 h-5" /> Preview Chatbot Sekarang
                  </button>
                </div>
              </motion.div>
            )}

            {/* PREVIEW */}
            {currentTab === "preview" && (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto">
                <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  {/* Header */}
                  <div className="p-4 flex items-center gap-3" style={{ backgroundColor: primaryColor + "20", borderBottom: `1px solid ${primaryColor}30` }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{botName}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Online • Powered by LexCom AI</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="h-72 overflow-y-auto p-4 space-y-3">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                          msg.role === "user" ? "text-white rounded-br-sm" : "bg-white/10 text-foreground rounded-bl-sm"
                        }`} style={msg.role === "user" ? { backgroundColor: primaryColor } : {}}>
                          {msg.content || (isTyping && msg.role === "bot" ? <Loader2 className="w-4 h-4 animate-spin" /> : "")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-white/10">
                    <div className="flex gap-2">
                      <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                        placeholder="Ketik pertanyaan hukum..."
                        disabled={isTyping}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
                      />
                      <button onClick={sendMessage} disabled={!input.trim() || isTyping} className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-50" style={{ backgroundColor: primaryColor }}>
                        {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button onClick={() => setCurrentTab("embed")} className="flex items-center gap-2 mx-auto text-sm text-primary hover:underline">
                    <Code2 className="w-4 h-4" /> Lihat Kode Embed untuk dipasang di website Anda
                  </button>
                </div>
              </motion.div>
            )}

            {/* EMBED */}
            {currentTab === "embed" && (
              <motion.div key="embed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Code2 className="w-4 h-4 text-primary" /> Kode Embed Widget</h3>
                  <div className="relative">
                    <pre className="bg-black/40 rounded-xl p-4 text-xs text-emerald-300 overflow-x-auto border border-white/10 font-mono">
                      {embedCode}
                    </pre>
                    <button onClick={copyEmbed} className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-xs hover:bg-white/20 transition-colors">
                      {copied ? <><Check className="w-3 h-3 text-emerald-400" /> Disalin</> : <><Copy className="w-3 h-3" /> Salin</>}
                    </button>
                  </div>
                  <div className="mt-5 space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Gunakan Untuk:</h4>
                    {[
                      { icon: Briefcase, label: "Firma Hukum", desc: "Pasang di website kantor hukum Anda" },
                      { icon: GraduationCap, label: "Kampus / FH", desc: "Bantu mahasiswa belajar hukum" },
                      { icon: Users, label: "Instansi Pemerintah", desc: "Layanan informasi hukum publik" },
                      { icon: Bot, label: "Platform Digital", desc: "Embed di aplikasi atau portal Anda" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">{item.label}</p>
                          <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
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
