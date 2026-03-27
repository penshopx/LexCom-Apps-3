import { useState, useRef, useEffect } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User as UserIcon, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const AGENTS = [
  { key: 'corporate', emoji: '🏢', name: 'Corporate Lawyer AI', category: 'Bisnis & Korporasi' },
  { key: 'tax', emoji: '💰', name: 'Tax Lawyer AI', category: 'Bisnis & Korporasi' },
  { key: 'employment', emoji: '👔', name: 'Employment Lawyer AI', category: 'Bisnis & Korporasi' },
  { key: 'immigration', emoji: '🌍', name: 'Immigration Lawyer AI', category: 'Bisnis & Korporasi' },
  { key: 'bankruptcy', emoji: '📊', name: 'Bankruptcy Lawyer AI', category: 'Bisnis & Korporasi' },
  { key: 'securities', emoji: '📈', name: 'Securities Lawyer AI', category: 'Bisnis & Korporasi' },
  { key: 'civilrights', emoji: '⚖️', name: 'Civil Rights Lawyer AI', category: 'Personal & Keluarga' },
  { key: 'criminal', emoji: '🛡️', name: 'Criminal Defense Lawyer AI', category: 'Personal & Keluarga' },
  { key: 'family', emoji: '👨‍👩‍👧', name: 'Family Lawyer AI', category: 'Personal & Keluarga' },
  { key: 'realestate', emoji: '🏠', name: 'Real Estate Lawyer AI', category: 'Personal & Keluarga' },
  { key: 'personalinjury', emoji: '🚗', name: 'Personal Injury Lawyer AI', category: 'Personal & Keluarga' }
];

export default function Chatbots() {
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState(null as any);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const startConversation = async (agent: any) => {
    if (!isAuthenticated) {
      login();
      return;
    }

    try {
      setSelectedAgent(agent);
      setMessages([]);
      const res = await fetch("/api/openai/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: agent.name, agentType: agent.key }),
        credentials: "include"
      });
      if (!res.ok) throw new Error("Gagal memulai percakapan");
      const data = await res.json();
      setConversationId(data.id);
      
      // Welcome message
      setMessages([{
        role: "assistant",
        content: `Halo! Saya adalah ${agent.name}. Ada yang bisa saya bantu terkait masalah ${agent.category.toLowerCase()} hari ini?`
      }]);
    } catch (err) {
      toast({ title: "Error", description: "Tidak dapat memulai chat", variant: "destructive" });
      setSelectedAgent(null);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMsg }),
        credentials: "include"
      });

      if (!res.ok) throw new Error("Gagal mengirim pesan");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let buffer = "";
      
      // Add empty assistant message
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content += data.content;
                  return newMsgs;
                });
              }
              if (data.done) {
                setIsTyping(false);
              }
            } catch (e) {
              // Ignore parse error for partial chunks
            }
          }
        }
      }
    } catch (err) {
      toast({ title: "Error", description: "Koneksi terputus", variant: "destructive" });
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pt-24">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex gap-6 h-[calc(100vh-100px)]">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 glass-card rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-card/50">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Legal Agents
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Pilih spesialisasi yang Anda butuhkan</p>
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {AGENTS.map((agent) => (
                <button
                  key={agent.key}
                  onClick={() => startConversation(agent)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 border ${
                    selectedAgent?.key === agent.key 
                      ? 'bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.2)]' 
                      : 'bg-card/30 border-white/5 hover:bg-card/80 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{agent.emoji}</div>
                    <div>
                      <div className="font-semibold text-sm">{agent.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Online
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground inline-block">
                    {agent.category}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass-card rounded-2xl border border-white/10 flex flex-col overflow-hidden relative">
          {!isAuthenticated ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <MessageSquare className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">Masuk untuk Memulai Chat</h3>
              <p className="text-muted-foreground mb-6 max-w-sm text-center">
                Dapatkan akses ke 11 AI Legal Agents kami untuk konsultasi hukum gratis.
              </p>
              <Button onClick={login} size="lg" className="rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Masuk Sekarang
              </Button>
            </div>
          ) : !selectedAgent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Bot className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Pilih AI Agent dari sidebar untuk memulai konsultasi</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-card/50 flex items-center gap-3">
                <div className="text-3xl">{selectedAgent.emoji}</div>
                <div>
                  <h3 className="font-bold text-lg">{selectedAgent.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAgent.category}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
                {messages.map((msg, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === 'user' 
                        ? 'bg-primary/20 border border-primary/30 text-foreground rounded-tr-sm' 
                        : 'bg-card border border-white/10 text-foreground rounded-tl-sm shadow-lg'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="bg-card border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10 bg-card/30 backdrop-blur-md">
                <form onSubmit={sendMessage} className="relative flex items-center">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ketik pertanyaan Anda di sini..."
                    className="w-full pr-14 py-6 rounded-full bg-background border-white/20 focus-visible:ring-primary shadow-inner"
                    disabled={isTyping}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute right-2 rounded-full h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    disabled={!input.trim() || isTyping}
                  >
                    <Send size={18} className="ml-1" />
                  </Button>
                </form>
                <div className="text-center mt-2 text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Sparkles size={12} className="text-primary" /> AI dapat membuat kesalahan. Harap verifikasi informasi penting.
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
