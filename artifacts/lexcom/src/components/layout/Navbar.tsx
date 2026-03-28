import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Scale, Menu, X, LogIn, LogOut, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@workspace/replit-auth-web";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const primaryLinks = [
    { name: "Beranda", href: "/" },
    { name: "Agen AI", href: "/agents" },
    { name: "Layanan", href: "/layanan" },
    { name: "Peraturan", href: "/peraturan" },
    { name: "Forum", href: "/forum" },
  ];

  const secondaryLinks = [
    { name: "✨ LexBot", href: "/lexbot" },
    { name: "🤖 Agentic AI", href: "/agentic-chatbots" },
    { name: "📚 Kursus", href: "/kursus" },
    { name: "⚖️ Putusan", href: "/putusan" },
    { name: "👨‍⚖️ Pengacara", href: "/pengacara" },
    { name: "📖 Panduan", href: "/panduan" },
    { name: "📄 Dokumen", href: "/documents" },
    { name: "📁 Kasus", href: "/cases" },
    { name: "👥 Komunitas", href: "/komunitas" },
  ];

  const allLinks = [...primaryLinks, ...secondaryLinks];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-panel" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1 */}
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              LexCom
            </span>
          </Link>

          {/* Primary Nav */}
          <nav className="hidden md:flex items-center gap-6">
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
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  {user?.name || user?.email || "User"}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white/10 text-foreground hover:bg-white/20 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" /> Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-white text-background hover:bg-gray-200 transition-all shadow-lg hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" /> Masuk
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Row 2 — Secondary Nav */}
        <div className="hidden md:flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-hide">
          {secondaryLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                isActive(link.href)
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-white/5"
          >
            <div className="px-4 py-6 flex flex-col gap-3">
              {allLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium block px-2 py-1 ${
                    isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : isAuthenticated ? (
                <>
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    {user?.name || user?.email || "User"}
                  </div>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-base font-semibold bg-white/10 text-white"
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
