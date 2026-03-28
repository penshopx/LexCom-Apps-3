import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Scale, X, Filter } from "lucide-react";
import { dataPutusan, type Putusan as TPutusan, type JenisPengadilan } from "@/data/putusan";

const JENIS_LIST: Array<{ value: JenisPengadilan | "Semua"; label: string }> = [
  { value: "Semua", label: "Semua Pengadilan" },
  { value: "MK", label: "Mahkamah Konstitusi" },
  { value: "MA", label: "Mahkamah Agung" },
  { value: "PN", label: "Pengadilan Negeri" },
  { value: "PA", label: "Pengadilan Agama" },
];

const JENIS_COLORS: Record<string, string> = {
  MK: "bg-red-500/20 text-red-400 border-red-500/30",
  MA: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PN: "bg-green-500/20 text-green-400 border-green-500/30",
  PA: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const TAHUN_OPTIONS = ["Semua", "2024", "2023", "2022", "2021", "2020", "2019", "Lebih Lama"];

function formatTanggal(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function Putusan() {
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState<JenisPengadilan | "Semua">("Semua");
  const [tahunFilter, setTahunFilter] = useState("Semua");
  const [selected, setSelected] = useState<TPutusan | null>(null);

  const filtered = useMemo(() => {
    return dataPutusan.filter(p => {
      const matchSearch = search === "" ||
        p.nomor.toLowerCase().includes(search.toLowerCase()) ||
        p.pokok_perkara.toLowerCase().includes(search.toLowerCase()) ||
        p.majelis.toLowerCase().includes(search.toLowerCase());
      const matchJenis = jenisFilter === "Semua" || p.jenis === jenisFilter;
      const tahun = new Date(p.tanggal).getFullYear();
      const matchTahun = tahunFilter === "Semua" ||
        (tahunFilter === "Lebih Lama" ? tahun < 2019 : tahun.toString() === tahunFilter);
      return matchSearch && matchJenis && matchTahun;
    });
  }, [search, jenisFilter, tahunFilter]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <Scale className="w-3 h-3" /> Database Putusan
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Putusan <span className="text-gradient">Pengadilan</span>
            </h1>
            <p className="text-muted-foreground">
              {dataPutusan.length} putusan — MK, MA, Pengadilan Negeri, dan Pengadilan Agama
            </p>
          </div>

          {/* Search + Filter */}
          <div className="flex gap-3 flex-wrap mb-6">
            <div className="relative flex-1 min-w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nomor putusan, majelis, atau pokok perkara..."
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={jenisFilter}
                onChange={e => setJenisFilter(e.target.value as JenisPengadilan | "Semua")}
                className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {JENIS_LIST.map(j => (
                  <option key={j.value} value={j.value} className="bg-background">{j.label}</option>
                ))}
              </select>
            </div>
            <select
              value={tahunFilter}
              onChange={e => setTahunFilter(e.target.value)}
              className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {TAHUN_OPTIONS.map(t => (
                <option key={t} value={t} className="bg-background">{t === "Semua" ? "Semua Tahun" : t}</option>
              ))}
            </select>
          </div>

          <p className="text-xs text-muted-foreground mb-4">{filtered.length} putusan ditemukan</p>

          {/* List */}
          <div className="grid gap-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Scale className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Tidak ada putusan yang sesuai pencarian.</p>
              </div>
            ) : (
              filtered.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelected(p)}
                  className="glass-card rounded-xl border border-white/10 hover:border-primary/30 transition-all p-5 text-left w-full group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${JENIS_COLORS[p.jenis]}`}>
                          {p.jenis}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatTanggal(p.tanggal)}</span>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mb-1">{p.nomor}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                        {p.pokok_perkara}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl glass-card rounded-2xl border border-white/15 flex flex-col max-h-[85vh]"
            >
              <div className="flex items-start justify-between p-6 border-b border-white/10 flex-shrink-0">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${JENIS_COLORS[selected.jenis]}`}>
                      {selected.jenis === "MK" ? "Mahkamah Konstitusi" :
                       selected.jenis === "MA" ? "Mahkamah Agung" :
                       selected.jenis === "PN" ? "Pengadilan Negeri" : "Pengadilan Agama"}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatTanggal(selected.tanggal)}</span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">{selected.nomor}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-primary">Majelis Hakim</h3>
                  <p className="text-sm text-muted-foreground">{selected.majelis}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-primary">Pokok Perkara</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.pokok_perkara}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-primary">Amar Putusan</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.amar}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
