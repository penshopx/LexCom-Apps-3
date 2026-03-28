import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Star, MapPin, Briefcase, GraduationCap, X, Filter, Phone } from "lucide-react";
import { dataPengacara, KOTA_LIST, SPESIALISASI_LIST, type Pengacara as TPengacara } from "@/data/pengacara";

export default function Pengacara() {
  const [search, setSearch] = useState("");
  const [kotaFilter, setKotaFilter] = useState("Semua");
  const [spesFilter, setSpesFilter] = useState("Semua");
  const [selected, setSelected] = useState<TPengacara | null>(null);

  const filtered = useMemo(() => {
    return dataPengacara.filter(p => {
      const matchSearch = search === "" ||
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.spesialisasi.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
        p.bio.toLowerCase().includes(search.toLowerCase());
      const matchKota = kotaFilter === "Semua" || p.kota === kotaFilter;
      const matchSpes = spesFilter === "Semua" || p.spesialisasi.includes(spesFilter);
      return matchSearch && matchKota && matchSpes;
    });
  }, [search, kotaFilter, spesFilter]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <Users className="w-3 h-3" /> Direktori Pengacara
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Direktori <span className="text-gradient">Pengacara</span>
            </h1>
            <p className="text-muted-foreground">
              {dataPengacara.length} pengacara terverifikasi di seluruh Indonesia
            </p>
          </div>

          {/* Search + Filters */}
          <div className="flex gap-3 flex-wrap mb-6">
            <div className="relative flex-1 min-w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama pengacara atau spesialisasi..."
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={kotaFilter}
                onChange={e => setKotaFilter(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="Semua" className="bg-background">Semua Kota</option>
                {KOTA_LIST.map(k => (
                  <option key={k} value={k} className="bg-background">{k}</option>
                ))}
              </select>
            </div>
            <select
              value={spesFilter}
              onChange={e => setSpesFilter(e.target.value)}
              className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="Semua" className="bg-background">Semua Spesialisasi</option>
              {SPESIALISASI_LIST.map(s => (
                <option key={s} value={s} className="bg-background">{s}</option>
              ))}
            </select>
          </div>

          <p className="text-xs text-muted-foreground mb-4">{filtered.length} pengacara ditemukan</p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Tidak ada pengacara yang sesuai kriteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div
                    className="group glass-card rounded-xl border border-white/10 hover:border-primary/30 transition-all p-5 flex flex-col cursor-pointer h-full"
                    onClick={() => setSelected(p)}
                  >
                    {/* Avatar + Name */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-display font-bold text-primary">
                          {p.nama.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">{p.nama}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-yellow-400 font-medium">{p.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Spesialisasi */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.spesialisasi.map(s => (
                        <span key={s} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Info */}
                    <div className="space-y-1 text-xs text-muted-foreground flex-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" /> {p.kota}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 flex-shrink-0" /> {p.pengalaman_tahun} tahun pengalaman
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{p.tarif}</span>
                      <Button size="sm" className="h-7 text-xs rounded-full px-3 gap-1" onClick={e => { e.stopPropagation(); setSelected(p); }}>
                        <Phone className="w-3 h-3" /> Hubungi
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
              className="w-full max-w-lg glass-card rounded-2xl border border-white/15 flex flex-col max-h-[85vh]"
            >
              <div className="flex items-start justify-between p-6 border-b border-white/10 flex-shrink-0">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-display font-bold text-primary">{selected.nama.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold">{selected.nama}</h2>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-yellow-400 font-medium">{selected.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-6 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {selected.spesialisasi.map(s => (
                    <span key={s} className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" /> {selected.kota}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4 text-primary" /> {selected.pengalaman_tahun} tahun
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground col-span-2">
                    <GraduationCap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> {selected.pendidikan}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2 text-primary">Tentang</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.bio}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">No. Advokat</p>
                      <p className="text-sm font-mono font-medium">{selected.no_advokat}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Tarif Konsultasi</p>
                      <p className="text-sm font-semibold text-primary">{selected.tarif}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full rounded-xl gap-2">
                  <Phone className="w-4 h-4" /> Hubungi {selected.nama.split(",")[0]}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
