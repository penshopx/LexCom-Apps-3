import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BookOpen, Play, Star, Users, Award, CheckCircle } from "lucide-react";
import { dataKursus } from "@/data/kursus";

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
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </span>
  );
}

function formatPeserta(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}rb`;
  return String(n);
}

export default function KursusDetail() {
  const params = useParams<{ id: string }>();
  const kursus = dataKursus.find(k => k.id === params.id);

  if (!kursus) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-16 px-4 text-center">
          <p className="text-muted-foreground">Kursus tidak ditemukan.</p>
          <Link href="/kursus"><Button className="mt-4">Kembali ke Kursus</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const avatarStyle = getAvatarStyle(kursus.instruktur);
  const initials = getInitials(kursus.instruktur);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-36 pb-16 px-4">

        {/* Hero Thumbnail */}
        <div
          className="w-full h-52 md:h-64 flex items-center justify-center relative overflow-hidden mb-0"
          style={{ background: `linear-gradient(135deg, ${kursus.gradientFrom}, ${kursus.gradientTo})` }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
          />
          <div className="text-center z-10">
            <div className="text-7xl mb-3 drop-shadow-2xl">{kursus.topikEmoji}</div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border bg-black/30 backdrop-blur-sm ${LEVEL_COLORS[kursus.level]}`}>
              {kursus.level}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="max-w-3xl mx-auto">
          <Link href="/kursus">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 mt-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Kursus
            </button>
          </Link>

          {/* Title + Stats */}
          <div className="glass-card rounded-2xl border border-white/15 p-6 mb-5">
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-3 leading-tight">{kursus.judul}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{kursus.deskripsi}</p>

            {/* Rating row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-400">{kursus.rating.toFixed(1)}</span>
                <StarRating rating={kursus.rating} />
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" /> {formatPeserta(kursus.peserta)} peserta
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> {kursus.durasi}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" /> {kursus.jumlahModul} modul
              </span>
            </div>

            {/* Instructor card */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-base font-bold shadow-lg"
                style={{ background: avatarStyle.background, color: avatarStyle.color }}
              >
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-sm">{kursus.instruktur}</p>
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-xs text-muted-foreground">{kursus.jabatanInstruktur}</p>
                <p className="text-[10px] text-primary/80 mt-1">Instruktur Terverifikasi LexCom</p>
              </div>
            </div>

            {/* What you'll learn */}
            <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 mb-5">
              <h3 className="text-sm font-semibold mb-3 text-primary">Yang akan Anda pelajari:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {kursus.materi.slice(0, 6).map(m => (
                  <div key={m.modul} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{m.judul}</span>
                  </div>
                ))}
                {kursus.materi.length > 6 && (
                  <p className="text-xs text-muted-foreground/60 col-span-2">
                    + {kursus.materi.length - 6} modul lainnya
                  </p>
                )}
              </div>
            </div>

            {/* CTA */}
            <Button className="w-full rounded-xl h-11 text-sm font-semibold bg-primary hover:bg-primary/90">
              Mulai Belajar Gratis
            </Button>
            <p className="text-center text-[10px] text-muted-foreground mt-2">
              Akses penuh · Tanpa biaya · Sertifikat tersedia
            </p>
          </div>

          {/* Curriculum */}
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <h2 className="font-display text-lg font-bold mb-1">Kurikulum Kursus</h2>
            <p className="text-xs text-muted-foreground mb-4">{kursus.jumlahModul} modul · {kursus.durasi} total</p>
            <div className="space-y-2">
              {kursus.materi.map((m) => (
                <div
                  key={m.modul}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <span className="text-[10px] font-bold text-primary">{m.modul}</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <Play className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">{m.judul}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{m.durasi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
