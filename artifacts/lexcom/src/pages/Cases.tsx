import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@workspace/replit-auth-web";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Calendar, Scale, Briefcase, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface LegalCase {
  id: number;
  title: string;
  description: string | null;
  caseType: string;
  status: string;
  hearingDate: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CaseFormData {
  title: string;
  caseType: string;
  status: string;
  hearingDate: string;
}

const CASE_TYPES = [
  { value: "Perdata", label: "Perdata" },
  { value: "Pidana", label: "Pidana" },
  { value: "TUN", label: "Tata Usaha Negara (TUN)" },
  { value: "Agama", label: "Agama" },
  { value: "Niaga", label: "Niaga" },
];

const STATUSES = [
  { value: "open", label: "Terbuka (Open)", color: "bg-blue-500/20 text-blue-400" },
  { value: "in_progress", label: "Sedang Berjalan", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "closed", label: "Selesai (Closed)", color: "bg-green-500/20 text-green-400" },
];

function fetchCases(): Promise<LegalCase[]> {
  return fetch("/api/cases", { credentials: "include" }).then((res) => res.json() as Promise<LegalCase[]>);
}

export default function Cases() {
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CaseFormData>({ title: "", caseType: "", status: "open", hearingDate: "" });

  const { data: cases, isLoading } = useQuery({
    queryKey: ["cases"],
    queryFn: fetchCases,
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: (newCase: CaseFormData) =>
      fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCase),
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error("Gagal membuat perkara");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      setIsCreateOpen(false);
      setFormData({ title: "", caseType: "", status: "open", hearingDate: "" });
      toast({ title: "Sukses", description: "Perkara berhasil ditambahkan" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal membuat perkara", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CaseFormData }) =>
      fetch(`/api/cases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error("Gagal mengupdate perkara");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      setIsEditOpen(false);
      setSelectedCase(null);
      toast({ title: "Sukses", description: "Perkara berhasil diupdate" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal mengupdate perkara", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/cases/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error("Gagal menghapus perkara");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      setIsDeleteOpen(false);
      setSelectedCase(null);
      toast({ title: "Sukses", description: "Perkara berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menghapus perkara", variant: "destructive" });
    }
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title: formData.title,
      caseType: formData.caseType,
      hearingDate: formData.hearingDate ? new Date(formData.hearingDate).toISOString() : null,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    updateMutation.mutate({
      id: selectedCase.id,
      data: {
        title: formData.title,
        caseType: formData.caseType,
        status: formData.status,
        hearingDate: formData.hearingDate ? new Date(formData.hearingDate).toISOString() : null,
      },
    });
  };

  const openEdit = (c: LegalCase) => {
    setSelectedCase(c);
    setFormData({
      title: c.title,
      caseType: c.caseType,
      status: c.status,
      hearingDate: c.hearingDate ? c.hearingDate.split('T')[0] : "",
    });
    setIsEditOpen(true);
  };

  const openDelete = (c: LegalCase) => {
    setSelectedCase(c);
    setIsDeleteOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background pt-24">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
          <Briefcase className="w-20 h-20 text-muted-foreground mb-6 opacity-20" />
          <h2 className="text-3xl font-display font-bold mb-4">Manajemen Perkara</h2>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            Silakan masuk untuk mengelola daftar perkara hukum Anda. Anda dapat melacak status, jadwal sidang, dan lainnya.
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
    <div className="min-h-screen flex flex-col bg-background pt-24">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-primary" />
              Manajemen Perkara
            </h1>
            <p className="text-muted-foreground mt-1">Kelola dan lacak status perkara hukum klien Anda</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-lg gap-2" onClick={() => setFormData({ title: "", caseType: "", status: "open", hearingDate: "" })}>
                <Plus size={18} /> Tambah Perkara
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-panel border-white/10">
              <DialogHeader>
                <DialogTitle className="font-display">Tambah Perkara Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Perkara</Label>
                  <Input 
                    id="title" 
                    placeholder="Contoh: Sengketa Tanah vs PT. Maju Jaya" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Perkara</Label>
                  <Select value={formData.caseType} onValueChange={(val) => setFormData({ ...formData, caseType: val })} required>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Pilih jenis perkara" />
                    </SelectTrigger>
                    <SelectContent>
                      {CASE_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal Sidang Selanjutnya (Opsional)</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={formData.hearingDate}
                    onChange={(e) => setFormData({ ...formData, hearingDate: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Batal</Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !cases || cases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-2xl border border-white/5">
            <Scale className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-xl font-bold mb-2">Belum ada perkara</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">Mulai kelola kasus Anda dengan menambahkan perkara hukum pertama Anda.</p>
            <Button variant="outline" className="rounded-full gap-2" onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} /> Tambah Perkara
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(cases ?? []).map((c: LegalCase, i: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={c.id}
              >
                <Card className="glass-card border-white/5 hover:border-primary/30 transition-all h-full flex flex-col group">
                  <CardHeader className="pb-3 flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-lg leading-tight line-clamp-2" title={c.title}>{c.title}</CardTitle>
                      <CardDescription className="mt-2 text-primary font-medium">{c.caseType}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4 flex-1 flex flex-col justify-end gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className={`${STATUSES.find(s => s.value === c.status)?.color || "bg-secondary text-secondary-foreground"} border-none`}>
                          {STATUSES.find(s => s.value === c.status)?.label || c.status}
                        </Badge>
                      </div>
                      {c.hearingDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1.5"><Calendar size={14} /> Sidang</span>
                          <span className="font-medium text-foreground">
                            {new Date(c.hearingDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" className="flex-1 gap-1.5 h-8" onClick={() => openEdit(c)}>
                        <Edit2 size={14} /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1 gap-1.5 h-8 bg-destructive/80 hover:bg-destructive text-destructive-foreground" onClick={() => openDelete(c)}>
                        <Trash2 size={14} /> Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px] glass-panel border-white/10">
            <DialogHeader>
              <DialogTitle className="font-display">Edit Perkara</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Judul Perkara</Label>
                <Input 
                  id="edit-title" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Jenis Perkara</Label>
                  <Select value={formData.caseType} onValueChange={(val) => setFormData({ ...formData, caseType: val })} required>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CASE_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })} required>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Tanggal Sidang Selanjutnya</Label>
                <Input 
                  id="edit-date" 
                  type="date"
                  value={formData.hearingDate}
                  onChange={(e) => setFormData({ ...formData, hearingDate: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[400px] glass-panel border-white/10">
            <DialogHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <DialogTitle className="text-center font-display text-xl">Hapus Perkara?</DialogTitle>
              <p className="text-center text-muted-foreground mt-2 text-sm">
                Apakah Anda yakin ingin menghapus perkara <span className="font-semibold text-foreground">"{selectedCase?.title}"</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </DialogHeader>
            <DialogFooter className="pt-6 sm:justify-center">
              <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => deleteMutation.mutate(selectedCase?.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Ya, Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </div>
  );
}
