import { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, Loader2, MessageSquare, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

const AGENTS: Record<string, { emoji: string; name: string; category: string; description: string; specialties: string[] }> = {
  corporate: {
    emoji: "🏢",
    name: "Corporate Lawyer AI",
    category: "Bisnis & Korporasi",
    description: "Spesialis hukum perusahaan, merger & akuisisi, tata kelola korporasi, dan kepatuhan bisnis.",
    specialties: ["Pendirian PT & CV", "Merger & Akuisisi", "Kontrak Korporasi", "Tata Kelola Perusahaan", "Kepatuhan Hukum"],
  },
  tax: {
    emoji: "💰",
    name: "Tax Lawyer AI",
    category: "Bisnis & Korporasi",
    description: "Ahli perencanaan pajak, sengketa perpajakan, dan kepatuhan pajak untuk individu maupun badan usaha.",
    specialties: ["PPh Badan & Pribadi", "PPN & PPnBM", "Sengketa Pajak", "Perencanaan Pajak", "Transfer Pricing"],
  },
  employment: {
    emoji: "👔",
    name: "Employment Lawyer AI",
    category: "Bisnis & Korporasi",
    description: "Konsultan hubungan ketenagakerjaan, PHK, kontrak kerja, dan perselisihan industrial.",
    specialties: ["Kontrak Kerja", "PHK & Pesangon", "Perselisihan Industrial", "K3 & BPJS", "UMK & Upah"],
  },
  immigration: {
    emoji: "🌍",
    name: "Immigration Lawyer AI",
    category: "Bisnis & Korporasi",
    description: "Spesialis visa, izin tinggal, KITAS/KITAP, dan keimigrasian untuk WNA di Indonesia.",
    specialties: ["Visa & KITAS", "KITAP", "Izin Kerja (IMTA)", "Naturalisasi", "Deportasi"],
  },
  bankruptcy: {
    emoji: "📊",
    name: "Bankruptcy Lawyer AI",
    category: "Bisnis & Korporasi",
    description: "Ahli kepailitan, PKPU, restrukturisasi utang, dan penyelesaian sengketa niaga.",
    specialties: ["Kepailitan", "PKPU", "Restrukturisasi Utang", "Likuidasi", "Sengketa Niaga"],
  },
  securities: {
    emoji: "📈",
    name: "Securities Lawyer AI",
    category: "Bisnis & Korporasi",
    description: "Konsultan pasar modal, IPO, efek, dan kepatuhan OJK untuk emiten maupun investor.",
    specialties: ["IPO & Rights Issue", "Reksa Dana", "Obligasi", "Kepatuhan OJK", "Insider Trading"],
  },
  civilrights: {
    emoji: "⚖️",
    name: "Civil Rights Lawyer AI",
    category: "Personal & Keluarga",
    description: "Pembela hak-hak sipil, diskriminasi, kebebasan berekspresi, dan hak konstitusional warga negara.",
    specialties: ["Hak Asasi Manusia", "Diskriminasi", "Kebebasan Berekspresi", "Hak Privasi", "Gugatan Perdata"],
  },
  criminal: {
    emoji: "🛡️",
    name: "Criminal Defense Lawyer AI",
    category: "Personal & Keluarga",
    description: "Pengacara pidana yang membantu memahami hak-hak tersangka, proses peradilan, dan pembelaan.",
    specialties: ["KUHP & KUHAP", "Pembelaan Tersangka", "Praperadilan", "Penangguhan Penahanan", "Banding & PK"],
  },
  family: {
    emoji: "👨‍👩‍👧",
    name: "Family Lawyer AI",
    category: "Personal & Keluarga",
    description: "Ahli hukum keluarga: perceraian, hak asuh anak, waris, dan perkawinan campuran.",
    specialties: ["Perceraian", "Hak Asuh Anak", "Waris & Warisan", "Perjanjian Pra-Nikah", "Adopsi"],
  },
  realestate: {
    emoji: "🏠",
    name: "Real Estate Lawyer AI",
    category: "Personal & Keluarga",
    description: "Konsultan properti: jual beli, sertifikat, sengketa tanah, dan investasi properti.",
    specialties: ["SHM & HGB", "Jual Beli Properti", "Sengketa Tanah", "PPAT & Notaris", "Properti Asing"],
  },
  personalinjury: {
    emoji: "🚗",
    name: "Personal Injury Lawyer AI",
    category: "Personal & Keluarga",
    description: "Ahli klaim kecelakaan, ganti rugi, malpraktik medis, dan asuransi.",
    specialties: ["Kecelakaan Lalu Lintas", "Malpraktik Medis", "Klaim Asuransi", "Ganti Rugi", "Negligence"],
  },
};

export default function AgentChat() {
  const params = useParams<{ agentKey: string }>();
  const agentKey = params.agentKey || "";
  const agent = AGENTS[agentKey];
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string; id: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgCounter = useRef(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Agen tidak ditemukan</h1>
          <Link href="/agents">
            <Button>Kembali ke Daftar Agen</Button>
          </Link>
        </div>
      </div>
    );
  }

  const startChat = async () => {
    if (!isAuthenticated) { login(); return; }
    try {
      const res = await fetch("/api/openai/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: agent.name, agentType: agentKey }),
      });
      const conv = await res.json();
      setConversationId(conv.id);
      setStarted(true);
      setMessages([{
        id: `sys-${++msgCounter.current}`,
        role: "assistant",
        content: `Halo! Saya ${agent.name}. Saya siap membantu Anda dengan permasalahan ${agent.category.toLowerCase()}. Apa yang ingin Anda tanyakan?`,
      }]);
    } catch {
      toast({ title: "Gagal memulai percakapan", variant: "destructive" });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || isTyping) return;
    const userMsg = { id: `u-${++msgCounter.current}`, role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const aiMsgId = `a-${++msgCounter.current}`;
    setMessages(prev => [...prev, { id: aiMsgId, role: "assistant", content: "" }]);

    try {
      const res = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: userMsg.content }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: m.content + data.content } : m));
              }
            } catch {}
          }
        }
      }
    } catch {
      toast({ title: "Gagal mengirim pesan", variant: "destructive" });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-8 px-4 max-w-5xl mx-auto w-full">
        {/* Back + Header */}
        <div className="mb-6 flex items-start gap-4">
          <Link href="/agents">
            <button className="mt-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-4xl">{agent.emoji}</span>
              <div>
                <h1 className="font-display text-2xl font-bold">{agent.name}</h1>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  {agent.category}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{agent.description}</p>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-6">
          {agent.specialties.map(s => (
            <span key={s} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
              {s}
            </span>
          ))}
        </div>

        {/* Chat Box */}
        <div className="glass-card rounded-2xl border border-white/10 flex flex-col overflow-hidden" style={{ height: "520px" }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5" ref={scrollRef}>
            {!started ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">{agent.emoji}</div>
                <h3 className="text-xl font-bold mb-2">Konsultasi dengan {agent.name}</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm">{agent.description}</p>
                {isAuthenticated ? (
                  <Button onClick={startChat} className="rounded-full px-8 gap-2">
                    <Sparkles className="w-4 h-4" /> Mulai Konsultasi
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Masuk untuk memulai konsultasi gratis</p>
                    <Button onClick={login} className="rounded-full px-8 gap-2">
                      <MessageSquare className="w-4 h-4" /> Masuk & Mulai Chat
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${
                      msg.role === "assistant" ? "bg-primary/20 border border-primary/30" : "bg-white/10"
                    }`}>
                      {msg.role === "assistant" ? agent.emoji : "👤"}
                    </div>
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-sm text-sm leading-relaxed"
                        : "bg-white/5 border border-white/10 text-foreground rounded-tl-sm"
                    }`}>
                      {msg.role === "user" ? (
                        msg.content
                      ) : msg.content ? (
                        <MarkdownRenderer content={msg.content} className="text-sm" />
                      ) : (
                        <span className="flex gap-1 items-center text-muted-foreground text-sm">
                          <Loader2 className="w-3 h-3 animate-spin" /> Sedang mengetik...
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>

          {/* Input */}
          {started && (
            <div className="p-4 border-t border-white/10 bg-white/2">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={`Tanyakan seputar ${agent.category.toLowerCase()}...`}
                  className="flex-1 bg-white/5 border-white/10 rounded-xl"
                  disabled={isTyping}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="rounded-xl px-4 bg-primary hover:bg-primary/90"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
