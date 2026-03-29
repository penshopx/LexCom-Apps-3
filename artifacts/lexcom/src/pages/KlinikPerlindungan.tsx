import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, FileText, ChevronRight, ArrowRight, Sparkles,
  CheckCircle2, AlertCircle, Clock, Scale, Heart,
  Phone, Baby, Users, BookOpen, Gavel, Star, Lock,
} from "lucide-react";

const UU_CARDS = [
  {
    kode: "UU 23/2004",
    judul: "Penghapusan Kekerasan Dalam Rumah Tangga (PKDRT)",
    ringkasan: "Mengatur 4 jenis KDRT: fisik, psikis, seksual, dan penelantaran. Memberi hak perlindungan sementara (72 jam) & penetapan pengadilan, pemulihan korban.",
    pasal: "Pasal 5, 9, 16, 29–45",
    warna: "from-rose-500 to-pink-600",
    border: "border-rose-500/30",
    bg: "bg-rose-500/10",
  },
  {
    kode: "UU 35/2014",
    judul: "Perlindungan Anak (Perubahan UU 23/2002)",
    ringkasan: "Memperkuat hak anak atas perlindungan dari kekerasan, eksploitasi, penelantaran, dan perlakuan salah. Ancaman pidana diperberat, kewajiban negara & masyarakat dipertegas.",
    pasal: "Pasal 13, 59, 76A–76J, 80–89",
    warna: "from-blue-500 to-cyan-600",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    kode: "UU 12/2022",
    judul: "Tindak Pidana Kekerasan Seksual (TPKS)",
    ringkasan: "UU terbaru yang mengatur 9 jenis TPKS (pelecehan seksual, pemaksaan kontrasepsi, dll). Korban mendapat pendampingan, restitusi, dan hak tidak dikonfrontasi secara langsung.",
    pasal: "Pasal 4–14, 30, 67–82",
    warna: "from-violet-500 to-purple-600",
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
  },
  {
    kode: "PP 78/2021",
    judul: "Perlindungan Khusus Bagi Anak",
    ringkasan: "Mengatur mekanisme perlindungan khusus bagi anak dalam situasi darurat: anak korban KDRT, eksploitasi, bencana, konflik bersenjata, termasuk mekanisme reintegrasi.",
    pasal: "Pasal 3–40",
    warna: "from-emerald-500 to-teal-600",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
];

const ALUR_STAGES = [
  {
    id: "pengaduan",
    step: "01",
    label: "Pengaduan & Pelaporan",
    emoji: "📢",
    duration: "Segera / 1×24 jam",
    basis: "Pasal 15 UU 23/2004 · Pasal 26 UU 12/2022",
    color: "from-rose-600 to-pink-700",
    border: "border-rose-500/20",
    glow: "shadow-rose-500/20",
    desc: "Laporan dapat dibuat oleh korban sendiri, keluarga, atau siapapun yang mengetahui terjadinya kekerasan. Laporan ke Kepolisian (Laporan Polisi), UPTD PPA, P2TP2A, atau LBH. Polisi WAJIB menerima laporan dan memberikan perlindungan.",
    docs: ["Surat Keterangan Visum et Repertum", "Laporan Polisi (LP)", "Kronologi Kejadian Tertulis", "Dokumentasi Bukti (foto, screenshot, dll)"],
    tips: "Segera amankan barang bukti dan cari saksi. Visum et Repertum adalah bukti kunci — minta ke RS/dokter dalam 1×24 jam setelah kejadian.",
  },
  {
    id: "perlindungan_sementara",
    step: "02",
    label: "Perlindungan Sementara",
    emoji: "🛡️",
    duration: "Maks. 7 hari → diperpanjang pengadilan",
    basis: "Pasal 16–17 UU 23/2004 · Pasal 28 UU 12/2022",
    color: "from-violet-600 to-purple-700",
    border: "border-violet-500/20",
    glow: "shadow-violet-500/20",
    desc: "Polisi WAJIB memberikan perlindungan sementara dalam 1×24 jam setelah laporan, termasuk memindahkan korban ke rumah aman (shelter), memerintahkan pelaku meninggalkan rumah, dan melarang mendekati korban.",
    docs: ["Surat Perintah Perlindungan Sementara", "Rujukan ke Rumah Aman/Shelter", "Penetapan Pengadilan (Perintah Perlindungan)", "Surat Penetapan Perlindungan"],
    tips: "Pengadilan dapat mengeluarkan perintah perlindungan dalam 7 hari. Mintalah bantuan UPTD PPA atau LBH untuk mendampingi proses ini.",
  },
  {
    id: "penyidikan",
    step: "03",
    label: "Penyidikan & Pendampingan",
    emoji: "🔍",
    duration: "30–60 hari (dapat diperpanjang)",
    basis: "Pasal 18–22 UU 23/2004 · Pasal 33–44 UU 12/2022",
    color: "from-blue-600 to-cyan-700",
    border: "border-blue-500/20",
    glow: "shadow-blue-500/20",
    desc: "Selama penyidikan, korban berhak mendapat pendampingan hukum, psikologis, dan medis. Penyidik berkoordinasi dengan tenaga kesehatan dan pekerja sosial. Pemeriksaan korban anak dilakukan khusus oleh penyidik perempuan terlatih.",
    docs: ["Berita Acara Pemeriksaan (BAP) Korban", "Surat Permintaan Pendampingan ke LBH", "Surat Keterangan Psikologis", "BAP Saksi-saksi"],
    tips: "Korban berhak menolak diperiksa bersama-sama dengan pelaku. Penyidik wajib menjaga kerahasiaan identitas korban anak.",
  },
  {
    id: "penuntutan",
    step: "04",
    label: "Penuntutan & Persidangan",
    emoji: "⚖️",
    duration: "Sesuai jadwal PN/PA",
    basis: "Pasal 23–30 UU 23/2004 · UU 12/2022 · KUHAP",
    color: "from-amber-600 to-orange-700",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/20",
    desc: "Persidangan KDRT/TPKS dapat dilakukan secara tertutup. Korban anak dapat memberikan kesaksian melalui telekonferensi. Korban berhak atas restitusi (ganti rugi dari pelaku) dan kompensasi (dari negara bila restitusi tidak terpenuhi).",
    docs: ["Surat Dakwaan (untuk pelaku)", "Permohonan Restitusi", "Surat Keterangan Ahli (psikolog/dokter)", "Putusan Pengadilan"],
    tips: "Ajukan permohonan restitusi sedini mungkin — bisa diajukan sejak tahap penyidikan. Besarnya restitusi meliputi kerugian materiil dan immateriil.",
  },
  {
    id: "pemulihan",
    step: "05",
    label: "Pemulihan & Reintegrasi",
    emoji: "🌱",
    duration: "Berkelanjutan",
    basis: "Pasal 39–42 UU 23/2004 · Pasal 67–71 UU 12/2022 · PP 78/2021",
    color: "from-emerald-600 to-teal-700",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/20",
    desc: "Negara wajib menyediakan layanan rehabilitasi (medis, psikologis, sosial) bagi korban. Anak korban mendapat hak reintegrasi keluarga. Layanan tersedia di UPTD PPA, LPSK, P2TP2A, dan rumah sakit rujukan.",
    docs: ["Surat Keterangan Rehabilitasi", "Program Pendampingan LPSK", "Permohonan Witness Protection (saksi kunci)", "Laporan Reintegrasi Anak"],
    tips: "LPSK (Lembaga Perlindungan Saksi dan Korban) dapat memberikan perlindungan fisik, bantuan medis & psikologis, dan bantuan restitusi tanpa biaya.",
  },
];

const TEMPLATE_DOCS = [
  { icon: "📋", nama: "Surat Kronologi Kekerasan", ket: "Deskripsi faktual kejadian untuk lampiran LP" },
  { icon: "📄", nama: "Permohonan Perintah Perlindungan", ket: "Pengajuan ke Pengadilan Negeri" },
  { icon: "📜", nama: "Surat Kuasa Pendampingan LBH", ket: "Memberikan wewenang kepada pengacara/LBH" },
  { icon: "📃", nama: "Permohonan Visum et Repertum", ket: "Permintaan ke dokter/RS untuk korban" },
  { icon: "📑", nama: "Permohonan Restitusi ke Kejaksaan", ket: "Ganti rugi dari pelaku sesuai UU TPKS" },
  { icon: "📝", nama: "Surat Permohonan Pemulihan ke LPSK", ket: "Akses layanan rehabilitasi & perlindungan" },
  { icon: "📒", nama: "Pengaduan ke Komnas Perempuan", ket: "Laporan kebijakan atau sistematik" },
  { icon: "📕", nama: "Permohonan Perlindungan Anak ke P2TP2A", ket: "Layanan anak korban kekerasan" },
];

const HOTLINES = [
  { nama: "SAPA 129 (Kemensos)", nomor: "129", desc: "Hotline nasional kekerasan perempuan & anak", color: "text-rose-400" },
  { nama: "Hotline LPSK", nomor: "1-500-006", desc: "Lembaga Perlindungan Saksi & Korban", color: "text-violet-400" },
  { nama: "Komnas Perempuan", nomor: "(021) 3903963", desc: "Pengaduan & advokasi kebijakan", color: "text-blue-400" },
  { nama: "KPAI", nomor: "(021) 3900833", desc: "Komisi Perlindungan Anak Indonesia", color: "text-emerald-400" },
];

const FAQ_PERLINDUNGAN = [
  {
    q: "Apa itu KDRT dan apakah mencakup kekerasan psikologis?",
    a: "Ya. UU No. 23/2004 mendefinisikan KDRT sebagai setiap perbuatan terhadap seseorang dalam lingkup rumah tangga yang mengakibatkan kesengsaraan atau penderitaan fisik, seksual, psikologis, dan/atau penelantaran. Kekerasan psikologis (menghina, mengancam, mengisolasi, mempermalukan) adalah KDRT dan dapat dipidana dengan hukuman 3–9 tahun penjara (Pasal 45 UU 23/2004)."
  },
  {
    q: "Siapa saja yang termasuk 'lingkup rumah tangga' dalam UU PKDRT?",
    a: "UU 23/2004 mendefinisikan lingkup rumah tangga mencakup: (1) suami, istri, dan anak termasuk anak angkat; (2) orang-orang yang mempunyai hubungan keluarga karena hubungan darah, perkawinan, persusuan, atau pengasuhan; (3) orang yang bekerja membantu rumah tangga dan menetap di dalam rumah. Artinya, kekerasan oleh mertua, ipar, ART pun bisa masuk ranah PKDRT."
  },
  {
    q: "Apa yang dimaksud dengan restitusi dan siapa yang berhak mengajukan?",
    a: "Restitusi adalah ganti kerugian yang wajib dibayar oleh pelaku kepada korban, mencakup kerugian fisik, psikis, ekonomi, biaya pengobatan, rehabilitasi, dan kehilangan penghasilan. Restitusi diatur dalam UU No. 12/2022 tentang TPKS. Korban (atau pendamping/LBH atas nama korban) dapat mengajukan permohonan restitusi sejak tahap penyidikan sampai sebelum putusan pengadilan. Bila pelaku tidak mampu, negara memberikan kompensasi melalui LPSK."
  },
  {
    q: "Bagaimana cara melaporkan kekerasan terhadap anak jika pelakunya adalah orang tua?",
    a: "Kekerasan oleh orang tua terhadap anak adalah tindak pidana berdasarkan UU No. 35/2014 (Perlindungan Anak). Laporan bisa dibuat oleh: siapapun yang mengetahui (tetangga, guru, dll), anak sendiri bila sudah cukup umur, atau petugas sosial/LBH. Polisi, guru, tenaga kesehatan, dan pekerja sosial memiliki KEWAJIBAN HUKUM untuk melaporkan. Anak akan ditempatkan di rumah aman selama proses, dan orang tua dapat kehilangan hak asuh sementara atau permanen."
  },
  {
    q: "Apakah korban TPKS harus berhadapan langsung dengan pelaku di persidangan?",
    a: "Tidak. UU No. 12/2022 (TPKS) secara khusus mengatur bahwa korban berhak untuk tidak dikonfrontasi secara langsung dengan terdakwa/pelaku. Korban dapat memberikan kesaksian melalui media elektronik (telekonferensi) dari tempat yang berbeda. Hakim juga dapat mengeluarkan perintah agar persidangan dilakukan tertutup untuk umum demi melindungi korban."
  },
];

const HAK_CHECKER_DATA: Record<string, Record<string, { hak: string[]; langkah: string[]; lembaga: string[] }>> = {
  perempuan: {
    "Kekerasan Fisik (KDRT)": {
      hak: ["Perlindungan sementara 1×24 jam oleh kepolisian", "Visum et Repertum gratis (RS pemerintah)", "Perintah perlindungan dari pengadilan", "Tempat tinggal sementara di shelter/rumah aman", "Pendampingan psikologis dan konseling gratis", "Restitusi dari pelaku atau kompensasi dari negara"],
      langkah: ["1. Lapor ke Polsek/Polres terdekat atau hubungi SAPA 129", "2. Minta Visum et Repertum segera (dalam 24 jam)", "3. Minta Surat Perintah Perlindungan Sementara", "4. Hubungi UPTD PPA atau P2TP2A untuk pendampingan", "5. Pertimbangkan mengajukan Perintah Perlindungan ke PN"],
      lembaga: ["Polres/Polda (SPKT 24 jam)", "UPTD PPA (Dinas P3A)", "P2TP2A", "LBH / YLBHI", "Komnas Perempuan"],
    },
    "Kekerasan Seksual (TPKS)": {
      hak: ["Hak atas privasi dan kerahasiaan identitas", "Tidak dikonfrontasi langsung dengan pelaku", "Pendampingan hukum, psikologis, dan medis", "Restitusi (ganti rugi dari pelaku) dan kompensasi negara", "Perlindungan LPSK (fisik, medis, psikologis)", "Pemeriksaan oleh penyidik perempuan"],
      langkah: ["1. Hubungi SAPA 129 atau Hotline LPSK 1-500-006", "2. Datangi Puskesmas/RS untuk penanganan medis & visum", "3. Laporkan ke Polisi — minta penyidik perempuan", "4. Daftarkan ke LPSK untuk perlindungan lanjutan", "5. Ajukan permohonan restitusi melalui LBH/pendamping"],
      lembaga: ["LPSK (1-500-006)", "Polri Unit PPA", "SAPA 129 (Kemensos)", "LBH Apik / LBH Pers", "Komnas Perempuan"],
    },
    "Penelantaran Ekonomi": {
      hak: ["Nafkah dari suami (kewajiban hukum)", "Perlindungan sebagai KDRT penelantaran (Pasal 9 UU 23/2004)", "Gugatan alimentasi di Pengadilan Agama/Negeri", "Aset bersama terlindungi selama proses hukum"],
      langkah: ["1. Kumpulkan bukti penelantaran (rekening, bukti pengeluaran keluarga)", "2. Lapor ke Polisi sebagai KDRT bentuk penelantaran", "3. Konsultasikan gugatan nafkah ke LBH atau Pengadilan Agama", "4. Ajukan permohonan mediasi melalui BP4 atau P2TP2A"],
      lembaga: ["Pengadilan Agama (untuk muslim)", "Pengadilan Negeri", "BP4 (Badan Penasihatan Perkawinan)", "LBH Apik", "UPTD PPA"],
    },
  },
  anak: {
    "Kekerasan Fisik": {
      hak: ["Penempatan di rumah aman/shelter selama proses hukum", "Visum et Repertum gratis", "Pemeriksaan oleh penyidik anak yang terlatih", "Pendampingan psikologis wajib", "Hak reintegrasi keluarga (bila aman)", "Pelaku dipidana 3,5–15 tahun (UU 35/2014 Pasal 80)"],
      langkah: ["1. Laporkan ke Polsek atau KPAI (021-3900833)", "2. Amankan anak dari pelaku — minta bantuan P2TP2A", "3. Minta pendampingan Pekerja Sosial Anak (PEKSOS)", "4. Proses hukum: penyidikan di unit PPA, sidang anak tertutup", "5. Ajukan reintegrasi anak ke keluarga aman atau keluarga asuh"],
      lembaga: ["KPAI (021-3900833)", "Dinas Sosial (UPTD PPSA)", "P2TP2A", "Polri Unit PPA", "LBH Anak"],
    },
    "Kekerasan Seksual": {
      hak: ["Sidang sepenuhnya tertutup dari umum", "Kesaksian via telekonferensi tanpa berhadapan pelaku", "Identitas anak WAJIB dirahasiakan (media pun dilarang)", "Pendampingan psikologis intensif", "Restitusi dan kompensasi dari negara", "Hak tidak dikriminalisasi atas kekerasan yang dialami"],
      langkah: ["1. Segera bawa anak ke RS/Puskesmas untuk penanganan medis", "2. Lapor ke Polisi — tolak pemeriksaan tanpa pendamping", "3. Hubungi KPAI atau P2TP2A untuk pendampingan khusus anak", "4. Minta LBH mendampingi seluruh proses hukum", "5. Daftarkan anak ke LPSK bila terancam sebagai saksi"],
      lembaga: ["KPAI", "LPSK (1-500-006)", "Polri Unit PPA (khusus anak)", "P2TP2A", "LBH APIK / Yayasan Pulih"],
    },
    "Eksploitasi & Penelantaran": {
      hak: ["Perlindungan negara wajib (UU 35/2014 Pasal 59)", "Hak atas pendidikan, kesehatan, dan identitas", "Pemisahan dari pelaku ekploitasi", "Rehabilitasi sosial di LRSA (Lembaga Rehabilitasi Sosial Anak)"],
      langkah: ["1. Laporkan ke Dinas Sosial atau KPAI", "2. Anak ditempatkan di shelter/LRSA bila situasi tidak aman", "3. Proses hukum terhadap pelaku eksploitasi", "4. Program rehabilitasi dan reintegrasi sosial anak"],
      lembaga: ["Dinas Sosial setempat", "KPAI", "Kemensos (SAPA 129)", "Yayasan ECPAT Indonesia", "Terre des hommes"],
    },
  },
};

function HakCorbanChecker() {
  const [kategori, setKategori] = useState<"perempuan" | "anak" | null>(null);
  const [jenisKasus, setJenisKasus] = useState<string | null>(null);

  const result = kategori && jenisKasus ? HAK_CHECKER_DATA[kategori]?.[jenisKasus] : null;

  return (
    <div className="bg-gradient-to-br from-rose-950/20 to-violet-950/20 border border-white/8 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center">
          <Shield className="w-4 h-4 text-rose-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-foreground">Checker Hak Korban</h3>
          <p className="text-[10px] text-muted-foreground">Pilih kategori dan jenis kasus untuk melihat hak & langkah yang tersedia</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Kategori Korban</p>
          <div className="grid grid-cols-2 gap-2">
            {(["perempuan", "anak"] as const).map((k) => (
              <button
                key={k}
                onClick={() => { setKategori(k); setJenisKasus(null); }}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  kategori === k
                    ? "bg-rose-500/20 border-rose-400/50 text-rose-300"
                    : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
                }`}
              >
                {k === "perempuan" ? <><Heart className="w-4 h-4" /> Perempuan Dewasa</> : <><Baby className="w-4 h-4" /> Anak (&lt;18 Tahun)</>}
              </button>
            ))}
          </div>
        </div>

        {kategori && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Jenis Kekerasan / Kasus</p>
            <div className="grid gap-2">
              {Object.keys(HAK_CHECKER_DATA[kategori]).map((jenis) => (
                <button
                  key={jenis}
                  onClick={() => setJenisKasus(jenis)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    jenisKasus === jenis
                      ? "bg-violet-500/20 border-violet-400/50 text-violet-300"
                      : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
                  }`}
                >
                  {jenis}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {result && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 pt-2 border-t border-white/8"
            >
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hak-hak Anda sebagai Korban
                </p>
                <ul className="space-y-1.5">
                  {result.hak.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4">
                <p className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" /> Langkah yang Perlu Dilakukan
                </p>
                <ul className="space-y-1.5">
                  {result.langkah.map((l, i) => (
                    <li key={i} className="text-xs text-muted-foreground leading-relaxed">{l}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-violet-500/10 border border-violet-500/20 p-4">
                <p className="text-xs font-bold text-violet-400 mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Lembaga yang Dapat Membantu
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.lembaga.map((l, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-300">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function FaqPerlindungan() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_PERLINDUNGAN.map((faq, i) => (
        <motion.div key={i} className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-foreground leading-snug">{faq.q}</span>
            <ChevronRight className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-3">{faq.a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

export default function KlinikPerlindungan() {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-28">

        {/* ─── HERO ─── */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-950/30 via-background to-violet-950/20 pointer-events-none" />
          <div className="absolute top-20 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-[100px]" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-300 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" /> Perlindungan Perempuan & Anak
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight">
              Klinik Hukum{" "}
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                Perlindungan<br className="hidden md:block" /> Perempuan & Anak
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Panduan implementasi UU PKDRT, UU Perlindungan Anak, dan UU TPKS — dari pengaduan hingga pemulihan. Dilengkapi checker hak korban interaktif, alur perlindungan 5 tahap, dan 8 template dokumen.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {[
                { emoji: "⚖️", val: "3 UU + 1 PP", label: "Dasar Hukum" },
                { emoji: "🛡️", val: "5 Tahap", label: "Alur Perlindungan" },
                { emoji: "📋", val: "8 Template", label: "Dokumen Siap Pakai" },
                { emoji: "📞", val: "SAPA 129", label: "Hotline Nasional" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/8 bg-white/4 p-4 flex flex-col items-center gap-1">
                  <span className="text-xl">{s.emoji}</span>
                  <span className="text-sm font-black text-foreground">{s.val}</span>
                  <span className="text-[10px] text-muted-foreground text-center">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── EMERGENCY HOTLINES ─── */}
        <section className="py-8 bg-rose-950/20 border-y border-rose-500/15">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Darurat? Hubungi Segera</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {HOTLINES.map((h) => (
                <div key={h.nama} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <p className={`text-lg font-black ${h.color}`}>{h.nomor}</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{h.nama}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── DASAR HUKUM ─── */}
        <section className="py-14 border-b border-white/8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-foreground mb-2">Dasar Hukum Perlindungan</h2>
              <p className="text-muted-foreground text-sm">Empat instrumen hukum utama yang melindungi perempuan dan anak di Indonesia</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {UU_CARDS.map((u) => (
                <div key={u.kode} className={`rounded-2xl border p-5 ${u.border}`}>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${u.bg} mb-3`}>
                    <span className={`text-xs font-black bg-gradient-to-r ${u.warna} bg-clip-text text-transparent`}>{u.kode}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2 leading-snug">{u.judul}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{u.ringkasan}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                    <BookOpen className="w-3 h-3" /> Pasal-pasal kunci: {u.pasal}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ALUR PERLINDUNGAN 5 TAHAP ─── */}
        <section className="py-14 border-b border-white/8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-foreground mb-2">Alur Perlindungan — 5 Tahap</h2>
              <p className="text-muted-foreground text-sm">Klik setiap tahap untuk melihat dokumen yang diperlukan dan tips hukum.</p>
            </div>

            <div className="space-y-3">
              {ALUR_STAGES.map((stage, idx) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <button
                    onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${stage.border} ${activeStage === stage.id ? "bg-white/5" : "bg-white/2 hover:bg-white/4"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center flex-shrink-0 text-white font-black text-xs shadow-lg ${stage.glow}`}>
                        {stage.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-foreground">{stage.emoji} {stage.label}</span>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="w-3 h-3" /> {stage.duration}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{stage.basis}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${activeStage === stage.id ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {activeStage === stage.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className={`rounded-b-2xl border-x border-b ${stage.border} bg-white/3 px-5 py-5 space-y-4`}>
                          <p className="text-sm text-muted-foreground leading-relaxed">{stage.desc}</p>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-rose-400" /> Dokumen yang Diperlukan
                              </p>
                              <ul className="space-y-1.5">
                                {stage.docs.map((d) => (
                                  <li key={d} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {d}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
                              <p className="text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5" /> Tips Hukum
                              </p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{stage.tips}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <Link href="/vault">
                              <button className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/25 text-rose-300 hover:bg-rose-500/25 transition-colors">
                                <FileText className="w-3 h-3" /> Unduh Template
                              </button>
                            </Link>
                            <Link href="/lexbot">
                              <button className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/25 text-violet-300 hover:bg-violet-500/25 transition-colors">
                                <Sparkles className="w-3 h-3" /> Tanya Chaesa Lexbot
                              </button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CHECKER HAK KORBAN ─── */}
        <section className="py-14 border-b border-white/8 bg-gradient-to-b from-background to-card/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-foreground mb-2">Hak Apa yang Saya Miliki?</h2>
              <p className="text-muted-foreground text-sm">Pilih kategori korban dan jenis kasus untuk melihat hak, langkah, dan lembaga yang dapat membantu Anda.</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <HakCorbanChecker />
            </div>
          </div>
        </section>

        {/* ─── TEMPLATE DOKUMEN ─── */}
        <section className="py-14 border-b border-white/8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-foreground mb-2">Template Dokumen Perlindungan</h2>
              <p className="text-muted-foreground text-sm">8 template dokumen hukum siap pakai untuk kasus perlindungan perempuan dan anak</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TEMPLATE_DOCS.map((doc) => (
                <Link key={doc.nama} href="/vault">
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-4 hover:bg-white/6 hover:border-rose-500/20 transition-all cursor-pointer group">
                    <span className="text-2xl block mb-2">{doc.icon}</span>
                    <p className="text-xs font-bold text-foreground group-hover:text-rose-300 transition-colors leading-snug mb-1">{doc.nama}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{doc.ket}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/vault">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                  <FileText className="w-4 h-4" /> Lihat Semua Template di Vault
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── LEMBAGA PENDUKUNG ─── */}
        <section className="py-14 border-b border-white/8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-foreground mb-2">Lembaga & Layanan Pendukung</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { nama: "UPTD PPA", kepanjangan: "Unit Pelaksana Teknis Daerah Perlindungan Perempuan dan Anak", layanan: "Pendampingan psikologis, hukum, sosial, medis. Tersedia di seluruh Kabupaten/Kota.", icon: "🏛️", color: "text-rose-400", border: "border-rose-500/20" },
                { nama: "LPSK", kepanjangan: "Lembaga Perlindungan Saksi dan Korban", layanan: "Perlindungan fisik, bantuan medis & psikologis, restitusi, kompensasi. Hotline: 1-500-006.", icon: "🛡️", color: "text-violet-400", border: "border-violet-500/20" },
                { nama: "P2TP2A", kepanjangan: "Pusat Pelayanan Terpadu Pemberdayaan Perempuan dan Anak", layanan: "Konsultasi, pendampingan hukum, shelter, layanan medis & psikologis di seluruh provinsi.", icon: "🏠", color: "text-blue-400", border: "border-blue-500/20" },
                { nama: "KPAI", kepanjangan: "Komisi Perlindungan Anak Indonesia", layanan: "Pengaduan kasus anak, advokasi kebijakan, pemantauan implementasi UU Perlindungan Anak.", icon: "👶", color: "text-emerald-400", border: "border-emerald-500/20" },
                { nama: "Komnas Perempuan", kepanjangan: "Komisi Nasional Anti Kekerasan terhadap Perempuan", layanan: "Pemantauan kasus kekerasan, rekomendasi kebijakan, pendampingan advokasi.", icon: "⚖️", color: "text-amber-400", border: "border-amber-500/20" },
                { nama: "LBH / YLBHI", kepanjangan: "Lembaga Bantuan Hukum / Yayasan LBH Indonesia", layanan: "Bantuan hukum GRATIS bagi korban tidak mampu, pendampingan perkara hingga pengadilan.", icon: "📚", color: "text-cyan-400", border: "border-cyan-500/20" },
              ].map((l) => (
                <div key={l.nama} className={`rounded-2xl border bg-white/3 p-5 ${l.border}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{l.icon}</span>
                    <div>
                      <p className={`text-sm font-black ${l.color}`}>{l.nama}</p>
                      <p className="text-[10px] text-muted-foreground/60 mb-2">{l.kepanjangan}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{l.layanan}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-14 border-b border-white/8 bg-gradient-to-b from-background to-card/20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-foreground mb-2">Pertanyaan yang Sering Ditanyakan</h2>
            </div>
            <FaqPerlindungan />
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-950/30 via-background to-violet-950/20 pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-rose-500/25">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">
                Butuh Bantuan Segera?
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-xl mx-auto">
                Chaesa Lexbot dapat membantu Anda memahami hak hukum Anda dan langkah apa yang harus diambil. Konsultasi gratis, tersedia 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/lexbot">
                  <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-rose-500/25">
                    <Sparkles className="w-4 h-4" /> Konsultasi dengan Chaesa Lexbot
                  </button>
                </Link>
                <Link href="/agents">
                  <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 transition-all">
                    <Users className="w-4 h-4" /> Konsultasi Pakar Hukum AI
                  </button>
                </Link>
              </div>
              <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-xl mx-auto">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300/80 leading-relaxed">
                    <strong className="text-amber-300">Kerahasiaan terjamin.</strong> Semua informasi yang Anda bagikan kepada Chaesa Lexbot dienkripsi dan tidak disimpan untuk tujuan lain. Identitas Anda tidak akan dibagikan kepada pihak manapun.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
