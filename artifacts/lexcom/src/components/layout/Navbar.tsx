import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Scale, Menu, X, LogIn, LogOut, Loader2, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@workspace/replit-auth-web";
import { useTheme } from "@/contexts/ThemeContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

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
    { name: "\u2728 LexBot", href: "/lexbot" },
    { name: "\ud83e\udd16 Agentic AI", href: "/agentic-chatbots" },
    { name: "\ud83d\udcda Kursus", href: "/kursus" },
    { name: "\u2696\ufe0f Putusan", href: "/putusan" },
    { name: "\ud83d\udc68\u200d\u2696\ufe0f Pengacara", href: "/pengacara" },
    { name: "\ud83d\udcd6 Panduan", href: "/panduan" },
    { name: "\ud83d\udcc4 Dokumen", href: "/documents" },
    { name: "\ud83d\udcc1 Kasus", href: "/cases" },
    { name: "\ud83d\udc65 Komunitas", href: "/komunitas" },
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
        <div className="flex justify-between items-center py-3 border-b border-border/30">
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

          {/* Auth + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  {user?.name || user?.email || "User"}
                </span>
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

          {/* Mobile: Theme Toggle + Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className="p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
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
                  : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
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
            className="md:hidden glass-panel border-t border-border/30"
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
              <div className="h-px bg-border my-2" />
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
