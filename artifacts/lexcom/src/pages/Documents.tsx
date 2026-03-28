import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@workspace/replit-auth-web";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Save, Copy, Trash2, Loader2, Sparkles, Wand2, FileCode2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface LegalDocument {
  id: number;
  title: string;
  documentType: string;
  content: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

const DOC_TYPES = [
  { value: "gugatan", label: "Surat Gugatan" },
  { value: "jawaban", label: "Surat Jawaban" },
  { value: "replik", label: "Replik" },
  { value: "duplik", label: "Duplik" },
  { value: "surat_kuasa", label: "Surat Kuasa" },
  { value: "kontrak", label: "Kontrak/Perjanjian" },
];

function fetchDocuments(): Promise<LegalDocument[]> {
  return fetch("/api/documents", { credentials: "include" }).then((res) => res.json() as Promise<LegalDocument[]>);
}

export default function Documents() {
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    documentType: "gugatan",
    description: "",
    parties: "",
    details: "",
  });
  
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: documents, isLoading: isLoadingDocs } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
    enabled: isAuthenticated,
  });

  const saveMutation = useMutation({
    mutationFn: (data: { title: string; content: string; documentType: string }) =>
      fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error("Gagal menyimpan dokumen");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Sukses", description: "Dokumen berhasil disimpan ke database" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menyimpan dokumen", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/documents/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error("Gagal menghapus dokumen");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Sukses", description: "Dokumen berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menghapus dokumen", variant: "destructive" });
    }
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast({ title: "Error", description: "Deskripsi kasus tidak boleh kosong", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      if (!res.ok) throw new Error("Gagal membuat dokumen");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                setGeneratedContent(prev => prev + data.content);
              }
              if (data.done) {
                setIsGenerating(false);
              }
            } catch (e) {
              // Ignore parse error
            }
          }
        }
      }
    } catch (err) {
      toast({ title: "Error", description: "Gagal membuat dokumen", variant: "destructive" });
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({ title: "Disalin!", description: "Teks dokumen telah disalin ke clipboard" });
  };

  const handleSave = () => {
    if (!generatedContent) return;
    const title = `${DOC_TYPES.find(t => t.value === formData.documentType)?.label || 'Dokumen'} - ${new Date().toLocaleDateString('id-ID')}`;
    saveMutation.mutate({
      title,
      content: generatedContent,
      documentType: formData.documentType,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background pt-36">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
          <FileCode2 className="w-20 h-20 text-muted-foreground mb-6 opacity-20" />
          <h2 className="text-3xl font-display font-bold mb-4">Generator Dokumen Hukum</h2>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            Masuk untuk menggunakan AI dalam menyusun draft awal dokumen hukum, dari surat kuasa hingga gugatan secara otomatis.
          </p>
          <Button onClick={login} size="lg" className="rounded-full shadow-lg">
            Masuk Sekarang
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pt-36">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <FileCode2 className="w-8 h-8 text-primary" />
            Generator Dokumen Hukum
          </h1>
          <p className="text-muted-foreground mt-1">Gunakan AI untuk menyusun draft dokumen hukum secara instan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Panel: Form */}
          <div className="glass-card rounded-2xl border border-white/10 p-6 shadow-xl">
            <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-accent" />
              Parameter Dokumen
            </h2>
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="space-y-2">
                <Label>Jenis Dokumen</Label>
                <Select value={formData.documentType} onValueChange={(val) => setFormData({ ...formData, documentType: val })}>
                  <SelectTrigger className="bg-background/50 h-12">
                    <SelectValue placeholder="Pilih jenis dokumen" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Deskripsi Kasus / Konteks <span className="text-destructive">*</span></Label>
                <Textarea 
                  placeholder="Jelaskan secara detail mengenai pokok perkara, tuntutan, atau isi perjanjian yang diinginkan..."
                  className="bg-background/50 min-h-[120px] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Identitas Pihak (Opsional)</Label>
                <Textarea 
                  placeholder="Nama, alamat, pekerjaan dari Penggugat/Tergugat atau Para Pihak"
                  className="bg-background/50 min-h-[80px] resize-none"
                  value={formData.parties}
                  onChange={(e) => setFormData({ ...formData, parties: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Detail Tambahan (Opsional)</Label>
                <Input 
                  placeholder="Tuntutan spesifik, dasar hukum spesifik, nominal, dll."
                  className="bg-background/50"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold shadow-lg gap-2 mt-4"
                disabled={isGenerating || !formData.description.trim()}
              >
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Menyusun Draft...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Generate Dokumen</>
                )}
              </Button>
            </form>
          </div>

          {/* Right Panel: Preview */}
          <div className="glass-card rounded-2xl border border-white/10 flex flex-col shadow-xl overflow-hidden min-h-[600px]">
            <div className="p-4 border-b border-white/10 bg-card/50 flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                Preview Dokumen
              </h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy} 
                  disabled={!generatedContent}
                  className="bg-background/50"
                >
                  <Copy size={14} className="mr-1.5" /> Salin
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave} 
                  disabled={!generatedContent || saveMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                >
                  {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save size={14} className="mr-1.5" />} 
                  Simpan
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-9 w-9 hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setGeneratedContent("")}
                  disabled={!generatedContent && !isGenerating}
                  title="Kosongkan"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 bg-background/30 p-6 relative">
              {!generatedContent && !isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <FileText className="w-16 h-16 mb-4 stroke-1" />
                  <p className="text-center max-w-xs">Isi form di samping dan klik Generate untuk menyusun dokumen otomatis</p>
                </div>
              ) : (
                <ScrollArea className="h-full w-full rounded-md border border-white/5 bg-background p-6 shadow-inner font-serif text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {generatedContent}
                  {isGenerating && (
                    <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse align-middle"></span>
                  )}
                </ScrollArea>
              )}
            </div>
          </div>
        </div>

        {/* Saved Documents Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">Dokumen Tersimpan</h2>
          </div>
          
          {isLoadingDocs ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !documents || documents.length === 0 ? (
            <div className="text-center p-12 glass-card rounded-xl border-dashed border-2 border-white/10 text-muted-foreground">
              Belum ada dokumen yang disimpan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {documents.map((doc: LegalDocument, i: number) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={doc.id}
                  >
                    <Card className="glass-card border-white/5 hover:border-primary/30 transition-all flex flex-col h-full group">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-4">
                          <CardTitle className="text-base leading-tight line-clamp-2" title={doc.title}>{doc.title}</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteMutation.mutate(doc.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded-md bg-secondary/20 text-xs font-medium text-secondary-foreground inline-block">
                            {DOC_TYPES.find(t => t.value === doc.documentType)?.label || doc.documentType}
                          </span>
                          <span className="text-xs">
                            {new Date(doc.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2 text-sm text-muted-foreground line-clamp-3">
                        {doc.content.substring(0, 150)}...
                      </CardContent>
                      <div className="mt-auto p-4 pt-0 border-t border-white/5 bg-background/20 rounded-b-xl flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs h-8"
                          onClick={() => {
                            setGeneratedContent(doc.content);
                            setFormData(prev => ({ ...prev, documentType: doc.documentType }));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          Lihat Penuh
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
