import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "LexCom membantu saya mengelola perkara lebih efisien. Template dokumen hukumnya sangat membantu menghemat waktu.",
    author: "Budi Santoso, S.H.",
    role: "Advokat",
    avatar: "BS"
  },
  {
    quote: "Saya bisa konsultasi hukum kapan saja tanpa harus ke kantor advokat. Sangat membantu untuk bisnis kecil saya.",
    author: "Siti Rahayu",
    role: "Pelaku UMKM",
    avatar: "SR"
  },
  {
    quote: "Platform yang luar biasa untuk kolaborasi antara akademisi dan praktisi hukum. Ekosistemnya sangat mendukung.",
    author: "Dr. Ahmad Fauzi",
    role: "Akademisi Hukum",
    avatar: "AF"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              key={i}
              className="glass-card p-8 rounded-2xl relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5" />
              <p className="text-foreground/90 text-lg leading-relaxed mb-8 relative z-10">
                "{testi.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center text-white font-bold font-display">
                  {testi.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testi.author}</h4>
                  <p className="text-sm text-muted-foreground">{testi.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
