import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Sparkles, Bot, Database, Calculator, GraduationCap, Users, Building2,
  Scale, FileText, BookOpen, MessageSquare, Globe, ExternalLink,
  Hash, Gavel, BookMarked, Receipt, User2, Briefcase, PenLine, Code2,
  BarChart3, Search, Microscope, FolderOpen
} from "lucide-react";

const EKOSISTEM = [
  {
    kategori: "🤖 Konsultasi AI",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    titleColor: "text-violet-400",
    items: [
      { icon: Sparkles,     label: "Chaesa Lexbot",        desc: "Multi-agent orchestrator",         href: "/lexbot" },
      { icon: Bot,          label: "Agentic Chatbots",    desc: "19 agen berkolaborasi",            href: "/agentic-chatbots" },
      { icon: MessageSquare,label: "19 Pakar Hukum AI",  desc: "Spesialis bidang hukum",           href: "/agents" },
    ],
  },
  {
    kategori: "📚 Database Hukum",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20",
    titleColor: "text-blue-400",
    items: [
      { icon: Scale,        label: "Peraturan",           desc: "53 UU, PP, Perpres, Permen",       href: "/peraturan" },
      { icon: Gavel,        label: "Putusan",             desc: "30+ putusan MK, MA, PN, PA",       href: "/putusan" },
      { icon: BookOpen,     label: "Panduan",             desc: "30+ panduan prosedur hukum",       href: "/panduan" },
      { icon: Hash,         label: "Glosarium",           desc: "120+ istilah hukum Indonesia",     href: "/glosarium" },
    ],
  },
  {
    kategori: "🛠️ Alat Bantu & Legal Ops",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    titleColor: "text-emerald-400",
    items: [
      { icon: Calculator,   label: "Kalkulator Hukum",   desc: "6 kalkulator (pesangon, waris…)",  href: "/kalkulator" },
      { icon: FileText,     label: "Generator Dokumen",  desc: "Draf otomatis berbasis AI",         href: "/documents" },
      { icon: Microscope,   label: "Telaah Dokumen AI",  desc: "Review 5 agen paralel",             href: "/telaah-dokumen" },
      { icon: FolderOpen,   label: "Manajemen Kasus",    desc: "Kelola perkara & dokumen",          href: "/cases" },
      { icon: Briefcase,    label: "Legal Ops Suite",    desc: "6 modul corporate legal dashboard", href: "/legal-ops" },
      { icon: BookMarked,   label: "Vault Template",     desc: "1.500+ template dokumen hukum",     href: "/vault" },
    ],
  },
  {
    kategori: "🧠 Riset & Intelijen AI",
    color: "from-violet-500/20 to-indigo-500/10",
    border: "border-violet-500/20",
    titleColor: "text-violet-400",
    items: [
      { icon: Search,      label: "Riset AI Hub",          desc: "Ringkasan multi-agen & pencarian semantik", href: "/riset-ai" },
      { icon: Globe,       label: "Peta Preseden",         desc: "Visualisasi jaringan yurisprudensi",        href: "/peta-preseden" },
      { icon: BarChart3,   label: "Intelijen Regulasi",   desc: "Skor risiko kepatuhan bisnis & AI",         href: "/intelijen-regulasi" },
    ],
  },
  {
    kategori: "✍️ Studio AI",
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/20",
    titleColor: "text-pink-400",
    items: [
      { icon: PenLine,   label: "Studio Opini Hukum", desc: "Generate opini IRAC profesional",   href: "/studio-opini" },
      { icon: PenLine,   label: "Penulis Cerdas",     desc: "Artikel, laporan & skripsi AI",     href: "/penulis-cerdas" },
      { icon: Bot,       label: "Chatbot Builder",    desc: "Bangun chatbot hukum kustom",        href: "/chatbot-builder" },
      { icon: BookMarked,label: "Ebook Builder",      desc: "Modul, panduan & buku hukum AI",    href: "/ebook-builder" },
    ],
  },
  {
    kategori: "🏥 Klinik Hukum Spesialis",
    color: "from-red-500/20 to-rose-500/10",
    border: "border-red-500/20",
    titleColor: "text-red-400",
    items: [
      { icon: Scale,        label: "Klinik PHI",                desc: "PHI + Kalkulator Pesangon PP 35/2021",              href: "/klinik-phi" },
      { icon: Briefcase,    label: "Klinik PKPU & Pailit",      desc: "Kepailitan + Kalkulator Voting Kuorum",             href: "/klinik-pkpu" },
      { icon: Users,        label: "Klinik Perlindungan P&A",   desc: "UU PKDRT, UU PA, UU TPKS — checker hak korban",   href: "/klinik-perlindungan" },
    ],
  },
  {
    kategori: "🎓 Pendidikan & Profesi",
    color: "from-orange-500/20 to-amber-500/10",
    border: "border-orange-500/20",
    titleColor: "text-orange-400",
    items: [
      { icon: GraduationCap,label: "Kursus Online",       desc: "Kursus hukum bersertifikat",       href: "/kursus" },
      { icon: BookOpen,     label: "Akademi Advokat",     desc: "CPD, UPA prep, etika profesi",      href: "/akademi-advokat" },
      { icon: GraduationCap,label: "BimTek Profesi Hukum",desc: "6 jalur: Advokat, Notaris, PPAT…", href: "/bimtek" },
      { icon: BookOpen,     label: "Perpustakaan Hukum",  desc: "96+ e-book & AI Tanya Jawab",       href: "/perpustakaan" },
      { icon: BookMarked,   label: "Panduan Praktis",     desc: "Tutorial step-by-step hukum",       href: "/panduan" },
      { icon: Hash,         label: "Glosarium",           desc: "120+ istilah hukum Indonesia",      href: "/glosarium" },
    ],
  },
  {
    kategori: "👥 Jaringan",
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/20",
    titleColor: "text-pink-400",
    items: [
      { icon: User2,        label: "Direktori Pengacara", desc: "300+ advokat terverifikasi",      href: "/pengacara" },
      { icon: MessageSquare,label: "Forum Hukum",         desc: "Diskusi kasus & pertanyaan",      href: "/forum" },
      { icon: Users,        label: "Komunitas",           desc: "Jaringan praktisi & akademisi",   href: "/komunitas" },
    ],
  },
  {
    kategori: "🏛️ Sumber Resmi",
    color: "from-yellow-500/20 to-orange-500/10",
    border: "border-yellow-500/20",
    titleColor: "text-yellow-400",
    items: [
      { icon: Globe, label: "Direktori Putusan MA", desc: "putusan3.mahkamahagung.go.id", href: "https://putusan3.mahkamahagung.go.id/", external: true },
      { icon: Globe, label: "Putusan & Perkara MK", desc: "mkri.id",                      href: "https://www.mkri.id/perkara",            external: true },
      { icon: Globe, label: "Perkara KPK",          desc: "kpk.go.id",                    href: "https://kpk.go.id/id/publikasi-data/penanganan-perkara", external: true },
      { icon: Globe, label: "JDIH MA",              desc: "jdih.mahkamahagung.go.id",     href: "https://jdih.mahkamahagung.go.id/",      external: true },
    ],
  },
];

export function EkosistemSection() {
  return (
    <section id="ekosistem" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
            <Database className="w-4 h-4" /> Ekosistem Lengkap
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
            Seluruh Fitur dalam <span className="text-gradient">Satu Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            LexCom mengintegrasikan AI, database hukum, alat bantu, pendidikan, dan jaringan profesional — platform hukum digital terlengkap Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EKOSISTEM.map((kat, ki) => (
            <motion.div
              key={ki}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ki * 0.07 }}
              className={`rounded-2xl border bg-gradient-to-br p-5 ${kat.color} ${kat.border}`}
            >
              <h3 className={`font-bold text-sm mb-4 ${kat.titleColor}`}>{kat.kategori}</h3>
              <div className="space-y-2">
                {kat.items.map((item, ii) =>
                  item.external ? (
                    <a
                      key={ii}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors">
                        <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">{item.label}</p>
                          <ExternalLink className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">{item.desc}</p>
                      </div>
                    </a>
                  ) : (
                    <Link key={ii} href={item.href}>
                      <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors">
                          <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/layanan">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/25">
              <Sparkles className="w-4 h-4" /> Lihat Semua Layanan LexCom
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
