import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, BookOpen, Clock, ChevronRight } from "lucide-react";
import { dataPanduan, type KategoriPanduan } from "@/data/panduan";

const KATEGORI_LIST: Array<KategoriPanduan | "Semua"> = ["Semua", "Perdata", "Pidana", "Keluarga", "Bisnis", "Properti"];

const KATEGORI_COLORS: Record<string, string> = {
  Perdata: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Pidana: "bg-red-500/20 text-red-400 border-red-500/30",
  Keluarga: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Bisnis: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Properti: "bg-green-500/20 text-green-400 border-green-500/30",
};

function formatTanggal(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function Panduan() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState<KategoriPanduan | "Semua">("Semua");

  const filtered = useMemo(() => {
    return dataPanduan.filter(p => {
      const matchSearch = search === "" ||
        p.judul.toLowerCase().includes(search.toLowerCase()) ||
        p.ringkasan.toLowerCase().includes(search.toLowerCase());
      const matchKategori = kategori === "Semua" || p.kategori === kategori;
      return matchSearch && matchKategori;
    });
  }, [search, kategori]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <BookOpen className="w-3 h-3" /> Panduan Hukum
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Panduan Praktis <span className="text-gradient">Hukum Indonesia</span>
            </h1>
            <p className="text-muted-foreground">
              {dataPanduan.length} artikel panduan — ditulis dalam Bahasa Indonesia yang mudah dipahami
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari panduan hukum..."
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            {KATEGORI_LIST.map(kat => (
              <button
                key={kat}
                onClick={() => setKategori(kat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${
                  kategori === kat
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-foreground"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mb-4">{filtered.length} panduan ditemukan</p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Tidak ada panduan yang sesuai pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={`/panduan/${p.id}`}>
                    <div className="group glass-card rounded-xl border border-white/10 hover:border-primary/30 transition-all p-5 h-full cursor-pointer flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${KATEGORI_COLORS[p.kategori]}`}>
                          {p.kategori}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors mb-2 flex-1">
                        {p.judul}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.ringkasan}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-white/10">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatTanggal(p.tanggal)}
                        </span>
                        <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Baca <ChevronRight className="w-3 h-3" />
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
