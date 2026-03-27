import { motion } from "framer-motion";

const stats = [
  { value: "300+", label: "Advokat & Praktisi" },
  { value: "150+", label: "Akademisi & Peneliti" },
  { value: "2.000+", label: "Mahasiswa Hukum" },
  { value: "500+", label: "Paralegal & Relawan" },
  { value: "5.000+", label: "Masyarakat Umum" },
  { value: "800+", label: "Pelaku UMKM" },
];

export function StatsSection() {
  return (
    <section id="community" className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Ekosistem Komunitas
          </h2>
          <p className="text-lg text-muted-foreground">
            LexCom mempertemukan semua pemangku kepentingan hukum dalam satu ekosistem kolaboratif yang saling mendukung.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
