import { Link } from "wouter";
import { motion } from "framer-motion";

const ROW_AI = [
  { emoji: "✨", name: "Chaesa Lexbot",        href: "/lexbot" },
  { emoji: "🤖", name: "Agentic AI",          href: "/agentic-chatbots" },
  { emoji: "⚖️", name: "Pakar Hukum AI",      href: "/agents" },
  { emoji: "🧠", name: "Riset AI Hub",        href: "/riset-ai" },
  { emoji: "📊", name: "Intelijen Regulasi",  href: "/intelijen-regulasi" },
  { emoji: "✍️", name: "Penulis Cerdas",      href: "/penulis-cerdas" },
  { emoji: "🤖", name: "Chatbot Builder",     href: "/chatbot-builder" },
  { emoji: "📚", name: "Ebook Builder",       href: "/ebook-builder" },
  { emoji: "🔬", name: "Telaah Dokumen",      href: "/telaah-dokumen" },
  { emoji: "🗺️", name: "Peta Preseden",       href: "/peta-preseden" },
];

const ROW_DB = [
  { emoji: "📜", name: "Peraturan",   href: "/peraturan" },
  { emoji: "🏛️", name: "Putusan",    href: "/putusan" },
  { emoji: "📖", name: "Panduan",    href: "/panduan" },
  { emoji: "📕", name: "Glosarium",  href: "/glosarium" },
  { emoji: "🧮", name: "Kalkulator", href: "/kalkulator" },
  { emoji: "📄", name: "Dokumen AI", href: "/documents" },
  { emoji: "📁", name: "Kasus",      href: "/cases" },
  { emoji: "📚", name: "Kursus",     href: "/kursus" },
  { emoji: "👨‍⚖️", name: "Pengacara", href: "/pengacara" },
  { emoji: "💬", name: "Forum",      href: "/forum" },
];

function NavLink({ emoji, name, href }: { emoji: string; name: string; href: string }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -2, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl border border-white/8 bg-white/4 hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer group flex-shrink-0 min-w-[72px]"
      >
        <span className="text-xl leading-none group-hover:scale-110 transition-transform">{emoji}</span>
        <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap leading-tight text-center">{name}</span>
      </motion.div>
    </Link>
  );
}

export function QuickNavBar() {
  return (
    <section className="py-6 border-y border-white/8 bg-gradient-to-b from-background to-card/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] px-3">
            Akses Cepat Semua Fitur
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        {/* Baris 1 — AI Tools */}
        <div className="flex items-center justify-center flex-wrap gap-2 pb-1 mb-2">
          {ROW_AI.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        {/* Baris 2 — Database & Resources */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-1">
          {ROW_DB.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
