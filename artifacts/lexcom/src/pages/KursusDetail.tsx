import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BookOpen, User, Play } from "lucide-react";
import { dataKursus } from "@/data/kursus";

const LEVEL_COLORS: Record<string, string> = {
  Pemula: "bg-green-500/20 text-green-400 border-green-500/30",
  Menengah: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Lanjut: "bg-red-500/20 text-red-400 border-red-500/30",
};

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/kursus">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Kursus
            </button>
          </Link>

          {/* Header */}
          <div className="glass-card rounded-2xl border border-white/15 p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[kursus.level]}`}>
                {kursus.level}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-3">{kursus.judul}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{kursus.deskripsi}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-5 pt-4 border-t border-white/10">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {kursus.durasi}</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {kursus.jumlahModul} modul</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {kursus.instruktur}</span>
            </div>

            <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{kursus.instruktur}</p>
                <p className="text-xs text-muted-foreground">{kursus.jabatanInstruktur}</p>
              </div>
            </div>
          </div>

          {/* Curriculum */}
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <h2 className="font-display text-lg font-bold mb-4">Kurikulum Kursus</h2>
            <div className="space-y-2">
              {kursus.materi.map((m, i) => (
                <div
                  key={m.modul}
                  className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/15 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
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
