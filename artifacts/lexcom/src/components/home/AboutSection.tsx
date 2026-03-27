import { Target, Rocket, CheckCircle2 } from "lucide-react";

const goals = [
  "Meningkatkan literasi dan kesadaran hukum masyarakat",
  "Mempermudah akses masyarakat terhadap informasi dan layanan hukum",
  "Membangun ekosistem kolaboratif antara masyarakat dan layanan hukum",
  "Menyediakan ruang partisipasi bagi praktisi hukum untuk berkontribusi",
  "Mendukung advokat dengan alat bantu digital dalam praktik hukum",
  "Mendorong budaya taat hukum dan penyelesaian masalah secara legal"
];

const missions = [
  "Membangun platform digital yang menghubungkan masyarakat dengan layanan hukum berkualitas",
  "Mengembangkan ekosistem komunitas hukum yang kolaboratif dan berkelanjutan",
  "Menyediakan alat bantu teknologi untuk meningkatkan efisiensi praktik hukum",
  "Mendorong inovasi LegalTech untuk transformasi layanan hukum Indonesia"
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-card/50 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Tentang LexCom
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              LexCom adalah wadah kolaboratif berbasis teknologi yang bertujuan meningkatkan kesadaran hukum masyarakat sekaligus menyediakan layanan hukum yang mudah diakses, transparan, dan terpercaya.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Komunitas ini mengintegrasikan masyarakat, praktisi hukum, akademisi, serta berbagai pemangku kepentingan dalam satu ekosistem digital yang saling mendukung.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-foreground mb-6">Tujuan Platform</h3>
            <ul className="space-y-4">
              {goals.map((goal, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-card to-card/50 border border-white/10 rounded-3xl p-10 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-32 h-32 text-primary" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-8 relative z-10">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl font-display font-bold text-foreground mb-4 relative z-10">Visi</h3>
            <p className="text-lg text-muted-foreground leading-relaxed relative z-10">
              Menjadi platform LegalTech terdepan di Indonesia yang mewujudkan masyarakat sadar hukum dan ekosistem layanan hukum digital yang inklusif, profesional, dan berkeadilan.
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 border border-white/10 rounded-3xl p-10 relative overflow-hidden group hover:border-secondary/30 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Rocket className="w-32 h-32 text-secondary" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-8 relative z-10">
              <Rocket className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-3xl font-display font-bold text-foreground mb-6 relative z-10">Misi</h3>
            <ul className="space-y-4 relative z-10">
              {missions.map((mission, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-2" />
                  <span className="text-muted-foreground">{mission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
