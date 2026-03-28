import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User } from "lucide-react";
import { dataPanduan } from "@/data/panduan";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

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

export default function PanduanDetail() {
  const params = useParams<{ id: string }>();
  const panduan = dataPanduan.find(p => p.id === params.id);

  if (!panduan) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-16 px-4 text-center">
          <p className="text-muted-foreground">Panduan tidak ditemukan.</p>
          <Link href="/panduan"><Button className="mt-4">Kembali ke Panduan</Button></Link>
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
          <Link href="/panduan">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Panduan
            </button>
          </Link>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${KATEGORI_COLORS[panduan.kategori]}`}>
                {panduan.kategori}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-4">{panduan.judul}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{panduan.ringkasan}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-white/10">
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {panduan.penulis}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTanggal(panduan.tanggal)}</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-white/10 p-6 md:p-8">
            <MarkdownRenderer content={panduan.konten} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
