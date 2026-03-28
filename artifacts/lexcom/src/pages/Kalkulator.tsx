import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calculator, Users, Clock, Scale, Briefcase, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type KalkulatorType = "biaya_perkara" | "pesangon" | "daluwarsa" | "penahanan" | "waris" | "biaya_notaris";

const KALKULATOR_LIST: Array<{ id: KalkulatorType; label: string; desc: string; icon: typeof Calculator; color: string }> = [
  { id: "biaya_perkara", label: "Biaya Perkara Perdata", desc: "Hitung panjar biaya perkara di Pengadilan Negeri berdasarkan nilai gugatan", icon: Scale, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { id: "pesangon", label: "Kalkulator Pesangon PHK", desc: "Hitung hak pesangon, UPMK, dan uang penggantian hak sesuai PP No. 35/2021", icon: Briefcase, color: "text-green-400 bg-green-500/10 border-green-500/20" },
  { id: "daluwarsa", label: "Kalkulator Daluwarsa", desc: "Hitung batas waktu kadaluarsa gugatan perdata dan penuntutan pidana", icon: Clock, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  { id: "penahanan", label: "Kalkulator Masa Penahanan", desc: "Hitung maksimum masa penahanan berdasarkan tahap pemeriksaan sesuai KUHAP", icon: Clock, color: "text-red-400 bg-red-500/10 border-red-500/20" },
  { id: "waris", label: "Kalkulator Bagian Waris", desc: "Hitung bagian harta warisan menurut hukum perdata (KUHPerdata) dan hukum Islam (KHI)", icon: Users, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { id: "biaya_notaris", label: "Biaya Notaris / PPAT", desc: "Estimasi biaya pembuatan akta notaris berdasarkan Permenkumham dan PP 24/2016", icon: Calculator, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
];

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground">
      <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function ResultBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 rounded-xl border ${highlight ? "bg-primary/10 border-primary/30" : "bg-secondary/50 border-border"}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-bold text-sm ${highlight ? "text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

// ============================================================
// KALKULATOR BIAYA PERKARA
// ============================================================
function KalkulatorBiayaPerkara() {
  const [nilaiGugatan, setNilaiGugatan] = useState("");
  const [hasil, setHasil] = useState<null | { biayaPanjar: number; biayaAdm: number; biayaProses: number; total: number }>(null);

  function hitung() {
    const nilai = parseFloat(nilaiGugatan.replace(/[^0-9]/g, ""));
    if (!nilai || nilai <= 0) return;
    const biayaAdm = 30000;
    const biayaProses = Math.min(Math.max(nilai * 0.002, 200000), 5000000);
    const biayaPanjar = biayaAdm + biayaProses;
    const total = biayaPanjar + 150000;
    setHasil({ biayaPanjar, biayaAdm, biayaProses, total });
  }

  return (
    <div className="space-y-4">
      <InfoBox>
        Estimasi berdasarkan SEMA No. 4/2008 dan peraturan biaya perkara PN. Besaran aktual ditentukan Panitera pada saat pendaftaran.
      </InfoBox>
      <div>
        <label className="text-sm font-medium block mb-1.5">Nilai Objek Sengketa / Gugatan (Rp)</label>
        <input
          type="text"
          value={nilaiGugatan}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            setNilaiGugatan(raw ? parseInt(raw).toLocaleString("id-ID") : "");
          }}
          placeholder="contoh: 500.000.000"
          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
        />
      </div>
      <button onClick={hitung} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition">
        Hitung Biaya Perkara
      </button>
      {hasil && (
        <div className="space-y-2 mt-2">
          <ResultBox label="Biaya Administrasi" value={formatRupiah(hasil.biayaAdm)} />
          <ResultBox label="Biaya Proses Persidangan" value={formatRupiah(hasil.biayaProses)} />
          <ResultBox label="Biaya Panjar (SKUM)" value={formatRupiah(hasil.biayaPanjar)} />
          <ResultBox label="Estimasi Total (termasuk biaya lain)" value={formatRupiah(hasil.total)} highlight />
          <p className="text-xs text-muted-foreground">*Belum termasuk biaya pengacara, materai, dan biaya perjalanan/panggilan saksi.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// KALKULATOR PESANGON
// ============================================================
function KalkulatorPesangon() {
  const [masaKerja, setMasaKerja] = useState("");
  const [gajiPokok, setGajiPokok] = useState("");
  const [alasanPHK, setAlasanPHK] = useState("efisiensi");
  const [hasil, setHasil] = useState<null | { uangPesangon: number; upmk: number; uph: number; total: number; multiplikator: number; ketentuanBulan: number }>(null);

  const ALASAN_PHK = [
    { value: "efisiensi", label: "Efisiensi / Restrukturisasi", multiplikator: 0.5 },
    { value: "pailit", label: "Kepailitan Perusahaan", multiplikator: 0.5 },
    { value: "penutupan_rugi", label: "Penutupan Perusahaan (Rugi)", multiplikator: 0.5 },
    { value: "penutupan_tidak_rugi", label: "Penutupan Perusahaan (Tidak Rugi)", multiplikator: 1.0 },
    { value: "perubahan_status", label: "Perubahan Status / PKWTT → PKWT", multiplikator: 1.0 },
    { value: "mengundurkan_diri", label: "Mengundurkan Diri (Resign)", multiplikator: 0 },
    { value: "pensiun", label: "Pensiun Normal", multiplikator: 1.0 },
    { value: "meninggal", label: "Meninggal Dunia", multiplikator: 1.0 },
    { value: "force_majeure", label: "Force Majeure", multiplikator: 0.5 },
  ];

  function getBulanPesangon(tahun: number): number {
    if (tahun < 1) return 1;
    if (tahun < 2) return 2;
    if (tahun < 3) return 3;
    if (tahun < 4) return 4;
    if (tahun < 5) return 5;
    if (tahun < 6) return 6;
    if (tahun < 7) return 7;
    if (tahun < 8) return 8;
    return 9;
  }

  function getBulanUPMK(tahun: number): number {
    if (tahun < 3) return 2;
    if (tahun < 6) return 3;
    if (tahun < 9) return 4;
    if (tahun < 12) return 5;
    if (tahun < 15) return 6;
    if (tahun < 18) return 7;
    if (tahun < 21) return 8;
    if (tahun < 24) return 9;
    return 10;
  }

  function hitung() {
    const masa = parseFloat(masaKerja);
    const gaji = parseFloat(gajiPokok.replace(/[^0-9]/g, ""));
    if (!masa || !gaji) return;
    const alasan = ALASAN_PHK.find((a) => a.value === alasanPHK);
    const multiplikator = alasan?.multiplikator ?? 1.0;
    const ketentuanBulan = getBulanPesangon(masa);
    const uangPesangon = multiplikator > 0 ? gaji * ketentuanBulan * multiplikator : 0;
    const bulanUPMK = multiplikator > 0 ? getBulanUPMK(masa) : 0;
    const upmk = gaji * bulanUPMK;
    const uph = multiplikator > 0 ? gaji * 0.15 : 0;
    const total = uangPesangon + upmk + uph;
    setHasil({ uangPesangon, upmk, uph, total, multiplikator, ketentuanBulan });
  }

  const selected = ALASAN_PHK.find((a) => a.value === alasanPHK);

  return (
    <div className="space-y-4">
      <InfoBox>
        Berdasarkan PP No. 35/2021 tentang PKWT, Alih Daya, Waktu Kerja, Waktu Istirahat, dan PHK. Pesangon = Gaji × Bulan ketentuan × Multiplikator.
      </InfoBox>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1.5">Masa Kerja (Tahun)</label>
          <input type="number" value={masaKerja} onChange={(e) => setMasaKerja(e.target.value)} placeholder="contoh: 5" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" min="0" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Gaji Pokok (Rp/bulan)</label>
          <input
            type="text"
            value={gajiPokok}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              setGajiPokok(raw ? parseInt(raw).toLocaleString("id-ID") : "");
            }}
            placeholder="contoh: 5.000.000"
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1.5">Alasan PHK</label>
        <select value={alasanPHK} onChange={(e) => setAlasanPHK(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
          {ALASAN_PHK.map((a) => <option key={a.value} value={a.value}>{a.label} (×{a.multiplikator})</option>)}
        </select>
      </div>
      <button onClick={hitung} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition">
        Hitung Pesangon
      </button>
      {hasil && (
        <div className="space-y-2 mt-2">
          <p className="text-xs text-muted-foreground">
            Ketentuan: {hasil.ketentuanBulan} bulan upah × multiplikator {selected?.label} (×{hasil.multiplikator})
          </p>
          <ResultBox label="Uang Pesangon (UP)" value={formatRupiah(hasil.uangPesangon)} />
          <ResultBox label="Uang Penghargaan Masa Kerja (UPMK)" value={formatRupiah(hasil.upmk)} />
          <ResultBox label="Uang Penggantian Hak (UPH ~15%)" value={formatRupiah(hasil.uph)} />
          <ResultBox label="Total Hak PHK" value={formatRupiah(hasil.total)} highlight />
          <p className="text-xs text-muted-foreground">*Belum termasuk upah selama proses PHK dan kompensasi PKWT jika berlaku.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// KALKULATOR DALUWARSA
// ============================================================
function KalkulatorDaluwarsa() {
  const [jenisDaluwarsa, setJenisDaluwarsa] = useState("perdata_umum");
  const [tanggalKejadian, setTanggalKejadian] = useState("");

  const JENIS = [
    { value: "perdata_umum", label: "Gugatan Perdata Umum (Hak Milik)", tahun: 30 },
    { value: "perbuatan_melawan_hukum", label: "PMH / Perbuatan Melawan Hukum", tahun: 5 },
    { value: "utang_dagang", label: "Utang Dagang / Tagihan", tahun: 5 },
    { value: "upah_pekerja", label: "Tunggakan Upah Pekerja", tahun: 2 },
    { value: "pidana_seumur", label: "Pidana — Ancaman Mati/Seumur Hidup", tahun: 18 },
    { value: "pidana_berat", label: "Pidana — Ancaman >3 Tahun", tahun: 12 },
    { value: "pidana_sedang", label: "Pidana — Ancaman 1-3 Tahun", tahun: 6 },
    { value: "pidana_ringan", label: "Pidana — Ancaman <1 Tahun (Tipiring)", tahun: 1 },
  ];

  const selected = JENIS.find((j) => j.value === jenisDaluwarsa);

  function hitungDaluwarsa() {
    if (!tanggalKejadian || !selected) return null;
    const start = new Date(tanggalKejadian);
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + selected.tahun);
    const today = new Date();
    const sisaDays = Math.floor((end.getTime() - today.getTime()) / 86400000);
    const sudahDaluwarsa = sisaDays < 0;
    return { end, sisaDays: Math.abs(sisaDays), sudahDaluwarsa };
  }

  const hasil = tanggalKejadian ? hitungDaluwarsa() : null;

  return (
    <div className="space-y-4">
      <InfoBox>
        Berdasarkan Pasal 1967 KUHPerdata (perdata) dan Pasal 78-84 KUHP (pidana). Daluwarsa dapat terhenti karena pengakuan utang, pengajuan gugatan, atau tindakan penyidikan.
      </InfoBox>
      <div>
        <label className="text-sm font-medium block mb-1.5">Jenis Klaim</label>
        <select value={jenisDaluwarsa} onChange={(e) => setJenisDaluwarsa(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
          {JENIS.map((j) => <option key={j.value} value={j.value}>{j.label} ({j.tahun} tahun)</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1.5">Tanggal Peristiwa / Mulai Daluwarsa</label>
        <input type="date" value={tanggalKejadian} onChange={(e) => setTanggalKejadian(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
      </div>
      {hasil && selected && (
        <div className="space-y-2">
          <ResultBox label="Periode Daluwarsa" value={`${selected.tahun} Tahun`} />
          <ResultBox label="Tanggal Daluwarsa" value={hasil.end.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} />
          <ResultBox
            label={hasil.sudahDaluwarsa ? "Status" : "Sisa Waktu"}
            value={hasil.sudahDaluwarsa ? `⚠️ SUDAH DALUWARSA (${hasil.sisaDays} hari lalu)` : `${hasil.sisaDays} hari tersisa`}
            highlight={!hasil.sudahDaluwarsa}
          />
          {hasil.sudahDaluwarsa && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
              Klaim kemungkinan sudah melampaui batas daluwarsa. Konsultasikan dengan pengacara untuk mengetahui apakah ada dasar penghentian daluwarsa.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// KALKULATOR MASA PENAHANAN
// ============================================================
function KalkulatorPenahanan() {
  const [tahap, setTahap] = useState("penyidik");
  const [tanggalMulai, setTanggalMulai] = useState("");

  const TAHAP = [
    {
      value: "penyidik", label: "Penyidik (Polisi)", stages: [
        { label: "Tahap I", hari: 20 }, { label: "Perpanjangan JPU", hari: 40 },
      ]
    },
    {
      value: "jpu", label: "Penuntut Umum (Kejaksaan)", stages: [
        { label: "Tahap I", hari: 20 }, { label: "Perpanjangan PN", hari: 30 },
      ]
    },
    {
      value: "pn", label: "Pengadilan Negeri (PN)", stages: [
        { label: "Tahap I", hari: 30 }, { label: "Perpanjangan PT", hari: 60 },
      ]
    },
    {
      value: "pt", label: "Pengadilan Tinggi (PT)", stages: [
        { label: "Tahap I", hari: 30 }, { label: "Perpanjangan MA", hari: 60 },
      ]
    },
    {
      value: "ma", label: "Mahkamah Agung (Kasasi)", stages: [
        { label: "Tahap I", hari: 50 }, { label: "Perpanjangan MA", hari: 60 },
      ]
    },
  ];

  const selectedTahap = TAHAP.find((t) => t.value === tahap);
  const totalHari = selectedTahap ? selectedTahap.stages.reduce((a, b) => a + b.hari, 0) : 0;

  function hitungAkhir(start: Date, tambah: number) {
    const d = new Date(start);
    d.setDate(d.getDate() + tambah);
    return d;
  }

  const tanggalMulaiDate = tanggalMulai ? new Date(tanggalMulai) : null;

  return (
    <div className="space-y-4">
      <InfoBox>
        Berdasarkan Pasal 20-31 KUHAP. Penahanan bertahap: penyidik → JPU → PN → PT → MA. Total maksimum bisa mencapai lebih dari 400 hari. Tersangka/terdakwa dapat mengajukan penangguhan penahanan.
      </InfoBox>
      <div>
        <label className="text-sm font-medium block mb-1.5">Tahap Penahanan</label>
        <select value={tahap} onChange={(e) => setTahap(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
          {TAHAP.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1.5">Tanggal Mulai Penahanan</label>
        <input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
      </div>
      {selectedTahap && (
        <div className="space-y-2">
          {selectedTahap.stages.map((s, i) => {
            if (!tanggalMulaiDate) return <ResultBox key={i} label={s.label} value={`${s.hari} hari`} />;
            const prevDays = selectedTahap.stages.slice(0, i).reduce((a, b) => a + b.hari, 0);
            const mulai = hitungAkhir(tanggalMulaiDate, prevDays);
            const selesai = hitungAkhir(tanggalMulaiDate, prevDays + s.hari);
            return (
              <ResultBox
                key={i}
                label={`${s.label} (${s.hari} hari): ${mulai.toLocaleDateString("id-ID")} – ${selesai.toLocaleDateString("id-ID")}`}
                value={`${s.hari} hari`}
              />
            );
          })}
          <ResultBox label="Total Maksimum Penahanan Tahap Ini" value={`${totalHari} hari`} highlight />
          {tanggalMulaiDate && (
            <ResultBox
              label="Batas Akhir Penahanan Tahap Ini"
              value={hitungAkhir(tanggalMulaiDate, totalHari).toLocaleDateString("id-ID", { dateStyle: "long" })}
              highlight
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// KALKULATOR WARIS
// ============================================================
function KalkulatorWaris() {
  const [totalHarta, setTotalHarta] = useState("");
  const [jumlahAnak, setJumlahAnak] = useState("1");
  const [adaPasangan, setAdaPasangan] = useState(true);
  const [sistemWaris, setSistemWaris] = useState("perdata");

  function hitung() {
    const harta = parseFloat(totalHarta.replace(/[^0-9]/g, ""));
    const anak = parseInt(jumlahAnak);
    if (!harta || isNaN(anak)) return null;

    if (sistemWaris === "perdata") {
      // KUHPerdata: pasangan 1/4 jika ada anak, sisanya dibagi rata anak
      let bagianPasangan = 0;
      if (adaPasangan) {
        bagianPasangan = harta * (1 / (anak + 1));
      }
      const bagianPerAnak = (harta - bagianPasangan) / anak;
      return { pasangan: bagianPasangan, perAnak: bagianPerAnak, anak };
    } else {
      // Hukum Islam (KHI): Pasangan 1/8 jika ada anak, sisanya ashabah anak (lk = 2x prp)
      // Asumsikan semua anak laki-laki untuk simplifikasi
      const bagianPasangan = adaPasangan ? harta * (1 / 8) : 0;
      const sisaAshabah = harta - bagianPasangan;
      const bagianPerAnak = sisaAshabah / anak;
      return { pasangan: bagianPasangan, perAnak: bagianPerAnak, anak };
    }
  }

  const hasil = totalHarta && jumlahAnak ? hitung() : null;

  return (
    <div className="space-y-4">
      <InfoBox>
        Estimasi pembagian waris. Hukum Perdata (KUHPerdata) berlaku untuk WNI non-Muslim. Hukum Islam (KHI) berlaku untuk WNI Muslim. Pembagian aktual bergantung pada jumlah dan jenis ahli waris seluruhnya.
      </InfoBox>
      <div className="flex gap-2 mb-2">
        {["perdata", "islam"].map((s) => (
          <button key={s} onClick={() => setSistemWaris(s)} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${sistemWaris === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"}`}>
            {s === "perdata" ? "Hukum Perdata (BW)" : "Hukum Islam (KHI)"}
          </button>
        ))}
      </div>
      <div>
        <label className="text-sm font-medium block mb-1.5">Total Harta Warisan (Rp)</label>
        <input type="text" value={totalHarta} onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ""); setTotalHarta(raw ? parseInt(raw).toLocaleString("id-ID") : ""); }} placeholder="contoh: 1.000.000.000" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1.5">Jumlah Anak</label>
          <input type="number" value={jumlahAnak} onChange={(e) => setJumlahAnak(e.target.value)} min="0" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Ada Pasangan Hidup?</label>
          <select value={adaPasangan ? "ya" : "tidak"} onChange={(e) => setAdaPasangan(e.target.value === "ya")} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
            <option value="ya">Ya</option>
            <option value="tidak">Tidak</option>
          </select>
        </div>
      </div>
      {hasil && (
        <div className="space-y-2">
          {adaPasangan && <ResultBox label={`Bagian Pasangan (${sistemWaris === "islam" ? "1/8" : `1/${hasil.anak + 1}`})`} value={formatRupiah(hasil.pasangan)} />}
          <ResultBox label={`Bagian per Anak (dari ${hasil.anak} anak)`} value={formatRupiah(hasil.perAnak)} highlight />
          <p className="text-xs text-muted-foreground">*Ini adalah estimasi sederhana. Pembagian aktual sangat bergantung pada seluruh komposisi ahli waris (orang tua, saudara, dll) dan mungkin berbeda. Konsultasikan dengan Notaris atau Pengadilan Agama.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// KALKULATOR BIAYA NOTARIS
// ============================================================
function KalkulatorNotaris() {
  const [nilaiAkta, setNilaiAkta] = useState("");
  const [jenisAkta, setJenisAkta] = useState("jual_beli");

  const JENIS = [
    { value: "jual_beli", label: "Akta Jual Beli (AJB)" },
    { value: "pendirian_pt", label: "Akta Pendirian PT" },
    { value: "hibah", label: "Akta Hibah" },
    { value: "perjanjian", label: "Perjanjian / Kontrak" },
    { value: "waris", label: "Surat Keterangan Waris (SKW)" },
    { value: "surat_kuasa", label: "Surat Kuasa (SKMHT/APHT)" },
  ];

  function hitungHonorarium(nilai: number): number {
    if (nilai <= 0) return 0;
    if (nilai <= 100_000_000) return Math.max(nilai * 0.025, 100_000);
    if (nilai <= 1_000_000_000) return 2_500_000 + (nilai - 100_000_000) * 0.015;
    if (nilai <= 10_000_000_000) return 2_500_000 + 13_500_000 + (nilai - 1_000_000_000) * 0.01;
    return 2_500_000 + 13_500_000 + 90_000_000 + (nilai - 10_000_000_000) * 0.005;
  }

  function hitung() {
    const nilai = parseFloat(nilaiAkta.replace(/[^0-9]/g, ""));
    if (!nilai) return null;
    const honorarium = hitungHonorarium(nilai);
    const pph = jenisAkta === "jual_beli" ? nilai * 0.025 : 0;
    const bphtb = jenisAkta === "jual_beli" ? (nilai - 80_000_000) * 0.05 : 0;
    return { honorarium, pph: Math.max(pph, 0), bphtb: Math.max(bphtb, 0) };
  }

  const hasil = nilaiAkta ? hitung() : null;

  return (
    <div className="space-y-4">
      <InfoBox>
        Berdasarkan Permenkumham No. 17/2021 tentang Honorarium Notaris dan peraturan perpajakan. PPh dan BPHTB hanya untuk Akta Jual Beli.
      </InfoBox>
      <div>
        <label className="text-sm font-medium block mb-1.5">Jenis Akta</label>
        <select value={jenisAkta} onChange={(e) => setJenisAkta(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
          {JENIS.map((j) => <option key={j.value} value={j.value}>{j.label}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1.5">Nilai Transaksi / Objek Akta (Rp)</label>
        <input type="text" value={nilaiAkta} onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ""); setNilaiAkta(raw ? parseInt(raw).toLocaleString("id-ID") : ""); }} placeholder="contoh: 500.000.000" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
      </div>
      {hasil && (
        <div className="space-y-2">
          <ResultBox label="Honorarium Notaris" value={formatRupiah(hasil.honorarium)} highlight />
          {jenisAkta === "jual_beli" && <>
            <ResultBox label="PPh Penjual (2.5% dari nilai)" value={formatRupiah(hasil.pph)} />
            <ResultBox label="BPHTB Pembeli (5% × (nilai-NPOPTKP))" value={formatRupiah(hasil.bphtb)} />
          </>}
          <p className="text-xs text-muted-foreground">*NPOPTKP Rp 80 juta (nilai default, dapat berbeda per daerah). Biaya aktual dapat berbeda berdasarkan kebijakan notaris setempat.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Kalkulator() {
  const [active, setActive] = useState<KalkulatorType | null>(null);

  const selected = KALKULATOR_LIST.find((k) => k.id === active);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-36 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <Calculator className="w-3 h-3" /> Kalkulator Hukum
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Kalkulator Hukum</h1>
            <p className="text-muted-foreground">
              Hitung biaya perkara, pesangon, daluwarsa, penahanan, dan waris secara otomatis berdasarkan ketentuan hukum Indonesia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {KALKULATOR_LIST.map((k) => (
              <button
                key={k.id}
                onClick={() => setActive(active === k.id ? null : k.id)}
                className={`text-left p-4 rounded-xl border transition-all ${active === k.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 bg-card"}`}
              >
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${k.color}`}>
                  <k.icon className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-foreground mb-1">{k.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{k.desc}</div>
                <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                  {active === k.id ? "Tutup" : "Buka Kalkulator"} <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {active && selected && (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${selected.color}`}>
                    <selected.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{selected.label}</h2>
                    <p className="text-xs text-muted-foreground">{selected.desc}</p>
                  </div>
                </div>
                {active === "biaya_perkara" && <KalkulatorBiayaPerkara />}
                {active === "pesangon" && <KalkulatorPesangon />}
                {active === "daluwarsa" && <KalkulatorDaluwarsa />}
                {active === "penahanan" && <KalkulatorPenahanan />}
                {active === "waris" && <KalkulatorWaris />}
                {active === "biaya_notaris" && <KalkulatorNotaris />}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4 text-sm text-amber-400/80">
            <strong className="text-amber-400">Disclaimer:</strong> Hasil kalkulator ini hanya merupakan estimasi berdasarkan ketentuan umum. Angka aktual dapat berbeda berdasarkan kondisi spesifik kasus, kebijakan pengadilan/notaris setempat, dan peraturan terbaru. Selalu konsultasikan dengan pengacara atau notaris sebelum mengambil keputusan hukum.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
