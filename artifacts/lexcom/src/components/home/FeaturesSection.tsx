import { motion } from "framer-motion";
import { Target, Zap, BookOpen, MessageCircle, Database, Users, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Agentic AI Advisor",
    desc: "AI yang memberikan saran proaktif — identifikasi risiko sebelum terjadi.",
    bullets: ["Saran Proaktif", "Analisis Risiko", "Rekomendasi"],
    color: "from-blue-500 to-cyan-400"
  },
  {
    icon: Zap,
    title: "Legal Executor",
    desc: "Delegasikan tugas: buat dokumen, riset, analisis — AI langsung eksekusi.",
    bullets: ["Buat Dokumen", "Riset Otomatis", "Hasil Instan"],
    color: "from-purple-500 to-pink-400"
  },
  {
    icon: BookOpen,
    title: "Mentoring AI",
    desc: "Belajar hukum dengan mentor AI yang membimbing step-by-step.",
    bullets: ["Roadmap Belajar", "Quiz Interaktif", "Evaluasi"],
    color: "from-emerald-500 to-teal-400"
  },
  {
    icon: MessageCircle,
    title: "Diskusi Hukum",
    desc: "Diskusikan kasus dengan AI yang menggali pemahaman dari berbagai sudut.",
    bullets: ["Pendalaman", "Berbagai Perspektif", "Pertanyaan Socratic"],
    color: "from-orange-500 to-red-400"
  },
  {
    icon: Database,
    title: "Knowledge Base",
    desc: "Akses database peraturan, putusan, dan panduan hukum terlengkap.",
    bullets: ["UU & PP", "Putusan Pengadilan", "Panduan Praktis"],
    color: "from-blue-600 to-indigo-500"
  },
  {
    icon: Users,
    title: "Expert Network",
    desc: "Koneksi dengan pengacara dan konsultan hukum profesional.",
    bullets: ["Direktori Pengacara", "Konsultasi Pakar", "Booking Online"],
    color: "from-violet-500 to-purple-500"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-card/30 border-y border-white/5 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Semua Kebutuhan Hukum dalam Satu Platform
          </h2>
          <p className="text-lg text-muted-foreground">
            Dari saran proaktif hingga eksekusi tugas — LexCom punya solusinya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              key={i}
              className="glass-card rounded-2xl p-8 hover:-translate-y-2 group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">
                {feature.desc}
              </p>
              <ul className="space-y-3">
                {feature.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-foreground/80">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
