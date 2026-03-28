import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  RotateCcw,
  ChevronDown,
  Cpu,
  Network,
  BookOpen,
  GitMerge,
  Minimize2,
} from "lucide-react";

interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentLabel?: string;
  agentEmoji?: string;
  action?: string;
  isStreaming?: boolean;
}

interface AgentStatus {
  type: "thinking" | "delegating" | "guide" | "planning" | "answering" | "clarifying";
  label: string;
}

interface StreamEvent {
  type: "thinking" | "action" | "content" | "done" | "error";
  action?: string;
  specialist?: string;
  specialistName?: string;
  feature?: string;
  title?: string;
  content?: string;
  message?: string;
  metadata?: Record<string, string>;
}

const PAGE_CONTEXT: Record<string, { title: string; prompts: string[] }> = {
  "/agentic-chatbots": {
    title: "Halaman Agentic AI Chat",
    prompts: [
      "Cara menggunakan Agentic AI Chat?",
      "Bedanya Mode Otomatis vs Manual?",
      "Bagaimana cara sintesis bekerja?",
    ],
  },
  "/lexbot": {
    title: "Halaman LexBot",
    prompts: [
      "Apa bedanya LexBot dengan Agentic AI Chat?",
      "Bagaimana cara kerja multi-agent di LexBot?",
    ],
  },
  "/agents": {
    title: "Halaman Agen AI",
    prompts: [
      "Apa perbedaan setiap agen hukum?",
      "Cara konsultasi dengan agen secara langsung?",
    ],
  },
  "/documents": {
    title: "Halaman Generator Dokumen",
    prompts: [
      "Cara membuat dokumen hukum otomatis?",
      "Dokumen apa saja yang bisa dibuat?",
    ],
  },
  "/cases": {
    title: "Halaman Manajemen Perkara",
    prompts: [
      "Cara menambah perkara baru?",
      "Bagaimana melacak status perkara?",
    ],
  },
  "/panduan": {
    title: "Halaman Panduan Hukum",
    prompts: [
      "Rekomendasikan panduan untuk pemula?",
      "Ada panduan tentang PHK?",
    ],
  },
  "/forum": {
    title: "Halaman Forum Diskusi",
    prompts: [
      "Cara posting pertanyaan di forum?",
      "Bisa posting anonim?",
    ],
  },
  "/": {
    title: "Beranda LexCom",
    prompts: [
      "Apa saja fitur utama LexCom?",
      "Mulai dari mana untuk pemula?",
      "Fitur mana yang gratis tanpa login?",
    ],
  },
};

const DEFAULT_PROMPTS = [
  "Jelaskan cara kerja Multi-Agent AI di LexCom",
  "Fitur apa yang tersedia tanpa login?",
  "Cara konsultasi dengan agen hukum spesifik?",
];

const AGENT_DISPLAY: Record<string, { label: string; emoji: string }> = {
  corporate: { label: "Corporate Lawyer AI", emoji: "🏢" },
  tax: { label: "Tax Lawyer AI", emoji: "💰" },
  employment: { label: "Employment Lawyer AI", emoji: "👔" },
  immigration: { label: "Immigration Lawyer AI", emoji: "✈️" },
  bankruptcy: { label: "Bankruptcy Lawyer AI", emoji: "📊" },
  securities: { label: "Securities Lawyer AI", emoji: "📈" },
  civilrights: { label: "Civil Rights Lawyer AI", emoji: "⚖️" },
  criminal: { label: "Criminal Defense AI", emoji: "🛡️" },
  family: { label: "Family Lawyer AI", emoji: "👨‍👩‍👧" },
  realestate: { label: "Real Estate Lawyer AI", emoji: "🏠" },
  personalinjury: { label: "Personal Injury AI", emoji: "🩺" },
  orchestrator: { label: "LexBot", emoji: "✨" },
};

export function FloatingLexBot() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const pageCtx = PAGE_CONTEXT[location] ?? PAGE_CONTEXT["/"]!;
  const prompts = pageCtx.prompts ?? DEFAULT_PROMPTS;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, agentStatus]);

  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      setHasUnread(true);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const initConv = useCallback(async (): Promise<number> => {
    if (conversationId) return conversationId;
    const res = await fetch("/api/assistant/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = (await res.json()) as { id: number };
    setConversationId(data.id);
    return data.id;
  }, [conversationId]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", content: text.trim() };
      const asstId = crypto.randomUUID();
      let fullContent = "";
      let resolvedAgent = "orchestrator";

      setMessages((p) => [
        ...p,
        userMsg,
        { id: asstId, role: "assistant", content: "", agentLabel: "LexBot", agentEmoji: "✨", isStreaming: true },
      ]);
      setInput("");
      setIsStreaming(true);
      setAgentStatus({ type: "thinking", label: "LexBot sedang menganalisis..." });

      try {
        const convId = await initConv();
        abortRef.current = new AbortController();

        const res = await fetch(`/api/assistant/conversations/${convId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: text.trim() }),
          signal: abortRef.current.signal,
        });

        if (!res.body) throw new Error("No body");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (!json) continue;
            try {
              const ev = JSON.parse(json) as StreamEvent;

              if (ev.type === "thinking") {
                setAgentStatus({ type: "thinking", label: "LexBot sedang menganalisis..." });
              } else if (ev.type === "action") {
                if (ev.action === "delegating" && ev.specialist) {
                  resolvedAgent = ev.specialist;
                  const meta = AGENT_DISPLAY[ev.specialist] ?? AGENT_DISPLAY.orchestrator;
                  setAgentStatus({ type: "delegating", label: `Berkonsultasi dengan ${ev.specialistName ?? meta.label}...` });
                  setMessages((p) =>
                    p.map((m) =>
                      m.id === asstId
                        ? { ...m, agentLabel: ev.specialistName ?? meta.label, agentEmoji: meta.emoji }
                        : m
                    )
                  );
                } else if (ev.action === "guide") {
                  setAgentStatus({ type: "guide", label: `Menyiapkan panduan tentang ${ev.feature ?? "fitur"}...` });
                } else if (ev.action === "planning") {
                  setAgentStatus({ type: "planning", label: "Membuat rencana tindakan..." });
                } else if (ev.action === "clarifying") {
                  setAgentStatus({ type: "clarifying", label: "Memformulasikan pertanyaan..." });
                } else {
                  setAgentStatus({ type: "answering", label: "Menyusun jawaban..." });
                }
              } else if (ev.type === "content" && ev.content) {
                fullContent += ev.content;
                setMessages((p) =>
                  p.map((m) => (m.id === asstId ? { ...m, content: fullContent } : m))
                );
              } else if (ev.type === "done") {
                setAgentStatus(null);
                setMessages((p) =>
                  p.map((m) =>
                    m.id === asstId ? { ...m, action: ev.metadata?.action, isStreaming: false } : m
                  )
                );
              } else if (ev.type === "error") {
                setAgentStatus(null);
                setMessages((p) =>
                  p.map((m) =>
                    m.id === asstId ? { ...m, content: `❌ ${ev.message ?? "Terjadi kesalahan"}`, isStreaming: false } : m
                  )
                );
              }
            } catch {}
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((p) =>
            p.map((m) =>
              m.id === asstId ? { ...m, content: "❌ Koneksi terputus. Silakan coba lagi.", isStreaming: false } : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        setAgentStatus(null);
        abortRef.current = null;
      }
      void resolvedAgent;
    },
    [isStreaming, initConv]
  );

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setConversationId(null);
    setIsStreaming(false);
    setAgentStatus(null);
    setInput("");
  };

  const STATUS_COLORS: Record<AgentStatus["type"], string> = {
    thinking: "bg-violet-500/10 border-violet-500/30 text-violet-300",
    delegating: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    guide: "bg-green-500/10 border-green-500/30 text-green-300",
    planning: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    answering: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
    clarifying: "bg-pink-500/10 border-pink-500/30 text-pink-300",
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => { setIsOpen(true); setIsMinimized(false); }}
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 hover:scale-110 transition-all duration-200 flex items-center justify-center"
              title="Buka LexBot"
            >
              <Sparkles className="w-6 h-6 text-white" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-background animate-pulse" />
              )}
            </button>
            <div className="mt-2 text-center">
              <span className="text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                LexBot
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
            style={{ maxHeight: isMinimized ? "56px" : "580px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-900/80 to-purple-900/80 backdrop-blur-md px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-600/80 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">LexBot</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  {!isMinimized && (
                    <p className="text-[10px] text-violet-300/80">
                      Asisten AI Multi-Agen · {pageCtx.title}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && !isMinimized && (
                  <button
                    onClick={reset}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-violet-300 hover:text-white transition-colors"
                    title="Reset"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-violet-300 hover:text-white transition-colors"
                  title={isMinimized ? "Perluas" : "Perkecil"}
                >
                  {isMinimized ? <ChevronDown className="w-3.5 h-3.5 rotate-180" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-violet-300 hover:text-white transition-colors"
                  title="Tutup"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Badges */}
                <div className="bg-background/95 backdrop-blur-md px-3 py-1.5 border-b border-white/5 flex gap-1.5 flex-wrap">
                  <Badge variant="outline" className="text-[10px] h-4 gap-0.5 border-violet-500/30 text-violet-400">
                    <Cpu className="w-2.5 h-2.5" /> Orchestrator
                  </Badge>
                  <Badge variant="outline" className="text-[10px] h-4 gap-0.5 border-blue-500/30 text-blue-400">
                    <Network className="w-2.5 h-2.5" /> 11 Specialists
                  </Badge>
                  <Badge variant="outline" className="text-[10px] h-4 gap-0.5 border-green-500/30 text-green-400">
                    <GitMerge className="w-2.5 h-2.5" /> Function Calling
                  </Badge>
                </div>

                {/* Messages */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto bg-background/95 backdrop-blur-md"
                  style={{ minHeight: 0 }}
                >
                  {messages.length === 0 ? (
                    <WelcomeState prompts={prompts} onSend={(p) => void send(p)} />
                  ) : (
                    <div className="p-3 space-y-3">
                      {messages.map((msg) => (
                        <MsgBubble key={msg.id} msg={msg} />
                      ))}
                      {agentStatus && (
                        <div
                          className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-xl border ${STATUS_COLORS[agentStatus.type]}`}
                        >
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          {agentStatus.label}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick prompts (context-aware, shown only when chat has started) */}
                {messages.length > 0 && !isStreaming && (
                  <div className="px-3 py-1.5 bg-background/95 border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-hide">
                    {prompts.slice(0, 2).map((p) => (
                      <button
                        key={p}
                        onClick={() => void send(p)}
                        className="text-[10px] text-muted-foreground whitespace-nowrap px-2.5 py-1 rounded-full border border-white/10 hover:border-violet-500/40 hover:text-violet-300 transition-all flex-shrink-0"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="px-3 py-3 bg-background/95 backdrop-blur-md border-t border-white/10 flex gap-2 flex-shrink-0">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Tanya LexBot apapun..."
                      disabled={isStreaming}
                      className="pr-8 py-2 h-9 text-xs bg-white/5 border-white/15 focus-visible:ring-violet-500 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void send(input);
                        }
                      }}
                    />
                    {isStreaming && (
                      <button
                        type="button"
                        onClick={() => { abortRef.current?.abort(); setIsStreaming(false); setAgentStatus(null); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => void send(input)}
                    disabled={!input.trim() || isStreaming}
                    className="h-9 w-9 p-0 rounded-xl bg-violet-600 hover:bg-violet-700"
                  >
                    {isStreaming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function WelcomeState({ prompts, onSend }: { prompts: string[]; onSend: (p: string) => void }) {
  return (
    <div className="p-4 space-y-4">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h4 className="font-bold text-sm text-foreground">Halo! Saya LexBot</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tanya saya cara menggunakan LexCom, atau ajukan pertanyaan hukum Anda — saya akan melibatkan spesialis yang tepat.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider">
          <BookOpen className="w-3 h-3" /> Mulai dengan topik ini
        </div>
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onSend(p)}
            className="w-full text-left text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-300 transition-all text-muted-foreground"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center">
        <div className="py-2 px-1 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <div className="flex justify-center text-violet-400 mb-1"><Cpu className="w-3 h-3" /></div>
          <p className="text-[10px] text-violet-400 font-medium">Orchestrator</p>
        </div>
        <div className="py-2 px-1 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex justify-center text-blue-400 mb-1"><Bot className="w-3 h-3" /></div>
          <p className="text-[10px] text-blue-400 font-medium">11 Agen</p>
        </div>
        <div className="py-2 px-1 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex justify-center text-green-400 mb-1"><GitMerge className="w-3 h-3" /></div>
          <p className="text-[10px] text-green-400 font-medium">Sintesis AI</p>
        </div>
      </div>
    </div>
  );
}

function MsgBubble({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end gap-2">
        <div className="max-w-[82%] bg-violet-600/20 border border-violet-500/30 rounded-xl rounded-tr-sm px-3 py-2">
          <p className="text-xs text-foreground leading-relaxed">{msg.content}</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-auto">
          <User className="w-3 h-3 text-violet-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="w-6 h-6 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 text-sm">
        {msg.agentEmoji ?? "✨"}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground">
            {msg.agentLabel ?? "LexBot"}
          </span>
          {msg.action === "delegate_to_specialist" && (
            <Badge variant="outline" className="text-[9px] h-3.5 border-blue-500/30 text-blue-400 px-1">
              Spesialis
            </Badge>
          )}
          {msg.action === "ask_clarifying_question" && (
            <Badge variant="outline" className="text-[9px] h-3.5 border-amber-500/30 text-amber-400 px-1">
              Klarifikasi
            </Badge>
          )}
        </div>
        <div className="bg-card/80 border border-white/10 rounded-xl rounded-tl-sm px-3 py-2">
          {msg.content ? (
            <MarkdownRenderer content={msg.content} className="text-xs" />
          ) : (
            <div className="flex gap-1.5 items-center text-muted-foreground">
              <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
