export type RisikoLevel = "KRITIS" | "TINGGI" | "SEDANG" | "RENDAH";

export interface ChecklistItem {
  id: string;
  label: string;
  deadline?: string;
}

export interface IsuRegulasi {
  id: string;
  kategori: string;
  kategoriIcon: string;
  risikoLevel: RisikoLevel;
  risikoSkor: number;
  judul: string;
  regulasiRef: string;
  tanggalEfektif: string;
  tanggalUpdate: string;
  ringkasan: string;
  dampakBisnis: string;
  entitasTerdampak: string[];
  analisisAI: string;
  rekomendasiAI: string[];
  checklist: ChecklistItem[];
  sanksi?: string;
  sumberRef?: string;
}

export const KATEGORI_FILTER = [
  { id: "semua", label: "Semua Isu", icon: "🔍" },
  { id: "oss", label: "OSS & Perizinan", icon: "🏢" },
  { id: "ai", label: "Teknologi AI", icon: "🤖" },
  { id: "pdp", label: "Data & Privasi", icon: "🔒" },
  { id: "platform", label: "Platform Digital", icon: "📱" },
  { id: "insentif", label: "Insentif & Pajak", icon: "💰" },
  { id: "pusatdata", label: "Pusat Data", icon: "🖥️" },
];

export const DATA_ISU: IsuRegulasi[] = [
  // ─── I. OSS & PERIZINAN ─────────────────────────────────────────────────────
  {
    id: "oss-001",
    kategori: "oss",
    kategoriIcon: "🏢",
    risikoLevel: "TINGGI",
    risikoSkor: 78,
    judul: "Mekanisme Verifikasi Semi Manual Baru Perubahan Data Perusahaan",
    regulasiRef: "Permenkum No. 49/2025 (perubahan Permenkumham 21/2021)",
    tanggalEfektif: "27 Oktober 2025",
    tanggalUpdate: "16 Februari 2026",
    ringkasan:
      "Kemenkumham menerapkan verifikasi substantif manual via telepon/email untuk perubahan direksi, komisaris, transfer saham, dan nama pemegang saham melalui SABH. Proses dapat memakan waktu hingga 14 hari kerja.",
    dampakBisnis:
      "Perubahan data korporasi kini memerlukan konfirmasi langsung via telepon atau email oleh pihak terkait. Penundaan 14 hari dapat mengganggu operasional bisnis, terutama saat restrukturisasi perusahaan.",
    entitasTerdampak: ["Perseroan Terbatas (PT)", "PT Penanaman Modal Asing (PMA)", "Firma Hukum Korporat", "Notaris"],
    analisisAI:
      "Permenkum 49/2025 memperkenalkan dualisme mekanisme (persetujuan vs. pemberitahuan) yang menciptakan ketidakjelasan kategorisasi perubahan data perusahaan. Keharusan konfirmasi langsung, sementara meningkatkan tata kelola, berdampak material pada kecepatan transaksi korporat — khususnya untuk M&A dan restrukturisasi yang time-sensitive. Risiko penolakan jika pihak terkait tidak dapat dihubungi menambah lapisan ketidakpastian hukum.",
    rekomendasiAI: [
      "Perbarui data kontak (email & telepon) seluruh direksi dan komisaris di sistem SABH segera",
      "Pastikan ketersediaan seluruh pejabat yang berwenang selama proses pengajuan perubahan",
      "Siapkan dokumen pendukung lengkap sebelum pengajuan (akta notaris, RUPS, laporan keuangan)",
      "Konsultasikan dengan notaris mengenai kategorisasi perubahan: persetujuan vs. pemberitahuan",
      "Anggarkan lead time tambahan 14-21 hari untuk setiap perubahan data korporasi",
    ],
    checklist: [
      { id: "c1", label: "Update data kontak direksi & komisaris di SABH", deadline: "Segera" },
      { id: "c2", label: "Verifikasi klasifikasi perubahan AD (persetujuan vs pemberitahuan)", deadline: "Sebelum pengajuan" },
      { id: "c3", label: "Siapkan salinan akta notaris, RUPS, dan dokumen pendukung", deadline: "Sebelum pengajuan" },
      { id: "c4", label: "Konfirmasi ketersediaan pihak terkait selama 14 hari verifikasi" },
      { id: "c5", label: "Sampaikan laporan tahunan RUPS kepada Menkum via SABH", deadline: "30 hari kerja sejak penandatanganan akta" },
    ],
    sanksi: "Teguran tertulis dan pemblokiran akses ke sistem SABH",
    sumberRef: "Permenkum 49/2025, UU No. 40/2007 tentang PT",
  },
  {
    id: "oss-002",
    kategori: "oss",
    kategoriIcon: "🏢",
    risikoLevel: "SEDANG",
    risikoSkor: 62,
    judul: "Perpanjangan Kesesuaian Kegiatan Pemanfaatan Ruang (KKPR) — Hambatan Sistem OSS",
    regulasiRef: "PP No. 21/2021, Permen ATR/BPN No. 13/2021",
    tanggalEfektif: "1 Januari 2022 (update OSS 2025)",
    tanggalUpdate: "16 Februari 2026",
    ringkasan:
      "Proses perpanjangan KKPR melalui sistem OSS mengalami hambatan teknis dan prosedural yang signifikan, termasuk ketidaksesuaian data RDTR, penundaan konfirmasi pemerintah daerah, dan ketidakjelasan persyaratan perpanjangan untuk bisnis yang beroperasi di zona campuran.",
    dampakBisnis:
      "Bisnis teknologi (data center, tower telekomunikasi, kantor pusat) mengalami ketidakpastian operasional karena KKPR kedaluwarsa tanpa kepastian perpanjangan. Risiko sanksi administratif dan penghentian operasional.",
    entitasTerdampak: ["Operator Pusat Data", "Perusahaan Telekomunikasi", "Pengembang Properti Komersial", "Bisnis TIK"],
    analisisAI:
      "Fragmentasi antara sistem OSS Pusat dan database RDTR Pemda menciptakan celah sinkronisasi yang merugikan pelaku usaha. Ketiadaan SLA (Service Level Agreement) untuk konfirmasi Pemda membuat ketidakpastian perpanjangan KKPR menjadi struktural. Bisnis di zona campuran (perumahan-komersial) menghadapi ambiguitas klasifikasi yang memerlukan klarifikasi regulasi lintas kementerian.",
    rekomendasiAI: [
      "Monitor tanggal kedaluwarsa KKPR minimal 6 bulan sebelum jatuh tempo",
      "Koordinasikan dengan Pemda terkait untuk konfirmasi data RDTR terkini",
      "Siapkan dokumen pelengkap termasuk bukti operasional dan rencana pengembangan",
      "Pertimbangkan konsultasi dengan konsultan perizinan untuk zona campuran",
    ],
    checklist: [
      { id: "c1", label: "Verifikasi tanggal kedaluwarsa KKPR di dashboard OSS", deadline: "Segera" },
      { id: "c2", label: "Ajukan perpanjangan KKPR minimal 3 bulan sebelum kedaluwarsa" },
      { id: "c3", label: "Konfirmasi kesesuaian RDTR dengan Dinas tata ruang setempat" },
      { id: "c4", label: "Siapkan dokumen teknis operasional (gambar site, IMB/PBG)" },
    ],
    sanksi: "Penghentian operasional sementara, pencabutan izin usaha",
    sumberRef: "PP No. 21/2021, Permen ATR/BPN No. 13/2021",
  },
  {
    id: "oss-003",
    kategori: "oss",
    kategoriIcon: "🏢",
    risikoLevel: "SEDANG",
    risikoSkor: 55,
    judul: "Perubahan dan Pembaruan Klasifikasi KBLI untuk Sektor Teknologi & Digital",
    regulasiRef: "Peraturan BPS (KBLI 2020 rev. 2024), Kepmen Koordinator Bidang Perekonomian",
    tanggalEfektif: "Bertahap sejak 2024",
    tanggalUpdate: "16 Februari 2026",
    ringkasan:
      "Pembaruan KBLI untuk sektor teknologi digital memperkenalkan kode-kode baru yang lebih spesifik (AI services, cloud computing, platform marketplace, fintech), namun menimbulkan kebingungan bagi bisnis yang model usahanya mencakup beberapa kode KBLI secara bersamaan.",
    dampakBisnis:
      "Pemilihan KBLI yang tidak tepat berisiko menimbulkan inkonsistensi izin, penolakan di sistem OSS, atau ketidaksesuaian dengan persyaratan regulasi sektor-spesifik (OJK, Kominfo, BPKN).",
    entitasTerdampak: ["Startup Teknologi", "Platform E-Commerce", "Penyedia Layanan Cloud", "Perusahaan Fintech", "AI Startup"],
    analisisAI:
      "Konvergensi layanan digital (AI + fintech + marketplace dalam satu platform) menyulitkan penerapan KBLI tunggal. Sistem OSS saat ini belum mengakomodasi multi-KBLI yang sepenuhnya terintegrasi, menciptakan risiko ketidakpatuhan bagi super-app dan platform yang beroperasi lintas sektor. Bisnis AI yang menawarkan layanan kepada sektor keuangan atau kesehatan berpotensi wajib memperoleh izin sektor tambahan.",
    rekomendasiAI: [
      "Lakukan audit KBLI aktif di sistem OSS dan sesuaikan dengan model bisnis terkini",
      "Konsultasikan dengan BPS atau konsultan hukum untuk KBLI yang paling tepat",
      "Perhatikan KBLI tambahan untuk layanan AI ke sektor regulasi (keuangan, kesehatan)",
      "Update KBLI di OSS sebelum perpanjangan izin usaha berikutnya",
    ],
    checklist: [
      { id: "c1", label: "Audit semua kode KBLI aktif di sistem OSS bisnis Anda" },
      { id: "c2", label: "Bandingkan KBLI dengan model bisnis aktual 2025-2026" },
      { id: "c3", label: "Ajukan perubahan KBLI jika ada ketidaksesuaian material" },
      { id: "c4", label: "Periksa implikasi KBLI baru terhadap kewajiban sektoral (OJK/Kominfo)" },
    ],
    sumberRef: "KBLI 2020 rev. 2024, Perpres No. 49/2021 (OSS-RBA)",
  },

  // ─── II. TEKNOLOGI AI ────────────────────────────────────────────────────────
  {
    id: "ai-001",
    kategori: "ai",
    kategoriIcon: "🤖",
    risikoLevel: "KRITIS",
    risikoSkor: 91,
    judul: "Ketiadaan Kerangka Regulasi AI yang Komprehensif dan Mengikat",
    regulasiRef: "SE Menkominfo No. 9/2023 (soft law), RUU AI (masih dalam pembahasan)",
    tanggalEfektif: "Berkelanjutan — regulasi mengikat belum ada",
    tanggalUpdate: "28 Maret 2026",
    ringkasan:
      "Indonesia belum memiliki regulasi AI yang komprehensif dan mengikat. Surat Edaran Menkominfo tentang Etika AI bersifat non-binding. RUU AI masih dalam pembahasan di DPR. Ketiadaan regulasi menciptakan risiko operasional dan reputasi bagi bisnis yang menggunakan AI — terutama di sektor keuangan, kesehatan, dan hukum.",
    dampakBisnis:
      "Bisnis AI beroperasi di area abu-abu hukum. Ketidakpastian ini memengaruhi keputusan investasi, pengembangan produk, serta potensi paparan hukum ketika sistem AI menghasilkan output yang berdampak material pada konsumen.",
    entitasTerdampak: ["Seluruh perusahaan yang menggunakan AI", "Fintech & Insurtech", "Healthtech", "LegalTech", "EdTech", "Platform E-Commerce"],
    analisisAI:
      "Vakum regulasi AI Indonesia menciptakan paradoks: bisnis terdorong adopsi AI untuk efisiensi, namun tanpa kepastian hukum mengenai akuntabilitas, transparansi, dan bias. Ketika RUU AI akhirnya disahkan, besar kemungkinan akan menerapkan pendekatan berbasis risiko (seperti EU AI Act) — bisnis yang tidak memulai persiapan governance AI dari sekarang akan menghadapi biaya compliance yang jauh lebih tinggi. Sektor keuangan dan kesehatan memiliki risiko tertinggi karena sudah ada regulasi sektoral yang dapat berinteraksi dengan penggunaan AI (POJK, Permenkes).",
    rekomendasiAI: [
      "Kembangkan kebijakan internal AI Governance sekarang, sebelum regulasi mengikat berlaku",
      "Dokumentasikan model AI yang digunakan, sumber data training, dan mekanisme bias mitigation",
      "Terapkan prinsip transparansi AI kepada pengguna (jelaskan kapan berinteraksi dengan AI)",
      "Pantau perkembangan RUU AI di DPR dan konsultasikan dengan counsel hukum secara berkala",
      "Untuk AI di sektor keuangan/kesehatan: pastikan kepatuhan dengan regulasi OJK/Kemenkes yang sudah ada",
    ],
    checklist: [
      { id: "c1", label: "Buat inventaris semua sistem AI yang digunakan dalam operasional bisnis" },
      { id: "c2", label: "Kembangkan AI Policy internal mencakup governance, bias, akuntabilitas" },
      { id: "c3", label: "Implementasikan mekanisme pengungkapan penggunaan AI kepada pengguna" },
      { id: "c4", label: "Tunjuk AI Compliance Officer atau koordinator AI governance" },
      { id: "c5", label: "Pantau perkembangan RUU AI dan EU AI Act sebagai benchmark" },
    ],
    sanksi: "Belum ada sanksi spesifik AI — namun potensi gugatan perdata dan reputasi",
    sumberRef: "SE Menkominfo No. 9/2023, Draft RUU AI Indonesia 2025",
  },
  {
    id: "ai-002",
    kategori: "ai",
    kategoriIcon: "🤖",
    risikoLevel: "TINGGI",
    risikoSkor: 82,
    judul: "Ketidakpastian Hukum Penggunaan AI di Sektor Keuangan dan Kesehatan",
    regulasiRef: "POJK No. 21/2023 (Inovasi Teknologi Keuangan), Permenkes No. 24/2022 (TIK Kesehatan)",
    tanggalEfektif: "Berlaku, implementasi bertahap",
    tanggalUpdate: "28 Maret 2026",
    ringkasan:
      "Meski tidak ada regulasi AI khusus, sektor keuangan (OJK) dan kesehatan (Kemenkes) sudah memiliki regulasi digital yang secara implisit mencakup penggunaan AI. Ambiguitas tentang kewajiban explainability AI, akuntabilitas keputusan otomatis, dan privasi data dalam konteks AI menciptakan risiko hukum spesifik sektor.",
    dampakBisnis:
      "Fintech yang menggunakan AI untuk credit scoring, fraud detection, atau investment advice wajib mempertimbangkan kewajiban disclosure OJK. Healthtech yang menggunakan AI untuk diagnosis atau triase wajib mematuhi standar klinisnya.",
    entitasTerdampak: ["P2P Lending", "Robo-Advisor", "Insurtech", "Startup Healthtech", "Telemedicine", "AI Diagnostik Medis"],
    analisisAI:
      "POJK No. 21/2023 mewajibkan inovasi keuangan melalui sandboxing, namun tidak secara eksplisit mengatur AI. OJK cenderung menerapkan prinsip 'sama risiko, sama regulasi' — artinya AI dalam keputusan kredit harus memenuhi standar explainability yang sama seperti proses manual. Di sektor kesehatan, penggunaan AI untuk keputusan klinis berpotensi berimplikasi pada standar profesi medis dan kewajiban malpraktik.",
    rekomendasiAI: [
      "Konsultasikan penggunaan AI credit scoring/fraud detection dengan OJK via sandbox IFSF",
      "Pastikan model AI di sektor keuangan dapat dijelaskan (explainable AI) kepada regulator",
      "Dapatkan persetujuan Kemenkes untuk sistem AI yang mendukung keputusan klinis",
      "Dokumentasikan tanggung jawab human-in-the-loop untuk keputusan AI bernilai tinggi",
    ],
    checklist: [
      { id: "c1", label: "Audit penggunaan AI dalam keputusan keuangan/kesehatan yang berdampak material" },
      { id: "c2", label: "Implementasikan explainability layer untuk model AI kredit/asuransi" },
      { id: "c3", label: "Konsultasikan dengan OJK/Kemenkes terkait penggunaan AI yang direncanakan" },
      { id: "c4", label: "Tetapkan kebijakan human oversight untuk keputusan AI berisiko tinggi" },
    ],
    sumberRef: "POJK No. 21/2023, Permenkes No. 24/2022, SE OJK terkait inovasi digital",
  },

  // ─── III. DATA & PRIVASI ─────────────────────────────────────────────────────
  {
    id: "pdp-001",
    kategori: "pdp",
    kategoriIcon: "🔒",
    risikoLevel: "KRITIS",
    risikoSkor: 88,
    judul: "Kekurangan Prosedur Teknis Detail untuk Pemrosesan Data Pribadi (UU PDP)",
    regulasiRef: "UU No. 27/2022 tentang Pelindungan Data Pribadi (masa transisi 2 tahun berakhir Oktober 2024)",
    tanggalEfektif: "17 Oktober 2024 (masa transisi berakhir)",
    tanggalUpdate: "28 Maret 2026",
    ringkasan:
      "Masa transisi 2 tahun UU PDP telah berakhir Oktober 2024. Namun peraturan pemerintah (PP) dan peraturan teknis turunannya belum sepenuhnya diterbitkan. Bisnis menghadapi ketidakpastian dalam mengimplementasikan standar teknis pemrosesan data yang sesuai tanpa panduan yang jelas.",
    dampakBisnis:
      "Bisnis yang memroses data pribadi (hampir semua bisnis digital) secara teknis sudah wajib mematuhi UU PDP namun tanpa kepastian teknis implementasi. Risiko sanksi administratif (Rp 2% pendapatan tahunan) dan pidana.",
    entitasTerdampak: ["Platform Digital", "E-Commerce", "Fintech", "Healthtech", "EdTech", "Semua bisnis yang memroses data pengguna"],
    analisisAI:
      "UU PDP mengadopsi prinsip GDPR Eropa namun dengan keterbatasan implementasi: tidak ada Lembaga Pengawas independen yang definitif, tidak ada panduan teknis spesifik untuk transfer data, dan prosedur DPO (Data Protection Officer) belum distandarisasi. Bisnis yang menunggu regulasi teknis lengkap mengambil risiko hukum — lebih prudent untuk mengimplementasikan standar GDPR sebagai proxy sambil menunggu aturan teknis Indonesia.",
    rekomendasiAI: [
      "Mulai implementasi UU PDP sekarang tanpa menunggu PP teknis — gunakan GDPR sebagai benchmark",
      "Tunjuk Data Protection Officer (DPO) atau person-in-charge pelindungan data",
      "Buat dan publikasikan Privacy Notice yang jelas dan mudah dipahami",
      "Dokumentasikan semua aktivitas pemrosesan data (Record of Processing Activities/ROPA)",
      "Implementasikan mekanisme consent yang valid: bebas, spesifik, terinformasi, tidak ambigu",
    ],
    checklist: [
      { id: "c1", label: "Tunjuk Data Protection Officer (DPO) atau koordinator PDP", deadline: "Segera" },
      { id: "c2", label: "Buat Register Aktivitas Pemrosesan Data (ROPA) lengkap", deadline: "Q2 2026" },
      { id: "c3", label: "Perbarui Privacy Policy sesuai UU PDP (bahasa Indonesia, mudah dipahami)", deadline: "Q1 2026" },
      { id: "c4", label: "Implementasikan mekanisme persetujuan (consent) yang memenuhi standar UU PDP" },
      { id: "c5", label: "Siapkan prosedur respons permintaan hak subjek data (akses, hapus, portabilitas)" },
      { id: "c6", label: "Buat rencana respons kebocoran data (72 jam notifikasi kepada otoritas)" },
    ],
    sanksi: "Administratif: denda hingga 2% pendapatan tahunan. Pidana: hingga 6 tahun penjara dan/atau denda Rp 6 miliar",
    sumberRef: "UU No. 27/2022 tentang PDP, Draft PP PDP",
  },
  {
    id: "pdp-002",
    kategori: "pdp",
    kategoriIcon: "🔒",
    risikoLevel: "TINGGI",
    risikoSkor: 76,
    judul: "Ketidakjelasan Transfer Data Pribadi Lintas Negara",
    regulasiRef: "Pasal 56-57 UU No. 27/2022, Draft PP PDP (belum disahkan)",
    tanggalEfektif: "17 Oktober 2024",
    tanggalUpdate: "28 Maret 2026",
    ringkasan:
      "UU PDP membolehkan transfer data lintas negara hanya jika negara tujuan memiliki tingkat perlindungan data yang setara. Namun belum ada daftar resmi negara yang disetujui (whitelist) dan mekanisme penilaian ekuivalensinya belum ditetapkan oleh regulator.",
    dampakBisnis:
      "Bisnis yang menggunakan cloud asing (AWS, GCP, Azure), tools SaaS internasional, atau memiliki operasi global menghadapi risiko hukum dalam transfer data. Ini mencakup penggunaan tools AI internasional yang memroses data pengguna Indonesia.",
    entitasTerdampak: ["Semua bisnis yang menggunakan cloud asing", "Perusahaan multinasional", "Startup yang menggunakan SaaS internasional", "Platform dengan data Indonesia di server luar negeri"],
    analisisAI:
      "Ketidakjelasan transfer data menciptakan compliance paradox: bisnis modern hampir mustahil beroperasi tanpa transfer data lintas negara, namun belum ada mekanisme sah yang definitif. Solusi pragmatis termasuk Standard Contractual Clauses (SCC) ala GDPR sebagai fallback, lokalisasi data untuk data sensitif di Indonesia, dan mapping semua aliran data ke vendor asing.",
    rekomendasiAI: [
      "Buat Data Flow Mapping untuk semua transfer data keluar Indonesia",
      "Implementasikan Standard Contractual Clauses (SCC) dengan vendor/cloud asing",
      "Pertimbangkan lokalisasi data sensitif (data kesehatan, keuangan) di server Indonesia",
      "Pantau daftar whitelist negara dari regulator ketika diterbitkan",
    ],
    checklist: [
      { id: "c1", label: "Peta semua aliran data ke vendor/cloud luar negeri (Data Flow Mapping)" },
      { id: "c2", label: "Review kontrak dengan vendor asing — tambahkan klausul pelindungan data" },
      { id: "c3", label: "Implementasikan SCC atau mekanisme transfer data yang setara" },
      { id: "c4", label: "Evaluasi opsi lokalisasi data untuk kategori data sensitif" },
    ],
    sanksi: "Potensi sanksi sesuai Pasal 57 UU PDP dan PP pelaksana yang akan terbit",
    sumberRef: "Pasal 56-57 UU No. 27/2022, GDPR Chapter V (sebagai referensi)",
  },
  {
    id: "pdp-003",
    kategori: "pdp",
    kategoriIcon: "🔒",
    risikoLevel: "TINGGI",
    risikoSkor: 71,
    judul: "Tantangan Pengelolaan Persetujuan (Consent) di Sektor Layanan Keuangan",
    regulasiRef: "UU PDP Pasal 20-35, POJK No. 22/2023 (Pelindungan Konsumen Sektor Jasa Keuangan)",
    tanggalEfektif: "Berlaku",
    tanggalUpdate: "28 Maret 2026",
    ringkasan:
      "Sektor jasa keuangan menghadapi tantangan unik: mekanisme consent UU PDP yang ketat berbenturan dengan kebutuhan operasional (KYC, AML, credit scoring) yang memerlukan pemrosesan data tanpa consent eksplisit per transaksi. Ketidakselarasan antara UU PDP dan regulasi OJK menciptakan ambiguitas kepatuhan.",
    dampakBisnis:
      "Fintech, bank digital, P2P lending, dan asuransi digital harus merancang ulang alur onboarding dan pemrosesan data agar memenuhi dua rezim regulasi yang sebagian tumpang tindih.",
    entitasTerdampak: ["Bank Digital", "Fintech P2P Lending", "Perusahaan Asuransi Digital", "Robo-Advisor", "BNPL (Buy Now Pay Later)"],
    analisisAI:
      "Konflik antara basis hukum UU PDP (legitimate interest vs. consent) dengan kewajiban OJK menciptakan kebutuhan untuk legal basis mapping yang cermat per jenis pemrosesan data. Pemrosesan untuk KYC dan AML dapat bertumpu pada 'kewajiban hukum' sebagai legal basis, sementara marketing dan profiling memerlukan consent eksplisit.",
    rekomendasiAI: [
      "Lakukan Legal Basis Mapping untuk setiap jenis pemrosesan data di operasional keuangan",
      "Pisahkan consent untuk pemrosesan wajib (KYC/AML) vs. opsional (marketing/profiling)",
      "Desain UX consent management yang jelas dan mudah di-revoke pengguna",
      "Koordinasikan kebijakan PDP dengan tim compliance OJK",
    ],
    checklist: [
      { id: "c1", label: "Mapping legal basis per jenis pemrosesan data (consent, kewajiban hukum, kepentingan sah)" },
      { id: "c2", label: "Redesign form consent onboarding — pisahkan mandatory vs. opsional" },
      { id: "c3", label: "Implementasikan consent management platform (CMP)" },
      { id: "c4", label: "Review kesesuaian kebijakan PDP dengan ketentuan POJK terkait" },
    ],
    sanksi: "Sanksi OJK (denda, pencabutan izin) + sanksi UU PDP (administratif + pidana)",
    sumberRef: "UU No. 27/2022 PDP, POJK No. 22/2023, POJK No. 21/2023",
  },

  // ─── IV. PLATFORM DIGITAL ────────────────────────────────────────────────────
  {
    id: "platform-001",
    kategori: "platform",
    kategoriIcon: "📱",
    risikoLevel: "TINGGI",
    risikoSkor: 73,
    judul: "Kurangnya Transparansi dalam Proses Pendaftaran PSE Kominfo",
    regulasiRef: "PP No. 71/2019, Permenkominfo No. 5/2020 (PSE Lingkup Privat)",
    tanggalEfektif: "Berlaku sejak 2022",
    tanggalUpdate: "28 Maret 2026",
    ringkasan:
      "Pelaku usaha melaporkan kurangnya transparansi dalam proses pendaftaran Penyelenggara Sistem Elektronik (PSE) — tidak ada timeline yang jelas, kriteria penolakan tidak dikomunikasikan, dan proses akreditasi untuk PSE kategori tertentu memerlukan dokumen yang tidak terdaftar dalam panduan resmi.",
    dampakBisnis:
      "Platform digital yang belum terdaftar sebagai PSE menghadapi risiko pemblokiran oleh Kominfo. Ketidakjelasan proses memperpanjang waktu pendaftaran dan meningkatkan biaya compliance.",
    entitasTerdampak: ["Platform Digital", "Aplikasi Mobile", "Portal Berita Online", "Platform E-Commerce", "SaaS B2B"],
    analisisAI:
      "Kasus pemblokiran platform internasional (Paypal, Steam, dll.) di 2022 menunjukkan keseriusan risiko ketidakpatuhan PSE. Meski kemudian dibuka, insiden tersebut menggambarkan dampak operasional signifikan. Bisnis yang beroperasi di Indonesia — baik domestik maupun internasional — wajib mendaftar PSE tanpa terkecuali.",
    rekomendasiAI: [
      "Daftarkan semua sistem elektronik bisnis Anda sebagai PSE di portal oss.go.id",
      "Perbarui data PSE setiap ada perubahan signifikan dalam sistem (fitur baru, dll.)",
      "Dokumentasikan semua korespondesi dengan Kominfo terkait pendaftaran PSE",
      "Konsultasikan interpretasi persyaratan PSE dengan konsultan hukum TI",
    ],
    checklist: [
      { id: "c1", label: "Cek status pendaftaran PSE semua platform/aplikasi di portal OSS", deadline: "Segera" },
      { id: "c2", label: "Daftarkan PSE baru sebelum diluncurkan ke publik" },
      { id: "c3", label: "Perbarui data PSE setiap perubahan signifikan sistem elektronik" },
      { id: "c4", label: "Simpan bukti pendaftaran dan sertifikat PSE untuk keperluan audit" },
    ],
    sanksi: "Pemblokiran akses platform oleh Kominfo",
    sumberRef: "PP No. 71/2019, Permenkominfo No. 5/2020",
  },
  {
    id: "platform-002",
    kategori: "platform",
    kategoriIcon: "📱",
    risikoLevel: "TINGGI",
    risikoSkor: 79,
    judul: "Persyaratan Baru Perlindungan Pengguna Anak di Platform Digital",
    regulasiRef: "UU No. 19/2016 (ITE Perubahan), Permenkominfo terkait Perlindungan Anak Online (2025)",
    tanggalEfektif: "Bertahap 2025-2026",
    tanggalUpdate: "28 Maret 2026",
    ringkasan:
      "Pemerintah Indonesia memperkuat regulasi perlindungan anak online, mengharuskan platform digital untuk mengimplementasikan verifikasi usia, fitur parental control, pembatasan konten, dan pelaporan CSAM (Child Sexual Abuse Material). Platform yang gagal comply menghadapi risiko pemblokiran dan sanksi pidana.",
    dampakBisnis:
      "Semua platform yang memungkinkan pengguna anak (game, media sosial, e-commerce, edukasi online) wajib menginvestasikan infrastruktur teknis untuk age verification dan parental control. Biaya compliance tinggi untuk startup.",
    entitasTerdampak: ["Platform Gaming", "Media Sosial", "Aplikasi Pendidikan", "Streaming Platform", "Marketplace"],
    analisisAI:
      "Tren global perlindungan anak online (UK Age Appropriate Design Code, EU DSA) mempercepat adopsi regulasi serupa di Indonesia. Platform yang beroperasi di Indonesia dengan pengguna potensial anak-anak harus melakukan Risk Assessment khusus dan mengimplementasikan 'best interests of the child' sebagai prinsip desain produk.",
    rekomendasiAI: [
      "Lakukan Child Risk Assessment untuk semua fitur platform",
      "Implementasikan age gate atau age verification yang efektif",
      "Kembangkan fitur parental control dan reporting untuk konten berbahaya bagi anak",
      "Buat kebijakan khusus perlindungan data anak (lebih ketat dari pengguna dewasa)",
    ],
    checklist: [
      { id: "c1", label: "Lakukan Child Safety Risk Assessment untuk platform Anda" },
      { id: "c2", label: "Implementasikan mekanisme age verification yang memadai" },
      { id: "c3", label: "Kembangkan fitur parental control dan pengaturan privasi anak" },
      { id: "c4", label: "Buat mekanisme pelaporan konten berbahaya bagi anak yang mudah diakses" },
      { id: "c5", label: "Tunjuk Child Safety Officer atau koordinator perlindungan anak" },
    ],
    sanksi: "Pemblokiran platform + sanksi pidana untuk pelanggaran CSAM",
    sumberRef: "UU No. 19/2016 (ITE), UU No. 35/2014 (Perlindungan Anak)",
  },
  {
    id: "platform-003",
    kategori: "platform",
    kategoriIcon: "📱",
    risikoLevel: "SEDANG",
    risikoSkor: 58,
    judul: "Moderasi Konten dan Tanggung Jawab Platform sebagai Pihak Ketiga",
    regulasiRef: "UU ITE (UU No. 1/2024), PP No. 71/2019, SE Kominfo No. 5/2023",
    tanggalEfektif: "Berlaku",
    tanggalUpdate: "28 Maret 2026",
    ringkasan:
      "UU ITE perubahan terbaru mempertegas kewajiban platform dalam moderasi konten, termasuk takedown konten ilegal dalam waktu 4x24 jam (darurat) dan 7x24 jam (non-darurat). Platform juga bertanggung jawab atas konten yang diunggah pihak ketiga jika tidak melakukan moderasi memadai.",
    dampakBisnis:
      "Platform UGC (User Generated Content) wajib memiliki tim dan sistem moderasi yang memadai. Kegagalan moderasi dapat berujung pada tanggung jawab hukum platform atas konten pengguna.",
    entitasTerdampak: ["Forum Online", "Platform Media Sosial", "Marketplace", "Platform Video", "Aplikasi Chat"],
    analisisAI:
      "Pergeseran dari 'notice and takedown' ke kewajiban moderasi proaktif menuntut investasi signifikan dalam teknologi (AI content moderation) dan SDM. Platform UGC skala besar memerlukan sistem hybrid AI-human moderation. Safe harbor provisions dalam UU ITE masih memerlukan klarifikasi regulasi tambahan.",
    rekomendasiAI: [
      "Implementasikan sistem moderasi konten otomatis (AI) untuk deteksi konten ilegal",
      "Buat SLA internal untuk merespons laporan konten: 4 jam untuk darurat, 24 jam standar",
      "Dokumentasikan semua tindakan moderasi sebagai bukti compliance",
      "Sediakan mekanisme appeal yang adil untuk konten yang di-takedown",
    ],
    checklist: [
      { id: "c1", label: "Audit sistem moderasi konten yang ada — apakah memenuhi standar UU ITE?" },
      { id: "c2", label: "Implementasikan atau upgrade sistem AI content moderation" },
      { id: "c3", label: "Buat SOP takedown konten dengan timeline 4x24 jam (darurat) / 7x24 jam (reguler)" },
      { id: "c4", label: "Latih tim moderasi human untuk konten yang memerlukan penilaian kontekstual" },
    ],
    sanksi: "Tanggung jawab hukum platform atas konten yang tidak dimoderasi + sanksi UU ITE",
    sumberRef: "UU No. 1/2024 (perubahan UU ITE), PP No. 71/2019",
  },

  // ─── V. INSENTIF & PAJAK ─────────────────────────────────────────────────────
  {
    id: "insentif-001",
    kategori: "insentif",
    kategoriIcon: "💰",
    risikoLevel: "RENDAH",
    risikoSkor: 30,
    judul: "Insentif Pajak untuk Bisnis yang Berfokus pada AI dan Operator Pusat Data",
    regulasiRef: "PP No. 10/2024 (Fasilitas PPh untuk Kegiatan Ekonomi Berpotensi Tinggi), Permenkeu No. 69/2023",
    tanggalEfektif: "2024-2026",
    tanggalUpdate: "28 Maret 2026",
    ringkasan:
      "Pemerintah Indonesia menawarkan berbagai insentif pajak untuk mendorong investasi di sektor AI dan pusat data — termasuk tax holiday, investment allowance, super deduction untuk R&D, dan pembebasan PPN untuk impor peralatan teknologi tertentu.",
    dampakBisnis:
      "Bisnis AI dan data center yang memenuhi syarat dapat menghemat signifikan melalui tax holiday (0% PPh badan 5-20 tahun), investment allowance (30-50% dari investasi), dan super deduction R&D (200-300% dari biaya R&D).",
    entitasTerdampak: ["Perusahaan AI", "Operator Pusat Data", "Startup Teknologi", "Perusahaan Cloud Computing"],
    analisisAI:
      "Insentif tax holiday tersedia untuk investasi minimum Rp 500 miliar di sektor prioritas (termasuk AI dan data center). Super deduction R&D 200-300% adalah peluang terbesar yang sering terlewat oleh startup — setiap Rp 1 yang dibelanjakan untuk riset AI dapat mengurangi beban pajak sebesar Rp 2-3. Syarat utama: investasi harus dalam bentuk PMDN atau PMA di bidang usaha yang tercantum dalam Daftar Prioritas Investasi.",
    rekomendasiAI: [
      "Evaluasi kelayakan untuk tax holiday — konsultasikan dengan BKPM/Kemenkeu",
      "Manfaatkan super deduction R&D 200-300% untuk pengeluaran riset AI",
      "Dokumentasikan semua pengeluaran R&D dengan baik untuk keperluan klaim pajak",
      "Pertimbangkan restrukturisasi entitas untuk memaksimalkan akses ke insentif",
    ],
    checklist: [
      { id: "c1", label: "Cek kelayakan tax holiday dan investment allowance di BKPM" },
      { id: "c2", label: "Dokumentasikan pengeluaran R&D untuk klaim super deduction" },
      { id: "c3", label: "Konsultasikan dengan konsultan pajak untuk optimasi insentif" },
      { id: "c4", label: "Daftarkan proyek AI/pusat data dalam skema insentif pajak yang relevan" },
    ],
    sumberRef: "PP No. 10/2024, Permenkeu No. 69/2023, PMK No. 128/2019 (Super Deduction R&D)",
  },

  // ─── VI. PUSAT DATA ──────────────────────────────────────────────────────────
  {
    id: "pusatdata-001",
    kategori: "pusatdata",
    kategoriIcon: "🖥️",
    risikoLevel: "TINGGI",
    risikoSkor: 75,
    judul: "Persyaratan Regulasi Kompleks untuk Operasional Pusat Data di Indonesia",
    regulasiRef: "PP No. 71/2019, Perpres No. 95/2018, Permenkominfo No. 2/2022 (Pusat Data Nasional)",
    tanggalEfektif: "Berlaku, bertahap",
    tanggalUpdate: "28 Maret 2026",
    ringkasan:
      "Operator pusat data di Indonesia wajib memenuhi rangkaian persyaratan yang mencakup: registrasi PSE, perizinan lokasi (KKPR, PBG), sertifikasi teknis (SNI/Tier Uptime Institute), pengelolaan keamanan siber (SNI 8799:2019), dan kewajiban lokal untuk data tertentu.",
    dampakBisnis:
      "Operator pusat data menghadapi regulatory burden tinggi dari multiple regulator (Kominfo, BSSN, ATR/BPN, ESDM untuk listrik). Timeline sertifikasi SNI bisa mencapai 12-18 bulan.",
    entitasTerdampak: ["Operator Pusat Data Komersial", "Hyperscaler (AWS, GCP, Azure)", "Perusahaan dengan Data Center In-House", "Colocation Providers"],
    analisisAI:
      "Pengembangan Pusat Data Nasional (PDN) oleh pemerintah menciptakan ekosistem regulasi baru yang belum sepenuhnya mature. Operator swasta perlu berkoordinasi dengan kebijakan PDN agar tidak redundan. Insiden peretasan PDN di 2024 mendorong pengetatan persyaratan keamanan siber yang berdampak pada seluruh ekosistem pusat data.",
    rekomendasiAI: [
      "Audit compliance pusat data terhadap seluruh persyaratan regulasi yang berlaku",
      "Mulai proses sertifikasi SNI lebih awal — timeline bisa 12-18 bulan",
      "Implementasikan SMKI (SNI ISO/IEC 27001) sebagai fondasi keamanan siber",
      "Koordinasikan dengan BSSN untuk persyaratan keamanan siber terkini",
    ],
    checklist: [
      { id: "c1", label: "Audit compliance terhadap PP No. 71/2019 dan Permenkominfo No. 2/2022" },
      { id: "c2", label: "Mulai proses sertifikasi SNI 8799:2019 (Keamanan Pusat Data)" },
      { id: "c3", label: "Pastikan perizinan lokasi (KKPR, PBG/IMB) lengkap dan valid" },
      { id: "c4", label: "Implementasikan standar keamanan siber BSSN yang relevan" },
      { id: "c5", label: "Daftarkan pusat data sebagai PSE jika belum" },
    ],
    sanksi: "Penutupan operasional, pencabutan izin, sanksi administratif Kominfo/BSSN",
    sumberRef: "PP No. 71/2019, Perpres No. 95/2018, Permenkominfo No. 2/2022",
  },
  {
    id: "pusatdata-002",
    kategori: "pusatdata",
    kategoriIcon: "🖥️",
    risikoLevel: "SEDANG",
    risikoSkor: 64,
    judul: "Persyaratan Ketat SNI untuk Sertifikasi Pusat Data",
    regulasiRef: "SNI 8799:2019 (Pusat Data), SNI ISO/IEC 27001:2022, Peraturan BSN",
    tanggalEfektif: "Bertahap — wajib untuk PSE kategori tertentu",
    tanggalUpdate: "28 Maret 2026",
    ringkasan:
      "Sertifikasi SNI untuk pusat data mencakup standar teknis ketat mengenai ketersediaan infrastruktur (availability), keamanan fisik, manajemen energi (PUE), dan keamanan informasi. Proses sertifikasi panjang dan mahal, namun wajib untuk beroperasi sebagai penyedia layanan data center komersial.",
    dampakBisnis:
      "Operator pusat data tanpa SNI menghadapi hambatan untuk memenangkan kontrak pemerintah dan enterprise besar. Biaya sertifikasi dan implementasi infrastruktur dapat mencapai ratusan juta hingga miliaran rupiah.",
    entitasTerdampak: ["Data Center Komersial", "Penyedia Colocation", "Operator Cloud Lokal"],
    analisisAI:
      "Standar SNI 8799:2019 mengadopsi sebagian besar prinsip Uptime Institute Tier Standard. Bisnis yang sudah memiliki sertifikasi Tier II/III/IV dari Uptime Institute akan lebih mudah mendapatkan SNI. Bagi operator yang belum tersertifikasi, jalur paling efisien adalah memulai dengan ISO 27001 (keamanan informasi) kemudian bergerak ke SNI 8799.",
    rekomendasiAI: [
      "Lakukan gap analysis antara infrastruktur saat ini dengan persyaratan SNI 8799",
      "Mulai dengan ISO 27001 sebagai fondasi kemudian scale ke SNI 8799",
      "Libatkan konsultan SNI berpengalaman untuk mempercepat proses sertifikasi",
      "Anggarkan 12-18 bulan dan biaya signifikan untuk proses sertifikasi penuh",
    ],
    checklist: [
      { id: "c1", label: "Lakukan gap analysis SNI 8799:2019 vs. infrastruktur data center saat ini" },
      { id: "c2", label: "Implementasikan atau sertifikasi ISO/IEC 27001:2022 terlebih dahulu" },
      { id: "c3", label: "Engage lembaga sertifikasi terakreditasi BSN" },
      { id: "c4", label: "Penuhi persyaratan PUE (Power Usage Effectiveness) yang disyaratkan" },
    ],
    sumberRef: "SNI 8799:2019, SNI ISO/IEC 27001:2022, Permenkominfo No. 2/2022",
  },
];
