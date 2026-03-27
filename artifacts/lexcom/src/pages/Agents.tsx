import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Bot, ArrowRight } from "lucide-react";

const AGENTS = [
  { key: "corporate", emoji: "🏢", name: "Corporate Lawyer AI", category: "Bisnis & Korporasi", description: "Hukum perusahaan, merger & akuisisi, tata kelola korporasi." },
  { key: "tax", emoji: "💰", name: "Tax Lawyer AI", category: "Bisnis & Korporasi", description: "Perencanaan pajak, sengketa perpajakan, kepatuhan pajak." },
  { key: "employment", emoji: "👔", name: "Employment Lawyer AI", category: "Bisnis & Korporasi", description: "Hubungan ketenagakerjaan, PHK, kontrak kerja." },
  { key: "immigration", emoji: "🌍", name: "Immigration Lawyer AI", category: "Bisnis & Korporasi", description: "Visa, KITAS/KITAP, izin kerja WNA di Indonesia." },
  { key: "bankruptcy", emoji: "📊", name: "Bankruptcy Lawyer AI", category: "Bisnis & Korporasi", description: "Kepailitan, PKPU, restrukturisasi utang." },
  { key: "securities", emoji: "📈", name: "Securities Lawyer AI", category: "Bisnis & Korporasi", description: "Pasar modal, IPO, efek, kepatuhan OJK." },
  { key: "civilrights", emoji: "⚖️", name: "Civil Rights Lawyer AI", category: "Personal & Keluarga", description: "Hak-hak sipil, diskriminasi, hak konstitusional." },
  { key: "criminal", emoji: "🛡️", name: "Criminal Defense Lawyer AI", category: "Personal & Keluarga", description: "Hak tersangka, proses peradilan, pembelaan pidana." },
  { key: "family", emoji: "👨‍👩‍👧", name: "Family Lawyer AI", category: "Personal & Keluarga", description: "Perceraian, hak asuh anak, waris, perkawinan." },
  { key: "realestate", emoji: "🏠", name: "Real Estate Lawyer AI", category: "Personal & Keluarga", description: "Properti, sertifikat, sengketa tanah, jual beli." },
  { key: "personalinjury", emoji: "🚗", name: "Personal Injury Lawyer AI", category: "Personal & Keluarga", description: "Kecelakaan, ganti rugi, malpraktik medis, asuransi." },
];

const categories = [...new Set(AGENTS.map(a => a.category))];

export default function Agents() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Bot className="w-4 h-4" />
              11 AI Legal Agents
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Pilih Spesialis <span className="text-gradient">Hukum AI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Setiap agen dilatih khusus dalam bidang hukumnya untuk memberikan konsultasi yang akurat dan relevan dalam Bahasa Indonesia.
            </p>
          </div>

          {/* Agents by category */}
          {categories.map(cat => (
            <div key={cat} className="mb-10">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4 px-1">
                {cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {AGENTS.filter(a => a.category === cat).map((agent, i) => (
                  <motion.div
                    key={agent.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/agents/${agent.key}`}>
                      <div className="group glass-card rounded-2xl border border-white/10 p-5 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 cursor-pointer h-full flex flex-col">
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
