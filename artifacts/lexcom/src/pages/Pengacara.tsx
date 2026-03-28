import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Users, Star, MapPin, Briefcase, GraduationCap, X,
  Filter, Phone, Bot, ArrowRight, Sparkles, Scale,
} from "lucide-react";
import { dataPengacara, KOTA_LIST, SPESIALISASI_LIST, type Pengacara as TPengacara } from "@/data/pengacara";

const PAKAR_AI = [
  {
    key: "pidana_umum",
    emoji: "⚖️",
    nama: "Pakar Hukum Pidana Umum",
    badge: "KUHP Baru 2026",
    deskripsi: "KUHP baru (UU No. 1/2023) & KUHAP: hak tersangka, pembelaan, praperadilan.",
    tag: ["KUHP Baru", "KUHAP", "Praperadilan", "Pembelaan"],
    warna: "from-red-500/20 to-red-500/5 border-red-500/20",
    warnaText: "text-red-400",
    warnaBadge: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    key: "pidana_khusus",
    emoji: "🔍",
    nama: "Pakar Pidana Khusus",
    badge: "KPK & TPPU",
    deskripsi: "Tipikor, TPPU, narkotika, kejahatan siber, dan pidana ekonomi.",
    tag: ["Tipikor", "TPPU", "Narkotika", "Pidana Siber"],
    warna: "from-orange-500/20 to-orange-500/5 border-orange-500/20",
    warnaText: "text-orange-400",
    warnaBadge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  {
    key: "perdata",
    emoji: "📜",
    nama: "Pakar Hukum Perdata",
    badge: "KUHPerdata",
    deskripsi: "Sengketa kontrak, wanprestasi, PMH, dan litigasi perdata.",
    tag: ["KUHPerdata", "Kontrak", "Wanprestasi", "Gugatan"],
    warna: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
    warnaText: "text-blue-400",
    warnaBadge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    key: "tatanegara",
    emoji: "🏛️",
    nama: "Pakar Hukum Tata Negara",
    badge: "Konstitusi & MK",
    deskripsi: "UUD 1945, Mahkamah Konstitusi, hak konstitusional, dan judicial review.",
    tag: ["UUD 1945", "MK", "Pemilu", "Judicial Review"],
    warna: "from-purple-500/20 to-purple-500/5 border-purple-500/20",
    warnaText: "text-purple-400",
    warnaBadge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    key: "administrasi",
    emoji: "📋",
    nama: "Pakar Hukum Administrasi",
    badge: "PTUN & Perizinan",
    deskripsi: "PTUN, keputusan TUN, OSS & NIB, perizinan usaha, dan kebijakan publik.",
    tag: ["PTUN", "Perizinan", "OSS", "Sengketa TUN"],
    warna: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
    warnaText: "text-cyan-400",
    warnaBadge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    key: "keluarga_waris",
    emoji: "👨‍👩‍👧",
    nama: "Pakar Hukum Keluarga & Waris",
    badge: "UU Perkawinan",
    deskripsi: "Perceraian, hak asuh anak, waris perdata & Islam, perjanjian pranikah.",
    tag: ["Perceraian", "Waris Islam", "Hak Asuh", "Pranikah"],
    warna: "from-pink-500/20 to-pink-500/5 border-pink-500/20",
    warnaText: "text-pink-400",
    warnaBadge: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  {
    key: "agraria",
    emoji: "🌾",
    nama: "Pakar Hukum Agraria",
    badge: "UUPA & BPN",
    deskripsi: "UUPA, sertifikasi tanah, sengketa agraria, HGU/HGB, dan reforma agraria.",
    tag: ["UUPA", "Sengketa Tanah", "SHM/HGB", "BPN/ATR"],
    warna: "from-green-500/20 to-green-500/5 border-green-500/20",
    warnaText: "text-green-400",
    warnaBadge: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  {
    key: "siber_pdp",
    emoji: "💻",
    nama: "Pakar Hukum Siber & PDP",
    badge: "UU ITE & PDP",
    deskripsi: "UU ITE, UU Perlindungan Data Pribadi 2024, kejahatan digital, e-commerce.",
    tag: ["UU ITE", "UU PDP", "Defamasi Digital", "E-Commerce"],
    warna: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20",
    warnaText: "text-indigo-400",
    warnaBadge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  {
    key: "lingkungan",
    emoji: "🌿",
    nama: "Pakar Hukum Lingkungan",
    badge: "UUPLH & AMDAL",
    deskripsi: "UUPLH, Omnibus Law lingkungan, AMDAL, izin lingkungan, dan sanksi pidana.",
    tag: ["UUPLH", "AMDAL", "Izin Lingkungan", "Omnibus Law"],
    warna: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    warnaText: "text-emerald-400",
    warnaBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    key: "persaingan_usaha",
    emoji: "🏆",
    nama: "Pakar Persaingan Usaha",
    badge: "KPPU & Anti Monopoli",
    deskripsi: "UU Anti Monopoli, KPPU, kartel, merger notifikasi, dominasi pasar.",
    tag: ["Anti Monopoli", "KPPU", "Kartel", "Merger"],
    warna: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20",
    warnaText: "text-yellow-400",
    warnaBadge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  {
    key: "hki",
    emoji: "🎨",
    nama: "Pakar Hukum Kekayaan Intelektual",
    badge: "HKI & DJKI",
    deskripsi: "Merek, paten, hak cipta, desain industri, dan penegakan HKI.",
    tag: ["Merek", "Paten", "Hak Cipta", "Desain Industri"],
    warna: "from-violet-500/20 to-violet-500/5 border-violet-500/20",
    warnaText: "text-violet-400",
    warnaBadge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  {
    key: "internasional",
    emoji: "🌐",
    nama: "Pakar Hukum Internasional",
    badge: "Perjanjian & Arbitrase",
    deskripsi: "Hukum internasional publik & privat, arbitrase SIAC/ICC, ASEAN Law, ekstradisi.",
    tag: ["Perjanjian Int'l", "Arbitrase", "ASEAN", "Ekstradisi"],
    warna: "from-sky-500/20 to-sky-500/5 border-sky-500/20",
    warnaText: "text-sky-400",
    warnaBadge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
];

export default function Pengacara() {
  const [tab, setTab] = useState<"pakar" | "direktori">("pakar");
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <Scale className="w-3 h-3" /> Konsultasi Hukum Indonesia
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Pakar Hukum <span className="text-gradient">& Pengacara</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Konsultasikan masalah hukum Anda dengan AI pakar bidang hukum Indonesia atau temukan pengacara terverifikasi di seluruh nusantara.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
            <button
              onClick={() => setTab("pakar")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === "pakar"
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bot className="w-4 h-4" />
              Pakar AI Hukum
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === "pakar" ? "bg-white/20" : "bg-white/10"}`}>
                {PAKAR_AI.length}
              </span>
            </button>
            <button
              onClick={() => setTab("direktori")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === "direktori"
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4" />
              Direktori Pengacara
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === "direktori" ? "bg-white/20" : "bg-white/10"}`}>
                {dataPengacara.length}
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {tab === "pakar" ? (
              <motion.div
                key="pakar"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* KUHAP notice */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="font-semibold text-primary">KUHP Baru berlaku 2 Januari 2026.</span>
                    <span className="text-muted-foreground ml-1">
                      Seluruh pakar AI kami telah diperbarui dengan UU No. 1/2023 tentang KUHP, UU PDP 2024, dan regulasi hukum Indonesia terkini.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PAKAR_AI.map((pakar, i) => (
                    <motion.div
                      key={pakar.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link href={`/agents/${pakar.key}`}>
                        <div className={`group glass-card rounded-2xl border bg-gradient-to-br ${pakar.warna} p-5 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="text-3xl">{pakar.emoji}</div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pakar.warnaBadge}`}>
                              {pakar.badge}
                            </span>
                          </div>

                          <h3 className={`font-semibold text-sm mb-1.5 group-hover:${pakar.warnaText} transition-colors`}>
                            {pakar.nama}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3">
                            {pakar.deskripsi}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {pakar.tag.map(t => (
                              <span key={t} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10">
                                {t}
                              </span>
                            ))}
                          </div>

                          <div className={`flex items-center gap-1.5 text-xs font-semibold ${pakar.warnaText} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            <Bot className="w-3 h-3" /> Konsultasi Sekarang <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="direktori"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* Search + Filters */}
                <div className="flex gap-3 flex-wrap mb-4">
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

                          <div className="flex flex-wrap gap-1 mb-3">
                            {p.spesialisasi.map(s => (
                              <span key={s} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                {s}
                              </span>
                            ))}
                          </div>

                          <div className="space-y-1 text-xs text-muted-foreground flex-1">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 flex-shrink-0" /> {p.kota}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="w-3 h-3 flex-shrink-0" /> {p.pengalaman_tahun} tahun pengalaman
                            </div>
                          </div>

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
              </motion.div>
            )}
          </AnimatePresence>
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
