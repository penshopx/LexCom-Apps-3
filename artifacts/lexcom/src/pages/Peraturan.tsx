import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, X, Filter, ExternalLink } from "lucide-react";
import { dataPeraturan, type Peraturan as TPeraturan, type JenisPeraturan } from "@/data/peraturan";

const SUMBER_JDIH = [
  {
    label: "JDIH Mahkamah Agung",
    desc: "Peraturan, SEMA, PERMA, dan kebijakan MA RI",
    url: "https://jdih.mahkamahagung.go.id/",
    badge: "MA",
    color: "border-blue-500/30 hover:border-blue-500/60 bg-blue-500/5",
    badgeColor: "bg-blue-500/20 text-blue-400",
  },
  {
    label: "Layanan Publik Kemenkum",
    desc: "Layanan publik resmi Kementerian Hukum RI",
    url: "https://kemenkum.go.id/layananpublik",
    badge: "Kemenkum",
    color: "border-red-500/30 hover:border-red-500/60 bg-red-500/5",
    badgeColor: "bg-red-500/20 text-red-400",
  },
  {
    label: "Peraturan.go.id",
    desc: "Portal resmi peraturan perundang-undangan Indonesia",
    url: "https://peraturan.go.id/",
    badge: "Pemerintah",
    color: "border-green-500/30 hover:border-green-500/60 bg-green-500/5",
    badgeColor: "bg-green-500/20 text-green-400",
  },
];

const JENIS_LIST: Array<{ value: JenisPeraturan | "Semua"; label: string }> = [
  { value: "Semua", label: "Semua Jenis" },
  { value: "UU", label: "Undang-Undang" },
  { value: "PP", label: "Peraturan Pemerintah" },
  { value: "Perpres", label: "Perpres" },
  { value: "Permen", label: "Peraturan Menteri" },
];

const JENIS_COLORS: Record<string, string> = {
  UU: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PP: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Perpres: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Permen: "bg-green-500/20 text-green-400 border-green-500/30",
  Perda: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default function Peraturan() {
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState<JenisPeraturan | "Semua">("Semua");
  const [selected, setSelected] = useState<TPeraturan | null>(null);

  const filtered = useMemo(() => {
    return dataPeraturan.filter(p => {
      const matchSearch = search === "" ||
        p.judul.toLowerCase().includes(search.toLowerCase()) ||
        p.nomor.toLowerCase().includes(search.toLowerCase()) ||
        p.ringkasan.toLowerCase().includes(search.toLowerCase());
      const matchJenis = jenisFilter === "Semua" || p.jenis === jenisFilter;
      return matchSearch && matchJenis;
    });
  }, [search, jenisFilter]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <FileText className="w-3 h-3" /> Database Peraturan
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Peraturan <span className="text-gradient">Perundang-undangan</span>
            </h1>
            <p className="text-muted-foreground">
              {dataPeraturan.length} peraturan — UU, PP, Perpres, dan Peraturan Menteri Indonesia
            </p>
          </div>

          {/* Sumber JDIH Panel */}
          <div className="mb-8 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <ExternalLink className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-sm text-foreground">Akses Langsung Sumber Resmi</h2>
              <span className="text-xs text-muted-foreground ml-auto">Website resmi pemerintah RI</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SUMBER_JDIH.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all group ${s.color}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.badgeColor}`}>{s.badge}</span>
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-tight mb-0.5 group-hover:text-primary transition-colors">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{s.desc}</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex gap-3 flex-wrap mb-6">
            <div className="relative flex-1 min-w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari peraturan, nomor, atau kata kunci..."
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={jenisFilter}
                onChange={e => setJenisFilter(e.target.value as JenisPeraturan | "Semua")}
                className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {JENIS_LIST.map(j => (
                  <option key={j.value} value={j.value} className="bg-background">{j.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Count */}
          <p className="text-xs text-muted-foreground mb-4">{filtered.length} peraturan ditemukan</p>

          {/* List */}
          <div className="grid gap-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Tidak ada peraturan yang sesuai pencarian.</p>
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
                        <span className="text-xs text-muted-foreground">{p.tahun}</span>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mb-1">{p.nomor}</p>
                      <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors mb-2">
                        {p.judul}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.ringkasan}</p>
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0">{p.instansi}</div>
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
                      {selected.jenis}
                    </span>
                    <span className="text-xs text-muted-foreground">{selected.tahun} · {selected.instansi}</span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">{selected.nomor}</p>
                  <h2 className="font-display text-lg font-bold">{selected.judul}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-primary">Ringkasan</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.ringkasan}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-primary">Isi Pokok</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selected.isi}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Akses Teks Resmi</h3>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://peraturan.go.id/search?q=${encodeURIComponent(selected.nomor)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Peraturan.go.id
                    </a>
                    <a
                      href="https://jdih.mahkamahagung.go.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> JDIH Mahkamah Agung
                    </a>
                    <a
                      href="https://kemenkum.go.id/layananpublik"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Layanan Kemenkum
                    </a>
                  </div>
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
