import { db } from "../index";
import { forumThreadsTable, forumRepliesTable } from "../schema/forum";
import { eq } from "drizzle-orm";

const THREADS = [
  {
    authorName: "Budi Santoso",
    title: "Bagaimana prosedur gugatan perdata di Pengadilan Negeri?",
    content:
      "Saya ingin menggugat tetangga saya yang mengambil alih sebagian tanah saya. Bagaimana prosedur untuk mengajukan gugatan perdata di Pengadilan Negeri? Dokumen apa saja yang harus saya siapkan?",
    category: "Perdata",
  },
  {
    authorName: "Dewi Rahayu",
    title: "PHK sepihak oleh perusahaan, apa yang bisa saya lakukan?",
    content:
      "Saya baru saja di-PHK oleh perusahaan tanpa pemberitahuan 30 hari dan tanpa pesangon. Padahal saya sudah bekerja selama 5 tahun. Apakah ada dasar hukum yang melindungi saya? Apa langkah yang harus saya ambil?",
    category: "Bisnis",
  },
  {
    authorName: "Ahmad Fauzi",
    title: "Syarat perceraian di Pengadilan Agama untuk yang beragama Islam",
    content:
      "Saya ingin mengetahui syarat dan prosedur pengajuan cerai gugat di Pengadilan Agama. Apakah harus ada alasan khusus? Berapa lama prosesnya biasanya?",
    category: "Keluarga",
  },
  {
    authorName: "Siti Nurhaliza",
    title: "Apakah jual beli tanah hanya dengan kwitansi sah di mata hukum?",
    content:
      "Orang tua saya membeli tanah tahun 1990 hanya dengan kwitansi dan saksi, tidak ada AJB di depan PPAT. Apakah transaksi ini sah secara hukum? Bagaimana cara menguatkan kepemilikan ini sekarang?",
    category: "Perdata",
  },
  {
    authorName: "Rizky Pratama",
    title: "Hak tersangka saat ditangkap polisi - apa yang perlu saya tahu?",
    content:
      "Adik saya baru saja ditangkap polisi. Apa saja hak-hak yang dimiliki tersangka berdasarkan KUHAP? Kapan kami boleh menghadirkan pengacara? Apa yang harus kami lakukan sekarang?",
    category: "Pidana",
  },
  {
    authorName: "Linda Wijaya",
    title: "Cara mendirikan PT dengan modal terbatas - panduan lengkap",
    content:
      "Saya ingin mendirikan PT untuk usaha kecil saya. Berapa modal minimum yang diperlukan? Apa saja dokumen yang dibutuhkan? Apakah bisa diurus sendiri tanpa notaris?",
    category: "Bisnis",
  },
  {
    authorName: "Hendra Kusuma",
    title: "Warisan rumah tidak ada surat wasiat, bagaimana pembagiannya?",
    content:
      "Ayah saya baru meninggal dan meninggalkan rumah tanpa wasiat. Ahli waris ada 3 anak (saya, kakak, adik) dan ibu masih hidup. Bagaimana hukum waris Islam mengatur pembagiannya?",
    category: "Keluarga",
  },
  {
    authorName: "Maya Anggraini",
    title: "Tanda tangan palsu di akta perusahaan - apakah bisa dipidana?",
    content:
      "Saya menemukan bahwa tanda tangan saya dipalsukan dalam dokumen pendirian PT oleh mantan rekan bisnis. Apakah ini termasuk tindak pidana? Pasal berapa yang berlaku? Bagaimana cara melaporkannya?",
    category: "Pidana",
  },
];

const REPLIES: Array<{ threadIdx: number; authorName: string; content: string }> = [
  {
    threadIdx: 0,
    authorName: "Eko Prasetyo",
    content:
      "Untuk gugatan perdata, Anda perlu menyiapkan: 1) Surat gugatan, 2) Fotokopi KTP, 3) Bukti kepemilikan tanah (SHM/girik), 4) Surat keterangan dari kelurahan. Biaya pendaftaran tergantung nilai objek sengketa.",
  },
  {
    threadIdx: 0,
    authorName: "Farida Hanum",
    content:
      "Tambahan dari saya: sebelum ke PN, coba mediasi dulu. Sesuai PERMA No. 1 Tahun 2016, hakim wajib mendorong para pihak untuk mediasi. Ini lebih cepat dan hemat biaya.",
  },
  {
    threadIdx: 1,
    authorName: "Wahyu Setiawan",
    content:
      "Berdasarkan UU No. 13 Tahun 2003 tentang Ketenagakerjaan, PHK harus melalui penetapan Pengadilan Hubungan Industrial. PHK sepihak tanpa prosedur yang benar tidak sah. Anda berhak atas pesangon 2x PMTK.",
  },
  {
    threadIdx: 2,
    authorName: "Nurul Hidayah",
    content:
      "Alasan cerai gugat di PA antara lain: suami tidak memberi nafkah lahir batin, pertengkaran terus menerus, suami pergi tanpa izin lebih dari 2 tahun, dll. Proses biasanya 3-6 bulan.",
  },
  {
    threadIdx: 4,
    authorName: "Dedy Susanto",
    content:
      "Hak tersangka berdasarkan KUHAP: 1) Hak untuk didampingi pengacara sejak awal, 2) Hak untuk diam (tidak menjawab pertanyaan), 3) Hak untuk diberitahu sangkaan, 4) Hak untuk menghubungi keluarga.",
  },
  {
    threadIdx: 5,
    authorName: "Agus Firmansyah",
    content:
      "Sejak PP No. 8 Tahun 2021, modal dasar PT tidak ada minimum untuk UMKM. Bisa mulai dari Rp 50 juta. Anda perlu notaris untuk akta pendirian, kemudian didaftarkan ke Kemenkumham via OSS.",
  },
];

export async function seedForum() {
  const existing = await db.select().from(forumThreadsTable).limit(1);
  if (existing.length > 0) {
    console.log("[seed] Forum already has data, skipping.");
    return;
  }

  const insertedThreads = await db.insert(forumThreadsTable).values(THREADS).returning();

  const replyCounts: Record<number, number> = {};
  for (const r of REPLIES) {
    const thread = insertedThreads[r.threadIdx];
    if (!thread) continue;
    await db.insert(forumRepliesTable).values({
      threadId: thread.id,
      authorName: r.authorName,
      content: r.content,
    });
    replyCounts[thread.id] = (replyCounts[thread.id] ?? 0) + 1;
  }

  for (const [threadId, count] of Object.entries(replyCounts)) {
    await db
      .update(forumThreadsTable)
      .set({ replyCount: count })
      .where(eq(forumThreadsTable.id, Number(threadId)));
  }

  console.log(`[seed] Inserted ${THREADS.length} forum threads and ${REPLIES.length} replies.`);
}
