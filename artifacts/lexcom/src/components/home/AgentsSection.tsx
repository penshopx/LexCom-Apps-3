import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Circle, Sparkles } from "lucide-react";
import { Link } from "wouter";

type Category = "Semua" | "Pakar Hukum" | "Lex Specialis" | "Tenaga Ahli";

const agents = [
  { id: 1,  key: "corporate",      emoji: "🏢", name: "Corporate Lawyer AI",          category: "Pakar Hukum" as Category,   desc: "Pendirian PT & CV, merger & akuisisi, tata kelola korporasi, kontrak bisnis, dan kepatuhan hukum perusahaan." },
  { id: 2,  key: "tax",            emoji: "💰", name: "Tax Lawyer AI",                 category: "Pakar Hukum" as Category,   desc: "Perencanaan pajak, PPh badan & pribadi, sengketa pajak, transfer pricing, dan kepatuhan perpajakan Indonesia." },
  { id: 3,  key: "employment",     emoji: "👔", name: "Employment Lawyer AI",          category: "Pakar Hukum" as Category,   desc: "Hubungan industrial, PHK & pesangon (PP 35/2021), kontrak kerja, perselisihan kerja, UMK, dan BPJS." },
  { id: 4,  key: "immigration",    emoji: "✈️",  name: "Immigration Lawyer AI",         category: "Pakar Hukum" as Category,   desc: "Visa, KITAS/KITAP, izin kerja WNA (IMTA), naturalisasi, dan keimigrasian di Indonesia." },
  { id: 5,  key: "bankruptcy",     emoji: "📊", name: "Bankruptcy Lawyer AI",          category: "Pakar Hukum" as Category,   desc: "Kepailitan, PKPU, restrukturisasi utang, likuidasi, dan sengketa niaga di Pengadilan Niaga." },
  { id: 6,  key: "securities",     emoji: "📈", name: "Securities Lawyer AI",          category: "Pakar Hukum" as Category,   desc: "Pasar modal, IPO, obligasi, reksa dana, dan kepatuhan OJK untuk emiten maupun investor." },
  { id: 7,  key: "civilrights",    emoji: "⚖️",  name: "Civil Rights Lawyer AI",        category: "Pakar Hukum" as Category,   desc: "HAM, hak-hak sipil, diskriminasi, kebebasan berekspresi, dan advokasi hak konstitusional." },
  { id: 8,  key: "criminal",       emoji: "🛡️",  name: "Criminal Defense AI",           category: "Pakar Hukum" as Category,   desc: "KUHP Baru (UU 1/2023), hak tersangka & terdakwa, proses pidana, strategi pembelaan, dan KUHAP." },
  { id: 9,  key: "family",         emoji: "👨‍👩‍👧", name: "Family Lawyer AI",              category: "Pakar Hukum" as Category,   desc: "Perceraian, hak asuh anak, pembagian harta bersama, waris, adopsi, dan perkawinan campur." },
  { id: 10, key: "realestate",     emoji: "🏠", name: "Real Estate Lawyer AI",         category: "Pakar Hukum" as Category,   desc: "Properti, sertifikasi tanah (SHM/HGB), sengketa agraria, jual beli, dan PPJB." },
  { id: 11, key: "personalinjury", emoji: "🩺", name: "Personal Injury Lawyer AI",     category: "Pakar Hukum" as Category,   desc: "Kecelakaan, cedera, malpraktik medis, klaim asuransi, dan ganti rugi perbuatan melawan hukum." },
  { id: 12, key: "ip",             emoji: "💡", name: "Intellectual Property AI",      category: "Pakar Hukum" as Category,   desc: "Merek, hak cipta, paten, desain industri, rahasia dagang, dan perlindungan HKI di Indonesia." },
  { id: 13, key: "syariah",        emoji: "🕌", name: "Hukum Syariah AI",              category: "Lex Specialis" as Category, desc: "Ekonomi syariah, perbankan Islam, zakat, wakaf, waris Islam (faraidh), dan KHI." },
  { id: 14, key: "tun",            emoji: "🏛️",  name: "Hukum Adm. Negara AI",         category: "Lex Specialis" as Category, desc: "Hukum TUN, sengketa administrasi pemerintahan, PTUN, dan kebijakan publik." },
  { id: 15, key: "lingkungan",     emoji: "🌿", name: "Hukum Lingkungan AI",           category: "Lex Specialis" as Category, desc: "Izin lingkungan (Amdal), sengketa lingkungan, limbah B3, emisi, dan hukum kehutanan." },
  { id: 16, key: "persaingan",     emoji: "🔍", name: "Hukum Persaingan Usaha AI",    category: "Lex Specialis" as Category, desc: "Antimonopoli, kartel, posisi dominan, merger & akuisisi (KPPU), dan persaingan usaha sehat." },
  { id: 17, key: "researcher",     emoji: "🔬", name: "Legal Researcher AI",           category: "Tenaga Ahli" as Category,  desc: "Riset hukum mendalam: doktrin, teori, perbandingan hukum, dan analisis yurisprudensi Indonesia." },
  { id: 18, key: "drafter",        emoji: "✍️",  name: "Legal Drafter AI",              category: "Tenaga Ahli" as Category,  desc: "Penyusunan peraturan, kontrak, MOU, dan instrumen hukum dengan standar teknik perundang-undangan." },
  { id: 19, key: "notaris",        emoji: "📜", name: "Notaris & PPAT AI",             category: "Tenaga Ahli" as Category,  desc: "Akta notaris, PPAT, warisan, perjanjian perkawinan, dan berbagai akta autentik di Indonesia." },
];

const TABS: Category[] = ["Semua", "Pakar Hukum", "Lex Specialis", "Tenaga Ahli"];

const BADGE_COLOR: Record<Category, string> = {
  "Semua": "",
  "Pakar Hukum": "text-blue-400",
  "Lex Specialis": "text-violet-400",
  "Tenaga Ahli": "text-emerald-400",
};

export function AgentsSection() {
  const [activeTab, setActiveTab] = useState<Category>("Semua");

  const filteredAgents = agents.filter(agent =>
    activeTab === "Semua" ? true : agent.category === activeTab
  );

  return (
    <section id="agents" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4" /> Tim AI Hukum Terlengkap
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            19 Agen AI Hukum <span className="text-gradient">Spesialis</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Setiap agen dilatih khusus dalam bidangnya — siap memberikan konsultasi hukum yang akurat, mendalam, dan kontekstual dalam Bahasa Indonesia.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {tab}
              {tab !== "Semua" && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({tab === "Pakar Hukum" ? 12 : tab === "Lex Specialis" ? 4 : 3})
                </span>
              )}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
              >
                <Link href={`/agents/${agent.key}`} className="block h-full">
                  <div className="glass-card rounded-2xl p-5 flex flex-col h-full group cursor-pointer hover:border-primary/30 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.12)]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl border border-white/10 group-hover:scale-110 transition-transform">
                        {agent.emoji}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                          <Circle className="w-1.5 h-1.5 fill-current" /> Online
                        </div>
                        <span className={`text-[10px] font-semibold ${BADGE_COLOR[agent.category]}`}>
                          {agent.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-grow mb-4">
                      {agent.desc}
                    </p>
                    <div className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 text-foreground group-hover:text-primary transition-all flex items-center justify-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="font-semibold text-xs">Mulai Konsultasi →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-10">
          <Link href="/agentic-chatbots">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-semibold text-sm hover:bg-primary/20 transition-all">
              <Sparkles className="w-4 h-4" /> Coba Agentic AI — Semua Agen Berkolaborasi
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
