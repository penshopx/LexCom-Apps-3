import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import {
  User, Crown, Zap, BarChart3, MessageSquare, FileText, BookMarked,
  PenLine, Bot, Scale, LogOut, ArrowRight, Shield, Calendar,
  Activity, Check, Settings, ChevronRight, Loader2
} from "lucide-react";
import { Link } from "wouter";

const PLAN_INFO: Record<string, { name: string; color: string; bg: string; limit: number; icon: string }> = {
  free:     { name: "Gratis",  color: "text-muted-foreground", bg: "bg-white/10",    limit: 5,   icon: "🆓" },
  starter:  { name: "Starter", color: "text-blue-400",         bg: "bg-blue-500/10", limit: 50,  icon: "⚡" },
  pro:      { name: "Pro",     color: "text-primary",          bg: "bg-primary/10",  limit: 200, icon: "🔥" },
  advokat:  { name: "Advokat", color: "text-amber-400",        bg: "bg-amber-500/10", limit: 999999, icon: "👑" },
};

const QUICK_LINKS = [
  { icon: MessageSquare, label: "LexBot AI",           href: "/lexbot",              desc: "Konsultasi hukum" },
  { icon: Scale,         label: "Pakar Hukum AI",      href: "/agents",              desc: "19 spesialis AI" },
  { icon: PenLine,       label: "Penulis Cerdas",      href: "/penulis-cerdas",      desc: "Studio penulisan AI" },
  { icon: Bot,           label: "Chatbot Builder",     href: "/chatbot-builder",     desc: "Buat chatbot kustom" },
  { icon: BookMarked,    label: "Ebook Builder",       href: "/ebook-builder",       desc: "Buat ebook hukum AI" },
  { icon: FileText,      label: "Dokumen AI",          href: "/documents",           desc: "Generator dokumen" },
  { icon: BarChart3,     label: "Intelijen Regulasi",  href: "/intelijen-regulasi",  desc: "Skor risiko kepatuhan" },
  { icon: Activity,      label: "Riset AI Hub",        href: "/riset-ai",            desc: "Riset multi-agen" },
];

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const isUnlimited = limit >= 999999;
  const pct = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const color = pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-foreground font-semibold">{isUnlimited ? "∞" : used}/{isUnlimited ? "∞" : limit} kueri hari ini</span>
        {!isUnlimited && <span className="text-muted-foreground">{Math.round(pct)}%</span>}
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <motion.div className={`${color} rounded-full h-2`} initial={{ width: 0 }} animate={{ width: isUnlimited ? "100%" : `${pct}%` }} transition={{ duration: 0.6 }} style={{ background: isUnlimited ? "linear-gradient(90deg, #8b5cf6, #06b6d4)" : undefined }} />
      </div>
      {!isUnlimited && <p className="text-[10px] text-muted-foreground mt-1">Reset tengah malam WIB</p>}
    </div>
  );
}

export default function Profil() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [usage, setUsage] = useState<number>(0);
  const [planId, setPlanId] = useState<string>("free");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/masuk");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/user/profile", { credentials: "include" })
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (d) {
            setPlanId(d.planId || "free");
            setUsage(d.usageToday || 0);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingProfile(false));
    }
  }, [isAuthenticated]);

  if (isLoading || loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const plan = PLAN_INFO[planId] || PLAN_INFO.free;
  const displayName = user?.firstName || user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Pengguna";
  const initials = displayName.slice(0, 2).toUpperCase();

  const stats = [
    { icon: MessageSquare, label: "Konsultasi AI",    val: "0",     sub: "total sesi" },
    { icon: FileText,      label: "Dokumen Dibuat",   val: "0",     sub: "dokumen" },
    { icon: Scale,         label: "Kasus Aktif",      val: "0",     sub: "perkara" },
    { icon: PenLine,       label: "Tulisan AI",       val: "0",     sub: "artikel" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-36 pb-16">
        <div className="max-w-5xl mx-auto px-4">

          {/* Profile Header */}
          <div className="glass-card rounded-3xl p-6 mb-6 border border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={displayName} className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                    {initials}
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${plan.bg} border-2 border-background flex items-center justify-center text-[10px]`}>
                  {plan.icon}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold">{displayName}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${plan.bg} ${plan.color}`}>
                  <span>{plan.icon}</span> Paket {plan.name}
                </div>
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <a href="/harga" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
                  <Crown className="w-3.5 h-3.5" /> Upgrade
                </a>
                <button onClick={logout} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  <LogOut className="w-3.5 h-3.5" /> Keluar
                </button>
              </div>
            </div>

            {/* Usage bar */}
            <div className="mt-5 pt-5 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Penggunaan AI Hari Ini</span>
              </div>
              <UsageBar used={usage} limit={plan.limit} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="glass-card rounded-2xl p-4 border border-white/10 text-center">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <s.icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xl font-bold">{s.val}</p>
                    <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick access */}
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> Akses Cepat
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {QUICK_LINKS.map((link, i) => (
                    <a key={i} href={link.href}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <link.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{link.label}</p>
                        <p className="text-[10px] text-muted-foreground">{link.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Recent Activity (placeholder) */}
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Aktivitas Terbaru
                </h3>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Belum ada aktivitas.</p>
                  <p className="text-xs mt-1">Mulai konsultasi hukum Anda pertama!</p>
                  <a href="/lexbot" className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline">
                    Buka LexBot <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Current plan */}
              <div className={`rounded-2xl p-5 border ${plan.bg} ${planId === "pro" ? "border-primary/40" : planId === "advokat" ? "border-amber-500/40" : "border-white/10"}`}>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" /> Paket Saat Ini
                </h3>
                <div className={`text-3xl font-display font-bold mb-1 ${plan.color}`}>
                  {plan.icon} {plan.name}
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  {planId === "free" ? "Gratis selamanya" : "Berlangganan aktif"}
                </p>
                {planId === "free" && (
                  <a href="/harga" className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold hover:opacity-90 transition-all">
                    Upgrade Sekarang ✨
                  </a>
                )}
                {planId !== "free" && (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                    <Check className="w-3.5 h-3.5" /> Aktif hingga akhir bulan
                  </div>
                )}
              </div>

              {/* Account info */}
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Informasi Akun
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Email",     val: user?.email || "-" },
                    { label: "Nama",      val: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || displayName },
                    { label: "ID Akun",   val: (user as any)?.id?.slice(0, 12) + "..." || "-" },
                    { label: "Terdaftar", val: "Baru saja" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className="text-xs font-medium text-foreground truncate max-w-[120px]">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Keamanan
                </h3>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <p className="text-xs text-emerald-400">Akun terproteksi via Replit Auth</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
