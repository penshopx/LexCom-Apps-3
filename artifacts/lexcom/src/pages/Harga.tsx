import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useAuth } from "@workspace/replit-auth-web";
import {
  Check, X, Sparkles, Zap, Crown, Building2, MessageSquare,
  ChevronDown, ChevronUp, Star, Shield, Users, Infinity
} from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Gratis",
    nameEn: "Free",
    icon: "🆓",
    price: 0,
    priceAnnual: 0,
    period: "Selamanya",
    color: "border-white/20",
    badge: null,
    desc: "Mulai eksplorasi platform LexCom tanpa biaya apapun",
    queries: "5 kueri AI/hari",
    cta: "Daftar Gratis",
    ctaStyle: "bg-white/10 border border-white/20 text-foreground hover:bg-white/20",
    features: [
      { text: "LexBot AI (dasar)", ok: true },
      { text: "Database Peraturan & Putusan", ok: true },
      { text: "Glosarium 120+ istilah hukum", ok: true },
      { text: "6 Kalkulator Hukum", ok: true },
      { text: "Forum Komunitas (baca)", ok: true },
      { text: "5 kueri AI per hari", ok: true },
      { text: "19 Pakar Hukum AI", ok: false },
      { text: "Agentic Multi-Agent AI", ok: false },
      { text: "Studio AI (Penulis, Chatbot, Ebook)", ok: false },
      { text: "Riset AI & Peta Preseden", ok: false },
      { text: "Telaah Dokumen AI", ok: false },
      { text: "Manajemen Kasus & Dokumen", ok: false },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    nameEn: "Starter",
    icon: "⚡",
    price: 79000,
    priceAnnual: 59000,
    period: "per bulan",
    color: "border-blue-500/40",
    badge: null,
    desc: "Untuk mahasiswa dan masyarakat yang butuh akses penuh AI hukum",
    queries: "50 kueri AI/hari",
    cta: "Mulai Starter",
    ctaStyle: "bg-blue-600 text-white hover:bg-blue-500",
    features: [
      { text: "Semua fitur Gratis", ok: true },
      { text: "19 Pakar Hukum AI", ok: true },
      { text: "Agentic Multi-Agent AI", ok: true },
      { text: "LexBot Advanced", ok: true },
      { text: "Generator Dokumen AI", ok: true },
      { text: "Manajemen Kasus & Dokumen", ok: true },
      { text: "Forum Komunitas (posting & reply)", ok: true },
      { text: "50 kueri AI per hari", ok: true },
      { text: "Studio AI (Penulis, Chatbot, Ebook)", ok: false },
      { text: "Riset AI Hub & Peta Preseden", ok: false },
      { text: "Telaah Dokumen 5 Agen", ok: false },
      { text: "Embed Chatbot Kustom", ok: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    nameEn: "Pro",
    icon: "🔥",
    price: 199000,
    priceAnnual: 149000,
    period: "per bulan",
    color: "border-primary/60",
    badge: "Paling Populer",
    badgeColor: "bg-primary text-white",
    desc: "Untuk praktisi hukum, dosen, dan konsultan profesional",
    queries: "200 kueri AI/hari",
    cta: "Mulai Pro",
    ctaStyle: "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg shadow-primary/30",
    features: [
      { text: "Semua fitur Starter", ok: true },
      { text: "Studio AI — Penulis Cerdas", ok: true },
      { text: "Studio AI — Chatbot Builder", ok: true },
      { text: "Studio AI — Ebook Builder", ok: true },
      { text: "Riset AI Hub (4 agen paralel)", ok: true },
      { text: "Telaah Dokumen (5 agen paralel)", ok: true },
      { text: "Peta Preseden dengan grafik", ok: true },
      { text: "Intelijen Regulasi AI (skor risiko)", ok: true },
      { text: "200 kueri AI per hari", ok: true },
      { text: "Prioritas response waktu", ok: true },
      { text: "Embed Chatbot Kustom", ok: false },
      { text: "Akses API", ok: false },
      { text: "White-label & branding", ok: false },
    ],
  },
  {
    id: "advokat",
    name: "Advokat",
    nameEn: "Enterprise",
    icon: "👑",
    price: 499000,
    priceAnnual: 399000,
    period: "per bulan",
    color: "border-amber-500/40",
    badge: "Enterprise",
    badgeColor: "bg-amber-500 text-black",
    desc: "Untuk firma hukum, instansi, kampus, dan bisnis skala besar",
    queries: "Tanpa batas",
    cta: "Hubungi Kami",
    ctaStyle: "bg-amber-500 text-black hover:bg-amber-400 font-bold",
    features: [
      { text: "Semua fitur Pro", ok: true },
      { text: "Kueri AI tanpa batas", ok: true },
      { text: "Embed Chatbot di website Anda", ok: true },
      { text: "Akses API LexCom", ok: true },
      { text: "Kustomisasi branding (white-label)", ok: true },
      { text: "Multi-pengguna (hingga 20 akun)", ok: true },
      { text: "Laporan penggunaan bulanan", ok: true },
      { text: "Dukungan prioritas 24/7", ok: true },
      { text: "Onboarding & pelatihan tim", ok: true },
      { text: "SLA 99.9% uptime", ok: true },
      { text: "Integrasi custom (Webhook, Zapier)", ok: true },
      { text: "Konsultasi strategi AI hukum", ok: true },
    ],
  },
];

const FAQS = [
  { q: "Apakah saya bisa mencoba sebelum berlangganan?", a: "Ya! Paket Gratis tersedia selamanya tanpa kartu kredit. Anda bisa menggunakan LexBot, database hukum, kalkulator, dan glosarium secara gratis." },
  { q: "Bagaimana cara pembayaran?", a: "Pembayaran dapat dilakukan via transfer bank (BCA, BNI, BRI, Mandiri), GoPay, OVO, Dana, QRIS, atau kartu kredit/debit. Setelah konfirmasi pembayaran, akses langsung aktif." },
  { q: "Apakah bisa upgrade atau downgrade plan?", a: "Bisa. Upgrade plan akan langsung aktif (sisa saldo diperhitungkan). Downgrade akan berlaku di siklus penagihan berikutnya." },
  { q: 'Apa itu "kueri AI"?', a: "Setiap percakapan atau permintaan ke sistem AI (LexBot, Pakar AI, Penulis Cerdas, dll.) menghitung sebagai 1 kueri. Batas direset setiap tengah malam WIB." },
  { q: "Apakah data saya aman?", a: "Ya. Semua data dienkripsi end-to-end dan disimpan di server Indonesia. Kami tidak menjual atau membagikan data pengguna kepada pihak ketiga." },
  { q: "Bagaimana cara berlangganan plan Advokat/Enterprise?", a: "Klik 'Hubungi Kami' dan tim kami akan menghubungi Anda dalam 1x24 jam untuk demo dan konfigurasi sesuai kebutuhan organisasi Anda." },
];

const WA_NUMBER = "6281234567890";

function formatRupiah(n: number) {
  if (n === 0) return "Rp0";
  return `Rp${n.toLocaleString("id-ID")}`;
}

export default function Harga() {
  const { isAuthenticated, login } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCta = (planId: string) => {
    if (planId === "free") {
      if (!isAuthenticated) login();
      else window.location.href = "/profil";
      return;
    }
    if (planId === "advokat") {
      window.open(`https://wa.me/${WA_NUMBER}?text=Halo LexCom, saya tertarik dengan paket Advokat Enterprise. Boleh saya tahu lebih lanjut?`, "_blank");
      return;
    }
    // For paid plans: WhatsApp purchase flow (replace with payment gateway later)
    const plan = PLANS.find(p => p.id === planId);
    const price = annual ? plan!.priceAnnual : plan!.price;
    const msg = `Halo LexCom, saya ingin berlangganan paket *${plan?.name}* ${annual ? "(tahunan)" : "(bulanan)"} seharga ${formatRupiah(price)}/bulan. Mohon info cara pembayarannya.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Crown className="w-4 h-4" /> Pilih Paket LexCom
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold mb-4">
              Investasi Terbaik untuk <span className="text-gradient">Kebutuhan Hukum Anda</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Mulai gratis, upgrade kapan saja. Tidak ada biaya tersembunyi. Batalkan kapan saja.
            </motion.p>

            {/* Annual toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-white/5 border border-white/10">
              <button onClick={() => setAnnual(false)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!annual ? "bg-white text-black" : "text-muted-foreground hover:text-foreground"}`}>
                Bulanan
              </button>
              <button onClick={() => setAnnual(true)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${annual ? "bg-white text-black" : "text-muted-foreground hover:text-foreground"}`}>
                Tahunan <span className="text-emerald-500 font-bold ml-1">Hemat 25%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.id}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl border glass-card p-6 flex flex-col ${plan.color} ${plan.id === "pro" ? "ring-2 ring-primary/50 shadow-xl shadow-primary/10" : ""}`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${plan.badgeColor}`}>
                    {plan.badge}
                  </div>
                )}

                <div className="text-3xl mb-3">{plan.icon}</div>
                <h3 className="text-xl font-display font-bold mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{plan.desc}</p>

                <div className="mb-4">
                  {plan.price === 0 ? (
                    <div className="text-3xl font-bold">Gratis</div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold">
                        {formatRupiah(annual ? plan.priceAnnual : plan.price)}
                        <span className="text-base font-normal text-muted-foreground">/bln</span>
                      </div>
                      {annual && (
                        <div className="text-xs text-emerald-400">Dibayar tahunan · Hemat {formatRupiah((plan.price - plan.priceAnnual) * 12)}</div>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="inline-flex items-center gap-1">
                      {plan.id === "advokat" ? <Infinity className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                      {plan.queries}
                    </span>
                  </div>
                </div>

                <button onClick={() => handleCta(plan.id)}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all mb-6 ${plan.ctaStyle}`}>
                  {plan.cta}
                </button>

                <div className="space-y-2 flex-1">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2">
                      {f.ok ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs ${f.ok ? "text-foreground" : "text-muted-foreground/40"}`}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: Shield, label: "Data Aman", desc: "Enkripsi end-to-end, server Indonesia" },
              { icon: Star, label: "Garansi 7 Hari", desc: "Uang kembali jika tidak puas" },
              { icon: Users, label: "10.000+ Pengguna", desc: "Mahasiswa, praktisi, publik" },
              { icon: Sparkles, label: "Update Gratis", desc: "Fitur baru tanpa biaya tambahan" },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-center mb-8">Pertanyaan Umum</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl border border-white/10 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left">
                    <span className="text-sm font-semibold">{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-white/10 pt-3">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mt-16 glass-card rounded-3xl p-10 border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/5">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              Masih ragu? Mulai dengan paket <span className="text-gradient">Gratis</span>
            </h2>
            <p className="text-muted-foreground mb-6">Tidak perlu kartu kredit. Daftar dalam 30 detik menggunakan akun Replit.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => !isAuthenticated && login()}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/25">
                <Sparkles className="w-5 h-5" /> Daftar Gratis Sekarang
              </button>
              <a href={`https://wa.me/${WA_NUMBER}?text=Halo LexCom, saya ingin bertanya tentang paket berlangganan.`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all">
                <MessageSquare className="w-5 h-5" /> Tanya via WhatsApp
              </a>
            </div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
