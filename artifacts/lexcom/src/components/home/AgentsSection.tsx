import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Circle } from "lucide-react";
import { Link } from "wouter";

type Category = "Semua" | "Bisnis & Korporasi" | "Personal & Keluarga";

const agents = [
  { id: 1, key: "corporate", emoji: "🏢", name: "Corporate Lawyer AI", category: "Bisnis & Korporasi" as Category, desc: "Spesialis pendirian perusahaan, merger & akuisisi, tata kelola perusahaan, kontrak bisnis, dan kepatuhan korporasi di Indonesia." },
  { id: 2, key: "tax", emoji: "💰", name: "Tax Lawyer AI", category: "Bisnis & Korporasi" as Category, desc: "Ahli perpajakan Indonesia, perencanaan pajak, sengketa pajak, kepatuhan fiskal." },
  { id: 3, key: "employment", emoji: "👔", name: "Employment Lawyer AI", category: "Bisnis & Korporasi" as Category, desc: "Spesialis hubungan industrial, PHK, kontrak kerja, upah minimum, K3." },
  { id: 4, key: "immigration", emoji: "🌍", name: "Immigration Lawyer AI", category: "Bisnis & Korporasi" as Category, desc: "Spesialis visa, izin tinggal, kewarganegaraan, deportasi." },
  { id: 5, key: "bankruptcy", emoji: "📊", name: "Bankruptcy Lawyer AI", category: "Bisnis & Korporasi" as Category, desc: "Ahli kepailitan, PKPU, restrukturisasi utang, dan perlindungan kreditor maupun debitor." },
  { id: 6, key: "securities", emoji: "📈", name: "Securities Lawyer AI", category: "Bisnis & Korporasi" as Category, desc: "Ahli dalam regulasi pasar modal, sekuritas, penawaran umum, dan perlindungan investor." },
  { id: 7, key: "civilrights", emoji: "⚖️", name: "Civil Rights Lawyer AI", category: "Personal & Keluarga" as Category, desc: "Pembela hak-hak sipil dan HAM, diskriminasi, kebebasan berekspresi." },
  { id: 8, key: "criminal", emoji: "🛡️", name: "Criminal Defense AI", category: "Personal & Keluarga" as Category, desc: "Ahli hukum pidana untuk pembelaan terdakwa, analisis dakwaan, strategi pembelaan." },
  { id: 9, key: "family", emoji: "👨‍👩‍👧", name: "Family Lawyer AI", category: "Personal & Keluarga" as Category, desc: "Menangani perceraian, hak asuh anak, pembagian harta, adopsi, dan permasalahan keluarga." },
  { id: 10, key: "realestate", emoji: "🏠", name: "Real Estate Lawyer AI", category: "Personal & Keluarga" as Category, desc: "Spesialis transaksi properti, sengketa tanah, sertifikasi hak atas tanah." },
  { id: 11, key: "personalinjury", emoji: "🚗", name: "Personal Injury AI", category: "Personal & Keluarga" as Category, desc: "Spesialis kasus kecelakaan, cedera akibat kelalaian, klaim asuransi, dan kompensasi korban." },
];

export function AgentsSection() {
  const [activeTab, setActiveTab] = useState<Category>("Semua");

  const filteredAgents = agents.filter(agent => 
    activeTab === "Semua" ? true : agent.category === activeTab
  );

  return (
    <section id="agents" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            🤖 11 Agen AI Hukum Spesialis
          </h2>
          <p className="text-lg text-muted-foreground">
            Setiap agen AI dirancang khusus untuk bidang hukum tertentu — atentif, proaktif, dan siap mengerjakan tugas hukum Anda 24/7.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {(["Semua", "Bisnis & Korporasi", "Personal & Keluarga"] as Category[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? "bg-white text-background shadow-lg scale-105" 
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/agents/${agent.key}`} className="block h-full">
                  <div className="glass-card rounded-2xl p-6 flex flex-col h-full group cursor-pointer hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-3xl border border-white/10 group-hover:scale-110 transition-transform">
                        {agent.emoji}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        <Circle className="w-2 h-2 fill-current" /> Online
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">
                      {agent.name}
                    </h3>
                    <p className="text-xs font-medium text-primary mb-4 uppercase tracking-wider">
                      {agent.category}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-8">
                      {agent.desc}
                    </p>
                    
                    <div className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 text-foreground group-hover:text-primary transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)]">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-semibold text-sm">Mulai Konsultasi →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
