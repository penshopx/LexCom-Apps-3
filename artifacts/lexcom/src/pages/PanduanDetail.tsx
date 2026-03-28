import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User } from "lucide-react";
import { dataPanduan } from "@/data/panduan";

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

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-display font-bold mt-8 mb-4 text-foreground">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-base font-semibold mt-5 mb-2 text-primary">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="text-sm text-muted-foreground leading-relaxed ml-4 mb-1 list-disc">
          <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />
        </li>
      );
    } else if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={i} className="text-sm text-muted-foreground leading-relaxed ml-4 mb-1 list-decimal">
          <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\. /, "").replace(/\*\*(.+?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />
        </li>
      );
    } else if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 text-xs overflow-x-auto my-4 text-muted-foreground">
          {codeLines.join("\n")}
        </pre>
      );
    } else if (line.includes("|") && line.trim().startsWith("|")) {
      const rows: string[] = [line];
      i++;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim().startsWith("|")) {
        if (!lines[i].replace(/\|/g, "").replace(/-/g, "").trim()) {
          i++;
          continue;
        }
        rows.push(lines[i]);
        i++;
      }
      const headers = rows[0].split("|").filter(c => c.trim()).map(c => c.trim());
      const dataRows = rows.slice(1).map(r => r.split("|").filter(c => c.trim()).map(c => c.trim()));
      elements.push(
        <div key={i} className="overflow-x-auto my-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/20">
                {headers.map((h, hi) => (
                  <th key={hi} className="text-left py-2 px-3 font-semibold text-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri} className="border-b border-white/10">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2 px-3 text-muted-foreground">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.trim() !== "") {
      elements.push(
        <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3">
          <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong class='text-foreground'>$1</strong>").replace(/`(.+?)`/g, "<code class='bg-white/10 px-1.5 py-0.5 rounded text-xs text-primary'>$1</code>") }} />
        </p>
      );
    } else {
      elements.push(<div key={i} className="h-1" />);
    }

    i++;
  }

  return elements;
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
            {renderMarkdown(panduan.konten)}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
