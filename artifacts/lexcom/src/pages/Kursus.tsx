import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, GraduationCap, Clock, BookOpen, Star, Users } from "lucide-react";
import { dataKursus, type LevelKursus } from "@/data/kursus";

const LEVEL_LIST: Array<LevelKursus | "Semua"> = ["Semua", "Pemula", "Menengah", "Lanjut"];

const LEVEL_COLORS: Record<string, string> = {
  Pemula: "bg-green-500/20 text-green-400 border-green-500/30",
  Menengah: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Lanjut: "bg-red-500/20 text-red-400 border-red-500/30",
};

function getInitials(name: string): string {
  const parts = name.replace(/^(Prof\.|Dr\.|Ir\.|Drs\.)\s*/gi, "").split(" ");
  return parts.slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

function getAvatarStyle(name: string): { background: string; color: string } {
  const palettes = [
    { background: "linear-gradient(135deg,#7c3aed,#4338ca)", color: "#e9d5ff" },
    { background: "linear-gradient(135deg,#0369a1,#0891b2)", color: "#bae6fd" },
    { background: "linear-gradient(135deg,#059669,#0d9488)", color: "#a7f3d0" },
    { background: "linear-gradient(135deg,#b45309,#d97706)", color: "#fde68a" },
    { background: "linear-gradient(135deg,#be185d,#9333ea)", color: "#fbcfe8" },
    { background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fecaca" },
    { background: "linear-gradient(135deg,#ea580c,#dc2626)", color: "#fed7aa" },
    { background: "linear-gradient(135deg,#4338ca,#6d28d9)", color: "#c7d2fe" },
  ];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return palettes[Math.abs(hash) % palettes.length];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </span>
  );
}

function formatPeserta(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}rb`;
  return String(n);
}

export default function Kursus() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<LevelKursus | "Semua">("Semua");

  const filtered = useMemo(() => {
    return dataKursus.filter(k => {
      const matchSearch =
        search === "" ||
        k.judul.toLowerCase().includes(search.toLowerCase()) ||
        k.instruktur.toLowerCase().includes(search.toLowerCase()) ||
        k.deskripsi.toLowerCase().includes(search.toLowerCase());
      const matchLevel = level === "Semua" || k.level === level;
      return matchSearch && matchLevel;
    });
  }, [search, level]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <GraduationCap className="w-3 h-3" /> Kursus Hukum
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Kursus Hukum <span className="text-gradient">Online</span>
            </h1>
            <p className="text-muted-foreground">
              {dataKursus.length} kursus dari instruktur hukum terbaik Indonesia
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari kursus atau instruktur..."
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>

          {/* Level Filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            {LEVEL_LIST.map(lv => (
              <button
                key={lv}
                onClick={() => setLevel(lv)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${
                  level === lv
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-foreground"
                }`}
              >
                {lv}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mb-4">{filtered.length} kursus ditemukan</p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Tidak ada kursus yang sesuai pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((k, i) => {
                const avatarStyle = getAvatarStyle(k.instruktur);
                const initials = getInitials(k.instruktur);
                return (
                  <motion.div
                    key={k.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/kursus/${k.id}`}>
                      <div className="group glass-card rounded-2xl border border-white/10 hover:border-primary/30 hover:shadow-[0_0_24px_rgba(139,92,246,0.12)] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col">
                        {/* Thumbnail */}
                        <div
                          className="h-36 flex items-center justify-center relative overflow-hidden"
                          style={{ background: `linear-gradient(135deg, ${k.gradientFrom}, ${k.gradientTo})` }}
                        >
                          <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                          />
                          <span className="text-5xl drop-shadow-lg select-none z-10">{k.topikEmoji}</span>
                          <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-black/30 backdrop-blur-sm ${LEVEL_COLORS[k.level]}`}>
                            {k.level}
                          </span>
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">
                            {k.judul}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                            {k.deskripsi}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-amber-400">{k.rating.toFixed(1)}</span>
                            <StarRating rating={k.rating} />
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Users className="w-2.5 h-2.5" /> {formatPeserta(k.peserta)} peserta
                            </span>
                          </div>

                          {/* Instructor */}
                          <div className="flex items-center gap-2 mb-3">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                              style={{ background: avatarStyle.background, color: avatarStyle.color }}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground/80 truncate">{k.instruktur}</p>
                              <p className="text-[10px] text-muted-foreground/70 truncate">{k.jabatanInstruktur}</p>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-white/10 mt-auto">
                            <span className="flex items-center gap-3">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {k.durasi}</span>
                              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {k.jumlahModul} modul</span>
                            </span>
                            <span className="text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                              Gratis
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
