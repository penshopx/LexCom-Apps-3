import { useState, useRef, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookMarked, Plus, Trash2, Sparkles, Loader2, Copy, Check,
  ChevronRight, ChevronDown, Download, GraduationCap, Scale,
  Briefcase, Users, BookOpen, Edit3, Eye
} from "lucide-react";

const EBOOK_TEMPLATES = [
  { key: "panduan",    emoji: "📖", label: "Panduan Hukum Praktis",   desc: "Buku panduan langkah-langkah prosedur hukum",       audience: "Masyarakat Umum" },
  { key: "modul",     emoji: "🎓", label: "Modul Pembelajaran",       desc: "Materi kuliah atau pelatihan hukum terstruktur",    audience: "Mahasiswa / Dosen" },
  { key: "buku_saku", emoji: "📋", label: "Buku Saku Hukum",          desc: "Referensi ringkas untuk praktisi hukum",            audience: "Advokat / Konsultan" },
  { key: "laporan",   emoji: "📊", label: "Laporan Riset",            desc: "Laporan penelitian atau kajian kebijakan hukum",    audience: "Akademisi / Peneliti" },
  { key: "peraturan", emoji: "📜", label: "Kompilasi Peraturan",      desc: "Kumpulan dan analisis peraturan terkait topik",     audience: "Praktisi / Instansi" },
  { key: "custom",    emoji: "✨", label: "Custom (Bebas)",            desc: "Desain struktur ebook sesuai kebutuhanmu",          audience: "Semua" },
];

const SUGGESTED_CHAPTERS: Record<string, string[]> = {
  panduan:    ["Pengantar & Dasar Hukum", "Persyaratan dan Dokumen", "Prosedur Langkah demi Langkah", "Hak dan Kewajiban Para Pihak", "Penyelesaian Sengketa", "FAQ dan Penutup"],
  modul:      ["Pendahuluan & Tujuan Pembelajaran", "Tinjauan Pustaka dan Teori", "Materi Inti Bab 1", "Materi Inti Bab 2", "Studi Kasus", "Evaluasi & Soal Latihan"],
  buku_saku:  ["Daftar Singkatan", "Ketentuan Umum", "Isu-isu Kunci", "Referensi Hukum Utama", "Checklist Praktis"],
  laporan:    ["Abstrak & Executive Summary", "Latar Belakang & Rumusan Masalah", "Metodologi Penelitian", "Temuan dan Analisis", "Kesimpulan & Rekomendasi", "Daftar Pustaka"],
  peraturan:  ["Pengantar Kompilasi", "Peraturan Tingkat UU", "Peraturan Turunan (PP/Perpres)", "Peraturan Teknis (Permen/Perda)", "Matriks Perbandingan", "Catatan Implementasi"],
  custom:     ["Bab 1", "Bab 2", "Bab 3"],
};

interface Chapter { id: string; title: string; content: string; generating: boolean; done: boolean; }

export default function EbookBuilder() {
  const [currentView, setCurrentView] = useState<"setup" | "build" | "preview">("setup");
  const [template, setTemplate] = useState("");
  const [ebookTitle, setEbookTitle] = useState("");
  const [ebookDesc, setEbookDesc] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const convIdRef = useRef<number | null>(null);

  const getConvId = useCallback(async () => {
    if (convIdRef.current) return convIdRef.current;
    const res = await fetch("/api/assistant/conversations", {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
    });
    const d = await res.json();
    convIdRef.current = d.id;
    return d.id as number;
  }, []);

  const loadTemplate = (key: string) => {
    setTemplate(key);
    const titles = SUGGESTED_CHAPTERS[key] || ["Bab 1"];
    setChapters(titles.map((t, i) => ({ id: `ch-${i}-${Date.now()}`, title: t, content: "", generating: false, done: false })));
  };

  const addChapter = () => {
    setChapters(prev => [...prev, { id: `ch-new-${Date.now()}`, title: `Bab ${prev.length + 1}`, content: "", generating: false, done: false }]);
  };

  const removeChapter = (id: string) => setChapters(prev => prev.filter(c => c.id !== id));
  const updateTitle = (id: string, title: string) => setChapters(prev => prev.map(c => c.id === id ? { ...c, title } : c));

  const generateChapter = useCallback(async (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter || chapter.generating) return;

    setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, generating: true, content: "" } : c));
    setExpandedChapter(chapterId);

    try {
      const convId = await getConvId();
      const selectedTemplate = EBOOK_TEMPLATES.find(t => t.key === template);
      const allChapterTitles = chapters.map(c => c.title).join(", ");

      const prompt = `Anda adalah penulis konten hukum profesional. Tulis konten untuk satu bab ebook hukum berikut ini.

INFORMASI EBOOK:
- Judul Ebook: ${ebookTitle}
- Deskripsi: ${ebookDesc}
- Tipe: ${selectedTemplate?.label}
- Target Pembaca: ${targetAudience || selectedTemplate?.audience}
- Struktur Bab: ${allChapterTitles}

BAB YANG HARUS DITULIS:
Judul Bab: "${chapter.title}"

INSTRUKSI:
- Tulis konten bab ini secara lengkap dan mendalam (~600-800 kata)
- Gunakan Bahasa Indonesia yang baik
- Sertakan referensi hukum yang relevan (UU, PP, putusan MA/MK)
- Gunakan sub-heading untuk struktur yang jelas
- Sesuaikan gaya dengan target pembaca
- Pastikan konsisten dengan judul bab lainnya dalam ebook ini`;

      const res = await fetch(`/api/assistant/conversations/${convId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: prompt }),
      });

      if (!res.body) throw new Error();
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          const t = line.startsWith("data: ") ? line.slice(6).trim() : line.trim();
          if (!t || t === "[DONE]") continue;
          try {
            const ev = JSON.parse(t);
            if (ev.type === "content" && ev.content) {
              setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, content: c.content + ev.content } : c));
            }
          } catch {}
        }
      }
      setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, generating: false, done: true } : c));
    } catch {
      setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, generating: false } : c));
    }
  }, [chapters, template, ebookTitle, ebookDesc, targetAudience, getConvId]);

  const generateAll = async () => {
    if (isGeneratingAll) return;
    setIsGeneratingAll(true);
    for (const chapter of chapters) {
      if (!chapter.done) await generateChapter(chapter.id);
    }
    setIsGeneratingAll(false);
  };

  const copyChapter = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAll = () => {
    const full = `# ${ebookTitle}\n\n${ebookDesc}\n\n---\n\n` + chapters.map(c => `## ${c.title}\n\n${c.content}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(full);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const doneCount = chapters.filter(c => c.done).length;
  const selectedTemplate = EBOOK_TEMPLATES.find(t => t.key === template);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-36 pb-16">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <BookMarked className="w-4 h-4" /> Ebook Builder AI
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Buat Ebook Hukum <span className="text-gradient">dengan AI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pilih template, susun bab, dan biarkan AI mengisi konten setiap bab secara lengkap. Hasilkan panduan, modul, atau laporan hukum profesional dalam hitungan menit.
            </p>
          </div>

          {/* View switcher */}
          <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10 w-fit mx-auto mb-8">
            {[
              { key: "setup",   icon: BookMarked, label: "Setup" },
              { key: "build",   icon: Edit3,      label: "Bangun Bab" },
              { key: "preview", icon: Eye,         label: "Preview" },
            ].map(v => (
              <button key={v.key} onClick={() => setCurrentView(v.key as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${currentView === v.key ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                <v.icon className="w-4 h-4" /> {v.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* SETUP */}
            {currentView === "setup" && (
              <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="glass-card rounded-2xl p-6 mb-6">
                  <h3 className="text-sm font-bold mb-4">Informasi Ebook</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Judul Ebook <span className="text-red-400">*</span></label>
                      <input value={ebookTitle} onChange={e => setEbookTitle(e.target.value)} placeholder="Contoh: Panduan Lengkap PHK dan Pesangon 2025" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Target Pembaca</label>
                      <input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="Contoh: Karyawan dan HR perusahaan" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Deskripsi Singkat</label>
                    <textarea value={ebookDesc} onChange={e => setEbookDesc(e.target.value)} rows={2} placeholder="Jelaskan tujuan dan cakupan ebook ini..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground" />
                  </div>
                </div>

                <h3 className="text-sm font-bold mb-4">Pilih Template</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {EBOOK_TEMPLATES.map(t => (
                    <button key={t.key} onClick={() => loadTemplate(t.key)}
                      className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] ${template === t.key ? "bg-primary/20 border-primary/50 scale-[1.02]" : "glass-card border-white/10 hover:border-white/20"}`}>
                      <div className="text-2xl mb-2">{t.emoji}</div>
                      <p className="text-xs font-bold text-foreground mb-1">{t.label}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight mb-2">{t.desc}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground">{t.audience}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button onClick={() => template && ebookTitle && setCurrentView("build")} disabled={!template || !ebookTitle}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-all">
                    Susun Bab <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* BUILD */}
            {currentView === "build" && (
              <motion.div key="build" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-bold text-lg">{ebookTitle}</h2>
                    <p className="text-xs text-muted-foreground">{selectedTemplate?.label} · {chapters.length} bab · {doneCount} selesai</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addChapter} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors">
                      <Plus className="w-4 h-4" /> Tambah Bab
                    </button>
                    <button onClick={generateAll} disabled={isGeneratingAll || doneCount === chapters.length}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-all">
                      {isGeneratingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {isGeneratingAll ? `Mengisi... (${doneCount}/${chapters.length})` : "Generate Semua Bab"}
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                {(isGeneratingAll || doneCount > 0) && (
                  <div className="mb-5 glass-card rounded-xl p-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-foreground font-semibold">{doneCount}/{chapters.length} bab selesai</span>
                      <span className="text-muted-foreground">{Math.round((doneCount / chapters.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <motion.div className="bg-primary rounded-full h-1.5" animate={{ width: `${(doneCount / chapters.length) * 100}%` }} transition={{ duration: 0.3 }} />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {chapters.map((chapter, i) => (
                    <div key={chapter.id} className="glass-card rounded-2xl overflow-hidden border border-white/10">
                      <div className="flex items-center gap-3 p-4">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${chapter.done ? "bg-emerald-500/20 text-emerald-400" : chapter.generating ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"}`}>
                          {chapter.done ? "✓" : chapter.generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : i + 1}
                        </div>
                        <input
                          value={chapter.title}
                          onChange={e => updateTitle(chapter.id, e.target.value)}
                          className="flex-1 bg-transparent text-sm font-semibold text-foreground focus:outline-none"
                        />
                        <div className="flex items-center gap-1">
                          {chapter.done && (
                            <button onClick={() => copyChapter(chapter.content, chapter.id)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                              {copiedId === chapter.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                            </button>
                          )}
                          <button
                            onClick={() => expandedChapter === chapter.id ? setExpandedChapter(null) : (chapter.done ? setExpandedChapter(chapter.id) : generateChapter(chapter.id))}
                            disabled={chapter.generating}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${chapter.done ? "bg-white/5 text-muted-foreground hover:bg-white/10" : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"}`}
                          >
                            {chapter.generating ? "Mengisi..." : chapter.done ? (expandedChapter === chapter.id ? "Sembunyikan" : "Lihat Konten") : "Generate AI"}
                          </button>
                          <button onClick={() => removeChapter(chapter.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {(expandedChapter === chapter.id || chapter.generating) && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="border-t border-white/10">
                            <div className="p-4 prose prose-invert prose-sm max-w-none">
                              {chapter.content ? (
                                <MarkdownRenderer content={chapter.content} />
                              ) : (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                                  <Loader2 className="w-4 h-4 animate-spin" /> AI sedang menulis bab ini...
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {doneCount > 0 && (
                  <div className="flex justify-center mt-6 gap-3">
                    <button onClick={copyAll} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-colors">
                      {copiedId === "all" ? <><Check className="w-4 h-4 text-emerald-400" /> Disalin!</> : <><Copy className="w-4 h-4" /> Salin Semua Konten</>}
                    </button>
                    <button onClick={() => setCurrentView("preview")} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold hover:opacity-90 transition-all">
                      <Eye className="w-4 h-4" /> Preview Ebook
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* PREVIEW */}
            {currentView === "preview" && (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
                  {/* Cover */}
                  <div className="bg-gradient-to-br from-primary/30 to-secondary/20 p-10 text-center border-b border-white/10">
                    <div className="text-4xl mb-4">{selectedTemplate?.emoji}</div>
                    <h1 className="text-2xl font-display font-bold text-foreground mb-2">{ebookTitle || "Judul Ebook"}</h1>
                    {ebookDesc && <p className="text-sm text-muted-foreground max-w-md mx-auto mb-3">{ebookDesc}</p>}
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">{selectedTemplate?.label}</span>
                  </div>

                  {/* Table of Contents */}
                  <div className="p-6 border-b border-white/10">
                    <h2 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-widest">Daftar Isi</h2>
                    <div className="space-y-1">
                      {chapters.map((ch, i) => (
                        <div key={ch.id} className="flex items-center gap-3 text-sm py-1.5">
                          <span className="w-6 text-muted-foreground text-right">{i + 1}.</span>
                          <span className={ch.done ? "text-foreground" : "text-muted-foreground/50"}>{ch.title}</span>
                          {ch.done && <span className="ml-auto text-[10px] text-emerald-400">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-8 max-h-[600px] overflow-y-auto">
                    {chapters.filter(c => c.done).map((ch, i) => (
                      <div key={ch.id}>
                        <h2 className="text-lg font-display font-bold text-foreground mb-4 pb-2 border-b border-white/10">
                          <span className="text-muted-foreground text-sm mr-2">Bab {chapters.indexOf(ch) + 1}.</span>
                          {ch.title}
                        </h2>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <MarkdownRenderer content={ch.content} />
                        </div>
                      </div>
                    ))}
                    {doneCount === 0 && (
                      <div className="text-center py-10 text-muted-foreground">
                        <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p>Belum ada bab yang selesai dihasilkan.</p>
                        <button onClick={() => setCurrentView("build")} className="text-primary text-sm hover:underline mt-2">
                          → Kembali ke Builder
                        </button>
                      </div>
                    )}
                  </div>

                  {doneCount > 0 && (
                    <div className="p-4 border-t border-white/10 flex justify-end">
                      <button onClick={copyAll} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all">
                        {copiedId === "all" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        Ekspor Seluruh Konten
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
