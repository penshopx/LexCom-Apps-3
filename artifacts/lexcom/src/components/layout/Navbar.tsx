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

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "AI Chat", href: "/agentic-chatbots" },
    { name: "Perkara", href: "/cases" },
    { name: "Dokumen", href: "/documents" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-panel py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              LexCom
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-all hover:text-foreground ${
                  location === link.href ? "text-primary font-bold" : "text-muted-foreground hover:text-gradient"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {user?.name || user?.email || "User"}
                </span>
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-foreground hover:bg-white/20 transition-all shadow-lg"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-background hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" /> Masuk
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-white/5 mt-3"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-medium block px-2 ${
                    location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
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
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    Logged in as {user?.name || user?.email || "User"}
                  </div>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex justify-center items-center gap-2 mt-2 px-5 py-3 rounded-xl text-lg font-semibold bg-white/10 text-white text-center shadow-lg"
                  >
                    <LogOut className="w-5 h-5" /> Keluar
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { login(); setIsMobileMenuOpen(false); }}
                  className="w-full flex justify-center items-center gap-2 mt-2 px-5 py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-primary to-secondary text-white text-center shadow-lg"
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
