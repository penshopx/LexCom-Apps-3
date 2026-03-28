import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, GraduationCap, Clock, ChevronRight, BookOpen } from "lucide-react";
import { dataKursus, type LevelKursus } from "@/data/kursus";

const LEVEL_LIST: Array<LevelKursus | "Semua"> = ["Semua", "Pemula", "Menengah", "Lanjut"];

const LEVEL_COLORS: Record<string, string> = {
  Pemula: "bg-green-500/20 text-green-400 border-green-500/30",
  Menengah: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Lanjut: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Kursus() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<LevelKursus | "Semua">("Semua");

  const filtered = useMemo(() => {
    return dataKursus.filter(k => {
      const matchSearch = search === "" ||
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((k, i) => (
                <motion.div
                  key={k.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={`/kursus/${k.id}`}>
                    <div className="group glass-card rounded-xl border border-white/10 hover:border-primary/30 transition-all p-5 h-full cursor-pointer flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[k.level]}`}>
                          {k.level}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors mb-2 flex-1">
                        {k.judul}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{k.deskripsi}</p>
                      <div className="text-xs text-muted-foreground mb-3">
                        <span className="font-medium text-foreground/70">{k.instruktur}</span>
                        <span className="text-muted-foreground/60 ml-1">· {k.jabatanInstruktur}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-white/10">
                        <span className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {k.durasi}</span>
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {k.jumlahModul} modul</span>
                        </span>
                        <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Detail <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
