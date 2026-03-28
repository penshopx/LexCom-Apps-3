import { motion } from "framer-motion";
import { FileEdit, FolderKanban, Search, Users } from "lucide-react";
import { Link } from "wouter";

const tools = [
  {
    icon: FileEdit,
    title: "Generator Dokumen Hukum",
    desc: "Buat dokumen hukum profesional dengan template terstruktur.",
    tags: ["Gugatan & Jawaban", "Replik & Duplik", "Surat Kuasa", "Kontrak & Perjanjian"],
    action: "Coba Sekarang →",
    href: "/documents",
    primary: true
  },
  {
    icon: FolderKanban,
    title: "Manajemen Perkara",
    desc: "Kelola semua perkara hukum Anda dalam satu sistem terorganisir.",
    tags: ["Tracking Status Perkara", "Jadwal Sidang", "Dokumen Perkara", "Notifikasi Otomatis"],
    action: "Coba Sekarang →",
    href: "/cases",
    primary: true
  },
  {
    icon: Search,
    title: "Database Hukum",
    desc: "Akses database peraturan perundang-undangan dan putusan pengadilan.",
    tags: ["Peraturan Perundangan", "Putusan Pengadilan", "Yurisprudensi", "Regulasi Terbaru"],
    action: "Eksplorasi →",
    href: "/peraturan",
    primary: false
  },
  {
    icon: Users,
    title: "Forum Profesional",
    desc: "Diskusi eksklusif antar advokat dan praktisi hukum.",
    tags: ["Diskusi Kasus", "Sharing Pengetahuan", "Networking Advokat", "Konsultasi Sejawat"],
    action: "Buka Forum →",
    href: "/forum",
    primary: false
  }
];

export function PractitionersSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-semibold mb-4">
            Untuk Praktisi Hukum
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 max-w-2xl">
            Alat Bantu Digital untuk Praktik Hukum Modern
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            LexCom menyediakan ekosistem digital lengkap bagi advokat dan praktisi hukum untuk menjalankan praktik secara lebih efisien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              key={i}
              className="bg-card border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <tool.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {tool.desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {tool.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/5 rounded-md text-xs font-medium text-foreground/80 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link href={tool.href} className={`inline-flex items-center gap-2 text-sm font-bold transition-all hover:translate-x-1 ${
                    tool.primary 
                      ? "text-primary hover:text-primary/80" 
                      : "text-foreground hover:text-primary"
                  }`}>
                    {tool.action}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
