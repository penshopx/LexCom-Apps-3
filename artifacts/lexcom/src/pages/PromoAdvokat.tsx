import { useState } from "react";
import { Link } from "wouter";
import {
  CheckCircle, XCircle, ChevronDown, ChevronUp, Star, Clock, Shield,
  Zap, BookOpen, Scale, FileText, Users, TrendingUp, AlertTriangle, ArrowRight,
  Phone, MessageCircle
} from "lucide-react";

const testimonials = [
  {
    name: "Riko",
    role: "Advokat, Jakarta",
    quote: "AI ini benar-benar asisten hukum digital. Saya bisa kerja lebih cepat tanpa takut salah pasal.",
    stars: 5,
  },
  {
    name: "Indri",
    role: "Konsultan Hukum, Surabaya",
    quote: "Saya pakai untuk bantu tim paralegal. Sekarang kerja jadi sistematis dan efisien banget.",
    stars: 5,
  },
  {
    name: "Bima",
    role: "Mahasiswa Profesi Hukum, Semarang",
    quote: "Kalau dulu saya googling pasal satu-satu, sekarang tinggal tanya ke AI ini. Hidup banget!",
    stars: 5,
  },
  {
    name: "Rani",
    role: "Dosen Hukum, Makassar",
    quote: "Lebih dari sekadar chatbot. AI ini ngerti hukum secara kontekstual dan aktual.",
    stars: 5,
  },
];

const features = [
  "UPDATE! Yurisprudensi Mahkamah Agung Terbaru",
  "UPDATE! KUHP & KUHAP Terbaru 2026",
  "Hukum Perdata",
  "Hukum Pidana (Umum & Khusus: Tipikor, Narkotika, ITE, Kehutanan, dll)",
  "Paralegal & Drafting Dokumen",
  "Hukum Ketenagakerjaan & PHI",
  "Pengadilan Pajak",
  "Pengadilan Tata Usaha Negara (PTUN)",
  "Pengadilan Agama",
  "Pengadilan Negeri (Perdata Umum)",
  "Pengadilan Niaga (Kepailitan & PKPU)",
  "Arbitrase & Alternatif Penyelesaian Sengketa (ADR)",
  "Hukum Internasional & HPI",
  "Hukum Digital & Teknologi Informasi",
  "Corporate Legal & Compliance",
  "Hukum Ekonomi Global & AML Compliance",
  "Hukum Syariah & Ekonomi Islam",
  "Legal Reasoning (Penalaran Terbuka)",
  "Riset Doktrinal & Hukum Komparatif",
  "Etika & Keputusan Dilema Hukum",
  "Legal Opinion",
];

const painPoints = [
  "Pusing menyusun dokumen hukum dari awal",
  "Lelah revisi draf kontrak berulang-ulang",
  "Bingung menjawab pertanyaan klien secara sistematis",
  "Kehabisan waktu untuk riset pasal dan yurisprudensi",
  "Terlambat menanggapi klien karena pekerjaan administratif",
  "Sulit mencari referensi hukum yang relevan dan terpercaya",
];

const benefits = [
  { icon: Clock, title: "Hemat Waktu & Tenaga", desc: "Drafting otomatis menghemat 5–8 jam kerja setiap hari" },
  { icon: Scale, title: "Analisis Pasal & Legal Reasoning", desc: "Otomatis dengan premis mayor–minor–konklusi yang terstruktur" },
  { icon: Shield, title: "Dukungan Compliance & Corporate Legal", desc: "Selalu update regulasi terbaru Indonesia" },
  { icon: Zap, title: "Tools Hukum Terlengkap", desc: "Semua cabang hukum Indonesia dalam satu sistem terintegrasi" },
  { icon: BookOpen, title: "Lisensi Lifetime", desc: "Sekali bayar, selamanya akses tanpa biaya berulang" },
  { icon: TrendingUp, title: "Tingkatkan Produktivitas 300%", desc: "Firma hukum yang sudah pakai terbukti jauh lebih efisien" },
];

const risks = [
  {
    title: "Kehilangan Waktu Berharga Setiap Hari",
    desc: "Tanpa AI ini, Anda akan terus menghabiskan waktu berjam-jam hanya untuk mengetik dan memformat dokumen hukum secara manual.",
  },
  {
    title: "Terjebak Dalam Cara Kerja Lama",
    desc: "Firma hukum lain yang sudah memakai AI ini akan bergerak jauh lebih cepat. Jika Anda tetap manual, Anda akan tertinggal di era hukum digital.",
  },
  {
    title: "Risiko Dokumen Tidak Standar",
    desc: "Tanpa sistem otomatis, dokumen hukum sering tidak sesuai format profesional — margin salah, struktur rancu, bahasa tidak baku. Hasil seperti ini bisa menurunkan kredibilitas di hadapan klien atau pengadilan.",
  },
  {
    title: "Rugi Finansial — Biaya Operasional Lebih Tinggi",
    desc: "Setiap bulan Anda mungkin menghabiskan biaya untuk asisten legal tambahan, layanan drafting pihak ketiga, atau software legal luar negeri yang tidak sesuai hukum Indonesia.",
  },
  {
    title: "Sulit Bersaing di Dunia Profesi Hukum Modern",
    desc: "Advokat, dosen, dan corporate legal yang memakai AI ini bisa menyajikan hasil lebih cepat dan presisi. Anda bisa kehilangan kepercayaan klien hanya karena kalah efisien.",
  },
  {
    title: "Kehilangan Peluang Emas — Harga Naik Setelah Promo",
    desc: "Promo diskon 80% Rp299.000 hanya untuk batch terbatas. Jika terlewat, harga kembali ke Rp1.745.000 atau lebih tinggi.",
  },
];

const faqs = [
  { q: "Produk Apa Ini?", a: "Ini adalah produk AI Advokat & Konsultan Hukum — sistem AI digital terpadu yang menghadirkan ilmu hukum Indonesia dalam satu ekosistem lengkap untuk kebutuhan advokat, paralegal, konsultan hukum, dosen, mahasiswa hukum, dan instansi pemerintah." },
  { q: "Produknya Dikirim Melalui Apa?", a: "Kami kirim produknya melalui WhatsApp dan email setelah pembayaran dikonfirmasi." },
  { q: "Apakah Ada Garansi Uang Kembali?", a: "Ya, ada garansi uang kembali 1×24 jam jika produk tidak sesuai dengan deskripsi." },
  { q: "Apakah Bisa Konsultasi & Request?", a: "Ya, bisa konsultasi dan request fitur atau konten tambahan." },
  { q: "Apakah Ada Biaya Bulanan/Tahunan?", a: "Tidak ada. Hanya sekali bayar untuk lifetime akses — tidak ada biaya berulang." },
  { q: "Apakah Ada Limit Penggunaan?", a: "Hanya ada limit harian. Besoknya bisa digunakan lagi tanpa batasan." },
  { q: "Apakah Harus Menggunakan Laptop?", a: "Tidak. AI ini bisa digunakan melalui HP, laptop, PC, maupun tablet — dari mana saja dan kapan saja." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-800/60 transition-colors"
      >
        <span className="font-semibold text-white pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-violet-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-300 text-sm leading-relaxed border-t border-slate-700 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function PromoAdvokat() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Nav minimal */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-violet-400 text-lg">
            <Scale className="w-5 h-5" />
            LexCom
          </Link>
          <a
            href="#beli"
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Dapatkan Sekarang
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-900/40 border border-violet-700/50 rounded-full px-3 py-1 text-xs text-violet-300 font-medium mb-6">
              <Zap className="w-3 h-3" /> AI Hukum Indonesia Terlengkap
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-5">
              Banyak orang pikir kerja advokat itu cuma soal{" "}
              <span className="text-violet-400">pintar bicara di sidang.</span>
            </h1>
            <p className="text-slate-300 leading-relaxed mb-4">
              Padahal, yang paling melelahkan justru terjadi <strong className="text-white">sebelum sidang dimulai.</strong>
            </p>
            <ul className="space-y-2 text-slate-400 text-sm mb-6">
              {["Riset pasal satu per satu.", "Membuka puluhan tab putusan pengadilan.", "Membaca jurnal hukum di tengah waktu yang terus berjalan.", "Satu kesalahan kecil di dokumen bisa berdampak besar ke klien, ke perkara, bahkan ke reputasi."].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">—</span> {t}
                </li>
              ))}
            </ul>
            <p className="text-white font-medium mb-2">Masalahnya bukan kurang ilmu.</p>
            <p className="text-slate-300 mb-8">Masalahnya, <strong className="text-violet-300">semua harus dikerjakan sendirian.</strong></p>
            <a
              href="#beli"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-7 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-violet-900/40"
            >
              Coba Sekarang <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/ai-advokat-hero.png"
              alt="AI Advokat & Konsultan Hukum"
              className="w-full max-w-sm rounded-2xl shadow-2xl shadow-violet-950/60"
            />
          </div>
        </div>
      </section>

      {/* SOLUSI */}
      <section className="bg-gradient-to-b from-violet-950/30 to-slate-950 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <span className="text-violet-400">AI Advokat & Konsultan Hukum</span> hadir untuk membantu
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            Meringankan kerja-kerja teknis hukum: mulai dari <strong className="text-white">riset, analisis, hingga drafting awal dokumen.</strong>
          </p>
          <p className="text-slate-400 max-w-xl mx-auto">
            Bukan menggantikan advokat. Tapi membantu advokat bekerja lebih <strong className="text-white">rapi, terstruktur, dan efisien.</strong>
          </p>
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-violet-800/40 rounded-2xl p-6 text-center">
              <div className="text-4xl font-extrabold text-violet-400 mb-1">5–8 Jam</div>
              <div className="text-slate-300 text-sm">Hemat Kerja Setiap Hari</div>
            </div>
            <div className="bg-slate-900 border border-violet-800/40 rounded-2xl p-6 text-center">
              <div className="text-4xl font-extrabold text-violet-400 mb-1">300%</div>
              <div className="text-slate-300 text-sm">Peningkatan Produktivitas Kantor Hukum</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Apa Kata Mereka</h2>
        <p className="text-slate-400 text-center mb-10">Yang sudah menggunakan AI Hukum ini</p>
        <div className="grid sm:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 italic mb-4 leading-relaxed">"{t.quote}"</p>
              <div>
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-xs text-slate-400">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="bg-slate-900/60 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Pernahkah Anda Mengalami Hal Ini?
          </h2>
          <p className="text-slate-400 text-center mb-10">Ketika menjadi Advokat / Konsultan Hukum</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {painPoints.map((p) => (
              <div key={p} className="flex items-start gap-3 bg-slate-900 border border-red-900/40 rounded-xl p-4">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES / CAKUPAN */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            AI Hukum Indonesia Pertama & Terlengkap
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Solusi <em>all-in-one</em> bagi advokat, paralegal, konsultan hukum, mahasiswa hukum, akademisi, hingga instansi pemerintahan.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <div key={f} className={`flex items-start gap-2.5 rounded-xl px-4 py-3 border ${f.startsWith("UPDATE") ? "bg-violet-950/50 border-violet-700/60" : "bg-slate-900/80 border-slate-700/50"}`}>
              <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${f.startsWith("UPDATE") ? "text-violet-400" : "text-green-400"}`} />
              <span className={`text-sm ${f.startsWith("UPDATE") ? "text-violet-200 font-semibold" : "text-slate-300"}`}>{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-gradient-to-b from-slate-950 to-violet-950/20 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Keuntungan Memiliki AI Hukum Ini
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-violet-900/50 border border-violet-700/40 flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{b.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RISKS */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 justify-center mb-3">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl md:text-3xl font-bold">Kerugian Jika Tidak Menggunakan AI Ini</h2>
        </div>
        <p className="text-slate-400 text-center mb-10">Anda akan mengalami banyak kerugian jika tidak menggunakan AI Hukum ini</p>
        <div className="space-y-4">
          {risks.map((r) => (
            <div key={r.title} className="bg-slate-900 border border-amber-900/30 rounded-2xl p-5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-900/40 border border-amber-700/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <XCircle className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-sm">{r.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BONUS */}
      <section className="bg-slate-900/60 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              🎁 BONUS SPESIAL
            </span>
            <h2 className="text-2xl md:text-3xl font-bold">
              Kami Sudah Menyiapkan Bonus untuk Anda
            </h2>
            <p className="text-slate-400 mt-2">Bagi yang melakukan pembayaran hari ini</p>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/bonus-buku-hukum.png"
              alt="Koleksi Buku & Materi Hukum Terbaik"
              className="w-full max-w-2xl rounded-2xl shadow-2xl"
            />
          </div>
          <p className="text-center text-slate-400 text-sm mt-4">
            Koleksi buku & materi hukum terbaik — <strong className="text-yellow-300">bonus akan update berkala</strong>
          </p>
        </div>
      </section>

      {/* PRICING / CTA */}
      <section id="beli" className="max-w-2xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-violet-900/60 to-slate-900 border-2 border-violet-600/60 rounded-3xl p-8 text-center shadow-2xl shadow-violet-950/50">
          <div className="inline-flex items-center gap-2 bg-red-900/50 border border-red-700/50 text-red-300 text-xs font-bold px-3 py-1 rounded-full mb-6">
            🔥 PROMO TERBATAS — DISKON 80%
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2">AI Advokat &amp; Konsultan Hukum</h2>
          <p className="text-slate-400 mb-6">Lifetime Akses · Sekali Bayar · Tidak Ada Biaya Bulanan</p>
          <div className="flex items-end justify-center gap-3 mb-2">
            <span className="text-slate-500 line-through text-xl">Rp1.745.000</span>
            <span className="text-5xl font-extrabold text-violet-300">Rp299.000</span>
          </div>
          <p className="text-xs text-slate-400 mb-8">Harga bisa naik setelah batch ini penuh</p>
          <div className="space-y-3 text-left mb-8">
            {["Akses ke 19+ AI Pakar Hukum Indonesia", "Semua cabang hukum termasuk update KUHP 2026 & Yurisprudensi MA", "Drafting dokumen, legal opinion, analisis kasus otomatis", "Bonus koleksi buku & materi hukum (update berkala)", "Garansi uang kembali 1×24 jam", "Dikirim via WhatsApp & Email"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-slate-200 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20membeli%20AI%20Advokat%20%26%20Konsultan%20Hukum"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Beli via WhatsApp
            </a>
            <Link
              href="/agents"
              className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              <Scale className="w-5 h-5" />
              Coba Gratis Dulu
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-4">Dengan melakukan pembelian, Anda menyetujui syarat & ketentuan yang berlaku.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Hal yang Sering Ditanyakan
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-violet-400 font-bold">
            <Scale className="w-5 h-5" />
            LexCom
          </Link>
          <p className="text-slate-500 text-sm">
            © 2026 LexCom. AI Hukum Indonesia Terlengkap.
          </p>
          <div className="flex gap-4 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <Link href="/agents" className="hover:text-white transition-colors">Agen AI</Link>
            <Link href="/pengacara" className="hover:text-white transition-colors">Pengacara</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
