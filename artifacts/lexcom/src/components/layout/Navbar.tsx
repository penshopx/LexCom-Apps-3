import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Scale, Menu, X, LogIn, LogOut, Loader2, Sun, Moon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@workspace/replit-auth-web";
import { useTheme } from "@/contexts/ThemeContext";

const MENU_GROUPS = [
  {
    label: "Konsultasi AI",
    links: [
      { name: "✨ LexBot", href: "/lexbot", desc: "Multi-agent AI orchestrator" },
      { name: "🤖 Agentic AI", href: "/agentic-chatbots", desc: "19 agen berkolaborasi" },
      { name: "⚖️ Pakar Hukum AI", href: "/agents", desc: "19 spesialis hukum" },
    ],
  },
  {
    label: "Database Hukum",
    links: [
      { name: "📜 Peraturan", href: "/peraturan", desc: "53 UU, PP, Perpres, Permen" },
      { name: "🏛️ Putusan", href: "/putusan", desc: "30+ putusan MA, MK, PN, PA" },
      { name: "📖 Panduan", href: "/panduan", desc: "30+ panduan praktis" },
      { name: "📕 Glosarium", href: "/glosarium", desc: "120+ istilah hukum" },
    ],
  },
  {
    label: "Alat Bantu",
    links: [
      { name: "🧮 Kalkulator", href: "/kalkulator", desc: "Pesangon, waris, biaya perkara" },
      { name: "📄 Dokumen AI", href: "/documents", desc: "Generator dokumen otomatis" },
      { name: "🔬 Telaah Dokumen", href: "/telaah-dokumen", desc: "Review 5 agen AI secara paralel" },
      { name: "📁 Manajemen Kasus", href: "/cases", desc: "Kelola perkara & jadwal" },
    ],
  },
  {
    label: "Riset AI",
    links: [
      { name: "🧠 Riset AI Hub", href: "/riset-ai", desc: "Ringkasan multi-agen & pencarian semantik" },
      { name: "🕸️ Peta Preseden", href: "/peta-preseden", desc: "Jaringan yurisprudensi & putusan terkait" },
    ],
  },
  {
    label: "Pendidikan",
    links: [
      { name: "📚 Kursus", href: "/kursus", desc: "Kursus hukum bersertifikat" },
      { name: "📖 Panduan", href: "/panduan", desc: "Tutorial prosedur hukum" },
    ],
  },
  {
    label: "Komunitas",
    links: [
      { name: "👨‍⚖️ Pengacara", href: "/pengacara", desc: "Direktori pengacara terverifikasi" },
      { name: "💬 Forum", href: "/forum", desc: "Diskusi kasus hukum" },
      { name: "👥 Komunitas", href: "/komunitas", desc: "Jaringan praktisi hukum" },
    ],
  },
];

const secondaryLinks = [
  { name: "✨ LexBot", href: "/lexbot" },
  { name: "🤖 Agentic AI", href: "/agentic-chatbots" },
  { name: "⚖️ Pakar AI", href: "/agents" },
  { name: "·", href: "#", divider: true },
  { name: "📜 Peraturan", href: "/peraturan" },
  { name: "🏛️ Putusan", href: "/putusan" },
  { name: "📖 Panduan", href: "/panduan" },
  { name: "📕 Glosarium", href: "/glosarium" },
  { name: "·", href: "#", divider: true },
  { name: "🧮 Kalkulator", href: "/kalkulator" },
  { name: "📄 Dokumen", href: "/documents" },
  { name: "🔬 Telaah Dokumen", href: "/telaah-dokumen" },
  { name: "📁 Kasus", href: "/cases" },
  { name: "·", href: "#", divider: true },
  { name: "🧠 Riset AI", href: "/riset-ai" },
  { name: "🕸️ Peta Preseden", href: "/peta-preseden" },
  { name: "·", href: "#", divider: true },
  { name: "📚 Kursus", href: "/kursus" },
  { name: "👨‍⚖️ Pengacara", href: "/pengacara" },
  { name: "💬 Forum", href: "/forum" },
  { name: "👥 Komunitas", href: "/komunitas" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const primaryLinks = [
    { name: "Beranda", href: "/" },
    { name: "Agen AI", href: "/agents" },
    { name: "Layanan", href: "/layanan" },
    { name: "Peraturan", href: "/peraturan" },
    { name: "Forum", href: "/forum" },
  ];

  const allNavLinks = secondaryLinks.filter(l => !l.divider);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-panel" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1 */}
        <div className="flex justify-between items-center py-3 border-b border-border/30">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">LexCom</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            {primaryLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-all hover:text-foreground ${
                  isActive(link.href) ? "text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-all hover:text-foreground ${
                  megaMenuOpen ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Semua Fitur <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {megaMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMegaMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 z-50 glass-panel rounded-2xl border border-border/50 shadow-2xl p-5 w-[680px] max-w-[90vw]"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        {MENU_GROUPS.map((group) => (
                          <div key={group.label}>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">{group.label}</p>
                            <div className="space-y-0.5">
                              {group.links.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className={`flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group ${isActive(link.href) ? "bg-primary/10" : ""}`}
                                >
                                  <div>
                                    <p className={`text-xs font-semibold transition-colors ${isActive(link.href) ? "text-primary" : "text-foreground group-hover:text-primary"}`}>{link.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{link.desc}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">{user?.name || user?.email || "User"}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-muted text-foreground hover:bg-muted/80 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" /> Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" /> Masuk
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Row 2 — Secondary Nav with dividers */}
        <div className="hidden md:flex items-center gap-0.5 py-1.5 overflow-x-auto scrollbar-hide">
          {secondaryLinks.map((link, i) =>
            link.divider ? (
              <span key={i} className="text-border/60 px-1 text-xs select-none">|</span>
            ) : (
              <Link
                key={link.href + link.name}
                href={link.href}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  isActive(link.href)
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
                }`}
              >
                {link.name}
              </Link>
            )
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-border/30 overflow-y-auto max-h-[80vh]"
          >
            <div className="px-4 py-5 space-y-4">
              {MENU_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{group.label}</p>
                  <div className="space-y-1">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                          isActive(link.href) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="h-px bg-border" />
              {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : isAuthenticated ? (
                <>
                  <div className="px-2 py-1 text-sm text-muted-foreground">{user?.name || user?.email || "User"}</div>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-base font-semibold bg-muted text-foreground"
                  >
                    <LogOut className="w-5 h-5" /> Keluar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { login(); setIsMobileMenuOpen(false); }}
                  className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-primary to-secondary text-white"
                >
                  <LogIn className="w-5 h-5" /> Masuk
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
