import { motion } from "framer-motion";
import { Users, Scale } from "lucide-react";
import { Link } from "wouter";

export function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Bergabung Sekarang — <span className="text-gradient">Gratis!</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Bergabunglah dengan ribuan anggota komunitas — masyarakat, advokat, akademisi, dan mahasiswa hukum — yang bersama-sama membangun ekosistem hukum digital Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-card border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-4">Untuk Masyarakat</h3>
            <p className="text-muted-foreground mb-8">
              Akses konsultasi hukum gratis, edukasi, dan pendampingan dari praktisi berlisensi.
            </p>
            <Link href="/agents" className="w-full mt-auto">
              <button className="w-full py-4 rounded-xl font-bold bg-white text-background hover:bg-gray-200 transition-colors">
                Mulai Konsultasi Gratis
              </button>
            </Link>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-b from-primary/20 to-card border border-primary/30 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden shadow-[0_0_50px_-12px_rgba(124,58,237,0.3)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <Scale className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-4">Untuk Praktisi Hukum</h3>
            <p className="text-muted-foreground mb-8">
              Akses alat bantu digital, kelola perkara, dan berkontribusi kepada masyarakat.
            </p>
            <Link href="/pengacara" className="w-full mt-auto">
              <button className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                Daftar sebagai Praktisi
              </button>
            </Link>
          </motion.div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
          Tidak perlu kartu kredit • Daftar dalam 2 menit • Konsultasi pertama gratis
        </p>
      </div>
    </section>
  );
}
