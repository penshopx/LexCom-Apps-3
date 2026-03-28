import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { dataGlosarium, type KategoriGlosarium } from "@/data/glosarium";

const KATEGORI_LIST: Array<KategoriGlosarium | "Semua"> = [
  "Semua", "Umum", "Perdata", "Pidana", "Bisnis", "Agraria", "Keluarga",
  "Ketenagakerjaan", "Tata Usaha Negara", "Acara", "Konstitusi",
];

const KATEGORI_COLORS: Record<string, string> = {
  Umum: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  Perdata: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Pidana: "bg-red-500/20 text-red-400 border-red-500/30",
  Bisnis: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Agraria: "bg-green-500/20 text-green-400 border-green-500/30",
  Keluarga: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Ketenagakerjaan: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Tata Usaha Negara": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Acara: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Konstitusi: "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

function IstilahCard({ item }: { item: typeof dataGlosarium[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div>
            <div className="font-semibold text-foreground text-sm">{item.istilah}</div>
            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.definisi}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full border font-medium ${KATEGORI_COLORS[item.kategori] ?? ""}`}>
            {item.kategori}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border space-y-3">
              <p className="text-sm text-foreground leading-relaxed">{item.definisi}</p>
              {item.contoh && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">Contoh: </span>
                  <span className="text-sm text-muted-foreground">{item.contoh}</span>
                </div>
              )}
              {item.dasar_hukum && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dasar Hukum:</span>
                  <span className="text-xs bg-secondary border border-border px-2 py-1 rounded">{item.dasar_hukum}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Glosarium() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState<KategoriGlosarium | "Semua">("Semua");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const sorted = useMemo(() => [...dataGlosarium].sort((a, b) => a.istilah.localeCompare(b.istilah, "id")), []);

  const filtered = useMemo(() => {
    return sorted.filter((item) => {
      const matchSearch =
        search === "" ||
        item.istilah.toLowerCase().includes(search.toLowerCase()) ||
        item.definisi.toLowerCase().includes(search.toLowerCase());
      const matchKategori = kategori === "Semua" || item.kategori === kategori;
      const matchLetter = !activeLetter || item.istilah.toUpperCase().startsWith(activeLetter);
      return matchSearch && matchKategori && matchLetter;
    });
  }, [sorted, search, kategori, activeLetter]);

  const availableLetters = useMemo(
    () => new Set(sorted.map((i) => i.istilah[0].toUpperCase())),
    [sorted]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-36 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <BookOpen className="w-3 h-3" /> Glosarium Hukum
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Glosarium Hukum Indonesia</h1>
            <p className="text-muted-foreground">
              Kamus istilah hukum Indonesia yang komprehensif — {dataGlosarium.length}+ istilah dengan definisi, contoh, dan dasar hukum.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveLetter(null); }}
                placeholder="Cari istilah atau definisi..."
                className="pl-9 pr-9"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Kategori filter */}
          <div className="flex flex-wrap gap-2 mb-5">
            {KATEGORI_LIST.map((k) => (
              <button
                key={k}
                onClick={() => setKategori(k)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  kategori === k
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Alphabet filter */}
          <div className="flex flex-wrap gap-1 mb-6">
            {ALPHABET.map((l) => (
              <button
                key={l}
                disabled={!availableLetters.has(l)}
                onClick={() => setActiveLetter(activeLetter === l ? null : l)}
                className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                  activeLetter === l
                    ? "bg-primary text-primary-foreground"
                    : availableLetters.has(l)
                    ? "hover:bg-primary/10 text-foreground border border-border"
                    : "text-muted-foreground/30 cursor-not-allowed"
                }`}
              >
                {l}
              </button>
            ))}
            {activeLetter && (
              <button
                onClick={() => setActiveLetter(null)}
                className="text-xs px-2 py-1 text-primary hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Results */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> istilah
              {kategori !== "Semua" && ` dalam kategori ${kategori}`}
            </p>
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-muted-foreground"
                >
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Istilah tidak ditemukan. Coba kata kunci lain.</p>
                </motion.div>
              ) : (
                filtered.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <IstilahCard item={item} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
