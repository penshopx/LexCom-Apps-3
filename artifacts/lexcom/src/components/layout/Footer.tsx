import { Link } from "wouter";
import { Scale, Twitter, Linkedin, Github, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl">LexCom</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Platform LegalTech terdepan di Indonesia yang mengintegrasikan AI agentic dengan keahlian hukum praktis untuk semua kalangan.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Layanan</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Legal Agents</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Generator Dokumen</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Manajemen Perkara</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Database Hukum</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Komunitas</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Untuk Masyarakat</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Untuk Praktisi Hukum</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Forum Diskusi</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mentoring</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Perusahaan</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Karir</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privasi & Syarat</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Kontak</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 LexCom. Semua hak dilindungi.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Made with <span className="text-red-500">❤️</span> in Indonesia
          </div>
        </div>
      </div>
    </footer>
  );
}
