import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { Navbar } from "@/components/layout/Navbar";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Bot,
  User as UserIcon,
  Loader2,
  Sparkles,
  MessageSquare,
  Zap,
  Settings2,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Network,
  GitMerge,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface AgentMeta {
  key: string;
  name: string;
  emoji: string;
  color: string;
}

interface AgentContribution {
  agentKey: string;
  agentName: string;
  emoji: string;
  color: string;
  content: string;
  status: "streaming" | "done";
  collapsed: boolean;
}

interface AgenticTurn {
  id: string;
  type: "user" | "agentic";
  userContent?: string;
  selectedAgents?: AgentMeta[];
  mode?: "single" | "multi";
  reasoning?: string;
  contributions: AgentContribution[];
  synthesis: string;
  synthesisStatus: "none" | "streaming" | "done";
  orchestrating: boolean;
  status: "streaming" | "done";
}

interface StreamEvent {
  type:
    | "orchestrating"
    | "agents_selected"
    | "agent_start"
    | "agent_chunk"
    | "agent_done"
    | "synthesis_start"
    | "synthesis_chunk"
    | "synthesis_done"
    | "done"
    | "error";
  agents?: AgentMeta[];
  mode?: "single" | "multi";
  reasoning?: string;
  agent?: string;
  agentName?: string;
  emoji?: string;
  color?: string;
  content?: string;
  message?: string;
}

const ALL_AGENTS: AgentMeta[] = [
  { key: "corporate",      name: "Corporate Lawyer AI",         emoji: "🏢", color: "#6366f1" },
  { key: "tax",            name: "Tax Lawyer AI",               emoji: "💰", color: "#f59e0b" },
  { key: "employment",     name: "Employment Lawyer AI",        emoji: "👔", color: "#10b981" },
  { key: "immigration",    name: "Immigration Lawyer AI",       emoji: "✈️",  color: "#06b6d4" },
  { key: "bankruptcy",     name: "Bankruptcy Lawyer AI",        emoji: "📊", color: "#ef4444" },
  { key: "securities",     name: "Securities Lawyer AI",        emoji: "📈", color: "#8b5cf6" },
  { key: "civilrights",    name: "Civil Rights Lawyer AI",      emoji: "⚖️",  color: "#f97316" },
  { key: "criminal",       name: "Criminal Defense AI",         emoji: "🛡️",  color: "#64748b" },
  { key: "family",         name: "Family Lawyer AI",            emoji: "👨‍👩‍👧", color: "#ec4899" },
  { key: "realestate",     name: "Real Estate Lawyer AI",       emoji: "🏠", color: "#14b8a6" },
  { key: "personalinjury", name: "Personal Injury Lawyer AI",   emoji: "🩺", color: "#eab308" },
  { key: "ip",             name: "Intellectual Property AI",    emoji: "💡", color: "#a855f7" },
  { key: "syariah",        name: "Hukum Syariah AI",            emoji: "🕌", color: "#16a34a" },
  { key: "tun",            name: "Hukum Adm. Negara AI",        emoji: "🏛️",  color: "#0369a1" },
  { key: "lingkungan",     name: "Hukum Lingkungan AI",         emoji: "🌿", color: "#15803d" },
  { key: "persaingan",     name: "Hukum Persaingan Usaha AI",   emoji: "🔍", color: "#b45309" },
  { key: "researcher",     name: "Legal Researcher AI",         emoji: "🔬", color: "#7c3aed" },
  { key: "drafter",        name: "Legal Drafter AI",            emoji: "✍️",  color: "#db2777" },
  { key: "notaris",        name: "Notaris & PPAT AI",           emoji: "📜", color: "#c2410c" },
];

const SAMPLE_PROMPTS = [
  "Karyawan saya ingin mengundurkan diri tapi minta pesangon, apakah itu benar secara hukum?",
  "Saya ingin mendirikan PT dan butuh izin usaha untuk WNA, langkah-langkahnya apa?",
  "Tanah saya disengketakan dan terancam digugat, apa yang harus saya lakukan?",
  "Perusahaan saya terkena pajak besar dan saya ingin mengajukan keberatan, bagaimana caranya?",
];

export default function Chatbots() {
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [manualAgents, setManualAgents] = useState<Set<string>>(new Set());
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [turns, setTurns] = useState<AgenticTurn[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns]);

  const initConversation = useCallback(async (): Promise<number> => {
    if (conversationId) return conversationId;
    const res = await fetch("/api/agentic/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Agentic Legal Chat" }),
      credentials: "include",
    });
    const data = (await res.json()) as { id: number };
    setConversationId(data.id);
    return data.id;
  }, [conversationId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;
      if (!isAuthenticated) { login(); return; }

      const userTurn: AgenticTurn = {
        id: crypto.randomUUID(),
        type: "user",
        userContent: text.trim(),
        contributions: [],
        synthesis: "",
        synthesisStatus: "none",
        orchestrating: false,
        status: "done",
      };

      const agenticTurnId = crypto.randomUUID();
      const agenticTurn: AgenticTurn = {
        id: agenticTurnId,
        type: "agentic",
        contributions: [],
        synthesis: "",
        synthesisStatus: "none",
        orchestrating: true,
        status: "streaming",
      };

      setTurns((prev) => [...prev, userTurn, agenticTurn]);
      setInput("");
      setIsStreaming(true);
      setHasStarted(true);

      try {
        const convId = await initConversation();
        abortRef.current = new AbortController();

        const body: { content: string; forcedAgents?: string[] } = { content: text.trim() };
        if (mode === "manual" && manualAgents.size > 0) {
          body.forcedAgents = Array.from(manualAgents);
        }

        const response = await fetch(`/api/agentic/conversations/${convId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
          signal: abortRef.current.signal,
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

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

              setTurns((prev) =>
                prev.map((t) => {
                  if (t.id !== agenticTurnId) return t;

                  if (event.type === "orchestrating") {
                    return { ...t, orchestrating: true };

                  } else if (event.type === "agents_selected") {
                    return {
                      ...t,
                      orchestrating: false,
                      selectedAgents: event.agents ?? [],
                      mode: event.mode,
                      reasoning: event.reasoning,
                    };

                  } else if (event.type === "agent_start") {
                    const newContrib: AgentContribution = {
                      agentKey: event.agent ?? "",
                      agentName: event.agentName ?? "",
                      emoji: event.emoji ?? "🤖",
                      color: event.color ?? "#6366f1",
                      content: "",
                      status: "streaming",
                      collapsed: false,
                    };
                    return { ...t, contributions: [...t.contributions, newContrib] };

                  } else if (event.type === "agent_chunk") {
                    return {
                      ...t,
                      contributions: t.contributions.map((c) =>
                        c.agentKey === event.agent
                          ? { ...c, content: c.content + (event.content ?? "") }
                          : c
                      ),
                    };

                  } else if (event.type === "agent_done") {
                    return {
                      ...t,
                      contributions: t.contributions.map((c) =>
                        c.agentKey === event.agent ? { ...c, status: "done" } : c
                      ),
                    };

                  } else if (event.type === "synthesis_start") {
                    return { ...t, synthesisStatus: "streaming" };

                  } else if (event.type === "synthesis_chunk") {
                    return { ...t, synthesis: t.synthesis + (event.content ?? "") };

                  } else if (event.type === "synthesis_done") {
                    return { ...t, synthesisStatus: "done" };

                  } else if (event.type === "done") {
                    return { ...t, status: "done", orchestrating: false };

                  } else if (event.type === "error") {
                    return {
                      ...t,
                      status: "done",
                      orchestrating: false,
                      contributions: [
                        {
                          agentKey: "error",
                          agentName: "Error",
                          emoji: "❌",
                          color: "#ef4444",
                          content: event.message ?? "Terjadi kesalahan",
                          status: "done",
                          collapsed: false,
                        },
                      ],
                    };
                  }
                  return t;
                })
              );
            } catch {}
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast({ title: "Koneksi terputus", variant: "destructive" });
        }
      } finally {
        setIsStreaming(false);
        setTurns((prev) =>
          prev.map((t) => (t.id === agenticTurnId ? { ...t, status: "done", orchestrating: false } : t))
        );
        abortRef.current = null;
        inputRef.current?.focus();
      }
    },
    [isStreaming, isAuthenticated, login, initConversation, mode, manualAgents, toast]
  );

  const toggleAgentCollapse = (turnId: string, agentKey: string) => {
    setTurns((prev) =>
      prev.map((t) =>
        t.id === turnId
          ? {
              ...t,
              contributions: t.contributions.map((c) =>
                c.agentKey === agentKey ? { ...c, collapsed: !c.collapsed } : c
              ),
            }
          : t
      )
    );
  };

  const resetChat = () => {
    abortRef.current?.abort();
    setTurns([]);
    setConversationId(null);
    setIsStreaming(false);
    setHasStarted(false);
    setInput("");
  };

  const toggleManualAgent = (key: string) => {
    setManualAgents((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < 3) next.add(key);
      else toast({ title: "Maksimal 3 agen", description: "Lepas salah satu agen terlebih dahulu" });
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pt-36">
      <Navbar />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-4 flex gap-4 h-[calc(100vh-96px)]">
        {/* ─── Sidebar ─── */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3">
          {/* Mode card */}
          <div className="glass-card rounded-2xl border border-white/10 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">Mode Multi-Agen</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setMode("auto")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  mode === "auto"
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-card/30 border-white/10 text-muted-foreground hover:bg-card/60"
                }`}
              >
                <Zap className="w-3 h-3" /> Otomatis
              </button>
              <button
                onClick={() => setMode("manual")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  mode === "manual"
                    ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                    : "bg-card/30 border-white/10 text-muted-foreground hover:bg-card/60"
                }`}
              >
                <Settings2 className="w-3 h-3" /> Manual
              </button>
            </div>
            {mode === "auto" ? (
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Orkestrator AI otomatis memilih agen terbaik berdasarkan pertanyaan Anda.
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Pilih 1–3 agen di bawah. Mereka akan berkolaborasi menjawab pertanyaan Anda.
              </p>
            )}
          </div>

          {/* Agent list */}
          <div className="glass-card rounded-2xl border border-white/10 flex flex-col overflow-hidden flex-1">
            <div className="p-3 border-b border-white/10 bg-card/50">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                AI Legal Agents
                {mode === "manual" && manualAgents.size > 0 && (
                  <Badge className="ml-auto text-[10px] h-4 bg-violet-600">
                    {manualAgents.size}/3
                  </Badge>
                )}
              </h2>
            </div>
            <ScrollArea className="flex-1 p-2">
              <div className="space-y-1">
                {ALL_AGENTS.map((agent) => {
                  const isSelected = manualAgents.has(agent.key);
                  return (
                    <button
                      key={agent.key}
                      onClick={() => mode === "manual" && toggleManualAgent(agent.key)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all border text-sm ${
                        mode === "manual"
                          ? isSelected
                            ? "bg-violet-500/20 border-violet-500/50 shadow-[0_0_10px_rgba(139,92,246,0.15)]"
                            : "bg-card/30 border-white/5 hover:bg-card/70 hover:border-white/20 cursor-pointer"
                          : "bg-card/20 border-white/5 cursor-default"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg leading-none">{agent.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs truncate">{agent.name}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <span className="text-[10px] text-muted-foreground">Online</span>
                          </div>
                        </div>
                        {mode === "manual" && isSelected && (
                          <Check className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {hasStarted && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetChat}
              className="w-full border-white/10 text-muted-foreground hover:text-foreground gap-2"
            >
              <Plus className="w-3.5 h-3.5" /> Percakapan Baru
            </Button>
          )}
        </div>

        {/* ─── Chat Area ─── */}
        <div className="flex-1 glass-card rounded-2xl border border-white/10 flex flex-col overflow-hidden relative min-w-0">
          {!isAuthenticated ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <Network className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
              <h3 className="text-2xl font-bold mb-2">Masuk untuk Mulai</h3>
              <p className="text-muted-foreground mb-6 max-w-sm text-center text-sm">
                Akses 11 AI Legal Agents dengan kemampuan multi-agen dan sintesis otomatis.
              </p>
              <Button onClick={login} size="lg" className="rounded-full shadow-lg">
                Masuk Sekarang
              </Button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-white/10 bg-card/40 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                    <GitMerge className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Agentic AI Legal Chat</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {mode === "auto"
                        ? "Orkestrator memilih agen secara otomatis"
                        : manualAgents.size > 0
                          ? `${manualAgents.size} agen dipilih manual`
                          : "Pilih agen di sidebar untuk mode manual"}
                    </p>
                  </div>
                </div>
                {mode === "manual" && manualAgents.size > 0 && (
                  <div className="flex gap-1 flex-wrap justify-end">
                    {Array.from(manualAgents).map((key) => {
                      const a = ALL_AGENTS.find((ag) => ag.key === key)!;
                      return (
                        <span
                          key={key}
                          className="text-xs px-2 py-0.5 rounded-full border"
                          style={{ borderColor: a.color + "60", color: a.color, backgroundColor: a.color + "15" }}
                        >
                          {a.emoji} {a.name.replace(" Lawyer AI", "").replace(" Defense", "")}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
                {!hasStarted ? (
                  <WelcomeScreen onPrompt={(p) => void sendMessage(p)} prompts={SAMPLE_PROMPTS} />
                ) : (
                  turns.map((turn) =>
                    turn.type === "user" ? (
                      <UserBubble key={turn.id} content={turn.userContent ?? ""} />
                    ) : (
                      <AgenticResponse
                        key={turn.id}
                        turn={turn}
                        onToggleCollapse={(agentKey) => toggleAgentCollapse(turn.id, agentKey)}
                      />
                    )
                  )
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10 bg-card/30 flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Tanyakan masalah hukum Anda..."
                      disabled={isStreaming}
                      className="pr-10 py-5 rounded-2xl bg-background border-white/20 focus-visible:ring-primary text-sm"
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
                        onClick={() => { abortRef.current?.abort(); setIsStreaming(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        title="Stop"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={!input.trim() || isStreaming || (mode === "manual" && manualAgents.size === 0)}
                    className="rounded-2xl h-[42px] px-5 bg-primary hover:bg-primary/90"
                  >
                    {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
                <p className="text-center mt-2 text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Multi-Agen AI · Hasil sintesis dari beberapa spesialis hukum
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function WelcomeScreen({ onPrompt, prompts }: { onPrompt: (p: string) => void; prompts: string[] }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-2xl shadow-violet-500/20">
        <GitMerge className="w-8 h-8 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">Agentic AI Legal Chat</h3>
        <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
          Sistem multi-agen yang mengorkestrasi kolaborasi antara 11 spesialis hukum AI untuk menjawab pertanyaan kompleks Anda.
        </p>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        <Badge variant="outline" className="gap-1 text-xs border-violet-500/30 text-violet-400">
          <Network className="w-3 h-3" /> Orchestrator Agent
        </Badge>
        <Badge variant="outline" className="gap-1 text-xs border-blue-500/30 text-blue-400">
          <Bot className="w-3 h-3" /> 11 Specialist Agents
        </Badge>
        <Badge variant="outline" className="gap-1 text-xs border-green-500/30 text-green-400">
          <GitMerge className="w-3 h-3" /> Auto Synthesis
        </Badge>
      </div>
      <div className="w-full max-w-xl space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Coba pertanyaan ini</p>
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onPrompt(p)}
            className="w-full text-left text-sm px-4 py-3 rounded-xl bg-card/40 border border-white/10 hover:bg-card/80 hover:border-white/30 transition-all text-muted-foreground hover:text-foreground"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 justify-end"
    >
      <div className="max-w-[75%] bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-sm px-4 py-3">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
      <div className="w-7 h-7 rounded-full bg-primary/30 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-auto">
        <UserIcon className="w-3.5 h-3.5 text-primary" />
      </div>
    </motion.div>
  );
}

function AgenticResponse({
  turn,
  onToggleCollapse,
}: {
  turn: AgenticTurn;
  onToggleCollapse: (agentKey: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 items-start"
    >
      <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center flex-shrink-0 mt-1">
        <GitMerge className="w-3.5 h-3.5 text-violet-400" />
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        {/* Orchestrator status */}
        {turn.orchestrating && (
          <div className="flex items-center gap-2 text-xs text-violet-400 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Orkestrator sedang menganalisis pertanyaan dan memilih agen...</span>
          </div>
        )}

        {/* Agents selected banner */}
        {turn.selectedAgents && turn.selectedAgents.length > 0 && (
          <div className="px-3 py-2 rounded-xl bg-card/50 border border-white/10 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground">
                {turn.mode === "multi" ? "🔀 Kolaborasi:" : "▶ Ditugaskan ke:"}
              </span>
              {turn.selectedAgents.map((a) => (
                <span
                  key={a.key}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium border"
                  style={{ color: a.color, borderColor: a.color + "50", backgroundColor: a.color + "15" }}
                >
                  {a.emoji} {a.name.replace(" Lawyer AI", "").replace(" Defense", "")}
                </span>
              ))}
            </div>
            {turn.reasoning && (
              <p className="mt-1.5 text-muted-foreground/80 italic">{turn.reasoning}</p>
            )}
          </div>
        )}

        {/* Agent contributions */}
        {turn.contributions.map((contrib) => (
          <AgentCard
            key={contrib.agentKey}
            contribution={contrib}
            onToggleCollapse={() => onToggleCollapse(contrib.agentKey)}
            showCollapse={turn.contributions.length > 1}
          />
        ))}

        {/* Synthesis */}
        {(turn.synthesisStatus === "streaming" || turn.synthesisStatus === "done") && (
          <SynthesisCard synthesis={turn.synthesis} status={turn.synthesisStatus} />
        )}
      </div>
    </motion.div>
  );
}

function AgentCard({
  contribution,
  onToggleCollapse,
  showCollapse,
}: {
  contribution: AgentContribution;
  onToggleCollapse: () => void;
  showCollapse: boolean;
}) {
  const { agentName, emoji, color, content, status, collapsed } = contribution;

  return (
    <div
      className="rounded-2xl rounded-tl-sm border overflow-hidden"
      style={{ borderColor: color + "40" }}
    >
      <div
        className="flex items-center justify-between px-3 py-2.5 cursor-pointer select-none"
        style={{ backgroundColor: color + "18" }}
        onClick={showCollapse ? onToggleCollapse : undefined}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{emoji}</span>
          <span className="text-xs font-bold" style={{ color }}>
            {agentName}
          </span>
          {status === "streaming" && (
            <Loader2 className="w-3 h-3 animate-spin" style={{ color }} />
          )}
          {status === "done" && (
            <Check className="w-3 h-3" style={{ color }} />
          )}
        </div>
        {showCollapse && (
          <div className="text-muted-foreground">
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-3 bg-card/30">
              {content ? (
                <MarkdownRenderer content={content} className="text-sm" />
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-xs">Menganalisis...</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SynthesisCard({ synthesis, status }: { synthesis: string; status: "streaming" | "done" }) {
  return (
    <div className="rounded-2xl rounded-tl-sm border border-violet-500/40 overflow-hidden shadow-lg shadow-violet-500/5">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-b border-violet-500/20">
        <GitMerge className="w-3.5 h-3.5 text-violet-400" />
        <span className="text-xs font-bold text-violet-300">Sintesis Akhir</span>
        {status === "streaming" && <Loader2 className="w-3 h-3 animate-spin text-violet-400" />}
        {status === "done" && <Sparkles className="w-3 h-3 text-violet-400" />}
      </div>
      <div className="px-4 py-3 bg-card/40">
        {synthesis ? (
          <MarkdownRenderer content={synthesis} className="text-sm" />
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-xs">Mensintesis perspektif semua agen...</span>
          </div>
        )}
      </div>
    </div>
  );
}
