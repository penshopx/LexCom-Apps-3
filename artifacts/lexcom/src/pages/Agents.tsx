import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Bot, ArrowRight, Sparkles } from "lucide-react";

const AGENTS = [
  { key: "corporate",      emoji: "🏢", name: "Corporate Lawyer AI",       category: "Pakar Hukum",    description: "Pendirian PT & CV, merger & akuisisi, tata kelola korporasi, kontrak bisnis." },
  { key: "tax",            emoji: "💰", name: "Tax Lawyer AI",              category: "Pakar Hukum",    description: "PPh badan & pribadi, PPN, sengketa pajak, transfer pricing, kepatuhan perpajakan." },
  { key: "employment",     emoji: "👔", name: "Employment Lawyer AI",       category: "Pakar Hukum",    description: "PHK & pesangon (PP 35/2021), kontrak kerja, perselisihan industrial, BPJS." },
  { key: "immigration",    emoji: "✈️",  name: "Immigration Lawyer AI",      category: "Pakar Hukum",    description: "Visa, KITAS/KITAP, izin kerja WNA (IMTA), naturalisasi, keimigrasian." },
  { key: "bankruptcy",     emoji: "📊", name: "Bankruptcy Lawyer AI",       category: "Pakar Hukum",    description: "Kepailitan, PKPU, restrukturisasi utang, likuidasi, sengketa niaga." },
  { key: "securities",     emoji: "📈", name: "Securities Lawyer AI",       category: "Pakar Hukum",    description: "Pasar modal, IPO, obligasi, reksa dana, kepatuhan OJK." },
  { key: "civilrights",    emoji: "⚖️",  name: "Civil Rights Lawyer AI",     category: "Pakar Hukum",    description: "HAM, diskriminasi, hak-hak sipil, kebebasan berekspresi." },
  { key: "criminal",       emoji: "🛡️",  name: "Criminal Defense AI",        category: "Pakar Hukum",    description: "KUHP Baru (UU 1/2023), hak tersangka, proses pidana, strategi pembelaan." },
  { key: "family",         emoji: "👨‍👩‍👧", name: "Family Lawyer AI",           category: "Pakar Hukum",    description: "Perceraian, hak asuh, waris, adopsi, harta bersama, perkawinan campur." },
  { key: "realestate",     emoji: "🏠", name: "Real Estate Lawyer AI",      category: "Pakar Hukum",    description: "Properti, sertifikasi tanah, sengketa agraria, jual beli, PPJB." },
  { key: "personalinjury", emoji: "🩺", name: "Personal Injury Lawyer AI",  category: "Pakar Hukum",    description: "Kecelakaan, cedera, malpraktik medis, klaim asuransi, ganti rugi PMH." },
  { key: "ip",             emoji: "💡", name: "Intellectual Property AI",   category: "Pakar Hukum",    description: "Merek, hak cipta, paten, desain industri, rahasia dagang, HKI." },
  { key: "syariah",        emoji: "🕌", name: "Hukum Syariah AI",           category: "Lex Specialis",  description: "Ekonomi syariah, perbankan Islam, zakat, wakaf, waris faraidh, KHI." },
  { key: "tun",            emoji: "🏛️",  name: "Hukum Adm. Negara AI",      category: "Lex Specialis",  description: "Hukum TUN, sengketa administrasi pemerintahan, PTUN, kebijakan publik." },
  { key: "lingkungan",     emoji: "🌿", name: "Hukum Lingkungan AI",        category: "Lex Specialis",  description: "Izin lingkungan (Amdal), sengketa lingkungan, limbah B3, hukum kehutanan." },
  { key: "persaingan",     emoji: "🔍", name: "Hukum Persaingan Usaha AI",  category: "Lex Specialis",  description: "Antimonopoli, kartel, posisi dominan, KPPU, persaingan usaha sehat." },
  { key: "researcher",     emoji: "🔬", name: "Legal Researcher AI",        category: "Tenaga Ahli",    description: "Riset hukum mendalam, doktrin, teori, perbandingan hukum, yurisprudensi." },
  { key: "drafter",        emoji: "✍️",  name: "Legal Drafter AI",           category: "Tenaga Ahli",    description: "Drafting peraturan, kontrak, MOU, dan instrumen hukum teknis." },
  { key: "notaris",        emoji: "📜", name: "Notaris & PPAT AI",          category: "Tenaga Ahli",    description: "Akta notaris, PPAT, warisan, perjanjian perkawinan, akta autentik." },
];

const CATEGORY_STYLE: Record<string, { badge: string; border: string }> = {
  "Pakar Hukum":   { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",    border: "hover:border-blue-500/30" },
  "Lex Specialis":  { badge: "bg-violet-500/10 text-violet-400 border-violet-500/20", border: "hover:border-violet-500/30" },
  "Tenaga Ahli":   { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", border: "hover:border-emerald-500/30" },
};

const categories = ["Pakar Hukum", "Lex Specialis", "Tenaga Ahli"];

export default function Agents() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Bot className="w-4 h-4" /> 19 AI Legal Agents
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Pilih Spesialis <span className="text-gradient">Hukum AI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
              Setiap agen dilatih khusus dalam bidang hukumnya untuk memberikan konsultasi yang akurat dan relevan dalam Bahasa Indonesia.
            </p>
            <Link href="/agentic-chatbots">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 transition-all">
                <Sparkles className="w-4 h-4" /> Atau gunakan Agentic AI — semua agen berkolaborasi otomatis
              </button>
            </Link>
          </div>

          {categories.map(cat => (
            <div key={cat} className="mb-10">
              <div className="flex items-center gap-3 mb-5 px-1">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${CATEGORY_STYLE[cat].badge}`}>{cat}</span>
                <span className="text-xs text-muted-foreground">
                  {AGENTS.filter(a => a.category === cat).length} agen
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {AGENTS.filter(a => a.category === cat).map((agent, i) => (
                  <motion.div
                    key={agent.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/agents/${agent.key}`}>
                      <div className={`group glass-card rounded-2xl border border-white/10 ${CATEGORY_STYLE[cat].border} p-5 hover:shadow-[0_0_20px_rgba(139,92,246,0.12)] transition-all duration-300 cursor-pointer h-full flex flex-col`}>
                        <div className="flex items-start gap-4 mb-3">
                          <div className="text-3xl">{agent.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {agent.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              <span className="text-xs text-muted-foreground">Online</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed flex-1">{agent.description}</p>
                        <div className="flex items-center gap-2 mt-4 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Mulai Konsultasi <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
