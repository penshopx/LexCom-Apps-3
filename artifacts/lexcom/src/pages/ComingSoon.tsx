import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ComingSoonProps {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
}

export function ComingSoonPage({ emoji, title, subtitle, description, features }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-7xl mb-6">{emoji}</div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              Segera Hadir
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">{title}</h1>
            <p className="text-primary font-medium text-lg mb-4">{subtitle}</p>
            <p className="text-muted-foreground text-base mb-10 max-w-xl mx-auto leading-relaxed">{description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-left max-w-lg mx-auto">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 glass-card rounded-xl p-3 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="outline" className="rounded-full px-6">
                  Kembali ke Beranda
                </Button>
              </Link>
              <Link href="/agentic-chatbots">
                <Button className="rounded-full px-6">
                  Coba AI Chat Sekarang
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function Layanan() {
  return <ComingSoonPage
    emoji="⚙️"
    title="Layanan LexCom"
    subtitle="Solusi Hukum Terpadu untuk Semua Kebutuhan"
    description="Kami menyediakan layanan hukum komprehensif mulai dari konsultasi AI, pembuatan dokumen, manajemen perkara, hingga koneksi dengan pengacara terpercaya."
    features={["Konsultasi AI 24/7", "Generator Dokumen Hukum", "Manajemen Perkara", "Direktori Pengacara", "Database Peraturan", "Kursus Hukum Online"]}
  />;
}



