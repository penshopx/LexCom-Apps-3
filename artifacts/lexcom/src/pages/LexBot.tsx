import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { Navbar } from "@/components/layout/Navbar";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Scale,
  FileText,
  ListChecks,
  MessageSquare,
  Loader2,
  X,
  RotateCcw,
  Cpu,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  agentLabel?: string;
  action?: string;
  timestamp: Date;
}

interface StreamEvent {
  type: "thinking" | "action" | "content" | "done" | "error";
  agent?: string;
  action?: string;
  specialist?: string;
  specialistName?: string;
  feature?: string;
  title?: string;
  context?: string;
  reason?: string;
  content?: string;
  message?: string;
  metadata?: Record<string, string>;
}

const QUICK_ACTIONS = [
  {
    icon: <Bot className="w-4 h-4" />,
    label: "Cara pakai Chatbot AI",
    prompt: "Bagaimana cara menggunakan fitur Agentic AI Chatbot di LexCom?",
    color: "bg-violet-500/10 border-violet-500/30 text-violet-300 hover:bg-violet-500/20",
  },
  {
    icon: <BookOpen className="w-4 h-4" />,
    label: "Panduan fitur LexCom",
    prompt: "Tolong jelaskan semua fitur yang ada di LexCom dan cara menggunakannya.",
    color: "bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20",
  },
  {
    icon: <Scale className="w-4 h-4" />,
    label: "Konsultasi hukum",
    prompt: "Saya butuh konsultasi hukum. Tolong bantu saya.",
    color: "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20",
  },
  {
    icon: <ListChecks className="w-4 h-4" />,
    label: "Buat rencana tindakan",
    prompt: "Bantu saya membuat rencana tindakan untuk menghadapi masalah hukum.",
    color: "bg-green-500/10 border-green-500/30 text-green-300 hover:bg-green-500/20",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    label: "Buat dokumen hukum",
    prompt: "Bagaimana cara membuat dokumen hukum menggunakan LexCom?",
    color: "bg-pink-500/10 border-pink-500/30 text-pink-300 hover:bg-pink-500/20",
  },
  {
    icon: <MessageSquare className="w-4 h-4" />,
    label: "Tanya ke Forum",
    prompt: "Bagaimana cara bertanya di Forum LexCom? Apakah saya harus login?",
    color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20",
  },
];

const AGENT_DISPLAY: Record<string, { label: string; color: string; icon: string }> = {
  orchestrator: { label: "LexBot", color: "bg-violet-600", icon: "🤖" },
  corporate: { label: "Corporate Lawyer AI", color: "bg-blue-600", icon: "🏢" },
  tax: { label: "Tax Lawyer AI", color: "bg-amber-600", icon: "💰" },
  employment: { label: "Employment Lawyer AI", color: "bg-green-600", icon: "👷" },
  immigration: { label: "Immigration Lawyer AI", color: "bg-cyan-600", icon: "✈️" },
  bankruptcy: { label: "Bankruptcy Lawyer AI", color: "bg-red-600", icon: "⚖️" },
  securities: { label: "Securities Lawyer AI", color: "bg-indigo-600", icon: "📈" },
  civilrights: { label: "Civil Rights Lawyer AI", color: "bg-orange-600", icon: "🕊️" },
  criminal: { label: "Criminal Defense AI", color: "bg-slate-600", icon: "🛡️" },
  family: { label: "Family Lawyer AI", color: "bg-rose-600", icon: "👨‍👩‍👧" },
  realestate: { label: "Real Estate Lawyer AI", color: "bg-teal-600", icon: "🏠" },
  personalinjury: { label: "Personal Injury AI", color: "bg-yellow-600", icon: "🩺" },
};

type AgentStatusType = {
  type: "thinking" | "delegating" | "guide" | "planning" | "answering" | "clarifying";
  specialist?: string;
  specialistName?: string;
  feature?: string;
  title?: string;
};

export default function LexBot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatusType | null>(null);
  const [currentAgent, setCurrentAgent] = useState<string>("orchestrator");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, agentStatus]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const initConversation = useCallback(async (): Promise<number> => {
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

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsStreaming(true);
      setAgentStatus({ type: "thinking" });
      setCurrentAgent("orchestrator");

      const assistantMsgId = crypto.randomUUID();
      let fullContent = "";
      let resolvedAgent = "orchestrator";

      try {
        const convId = await initConversation();
        abortRef.current = new AbortController();

        const response = await fetch(
          `/api/assistant/conversations/${convId}/chat`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ content: text.trim() }),
            signal: abortRef.current.signal,
          }
        );

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: "assistant",
            content: "",
            agent: resolvedAgent,
            agentLabel: AGENT_DISPLAY[resolvedAgent]?.label ?? "LexBot",
            timestamp: new Date(),
          },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr) as StreamEvent;

              if (event.type === "thinking") {
                setAgentStatus({ type: "thinking" });

              } else if (event.type === "action") {
                if (event.action === "delegating" && event.specialist) {
                  resolvedAgent = event.specialist;
                  setCurrentAgent(event.specialist);
                  setAgentStatus({
                    type: "delegating",
                    specialist: event.specialist,
                    specialistName: event.specialistName,
                  });
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? {
                            ...m,
                            agent: event.specialist,
                            agentLabel: event.specialistName ?? AGENT_DISPLAY[event.specialist!]?.label,
                          }
                        : m
                    )
                  );
                } else if (event.action === "guide") {
                  setAgentStatus({ type: "guide", feature: event.feature });
                } else if (event.action === "planning") {
                  setAgentStatus({ type: "planning", title: event.title });
                } else if (event.action === "clarifying") {
                  setAgentStatus({ type: "clarifying" });
                } else {
                  setAgentStatus({ type: "answering" });
                }

              } else if (event.type === "content" && event.content) {
                fullContent += event.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: fullContent } : m
                  )
                );

              } else if (event.type === "done") {
                setAgentStatus(null);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, action: event.metadata?.action }
                      : m
                  )
                );

              } else if (event.type === "error") {
                setAgentStatus(null);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: `❌ ${event.message ?? "Terjadi kesalahan"}` }
                      : m
                  )
                );
              }
            } catch {}
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: "❌ Terjadi kesalahan koneksi. Silakan coba lagi." }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        setAgentStatus(null);
        abortRef.current = null;
        inputRef.current?.focus();
      }
    },
    [isStreaming, initConversation]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleQuickAction = (prompt: string) => {
    void sendMessage(prompt);
  };

  const resetConversation = () => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setConversationId(null);
    setAgentStatus(null);
    setIsStreaming(false);
    setInput("");
  };

  const agentInfo = AGENT_DISPLAY[currentAgent] ?? AGENT_DISPLAY.orchestrator;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 pt-28 pb-6 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LexBot</h1>
              <p className="text-xs text-muted-foreground">
                Asisten AI Multi-Agen · Panduan & Konsultasi LexCom
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetConversation}
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Button>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Online</span>
            </div>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
            <div className="text-center space-y-3 max-w-lg">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mx-auto shadow-2xl shadow-violet-500/20">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Halo! Saya LexBot 👋
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Asisten AI utama LexCom yang siap membantu Anda memahami platform,
                menjawab pertanyaan hukum, dan mengarahkan Anda ke spesialis yang tepat.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs gap-1 border-violet-500/30 text-violet-400">
                  <Cpu className="w-3 h-3" /> Orchestrator Agent
                </Badge>
                <Badge variant="outline" className="text-xs gap-1 border-blue-500/30 text-blue-400">
                  <Bot className="w-3 h-3" /> 11 Specialist Agents
                </Badge>
                <Badge variant="outline" className="text-xs gap-1 border-green-500/30 text-green-400">
                  <Sparkles className="w-3 h-3" /> Function Calling AI
                </Badge>
              </div>
            </div>

            <div className="w-full max-w-2xl">
              <p className="text-xs text-muted-foreground mb-3 text-center uppercase tracking-wider">
                Mulai dengan topik ini
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.prompt)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${action.color}`}
                    disabled={isStreaming}
                  >
                    {action.icon}
                    <span className="leading-tight">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-4 pr-1"
            style={{ minHeight: 0 }}
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {agentStatus && (
              <AgentStatusBubble status={agentStatus} agentInfo={agentInfo} />
            )}
          </div>
        )}

        {messages.length > 0 && !agentStatus && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {QUICK_ACTIONS.slice(0, 3).map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.prompt)}
                disabled={isStreaming}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${action.color} disabled:opacity-40`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya apapun tentang LexCom atau masalah hukum Anda..."
              disabled={isStreaming}
              className="pr-10 bg-card border-border/60 focus:border-primary/50 min-h-[44px] text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            {isStreaming && (
              <button
                type="button"
                onClick={() => {
                  abortRef.current?.abort();
                  setIsStreaming(false);
                  setAgentStatus(null);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted text-muted-foreground"
                title="Stop"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="bg-violet-600 hover:bg-violet-700 text-white min-h-[44px] px-4"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground/60">
          LexBot menggunakan multi-agent AI. Untuk konsultasi hukum formal, selalu hubungi pengacara berlisensi.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const agentKey = message.agent ?? "orchestrator";
  const agentMeta = AGENT_DISPLAY[agentKey] ?? AGENT_DISPLAY.orchestrator;

  if (isUser) {
    return (
      <div className="flex justify-end gap-2">
        <div className="max-w-[80%] bg-violet-600/20 border border-violet-500/30 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm text-foreground leading-relaxed">{message.content}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-auto">
          <User className="w-4 h-4 text-violet-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-start">
      <div
        className={`w-8 h-8 rounded-full ${agentMeta.color} flex items-center justify-center flex-shrink-0 text-sm shadow-md`}
      >
        {agentMeta.icon}
      </div>
      <div className="flex-1 max-w-[88%] space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            {message.agentLabel ?? agentMeta.label}
          </span>
          {message.action === "delegate_to_specialist" && (
            <Badge variant="outline" className="text-[10px] h-4 border-violet-500/30 text-violet-400">
              Specialist
            </Badge>
          )}
          {message.action === "ask_clarifying_question" && (
            <Badge variant="outline" className="text-[10px] h-4 border-amber-500/30 text-amber-400">
              Klarifikasi
            </Badge>
          )}
        </div>
        <div className="bg-card border border-border/60 rounded-2xl rounded-tl-sm px-4 py-3">
          {message.content ? (
            <MarkdownRenderer content={message.content} className="text-sm" />
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="text-sm">Menulis respons...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AgentStatusBubble({
  status,
  agentInfo,
}: {
  status: AgentStatusType;
  agentInfo: { label: string; color: string; icon: string };
}) {
  const statusText: Record<AgentStatusType["type"], string> = {
    thinking: "LexBot sedang menganalisis pertanyaan Anda...",
    delegating: `Berkonsultasi dengan ${status.specialistName ?? "spesialis"}...`,
    guide: `Menyiapkan panduan tentang ${status.feature ?? "fitur"}...`,
    planning: `Membuat rencana tindakan: ${status.title ?? ""}...`,
    answering: "Menyusun jawaban...",
    clarifying: "Memformulasikan pertanyaan klarifikasi...",
  };

  const statusColors: Record<AgentStatusType["type"], string> = {
    thinking: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    delegating: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    guide: "text-green-400 border-green-500/30 bg-green-500/10",
    planning: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    answering: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    clarifying: "text-pink-400 border-pink-500/30 bg-pink-500/10",
  };

  return (
    <div className="flex gap-2 items-center">
      <div
        className={`w-8 h-8 rounded-full ${agentInfo.color} flex items-center justify-center flex-shrink-0 opacity-70 animate-pulse`}
      >
        {agentInfo.icon}
      </div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-medium ${statusColors[status.type]}`}
      >
        <Loader2 className="w-3 h-3 animate-spin" />
        {statusText[status.type]}
      </div>
    </div>
  );
}
