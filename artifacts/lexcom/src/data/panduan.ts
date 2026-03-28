export type KategoriPanduan = "Perdata" | "Pidana" | "Keluarga" | "Bisnis" | "Properti";

export interface Panduan {
  id: string;
  judul: string;
  kategori: KategoriPanduan;
  penulis: string;
  tanggal: string;
  ringkasan: string;
  konten: string;
}

export const dataPanduan: Panduan[] = [
  {
    id: "cara-gugat-perdata",
    judul: "Cara Mengajukan Gugatan Perdata di Pengadilan Negeri",
    kategori: "Perdata",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-03-15",
    ringkasan: "Panduan langkah demi langkah mengajukan gugatan perdata, mulai dari persiapan dokumen, pendaftaran di PN, hingga persidangan.",
    konten: `## Apa itu Gugatan Perdata?
Gugatan perdata adalah tuntutan hak kepada pihak lain melalui pengadilan untuk memulihkan hak atau memperoleh ganti rugi atas pelanggaran hak.

## Langkah-Langkah Mengajukan Gugatan

### 1. Persiapan Dokumen
Sebelum mendaftarkan gugatan, siapkan:
- **Surat Gugatan** — memuat identitas para pihak, alasan gugatan (posita), dan tuntutan (petitum)
- **Fotokopi KTP** Penggugat (dilegalisir)
- **Bukti-bukti**: sertifikat tanah, perjanjian, kwitansi, surat, atau dokumen relevan lainnya
- **Surat Kuasa** (jika menggunakan pengacara, bermaterai dan dilegalisir)

### 2. Penghitungan Biaya Perkara
Biaya perkara terdiri dari biaya panjar (SKUM) yang ditentukan oleh Panitera berdasarkan nilai objek sengketa. Pihak tidak mampu dapat mengajukan permohonan prodeo (bebas biaya).

### 3. Pendaftaran Gugatan
- Datang ke Pengadilan Negeri yang berwenang (domisili tergugat atau lokasi objek sengketa)
- Serahkan surat gugatan rangkap (sesuai jumlah tergugat + 3 eksemplar)
- Bayar biaya panjar ke kasir PN
- Dapatkan nomor perkara dan jadwal sidang pertama

### 4. Proses Persidangan
Tahapan persidangan perdata:
1. **Sidang mediasi** — wajib dilalui sesuai PERMA 1/2016, biasanya 30 hari
2. **Pembacaan gugatan**
3. **Jawaban tergugat**
4. **Replik** (jawaban penggugat atas jawaban tergugat)
5. **Duplik** (jawaban tergugat atas replik)
6. **Pembuktian** (dokumen dan saksi)
7. **Kesimpulan**
8. **Putusan**

### 5. Tips Penting
- Gugat di pengadilan yang **berwenang secara relatif** (domisili tergugat, kecuali ada perjanjian)
- Daluwarsa gugatan perdata umumnya **30 tahun** untuk hak milik
- Mediasi yang berhasil lebih **cepat dan hemat biaya** dibanding putusan hakim
- Pastikan surat gugatan **jelas dan spesifik** agar tidak kabur (obscuur libel)`,
  },
  {
    id: "hak-tersangka-kuhap",
    judul: "Hak-Hak Tersangka dan Terdakwa dalam Proses Hukum Pidana",
    kategori: "Pidana",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-02-20",
    ringkasan: "Memahami hak-hak Anda sebagai tersangka atau terdakwa berdasarkan KUHAP, mulai dari hak diam hingga hak atas pendampingan pengacara.",
    konten: `## Dasar Hukum Perlindungan Tersangka

Kitab Undang-Undang Hukum Acara Pidana (KUHAP) menjamin sejumlah hak fundamental bagi tersangka dan terdakwa.

## Hak-Hak Tersangka (Pasal 50-68 KUHAP)

### 1. Hak Untuk Segera Diperiksa
Tersangka berhak segera mendapat pemeriksaan dari penyidik dan segera diajukan kepada penuntut umum (Pasal 50 KUHAP).

### 2. Hak Untuk Diam (Right to Remain Silent)
Tersangka **tidak wajib** menjawab pertanyaan penyidik. Anda berhak menolak memberikan keterangan. Segala keterangan yang Anda berikan dapat digunakan sebagai bukti.

### 3. Hak Atas Pendampingan Pengacara
Tersangka/terdakwa berhak mendapat bantuan hukum dari pengacara **sejak pertama kali** diperiksa (Pasal 54 KUHAP). Untuk ancaman pidana 5 tahun ke atas, pengacara wajib hadir.

### 4. Hak Untuk Diberitahu Sangkaan
Tersangka berhak **segera mendapat** pemberitahuan tentang sangkaan atau dakwaan terhadapnya (Pasal 51 KUHAP).

### 5. Hak Menghubungi Keluarga
Berhak menghubungi dan dikunjungi pihak keluarga (Pasal 60 KUHAP) serta menghubungi dokter pribadi (Pasal 58 KUHAP).

### 6. Hak Atas Juru Bahasa
Berhak mendapat juru bahasa jika tidak memahami Bahasa Indonesia (Pasal 53 KUHAP).

### 7. Hak Praperadilan
Tersangka dapat mengajukan praperadilan jika penangkapan atau penahanan tidak sah, penghentian penyidikan tidak sah, atau ganti rugi atas penahanan tidak sah (Pasal 77 KUHAP).

## Yang Harus Dilakukan Jika Ditangkap
1. **Tetap tenang**, jangan melawan
2. **Tanyakan identitas** penyidik dan surat penangkapan
3. **Hubungi pengacara** atau keluarga segera
4. **Diam** — tidak perlu menjawab pertanyaan sebelum pengacara hadir
5. **Minta salinan** berita acara pemeriksaan`,
  },
  {
    id: "perceraian-pengadilan-agama",
    judul: "Prosedur Perceraian di Pengadilan Agama: Panduan Lengkap",
    kategori: "Keluarga",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-01-10",
    ringkasan: "Panduan lengkap proses perceraian di Pengadilan Agama bagi pasangan Muslim, termasuk jenis perceraian, dokumen, biaya, dan proses persidangan.",
    konten: `## Jenis Perceraian di Pengadilan Agama

### 1. Talak (Cerai Talak)
Diajukan oleh **suami** untuk menceraikan istri. Mekanisme: suami mengajukan permohonan ke PA, mengikuti sidang, kemudian mengucapkan ikrar talak di depan majelis hakim.

### 2. Gugatan Cerai (Cerai Gugat)
Diajukan oleh **istri** yang ingin bercerai. Lebih umum karena istri tidak dapat menjatuhkan talak sendiri.

## Alasan Perceraian yang Diterima PA
Berdasarkan PP No. 9 Tahun 1975 dan KHI Pasal 116:
- Salah satu pihak berbuat zina/pemabuk/pejudi/pemadat
- Salah satu pihak **meninggalkan** yang lain selama 2 tahun berturut-turut tanpa alasan
- Salah satu pihak mendapat hukuman penjara 5 tahun atau lebih
- **Kekerasan dalam rumah tangga** (KDRT)
- Salah satu pihak mendapat cacat badan/penyakit yang tidak dapat disembuhkan
- **Pertengkaran terus menerus** dan tidak ada harapan hidup rukun

## Dokumen yang Diperlukan
- Surat gugatan/permohonan cerai (rangkap 6)
- Fotokopi KTP suami dan istri
- Buku Nikah asli + fotokopi
- Fotokopi Akta Kelahiran anak (jika ada)
- Surat keterangan dari kelurahan (jika diperlukan)

## Proses Persidangan
1. Pendaftaran dan pembayaran biaya panjar
2. **Pemanggilan para pihak**
3. **Sidang mediasi** — hakim mewajibkan mediasi
4. Sidang pemeriksaan pokok perkara
5. Pembuktian dan saksi
6. Putusan/penetapan
7. Pengambilan Akta Cerai di KUA setelah 14 hari berkekuatan hukum

## Hak-Hak Pasca Perceraian
- **Nafkah iddah**: mantan suami wajib memberi nafkah selama masa iddah (3 bulan 10 hari untuk istri yang tidak hamil)
- **Mut'ah**: pemberian sukarela mantan suami
- **Hak asuh anak** (hadhanah): untuk anak di bawah 12 tahun umumnya diberikan kepada ibu
- **Nafkah anak**: kewajiban ayah sampai anak dewasa (21 tahun)`,
  },
  {
    id: "pendirian-pt",
    judul: "Cara Mendirikan PT di Indonesia: Panduan Lengkap 2024",
    kategori: "Bisnis",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-04-01",
    ringkasan: "Panduan komprehensif mendirikan Perseroan Terbatas (PT) di Indonesia, termasuk syarat modal, dokumen, biaya notaris, dan pendaftaran online.",
    konten: `## Apa itu PT?
Perseroan Terbatas (PT) adalah badan hukum persekutuan modal yang didirikan berdasarkan perjanjian, melakukan kegiatan usaha dengan modal dasar yang seluruhnya terbagi dalam saham.

## Syarat Mendirikan PT
1. **Minimal 2 pendiri** (orang/badan hukum), bisa WNI atau WNA
2. **Modal dasar** — tidak ada minimum untuk UMKM (PP 8/2021)
3. **Modal disetor** minimal 25% dari modal dasar
4. **Domisili usaha** yang jelas

## Langkah-Langkah Pendirian PT

### Step 1: Cek dan Reservasi Nama PT
- Login ke ahu.go.id
- Cek ketersediaan nama PT
- Reservasi nama (berlaku 60 hari, biaya PNBP Rp 200.000)

### Step 2: Pembuatan Akta Notaris
Hubungi Notaris untuk:
- Akta Pendirian PT (Anggaran Dasar)
- Modal dasar, susunan pemegang saham, direksi, dan komisaris
- Biaya notaris: Rp 3-15 juta tergantung kompleksitas

### Step 3: Pengesahan Kemenkumham
- Notaris mendaftarkan ke sistem SABH (AHU Online)
- Upload akta dan dokumen pendukung
- SK Pengesahan terbit dalam 1-3 hari kerja
- Biaya PNBP Rp 1 juta

### Step 4: Pengurusan NPWP PT
- Daftar ke KPP domisili usaha atau online di ereg.pajak.go.id
- Lampirkan SK Kemenkumham, KTP/KITAS direktur, bukti domisili

### Step 5: Izin Usaha via OSS
- Daftar di oss.go.id
- Pilih KBLI (Klasifikasi Baku Lapangan Usaha Indonesia)
- Isi profil usaha, modal, tenaga kerja
- NIB (Nomor Induk Berusaha) terbit otomatis
- Izin usaha sesuai risiko (rendah: NIB, menengah/tinggi: tambahan persyaratan)

### Step 6: Buka Rekening Bank PT
- SK Kemenkumham, NPWP PT, NIB, Akta Notaris
- Rekening atas nama PT (bukan pribadi pengurus)

## Biaya Total Estimasi
- Notaris: Rp 3-15 juta
- PNBP nama + pengesahan: Rp 1,2 juta
- Total: ~Rp 5-20 juta

## Tips
- Pilih KBLI yang tepat untuk menghindari masalah perizinan di kemudian hari
- Pisahkan rekening pribadi dan perusahaan sejak awal
- Buat Perjanjian Pemegang Saham (Shareholders Agreement) bila ada beberapa pendiri`,
  },
  {
    id: "jual-beli-tanah",
    judul: "Proses Jual Beli Tanah yang Aman dan Sesuai Hukum",
    kategori: "Properti",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-02-05",
    ringkasan: "Panduan lengkap transaksi jual beli tanah mulai dari pengecekan sertifikat, AJB di PPAT, hingga balik nama di BPN.",
    konten: `## Mengapa Jual Beli Tanah Harus Melalui PPAT?

Sesuai PP 24/1997 tentang Pendaftaran Tanah, jual beli hak atas tanah yang sudah terdaftar **wajib** dilakukan di hadapan Pejabat Pembuat Akta Tanah (PPAT). Jual beli yang tidak melalui PPAT tidak dapat didaftarkan ke BPN.

## Langkah-Langkah Jual Beli Tanah

### 1. Due Diligence (Pemeriksaan Sertifikat)
Sebelum membeli, lakukan pengecekan:
- **Keaslian sertifikat** di Kantor Pertanahan (BPN) setempat
- Status hak (Hak Milik, HGB, HGU, Hak Pakai)
- Ada/tidaknya **sita/tanggungan** (APHT/HT)
- Kesesuaian data fisik (luas, batas, letak)
- **PBB** terbayar lunas (cek SPPT)
- IMB / PBG (untuk bangunan di atasnya)

### 2. Perjanjian Pengikatan Jual Beli (PPJB)
Sebelum AJB, para pihak dapat membuat PPJB di hadapan notaris untuk mengikat kesepakatan dengan pembayaran uang muka.

### 3. Akta Jual Beli (AJB)
- Dilakukan di hadapan **PPAT** berwenang di wilayah tanah berada
- Para pihak hadir atau diwakili kuasa autentik
- Syarat: KTP, KK, buku nikah (suami/istri harus hadir/setuju), NPWP penjual
- **Pajak** yang harus dilunasi sebelum AJB:
  - **PPh** (pajak penjual): 2,5% dari nilai transaksi
  - **BPHTB** (pajak pembeli): 5% x (nilai transaksi — NJOPTKP)

### 4. Balik Nama di BPN
Setelah AJB, PPAT mendaftarkan peralihan hak ke BPN dalam 7 hari. Proses balik nama biasanya **7-30 hari kerja**.

## Biaya Jual Beli Tanah
- PPh penjual: 2,5% x harga jual
- BPHTB pembeli: 5% x (harga jual — NJOPTKP Rp 60-80 juta per daerah)
- Biaya PPAT: 0,5-1% dari nilai transaksi (maks Rp 5 juta)
- Biaya BPN: bergantung nilai tanah

## Red Flags yang Harus Diwaspadai
- Penjual tidak bisa menunjukkan sertifikat asli
- Ada nama berbeda antara sertifikat dan KTP penjual
- Harga jauh di bawah pasaran
- Ada pihak ketiga yang mengklaim kepemilikan
- Sertifikat masih berupa girik/letter C (belum bersertipikat)`,
  },
  {
    id: "membuat-surat-kuasa",
    judul: "Cara Membuat Surat Kuasa yang Sah Secara Hukum",
    kategori: "Perdata",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-01-25",
    ringkasan: "Panduan membuat surat kuasa yang sah, perbedaan surat kuasa biasa dan autentik, serta kapan surat kuasa harus dibuat di hadapan notaris.",
    konten: `## Apa itu Surat Kuasa?

Surat kuasa adalah dokumen yang memberikan wewenang kepada seseorang (penerima kuasa/attorney) untuk bertindak atas nama pemberi kuasa (principal) dalam hal-hal yang ditentukan.

## Jenis Surat Kuasa

### 1. Surat Kuasa di Bawah Tangan
Dibuat sendiri oleh para pihak tanpa notaris. Harus bermaterai Rp 10.000 dan ditandatangani pemberi kuasa. Cocok untuk: pengambilan dokumen, keperluan administrasi sederhana, perbankan.

### 2. Surat Kuasa Autentik (Notariil)
Dibuat di hadapan Notaris. Wajib untuk: jual beli tanah, pengurusan waris, pembebasan hak tanggungan, kuasa dalam persidangan tingkat kasasi MA.

## Elemen Wajib Surat Kuasa
1. **Identitas lengkap** pemberi dan penerima kuasa (nama, NIK, alamat)
2. **Dasar hubungan** (jika perwakilan perusahaan: jabatan, dasar wewenang)
3. **Ruang lingkup kuasa** yang spesifik — hindari kuasa umum yang terlalu luas
4. **Masa berlaku** (jika ada batas waktu)
5. **Hak substitusi** (apakah penerima kuasa boleh melimpahkan ke pihak lain)
6. **Tanda tangan** pemberi kuasa + materai + tanggal

## Template Sederhana Surat Kuasa

\`\`\`
SURAT KUASA

Yang bertanda tangan di bawah ini:
Nama    : [Nama Lengkap]
NIK     : [Nomor KTP]
Alamat  : [Alamat Lengkap]

Dengan ini memberikan kuasa kepada:
Nama    : [Nama Penerima Kuasa]
NIK     : [Nomor KTP]
Alamat  : [Alamat Lengkap]

Untuk dan atas nama saya melakukan:
[Sebutkan kewenangan spesifik]

Surat kuasa ini berlaku sampai dengan [tanggal] / hingga tugas selesai.

[Kota], [tanggal]
Pemberi Kuasa,

[Tanda tangan + materai]
[Nama Terang]
\`\`\`

## Kapan Kuasa Berakhir?
- Penerima kuasa meninggal dunia
- Pemberi kuasa meninggal dunia
- Kuasa dicabut secara sepihak
- Masa berlaku habis
- Tugas selesai dilaksanakan`,
  },
  {
    id: "kdrt-hukum",
    judul: "Kekerasan Dalam Rumah Tangga: Hak Korban dan Cara Melaporkan",
    kategori: "Keluarga",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-03-01",
    ringkasan: "Panduan bagi korban KDRT tentang hak-hak hukum, cara membuat laporan polisi, perlindungan sementara, dan dukungan yang tersedia.",
    konten: `## Dasar Hukum Perlindungan KDRT

UU No. 23 Tahun 2004 tentang Penghapusan Kekerasan Dalam Rumah Tangga (UU PKDRT) memberikan perlindungan komprehensif bagi korban KDRT.

## Bentuk-Bentuk KDRT (Pasal 5 UU PKDRT)
1. **Kekerasan fisik** — pemukulan, tendangan, tamparan
2. **Kekerasan psikis** — ancaman, intimidasi, penghinaan
3. **Kekerasan seksual** — pemaksaan hubungan seksual
4. **Penelantaran rumah tangga** — tidak memberi nafkah, membiarkan sakit tanpa pengobatan

## Hak-Hak Korban KDRT (Pasal 10 UU PKDRT)
- Perlindungan dari polisi dan instansi terkait
- Pelayanan kesehatan
- Penanganan secara khusus berkaitan dengan kerahasiaan korban
- Pendampingan pekerja sosial
- Bimbingan rohani
- Perlindungan sementara (Pasal 16)

## Cara Melaporkan KDRT

### Lapor ke Polisi
1. Datang ke Polres/Polsek terdekat, minta ditangani oleh **Unit PPA** (Perlindungan Perempuan dan Anak)
2. Bawa: identitas diri, visum et repertum (jika ada luka fisik), bukti-bukti (foto, rekaman, pesan)
3. Buat **Laporan Polisi** (LP)
4. Minta **Surat Perlindungan Sementara** (72 jam pertama)

### Alternatif Pengaduan
- **P2TP2A** (Pusat Pelayanan Terpadu Pemberdayaan Perempuan dan Anak) di tiap kabupaten/kota
- **LBH APIK** atau lembaga bantuan hukum perempuan
- **Komnas Perempuan**: 021-390 3112
- **Hotline SAPA 129**: layanan konseling KDRT 24 jam

## Sanksi Pelaku KDRT
- Kekerasan fisik: penjara maksimal **5 tahun** atau denda Rp 15 juta
- Kekerasan fisik berat (cacat permanen): penjara **10 tahun** atau denda Rp 30 juta
- Kekerasan psikis: penjara **3 tahun** atau denda Rp 9 juta
- Kekerasan seksual: penjara **12 tahun** atau denda Rp 36 juta`,
  },
  {
    id: "perjanjian-kerja-pkwt",
    judul: "Memahami PKWT: Hak Karyawan Kontrak dan Perlindungannya",
    kategori: "Bisnis",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-02-15",
    ringkasan: "Panduan hak karyawan dengan Perjanjian Kerja Waktu Tertentu (PKWT), batas durasi kontrak, kompensasi, dan perlindungan hukumnya.",
    konten: `## Apa itu PKWT?

Perjanjian Kerja Waktu Tertentu (PKWT) adalah perjanjian kerja antara pekerja dan pengusaha untuk waktu yang ditentukan berdasarkan jangka waktu atau selesainya pekerjaan tertentu.

## Aturan PKWT Pasca UU Cipta Kerja (PP 35/2021)

### Batas Waktu PKWT
- Maksimal **5 tahun** total (termasuk perpanjangan dan pembaruan)
- Tidak ada kewajiban jeda antar kontrak
- Dapat diperpanjang berkali-kali selama tidak melampaui 5 tahun

### Jenis Pekerjaan yang Boleh PKWT
- Pekerjaan yang **sekali selesai** atau sementara
- Pekerjaan yang **musiman**
- Pekerjaan yang **berkaitan dengan produk baru** (percobaan)

### Larangan: Pekerjaan yang Tidak Boleh PKWT
Pekerjaan yang bersifat **tetap/terus menerus** tidak boleh menggunakan PKWT. Jika dilanggar, PKWT berubah menjadi PKWTT (karyawan tetap) demi hukum.

## Hak-Hak Karyawan PKWT

### Kompensasi Akhir Kontrak (Baru!)
PP 35/2021 Pasal 15-16 mewajibkan pengusaha memberi **kompensasi PKWT** saat kontrak berakhir:
- **1/12 x upah sebulan** x masa kerja (per bulan bekerja)
- Contoh: bekerja 12 bulan → dapat kompensasi 1 bulan upah

### Hak Lainnya Setara Karyawan Tetap
- Upah minimum sesuai UMR/UMK
- Jaminan sosial (BPJS Kesehatan + BPJS Ketenagakerjaan)
- Hak cuti tahunan (12 hari setelah 12 bulan kerja)
- THR (Tunjangan Hari Raya)
- Pesangon jika di-PHK sebelum kontrak berakhir

## Yang Harus Ada dalam PKWT
1. Nama dan alamat perusahaan
2. Identitas pekerja
3. Jenis pekerjaan
4. Tempat pekerjaan
5. Besaran dan cara pembayaran upah
6. **Jangka waktu** berlakunya PKWT
7. Hak dan kewajiban para pihak

*Catatan: PKWT yang tidak dibuat tertulis dianggap PKWTT.*`,
  },
  {
    id: "warisan-islam",
    judul: "Hukum Waris Islam: Pembagian Harta Warisan Sesuai KHI",
    kategori: "Keluarga",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-01-30",
    ringkasan: "Panduan hukum waris Islam di Indonesia berdasarkan Kompilasi Hukum Islam (KHI), termasuk cara menghitung bagian masing-masing ahli waris.",
    konten: `## Dasar Hukum Waris Islam di Indonesia

Pembagian warisan bagi umat Islam di Indonesia diatur dalam **Kompilasi Hukum Islam (KHI)** Pasal 171-209, yang merupakan ijtihad para ulama yang telah dikodifikasikan.

## Siapa yang Berhak Mewarisi?

### Ahli Waris Golongan Pertama (Ashab al-Furud)
| Ahli Waris | Bagian | Syarat |
|---|---|---|
| Suami | 1/4 (ada anak) / 1/2 (tidak ada anak) | - |
| Istri | 1/8 (ada anak) / 1/4 (tidak ada anak) | - |
| Anak perempuan | 1/2 (sendiri) / 2/3 (dua+) | Tidak ada anak laki |
| Ibu | 1/6 (ada anak) / 1/3 (tidak ada anak) | - |
| Ayah | 1/6 (ada anak) | - |

### Ashabah (Penerima Sisa)
Anak laki-laki mengambil sisa harta setelah ashab al-furud. Jika ada anak laki dan perempuan bersama, bagian anak laki 2:1 terhadap anak perempuan.

## Contoh Perhitungan
**Pewaris meninggal dengan: Istri, 2 anak laki, 1 anak perempuan**

Total harta: Rp 300 juta

1. Istri mendapat 1/8 = Rp 37,5 juta
2. Sisa = Rp 262,5 juta dibagi ashabah:
   - 2 anak laki = masing-masing 2 bagian
   - 1 anak perempuan = 1 bagian
   - Total = 5 bagian
3. Per bagian = Rp 262,5 juta ÷ 5 = Rp 52,5 juta
4. Tiap anak laki = Rp 105 juta, anak perempuan = Rp 52,5 juta

## Harta Bersama vs Harta Warisan
Sebelum dibagi waris, harta bersama (gono-gini) **harus dipisah** terlebih dahulu:
- 50% milik pasangan yang masih hidup
- 50% menjadi harta warisan pewaris

## Prosedur Pembagian Waris
1. Urus **surat kematian** dan akta waris dari Kelurahan
2. Buat **Surat Pernyataan Ahli Waris** disaksikan 2 orang dan diketahui Lurah/Kepala Desa
3. Jika ada tanah: daftarkan peralihan hak waris ke BPN dengan dokumen waris
4. Jika ada sengketa: ajukan ke **Pengadilan Agama** (bagi yang beragama Islam)`,
  },
  {
    id: "perlindungan-konsumen-online",
    judul: "Hak Konsumen Belanja Online: Klaim Refund dan Penyelesaian Sengketa",
    kategori: "Perdata",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-03-20",
    ringkasan: "Hak-hak konsumen dalam transaksi e-commerce, cara klaim refund jika barang tidak sesuai, dan jalur pengaduan ke BPSK atau OJK.",
    konten: `## Hak Konsumen dalam Transaksi Online

UU No. 8 Tahun 1999 tentang Perlindungan Konsumen berlaku penuh untuk transaksi online. OJK dan BPSK memiliki kewenangan menangani sengketa.

## Hak-Hak Konsumen Belanja Online
1. **Hak atas informasi** yang benar — foto dan deskripsi produk harus akurat
2. **Hak atas keamanan** — produk tidak membahayakan
3. **Hak untuk memilih** — tidak boleh ada pemaksaan atau lock-in
4. **Hak atas ganti rugi** — refund/penggantian jika produk cacat atau tidak sesuai

## Kapan Anda Berhak Refund?
- Produk **tidak sesuai deskripsi** atau foto di platform
- Produk **cacat/rusak** saat diterima
- Produk **tidak tiba** setelah batas waktu pengiriman
- Penjual melakukan **penipuan** (barang palsu, stok kosong setelah bayar)

## Langkah Klaim Refund

### Step 1: Komplain ke Penjual (Maks. 2x24 Jam)
- Hubungi penjual via chat marketplace
- Lampirkan foto/video bukti barang rusak/tidak sesuai
- Minta refund atau penggantian barang

### Step 2: Buka Sengketa di Platform (Dispute)
Jika penjual tidak responsif:
- Tokopedia: klik "Komplain" — mediasi platform otomatis
- Shopee: "Ajukan Pengembalian" — Shopee mediasi
- Lazada: "Laporkan Masalah Pesanan"

### Step 3: Lapor ke BPSK atau Pengadilan
Jika platform tidak membantu:
- **BPSK** (Badan Penyelesaian Sengketa Konsumen) di kota setempat — gratis, selesai 21 hari
- **Laporan ke Kemendag** via siap.kemendag.go.id atau 0800-1-000-000
- **Gugatan Perdata** di Pengadilan Negeri (nilai di atas Rp 1 juta)

## Tips Belanja Online Aman
- Beli dari **toko resmi** atau penjual dengan rating tinggi (>4.8)
- Gunakan metode pembayaran yang dilindungi (jangan transfer langsung)
- Screenshot semua **bukti transaksi** dan percakapan
- Aktifkan fitur **COD** atau bayar setelah terima untuk transaksi besar
- Cek **kebijakan return** sebelum membeli`,
  },
  {
    id: "kontrak-sewa-rumah",
    judul: "Panduan Kontrak Sewa Rumah: Hak dan Kewajiban Penyewa",
    kategori: "Properti",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-02-28",
    ringkasan: "Hal-hal penting dalam perjanjian sewa menyewa rumah, klausula yang harus dicermati, dan cara menyelesaikan sengketa dengan pemilik.",
    konten: `## Dasar Hukum Sewa Menyewa

Sewa menyewa diatur dalam KUH Perdata Pasal 1548-1600. Perjanjian sewa yang dibuat secara tertulis lebih kuat daripada lisan.

## Elemen Penting dalam Perjanjian Sewa

### Wajib Ada:
1. **Identitas** pemilik dan penyewa (KTP)
2. **Deskripsi objek** — alamat, luas, kondisi
3. **Harga sewa** dan cara pembayaran (bulanan/tahunan)
4. **Jangka waktu** — tanggal mulai dan berakhir
5. **Deposit/uang jaminan** — besaran dan kondisi pengembalian
6. **Pembagian biaya**: PLN, PDAM, kebersihan, PBB

### Klausula yang Sering Merugikan Penyewa (Waspadai):
- "Pemilik berhak mengakhiri sewa kapan saja" — ini tidak sah tanpa ganti rugi
- "Deposit tidak dikembalikan atas alasan apapun"
- "Perubahan harga sewa sepihak oleh pemilik"
- "Penyewa bertanggung jawab atas semua kerusakan" (termasuk kerusakan wajar/aus)

## Hak Penyewa Selama Masa Sewa
- **Menikmati** properti secara damai tanpa gangguan pemilik
- Pemilik **tidak berhak masuk** tanpa seizin penyewa kecuali darurat
- Pemeliharaan **kerusakan besar** (atap bocor, saluran air utama) adalah tanggung jawab **pemilik**
- Penyewa hanya bertanggung jawab atas **kerusakan akibat pemakaian tidak wajar**

## Jika Pemilik Ingin Mengakhiri Sewa Lebih Awal
Pemilik **tidak dapat** mengusir penyewa sebelum masa sewa habis tanpa:
1. Kesepakatan bersama dan kompensasi
2. Putusan pengadilan (jika penyewa melanggar perjanjian)

## Deposit: Kapan Dikembalikan?
- Dalam **30-60 hari** setelah masa sewa berakhir (sesuai perjanjian)
- Pemilik boleh memotong untuk: kerusakan yang disebabkan penyewa, tagihan utility yang belum dibayar
- Pemilik **tidak boleh memotong** untuk keausan normal (cat kusam, engsel aus)

## Tips Sebelum Tanda Tangan
- Foto kondisi rumah secara detail sebelum masuk
- Minta inventaris barang perabot (jika furnished)
- Pastikan ada klausula **force majeure** (bencana alam)
- Daftarkan perjanjian ke PPAT jika jangka waktu di atas 1 tahun`,
  },
  {
    id: "lapor-kepolisian",
    judul: "Cara Membuat Laporan Polisi yang Benar dan Efektif",
    kategori: "Pidana",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-01-15",
    ringkasan: "Panduan langkah demi langkah membuat laporan polisi untuk berbagai jenis kejahatan, dokumen yang diperlukan, dan tindak lanjut setelah melapor.",
    konten: `## Kapan Harus Melapor ke Polisi?

Anda berhak melapor ke polisi ketika mengalami atau menyaksikan tindak pidana, seperti: pencurian, penipuan, penggelapan, kekerasan fisik, KDRT, pelecehan seksual, ancaman, atau pemerasan.

## Sebelum Melapor: Persiapkan Bukti
- **Foto/video** kejadian atau bukti kejahatan
- **Rekaman percakapan** atau pesan teks (screenshot)
- **Saksi** yang bersedia bersaksi
- **Dokumen** pendukung (kwitansi, perjanjian, transfer bank)
- **Visum et repertum** jika ada kekerasan fisik (minta dari rumah sakit/puskesmas)

## Prosedur Pelaporan

### Step 1: Datang ke SPKT (Sentra Pelayanan Kepolisian Terpadu)
Datang ke Polsek (untuk kasus ringan) atau Polres (untuk kasus serius) terdekat. Pastikan bawa identitas diri (KTP).

### Step 2: Sampaikan Kronologi
Ceritakan kejadian secara **runtut, jelas, dan faktual**:
- Kapan (waktu dan tanggal)
- Di mana (tempat kejadian)
- Siapa (identitas pelaku jika diketahui)
- Apa (tindakan yang dilakukan)
- Bagaimana (cara pelaku melakukannya)
- Akibat yang ditimbulkan

### Step 3: Terima Tanda Bukti Lapor (TBL)
Setelah laporan diterima, Anda mendapat **Tanda Bukti Lapor (TBL)** berisi nomor laporan. Simpan ini baik-baik untuk memantau perkembangan kasus.

### Step 4: Pemeriksaan Awal
Pelapor akan dipanggil untuk **Berita Acara Pemeriksaan (BAP)** sebagai saksi pelapor. Jawab pertanyaan jujur dan konsisten.

## Hak Pelapor
- Mengetahui perkembangan penanganan laporan
- Mendapat **perlindungan** jika ada ancaman dari terlapor
- Mengajukan **KDRT** dapat disertai permintaan Surat Perintah Perlindungan

## Jika Laporan Tidak Ditindaklanjuti
1. Minta penjelasan tertulis dari Kepala Satuan
2. Lapor ke **Bidpropam Polda** setempat
3. Ajukan pengaduan ke **Ombudsman RI**
4. Gunakan mekanisme **praperadilan** jika penyidikan dihentikan

## Kejahatan yang Perlu Dokumen Khusus
- **Penipuan/Penggelapan**: bukti transfer, perjanjian, chat
- **KDRT**: visum, foto luka, laporan ke P2TP2A
- **Kejahatan Siber (ITE)**: capture konten, URL, timestamp
- **Kecelakaan Lalu Lintas**: laporan dari lokasi, data saksi`,
  },
  {
    id: "phk-pesangon",
    judul: "PHK dan Pesangon: Hak Karyawan yang Harus Diketahui",
    kategori: "Bisnis",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-04-10",
    ringkasan: "Panduan lengkap hak karyawan saat di-PHK, cara menghitung pesangon sesuai UU Cipta Kerja, dan langkah hukum jika PHK tidak sah.",
    konten: `## PHK yang Sah vs Tidak Sah

### PHK yang Dapat Dilakukan Perusahaan (Pasal 36-38 PP 35/2021)
- Pekerja mengundurkan diri
- Pekerja mencapai usia pensiun
- Pekerja meninggal dunia
- Perusahaan pailit
- Efisiensi karena kondisi keuangan
- Perubahan status perusahaan (merger, akuisisi)

### PHK yang Tidak Boleh Dilakukan
Larangan PHK (Pasal 153 UU 13/2003 jo PP 35/2021):
- Karena sakit tidak melebihi 12 bulan terus menerus
- Karena menikah, hamil, atau melahirkan
- Karena beribadah sesuai agamanya
- Karena melapor ke pihak berwajib tentang pelanggaran pengusaha
- Karena menjadi pengurus serikat pekerja

## Cara Menghitung Pesangon

### Komponen PHK (PP 35/2021 Pasal 40-43)
1. **Uang Pesangon (UP)** — sesuai masa kerja
2. **Uang Penghargaan Masa Kerja (UPMK)** — untuk masa kerja >3 tahun
3. **Uang Penggantian Hak (UPH)** — sisa cuti, biaya pemulangan, dll

### Tabel Uang Pesangon
| Masa Kerja | Pesangon |
|---|---|
| < 1 tahun | 1 bulan upah |
| 1-2 tahun | 2 bulan upah |
| 2-3 tahun | 3 bulan upah |
| 3-4 tahun | 4 bulan upah |
| 4-5 tahun | 5 bulan upah |
| 5-6 tahun | 6 bulan upah |
| 6-7 tahun | 7 bulan upah |
| 7-8 tahun | 8 bulan upah |
| ≥ 8 tahun | 9 bulan upah |

*Catatan: Sesuai UU Cipta Kerja, nilai di atas merupakan 1x PMTK. Beberapa kondisi PHK memberikan 0,5x atau 2x PMTK.*

## Langkah Jika PHK Tidak Sah

### 1. Negosiasi Bipartit (Wajib, Maks. 30 Hari)
Diskusi langsung antara karyawan dan pengusaha. Jika sepakat, buat perjanjian bersama yang didaftarkan ke PHI.

### 2. Mediasi Dinas Tenaga Kerja
Jika bipartit gagal, lapor ke Disnaker setempat. Mediator Disnaker memfasilitasi penyelesaian. Maks. 30 hari.

### 3. Gugatan ke Pengadilan Hubungan Industrial (PHI)
Jika mediasi gagal, ajukan gugatan ke PHI di Pengadilan Negeri setempat. Proses maks. 50 hari (PN), jika kasasi ke MA maks. 30 hari.`,
  },
  {
    id: "adopsi-anak-indonesia",
    judul: "Prosedur Adopsi Anak di Indonesia: Syarat dan Proses Hukum",
    kategori: "Keluarga",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-01-05",
    ringkasan: "Panduan lengkap adopsi anak di Indonesia, perbedaan adopsi domestik dan internasional, syarat calon orang tua angkat, dan proses penetapan di pengadilan.",
    konten: `## Dasar Hukum Adopsi di Indonesia

Adopsi anak di Indonesia diatur dalam PP No. 54 Tahun 2007 tentang Pelaksanaan Pengangkatan Anak dan Pasal 171 KHI (untuk anak angkat Muslim).

## Jenis Adopsi

### 1. Adopsi Domestik (WNI oleh WNI)
Prosedur lebih sederhana. Dapat dilakukan oleh pasangan menikah maupun orang tua tunggal.

### 2. Adopsi Internasional (WNA oleh WNI atau sebaliknya)
Lebih ketat. Harus melalui lembaga sosial resmi, evaluasi lebih panjang, dan pelibatan Kemensos.

## Syarat Calon Orang Tua Angkat
- **Usia minimal**: 30 tahun, maksimal 55 tahun
- **Perbedaan usia**: minimal 20 tahun dengan anak yang akan diadopsi
- **Status perkawinan**: sudah menikah minimal 5 tahun (untuk pasangan)
- **Kondisi kesehatan**: mampu mengasuh secara fisik dan mental
- **Ekonomi**: mampu membiayai tumbuh kembang anak
- **Agama**: harus **seagama** dengan anak yang diadopsi (untuk WNI Muslim)

## Prosedur Adopsi Domestik

### Step 1: Persiapan Administrasi
Kumpulkan dokumen: KTP, KK, buku nikah, akta kelahiran, surat keterangan sehat, SKCK, surat penghasilan/rekening, surat izin dari kantor (jika PNS).

### Step 2: Pengajuan ke Dinas Sosial
Ajukan permohonan ke Dinas Sosial setempat. Tim Dinas Sosial melakukan **home study** — kunjungan rumah dan evaluasi kesiapan.

### Step 3: Pendampingan Lembaga Sosial
Calon orang tua angkat didampingi oleh lembaga sosial terakreditasi. Masa asuhan sementara minimal **6 bulan** sebelum penetapan.

### Step 4: Permohonan Penetapan Pengadilan
- Bagi non-Muslim: Pengadilan Negeri
- Bagi Muslim: Pengadilan Agama
- Lampirkan semua dokumen + laporan lembaga sosial

### Step 5: Penetapan Hakim
Hakim mengeluarkan penetapan pengangkatan anak. Penetapan ini dicatat di Disdukcapil untuk perubahan akta kelahiran.

## Hak Anak Angkat
- Hak mendapat nama keluarga angkat
- Hak atas nafkah, pendidikan, dan kesehatan dari orang tua angkat
- *Catatan*: Dalam Islam, anak angkat **tidak otomatis** mewarisi orang tua angkat kecuali ada wasiat`,
  },
  {
    id: "pajak-penghasilan",
    judul: "Panduan Pajak Penghasilan Pribadi: Cara Lapor SPT Tahunan",
    kategori: "Bisnis",
    penulis: "Tim Legal LexCom",
    tanggal: "2024-03-05",
    ringkasan: "Panduan wajib pajak orang pribadi dalam melaporkan SPT Tahunan, jenis penghasilan yang dikenai pajak, dan cara mengisi e-Filing pajak.",
    konten: `## Siapa yang Wajib Lapor SPT?

Setiap **Wajib Pajak Orang Pribadi** (WPOP) yang memiliki NPWP wajib menyampaikan SPT Tahunan PPh, meskipun penghasilan di bawah PTKP (Penghasilan Tidak Kena Pajak).

## Batas Waktu Pelaporan
- **SPT Tahunan PPh OP**: Paling lambat **31 Maret** tahun berikutnya
- Denda keterlambatan: Rp 100.000 per SPT

## Penghasilan Tidak Kena Pajak (PTKP) 2024
| Status | PTKP/Tahun |
|---|---|
| Tidak Kawin (TK/0) | Rp 54.000.000 |
| Kawin, tidak ada tanggungan (K/0) | Rp 58.500.000 |
| Kawin, 1 tanggungan (K/1) | Rp 63.000.000 |
| Kawin, 2 tanggungan (K/2) | Rp 67.500.000 |
| Kawin, 3 tanggungan (K/3) | Rp 72.000.000 |

## Tarif PPh Orang Pribadi (UU HPP 2021)
| Penghasilan Kena Pajak | Tarif |
|---|---|
| s.d. Rp 60 juta | 5% |
| Rp 60-250 juta | 15% |
| Rp 250-500 juta | 25% |
| Rp 500 juta - 5 miliar | 30% |
| Di atas Rp 5 miliar | 35% |

## Cara Lapor SPT Online (e-Filing)

### Step 1: Login DJP Online
Buka pajak.go.id, masuk dengan NPWP dan password. Jika belum punya akun, registrasi dengan EFIN (minta ke KPP).

### Step 2: Pilih e-Filing SPT 1770 S atau 1770 SS
- **1770 SS** — penghasilan bruto ≤ Rp 60 juta/tahun, satu sumber
- **1770 S** — penghasilan bruto > Rp 60 juta/tahun
- **1770** — penghasilan dari usaha/pekerjaan bebas

### Step 3: Isi Formulir
- Masukkan data penghasilan dari **bukti potong A1/A2** (dari pemberi kerja)
- Isi harta dan kewajiban
- Klaim pengurangan (zakat, premi asuransi, dll)

### Step 4: Kirim SPT
Setelah isi data, submit SPT. Anda akan menerima **Bukti Penerimaan Elektronik (BPE)** via email — simpan sebagai bukti.

## Dokumen yang Dibutuhkan
- Bukti Potong 1721 A1 (karyawan swasta) atau A2 (PNS)
- Bukti potong investasi/bunga deposito (jika ada)
- Laporan rekening bank (untuk melaporkan harta)
- NPWP`,
  },
];
