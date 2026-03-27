import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ComingSoonProps {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
}

export function ComingSoonPage({ emoji, title, subtitle, description, features }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-7xl mb-6">{emoji}</div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              Segera Hadir
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">{title}</h1>
            <p className="text-primary font-medium text-lg mb-4">{subtitle}</p>
            <p className="text-muted-foreground text-base mb-10 max-w-xl mx-auto leading-relaxed">{description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-left max-w-lg mx-auto">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 glass-card rounded-xl p-3 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="outline" className="rounded-full px-6">
                  Kembali ke Beranda
                </Button>
              </Link>
              <Link href="/agentic-chatbots">
                <Button className="rounded-full px-6">
                  Coba AI Chat Sekarang
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function Layanan() {
  return <ComingSoonPage
    emoji="⚙️"
    title="Layanan LexCom"
    subtitle="Solusi Hukum Terpadu untuk Semua Kebutuhan"
    description="Kami menyediakan layanan hukum komprehensif mulai dari konsultasi AI, pembuatan dokumen, manajemen perkara, hingga koneksi dengan pengacara terpercaya."
    features={["Konsultasi AI 24/7", "Generator Dokumen Hukum", "Manajemen Perkara", "Direktori Pengacara", "Database Peraturan", "Kursus Hukum Online"]}
  />;
}

export function Peraturan() {
  return <ComingSoonPage
    emoji="📜"
    title="Database Peraturan"
    subtitle="Ribuan Peraturan Perundang-undangan Indonesia"
    description="Akses mudah ke UU, PP, Perpres, Permen, Perda, dan seluruh regulasi hukum Indonesia yang terupdate secara real-time dengan fitur pencarian canggih."
    features={["Undang-Undang & PP", "Peraturan Menteri", "Peraturan Daerah", "Putusan MK & MA", "Pencarian Full-Text", "Update Real-time"]}
  />;
}

export function Kursus() {
  return <ComingSoonPage
    emoji="📚"
    title="Kursus Hukum Online"
    subtitle="Tingkatkan Pemahaman Hukum Anda"
    description="Pelajari hukum Indonesia dari para ahli melalui kursus video, modul interaktif, dan sertifikasi yang diakui. Tersedia untuk masyarakat umum maupun praktisi hukum."
    features={["Kursus Video HD", "Modul Interaktif", "Sertifikasi Resmi", "Instruktur Berpengalaman", "Forum Diskusi Kelas", "Akses Seumur Hidup"]}
  />;
}

export function Forum() {
  return <ComingSoonPage
    emoji="💬"
    title="Forum Diskusi Hukum"
    subtitle="Komunitas Tanya Jawab Hukum Terbesar"
    description="Diskusikan masalah hukum Anda dengan komunitas, ajukan pertanyaan kepada praktisi hukum, dan bagikan pengetahuan untuk membantu sesama."
    features={["Tanya Jawab Publik", "Diskusi Kelompok", "Jawaban dari Ahli", "Voting & Reputasi", "Kategori Spesialis", "Notifikasi Real-time"]}
  />;
}

export function Putusan() {
  return <ComingSoonPage
    emoji="⚖️"
    title="Database Putusan"
    subtitle="Arsip Putusan Pengadilan Indonesia"
    description="Akses ribuan putusan Mahkamah Agung, Mahkamah Konstitusi, Pengadilan Negeri, dan Pengadilan Agama untuk referensi hukum yang kuat."
    features={["Putusan MA & MK", "Putusan Pengadilan Negeri", "Putusan Pengadilan Agama", "Pencarian by Nomor", "Filter by Tahun & Jenis", "Analisis AI Putusan"]}
  />;
}

export function Pengacara() {
  return <ComingSoonPage
    emoji="👨‍⚖️"
    title="Direktori Pengacara"
    subtitle="Temukan Pengacara Terpercaya di Seluruh Indonesia"
    description="Hubungkan diri Anda dengan pengacara berpengalaman dan terverifikasi di seluruh Indonesia. Filter berdasarkan spesialisasi, lokasi, dan rating."
    features={["Profil Terverifikasi", "Filter Spesialisasi", "Rating & Ulasan", "Konsultasi Online", "Jadwal Pertemuan", "Estimasi Biaya"]}
  />;
}

export function Panduan() {
  return <ComingSoonPage
    emoji="📖"
    title="Panduan Hukum"
    subtitle="Panduan Praktis Hukum Indonesia"
    description="Kumpulan panduan hukum praktis yang ditulis dalam Bahasa Indonesia yang mudah dipahami, mencakup berbagai situasi hukum sehari-hari."
    features={["Panduan Step-by-Step", "Contoh Kasus Nyata", "Template Dokumen", "Checklist Hukum", "Tips & Strategi", "Update Berkala"]}
  />;
}

export function Komunitas() {
  return <ComingSoonPage
    emoji="👥"
    title="Komunitas LexCom"
    subtitle="Bergabung dengan Ribuan Pengguna LexCom"
    description="Jadilah bagian dari komunitas hukum Indonesia yang aktif. Berbagi pengalaman, belajar bersama, dan saling mendukung dalam memahami hukum."
    features={["Grup Diskusi", "Event & Webinar", "Mentoring Program", "Newsletter Hukum", "Koneksi Profesional", "Program Loyalitas"]}
  />;
}
