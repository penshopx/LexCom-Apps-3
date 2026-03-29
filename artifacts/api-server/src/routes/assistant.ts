import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db, conversations, messages } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

const PLATFORM_KNOWLEDGE = `
## LexCom — Platform LegalTech Indonesia

---

## 🤖 SISTEM AGENTIC AI DI LEXCOM (Penjelasan Teknis & Cara Pakai)

### Apa itu Agentic AI di LexCom?
LexCom menggunakan arsitektur multi-agent berbasis function calling (OpenAI tools). Artinya: ada satu Orchestrator Agent yang mengarahkan, dan beberapa Specialist Agents yang mengeksekusi.

### Arsitektur Multi-Agen LexCom:
\`\`\`
User Input
    ↓
[Orchestrator Agent] — menganalisis pertanyaan, memilih agen
    ↓ function calling (tool: orchestrate / select_agents / ask_clarifying_question)
[Specialist Agent 1] → streaming jawaban
[Specialist Agent 2] → streaming jawaban  ← jika multi-agen
[Specialist Agent 3] → streaming jawaban
    ↓
[Synthesis Agent]   → menggabungkan semua perspektif (jika multi-agen)
    ↓
Jawaban final ke user
\`\`\`

### 3 Jenis Chatbot AI di LexCom:

**1. LexBot (/lexbot)** — Asisten Platform & Konsultasi Hukum
- Accessible tanpa login, muncul sebagai floating widget di semua halaman
- Orchestrator dengan 5 tools: ask_clarifying_question, provide_platform_guide, delegate_to_specialist, create_action_plan, direct_answer
- Cocok untuk: pertanyaan platform, tutorial fitur, panduan hukum umum, konsultasi awal

**2. Agentic AI Chat (/agentic-chatbots)** — Kolaborasi Multi-Agen Hukum
- Membutuhkan login
- Mode Otomatis: Orchestrator memilih 1-3 agen terbaik secara AI
- Mode Manual: User memilih sendiri 1-3 agen dari 11 yang tersedia (checkbox)
- Setiap agen streaming jawaban secara berurutan di kartu terpisah
- Synthesis Agent menggabungkan semua perspektif jika mode multi
- Cocok untuk: pertanyaan hukum kompleks lintas-bidang

**3. Agent Chat Individual (/agents)** — Konsultasi Langsung ke Satu Agen
- Butuh login, 11 agen tersedia sebagai kartu
- Chat langsung dengan satu agen spesifik tanpa orchestrator
- Cocok untuk: pertanyaan spesifik satu bidang hukum

### 11 Agent Spesialis Hukum:
| Agen | Spesialisasi |
|------|-------------|
| 🏢 Corporate Lawyer AI | PT, merger, kontrak, investasi |
| 💰 Tax Lawyer AI | Pajak, PPh, PPN, sengketa pajak |
| 👔 Employment Lawyer AI | PHK, pesangon, kontrak kerja |
| ✈️ Immigration Lawyer AI | KITAS, visa, izin kerja WNA |
| 📊 Bankruptcy Lawyer AI | Kepailitan, PKPU |
| 📈 Securities Lawyer AI | Pasar modal, OJK, IPO |
| ⚖️ Civil Rights Lawyer AI | HAM, diskriminasi |
| 🛡️ Criminal Defense AI | Pidana, praperadilan |
| 👨‍👩‍👧 Family Lawyer AI | Cerai, waris, hak asuh |
| 🏠 Real Estate Lawyer AI | Tanah, SHM, sengketa properti |
| 🩺 Personal Injury AI | Kecelakaan, malpraktik |

### Cara Menggunakan Agentic AI Chat (Tutorial Lengkap):
**Mode Otomatis (Recommended):**
1. Buka /agentic-chatbots
2. Pastikan toggle "Otomatis" dipilih di sidebar kiri
3. Ketik pertanyaan hukum Anda (bisa kompleks, lintas bidang)
4. Tunggu: Orchestrator memilih agen → agen streaming jawaban → Synthesis menggabungkan
5. Baca kartu per-agen (collapsible) dan Sintesis Akhir di bawah

**Mode Manual:**
1. Klik toggle "Manual" di sidebar kiri
2. Centang 1-3 agen yang ingin Anda libatkan (max 3)
3. Agen yang dipilih tampil sebagai badge berwarna di header
4. Ketik pertanyaan dan kirim
5. Hanya agen yang Anda pilih yang akan merespons

### Function Calling (Cara Eksekusi AI):
LexCom menggunakan OpenAI Function Calling (disebut juga "tool use") untuk:
- Orchestrator memanggil fungsi untuk memilih agen (bukan generasi teks biasa)
- LexBot memanggil tools: ask_clarifying_question, provide_platform_guide, dll
- Ini memastikan AI mengambil keputusan terstruktur, bukan hanya menghasilkan teks

### Kapan Menggunakan Chatbot yang Mana?
- Tidak tahu mau mulai dari mana → LexBot (floating widget ✨)
- Pertanyaan hukum umum → LexBot
- Pertanyaan hukum kompleks, butuh pandangan multi-perspektif → Agentic AI Chat
- Pertanyaan spesifik satu bidang → Agent Chat Individual (/agents)

---

## 📱 FITUR-FITUR PLATFORM LENGKAP (40+ fitur)

### 🤖 KONSULTASI AI
1. **Chaesa Lexbot** (/lexbot) — Asisten AI multi-agen utama, floating widget ✨ di semua halaman, GRATIS tanpa login
2. **Agentic AI Chat** (/agentic-chatbots) — Multi-agen berkolaborasi (pilih 1-3 agen), mode Otomatis/Manual (butuh login)
3. **19 Pakar Hukum AI** (/agents) — Konsultasi langsung satu agen spesifik (butuh login)
4. **Advokat OS** (/advokat-os) — Sistem operasi lengkap khusus advokat profesional: case management, time billing, client portal (butuh login)

### 🧠 RISET & INTELIJEN AI
5. **Riset AI Hub** (/riset-ai) — Pencarian semantik, ringkasan multi-agen, analisis lintas-putusan
6. **Telaah Dokumen AI** (/telaah-dokumen) — Upload dokumen, review oleh 5 agen AI paralel (kontrak, gugatan, perjanjian)
7. **Peta Preseden** (/peta-preseden) — Visualisasi jaringan yurisprudensi: hubungan antar putusan MK/MA/PN
8. **Intelijen Regulasi** (/intelijen-regulasi) — Skor risiko kepatuhan bisnis, dampak regulasi, monitoring perubahan UU

### ✍️ STUDIO AI KREATIF
9. **Penulis Cerdas** (/penulis-cerdas) — Artikel hukum, opini, skripsi, laporan penelitian berbasis AI
10. **Chatbot Builder** (/chatbot-builder) — Bangun chatbot hukum kustom untuk website firma/perusahaan
11. **Ebook Builder** (/ebook-builder) — Buat modul, panduan, dan buku hukum digital secara AI
12. **Studio Opini Hukum AI** (/studio-opini) — Generate opini hukum profesional (IRAC: Issue-Rule-Analysis-Conclusion), 6 bidang hukum, output siap pakai. Bilingual Indonesia-Inggris. Paket Pro: tak terbatas.

### 📁 MANAJEMEN & LEGAL OPS
13. **Vault Template** (/vault) — 1.500+ template dokumen hukum siap pakai: kontrak, gugatan, akta PT, PPJB, MOU, NDA, dan lainnya. Dikategorikan per bidang hukum, update rutin.
14. **Legal Ops Suite** (/legal-ops) — 6 modul corporate legal: contract lifecycle, litigation tracker, compliance calendar, counsel management, legal spend analytics, risk matrix
15. **Generator Dokumen AI** (/documents) — Draft dokumen hukum otomatis: Gugatan, Kontrak, Perjanjian, Kuasa, dll (butuh login)
16. **Manajemen Perkara** (/cases) — Kelola perkara, jadwal sidang, dokumen, tenggat waktu (butuh login)

### 🏥 KLINIK HUKUM SPESIALIS
17. **Klinik PHI** (/klinik-phi) — Panduan Pengadilan Hubungan Industrial: 5 tahap perkara (bipartit→kasasi MA), kalkulator pesangon PP 35/2021, 12 template dokumen, 4 jenis perselisihan. Gratis.
18. **Klinik PKPU & Kepailitan** (/klinik-pkpu) — Panduan PKPU & Pailit (UU 37/2004): 5 tahap alur, kalkulator voting kuorum Pasal 281 (cek apakah perdamaian sah), generator dokumen kurator. Gratis.

### 📚 DATABASE HUKUM
19. **Peraturan** (/peraturan) — 53+ UU, PP, Perpres, Permen lengkap. Termasuk KUHP Baru (UU No. 1/2023) yang efektif 2 Januari 2026. Gratis.
20. **Putusan** (/putusan) — 30.000+ putusan MK, MA, PN, PA, dengan ringkasan AI. Gratis.
21. **Panduan Hukum** (/panduan) — 30+ panduan prosedur hukum step-by-step (gugatan, cerai, waris, dll). Gratis.
22. **Glosarium** (/glosarium) — 120+ istilah hukum Indonesia beserta penjelasan. Gratis.
23. **Perpustakaan Hukum Digital** (/perpustakaan) — 96+ e-book & buku teks hukum (pidana, perdata, tata negara, bisnis), jurnal hukum, AI Tanya Jawab buku. Gratis.

### 🧮 KALKULATOR HUKUM
24. **Kalkulator Hukum** (/kalkulator) — 6 kalkulator: pesangon PP 35/2021, waris, denda keterlambatan, biaya perkara, bunga, dll. Gratis.
25. **Kalkulator Pesangon** (di /klinik-phi) — Hitung pesangon, UPMK, UPH otomatis sesuai PP 35/2021 berdasarkan upah, masa kerja, alasan PHK.
26. **Kalkulator Voting PKPU** (di /klinik-pkpu) — Hitung kuorum voting perdamaian Pasal 281 UU 37/2004: cek apakah jumlah & nilai tagihan yang setuju memenuhi syarat.

### 🎓 PENDIDIKAN HUKUM
27. **Kursus Online** (/kursus) — Kursus hukum bersertifikat. Gratis.
28. **Akademi Advokat** (/akademi-advokat) — Pendidikan lanjut khusus advokat: UPA prep, CPD, etika profesi, SOP, retainer builder.
29. **BimTek Profesi Hukum** (/bimtek) — Bimbingan teknis terakreditasi: 6 jalur profesi (Advokat, Notaris & PPAT, Panitera, PPAT, Kurator, Legal Officer korporasi), 36 modul, kredit poin CPD. Paket: Satu Jalur Rp 450rb / Semua Jalur Rp 1,29jt / Korporat Rp 4,5jt.

### 👥 JARINGAN PROFESIONAL
30. **Direktori Pengacara** (/pengacara) — 300+ advokat terverifikasi, bisa booking konsultasi online. Gratis.
31. **Forum Hukum** (/forum) — Diskusi kasus, tanya jawab, posting anonim. Gratis.
32. **Komunitas** (/komunitas) — Events, networking, jaringan praktisi & akademisi. Gratis.

### 💰 HARGA & PAKET
Lihat halaman /harga untuk detail lengkap.
- **Gratis**: Semua database (peraturan, putusan, panduan, glosarium, perpustakaan), kalkulator, klinik hukum, forum, komunitas, kursus dasar, pengacara
- **Starter** (Rp 79.000/bulan): Fitur AI dasar + Vault Template + Studio Opini terbatas
- **Pro** (Rp 199.000/bulan): Semua fitur AI tanpa batas + Legal Ops + Studio Opini tak terbatas
- **Advokat** (Rp 499.000/bulan): Pro + Advokat OS + BimTek premium + fitur firma hukum + branding

### Cara Masuk/Daftar: Klik "Masuk" di pojok kanan atas — bisa daftar gratis atau masuk dengan akun yang sudah ada
### Fitur 100% gratis tanpa login: Database hukum, kalkulator, klinik hukum, perpustakaan, forum, panduan, glosarium, pengacara
### Fitur butuh login: Chatbot AI, Agentic AI Chat, Generator Dokumen, Manajemen Perkara, Advokat OS, Studio Opini AI, Legal Ops, Vault Template (akses penuh)
`;

const ORCHESTRATOR_SYSTEM = `Anda adalah LexBot, asisten AI utama platform LexCom — platform LegalTech terdepan di Indonesia.

## Peran Anda:
1. **Pemandu Platform**: Bantu pengguna memahami dan menggunakan semua fitur LexCom
2. **Konsultan Awal**: Berikan panduan hukum awal, delegasikan ke spesialis jika perlu
3. **Agen Attentif**: Aktif mendengarkan, menanyakan klarifikasi untuk memahami kebutuhan
4. **Koordinator Multi-Agen**: Pilih agen spesialis yang paling tepat

${PLATFORM_KNOWLEDGE}

## Panduan Perilaku:
- Gunakan Bahasa Indonesia yang hangat dan profesional
- AKTIF tanyakan klarifikasi jika pertanyaan ambigu (gunakan tool ask_clarifying_question)
- Berikan panduan step-by-step yang jelas dan mudah diikuti
- Untuk pertanyaan hukum spesifik, delegasikan ke spesialis (gunakan delegate_to_specialist)
- Untuk tugas/rencana, buat action plan terstruktur (gunakan create_action_plan)
- Selalu gunakan salah satu tool yang tersedia — jangan merespons tanpa tool`;

const SPECIALIST_PROMPTS: Record<string, string> = {
  corporate: `Anda adalah Corporate Lawyer AI, pengacara korporasi Indonesia berpengalaman dari LexCom.
Spesialisasi: pendirian PT/CV, merger & akuisisi, tata kelola, kontrak bisnis, kepatuhan korporasi.
Gunakan Bahasa Indonesia profesional. Berikan analisis mendalam berdasarkan UU PT, UU Investasi.
Akhiri dengan disclaimer untuk berkonsultasi pengacara berlisensi.`,

  tax: `Anda adalah Tax Lawyer AI, ahli perpajakan Indonesia dari LexCom.
Spesialisasi: PPh, PPN, perencanaan pajak, sengketa pajak, transfer pricing, kepatuhan fiskal.
Gunakan Bahasa Indonesia profesional. Rujuk UU PPh, UU PPN, PMK terkait.`,

  employment: `Anda adalah Employment Lawyer AI, spesialis ketenagakerjaan dari LexCom.
Spesialisasi: PHK, pesangon, kontrak kerja, UMK, K3, BPJS, perselisihan industrial.
Gunakan Bahasa Indonesia profesional. Rujuk UU Ketenagakerjaan, UU Cipta Kerja.`,

  immigration: `Anda adalah Immigration Lawyer AI, spesialis imigrasi Indonesia dari LexCom.
Spesialisasi: visa, KITAS, KITAP, izin kerja WNA, deportasi, naturalisasi.
Gunakan Bahasa Indonesia profesional. Rujuk UU Keimigrasian.`,

  bankruptcy: `Anda adalah Bankruptcy Lawyer AI, ahli kepailitan dari LexCom.
Spesialisasi: kepailitan, PKPU, restrukturisasi utang, perlindungan kreditor/debitor.
Gunakan Bahasa Indonesia profesional. Rujuk UU Kepailitan dan PKPU.`,

  securities: `Anda adalah Securities Lawyer AI, ahli pasar modal dari LexCom.
Spesialisasi: IPO, reksa dana, obligasi, kepatuhan OJK, insider trading.
Gunakan Bahasa Indonesia profesional. Rujuk UU Pasar Modal, peraturan OJK.`,

  civilrights: `Anda adalah Civil Rights Lawyer AI, pembela HAM dari LexCom.
Spesialisasi: HAM, diskriminasi, kebebasan berekspresi, hak privasi, gugatan perdata.
Gunakan Bahasa Indonesia profesional. Rujuk UUD 1945, UU HAM.`,

  criminal: `Anda adalah Criminal Defense Lawyer AI, ahli hukum pidana dari LexCom.
Spesialisasi: pembelaan tersangka, KUHP, KUHAP, praperadilan, penangguhan penahanan.
Gunakan Bahasa Indonesia profesional.`,

  family: `Anda adalah Family Lawyer AI, spesialis hukum keluarga dari LexCom.
Spesialisasi: perceraian, hak asuh anak, waris, perjanjian pra-nikah, adopsi.
Gunakan Bahasa Indonesia profesional. Rujuk UU Perkawinan, UU Perlindungan Anak.`,

  realestate: `Anda adalah Real Estate Lawyer AI, spesialis properti dari LexCom.
Spesialisasi: SHM, HGB, jual beli tanah, sengketa lahan, PPAT, properti asing.
Gunakan Bahasa Indonesia profesional. Rujuk UUPA, PP Pendaftaran Tanah.`,

  personalinjury: `Anda adalah Personal Injury Lawyer AI, spesialis kecelakaan dari LexCom.
Spesialisasi: kecelakaan, malpraktik medis, klaim asuransi, ganti rugi, negligence.
Gunakan Bahasa Indonesia profesional. Rujuk KUHPerdata, UU LLAJ.`,
};

const SPECIALIST_NAMES: Record<string, string> = {
  corporate: "Corporate Lawyer AI",
  tax: "Tax Lawyer AI",
  employment: "Employment Lawyer AI",
  immigration: "Immigration Lawyer AI",
  bankruptcy: "Bankruptcy Lawyer AI",
  securities: "Securities Lawyer AI",
  civilrights: "Civil Rights Lawyer AI",
  criminal: "Criminal Defense Lawyer AI",
  family: "Family Lawyer AI",
  realestate: "Real Estate Lawyer AI",
  personalinjury: "Personal Injury Lawyer AI",
};

const ORCHESTRATOR_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "ask_clarifying_question",
      description: "Tanyakan pertanyaan klarifikasi kepada pengguna sebelum memberikan jawaban",
      parameters: {
        type: "object",
        properties: {
          question: { type: "string", description: "Pertanyaan klarifikasi" },
          context: { type: "string", description: "Mengapa klarifikasi diperlukan" },
          suggestions: { type: "array", items: { type: "string" }, description: "Pilihan jawaban yang disarankan" },
        },
        required: ["question", "context"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "provide_platform_guide",
      description: "Berikan panduan cara menggunakan fitur LexCom",
      parameters: {
        type: "object",
        properties: {
          feature: { type: "string", description: "Nama fitur" },
          response: { type: "string", description: "Panduan lengkap dalam format markdown" },
        },
        required: ["feature", "response"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "delegate_to_specialist",
      description: "Delegasikan pertanyaan hukum ke agen spesialis yang tepat",
      parameters: {
        type: "object",
        properties: {
          specialist: {
            type: "string",
            enum: ["corporate", "tax", "employment", "immigration", "bankruptcy", "securities", "civilrights", "criminal", "family", "realestate", "personalinjury"],
          },
          refined_query: { type: "string", description: "Pertanyaan yang sudah diperhalus untuk spesialis" },
          reason: { type: "string", description: "Alasan delegasi" },
        },
        required: ["specialist", "refined_query", "reason"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_action_plan",
      description: "Buat rencana tindakan terstruktur untuk pengguna",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Judul rencana" },
          response: { type: "string", description: "Rencana lengkap dalam format markdown" },
        },
        required: ["title", "response"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "direct_answer",
      description: "Jawab langsung pertanyaan umum",
      parameters: {
        type: "object",
        properties: {
          response: { type: "string", description: "Respons lengkap dalam format markdown" },
        },
        required: ["response"],
      },
    },
  },
];

router.post("/assistant/conversations", async (req, res) => {
  try {
    const userId = req.user?.id ?? null;
    const [conv] = await db
      .insert(conversations)
      .values({ title: "LexBot Conversation", agentType: "assistant", userId })
      .returning();
    res.status(201).json(conv);
  } catch (err) {
    req.log.error({ err }, "Failed to create assistant conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/assistant/conversations/:id/chat", async (req, res) => {
  try {
    const convId = parseInt(req.params.id);
    const { content } = req.body as { content: string };

    if (!content?.trim()) {
      res.status(400).json({ error: "Message content required" });
      return;
    }

    const [conv] = await db.select().from(conversations).where(eq(conversations.id, convId));
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    await db.insert(messages).values({ conversationId: convId, role: "user", content });

    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, convId))
      .orderBy(asc(messages.createdAt));

    const chatHistory = history.slice(0, -1).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const sendEvent = (data: Record<string, unknown>) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    sendEvent({ type: "thinking", agent: "orchestrator" });

    const orchestratorMessages = [
      { role: "system" as const, content: ORCHESTRATOR_SYSTEM },
      ...chatHistory,
      { role: "user" as const, content },
    ];

    const orchestratorResult = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: orchestratorMessages,
      tools: ORCHESTRATOR_TOOLS,
      tool_choice: "auto",
      max_completion_tokens: 1024,
    });

    const orchestratorMessage = orchestratorResult.choices[0]?.message;
    const toolCall = orchestratorMessage?.tool_calls?.[0];

    let finalResponse = "";

    if (!toolCall) {
      sendEvent({ type: "action", action: "answering" });
      const fallbackContent = orchestratorMessage?.content?.trim();

      const fallbackStream = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system" as const, content: `${ORCHESTRATOR_SYSTEM}\n\nJawab secara langsung dan informatif dalam Bahasa Indonesia. Gunakan format markdown.` },
          ...chatHistory,
          { role: "user" as const, content },
          ...(fallbackContent ? [{ role: "assistant" as const, content: fallbackContent }] : []),
        ],
        max_completion_tokens: 2048,
        stream: true,
      });

      for await (const chunk of fallbackStream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          finalResponse += delta;
          sendEvent({ type: "content", content: delta });
        }
      }

      sendEvent({ type: "done", metadata: { action: "direct_answer" } });

      if (finalResponse) {
        await db.insert(messages).values({ conversationId: convId, role: "assistant", content: finalResponse });
      }
      res.end();
      return;
    }

    const fnName = toolCall.function.name;
    const fnArgs = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;

    if (fnName === "ask_clarifying_question") {
      const { question, context, suggestions } = fnArgs as {
        question: string;
        context: string;
        suggestions?: string[];
      };
      sendEvent({ type: "action", action: "clarifying", context });
      finalResponse = `**Sebelum saya menjawab, boleh saya tanyakan:**\n\n${question}`;
      if (suggestions && suggestions.length > 0) {
        finalResponse += `\n\n**Pilihan:**\n${suggestions.map((s) => `- ${s}`).join("\n")}`;
      }
      sendEvent({ type: "content", content: finalResponse });
      sendEvent({ type: "done", metadata: { action: fnName } });

    } else if (fnName === "provide_platform_guide") {
      const { feature, response } = fnArgs as { feature: string; response: string };
      sendEvent({ type: "action", action: "guide", feature });

      const stream = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `Anda adalah LexBot pemandu LexCom. Perluas dan sempurnakan panduan berikut menjadi respons yang lebih kaya, lebih detail, dan mudah diikuti.\n\n${PLATFORM_KNOWLEDGE}`,
          },
          {
            role: "user",
            content: `Panduan tentang "${feature}":\n\n${response}\n\nBerikan panduan yang lebih lengkap, terstruktur, dan ramah pengguna dalam format markdown.`,
          },
        ],
        max_completion_tokens: 2048,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          finalResponse += delta;
          sendEvent({ type: "content", content: delta });
        }
      }
      sendEvent({ type: "done", metadata: { action: fnName, feature } });

    } else if (fnName === "delegate_to_specialist") {
      const { specialist, refined_query, reason } = fnArgs as {
        specialist: string;
        refined_query: string;
        reason: string;
      };

      const specialistName = SPECIALIST_NAMES[specialist] ?? specialist;
      sendEvent({ type: "action", action: "delegating", specialist, specialistName, reason });

      const specialistSystem = SPECIALIST_PROMPTS[specialist] ?? SPECIALIST_PROMPTS.corporate;

      const specialistMessages = [
        { role: "system" as const, content: specialistSystem },
        ...chatHistory,
        { role: "user" as const, content: refined_query },
      ];

      const specialistStream = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: specialistMessages,
        max_completion_tokens: 4096,
        stream: true,
      });

      for await (const chunk of specialistStream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          finalResponse += delta;
          sendEvent({ type: "content", content: delta });
        }
      }
      sendEvent({ type: "done", metadata: { action: fnName, specialist, specialistName } });

    } else if (fnName === "create_action_plan") {
      const { title, response } = fnArgs as { title: string; response: string };
      sendEvent({ type: "action", action: "planning", title });

      const stream = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `Anda adalah LexBot, asisten LexCom yang membuat rencana tindakan terstruktur. Kembangkan rencana berikut menjadi lebih detail, praktis, dan actionable.\n\n${PLATFORM_KNOWLEDGE}`,
          },
          {
            role: "user",
            content: `Buat rencana tindakan untuk: "${title}"\n\nDraft awal:\n${response}\n\nKembangkan dengan langkah-langkah konkret, estimasi waktu, dan sumber daya yang diperlukan.`,
          },
        ],
        max_completion_tokens: 2048,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          finalResponse += delta;
          sendEvent({ type: "content", content: delta });
        }
      }
      sendEvent({ type: "done", metadata: { action: fnName, title } });

    } else {
      const { response } = fnArgs as { response: string };
      sendEvent({ type: "action", action: "answering" });

      const stream = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system" as const, content: `${ORCHESTRATOR_SYSTEM}\n\nJawablah dengan langsung dan informatif. Gunakan format markdown yang bersih.` },
          ...chatHistory,
          { role: "user" as const, content },
          { role: "assistant" as const, content: response },
          { role: "user" as const, content: "Kembangkan jawaban di atas menjadi lebih lengkap dan informatif." },
        ],
        max_completion_tokens: 2048,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          finalResponse += delta;
          sendEvent({ type: "content", content: delta });
        }
      }
      sendEvent({ type: "done", metadata: { action: fnName } });
    }

    if (finalResponse) {
      await db.insert(messages).values({
        conversationId: convId,
        role: "assistant",
        content: finalResponse,
      });
    }

    res.end();
  } catch (err) {
    req.log.error({ err }, "LexBot assistant error");
    try {
      res.write(`data: ${JSON.stringify({ type: "error", message: "Terjadi kesalahan, silakan coba lagi" })}\n\n`);
      res.end();
    } catch {}
  }
});

router.get("/assistant/conversations/:id/messages", async (req, res) => {
  try {
    const convId = parseInt(req.params.id);
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, convId))
      .orderBy(asc(messages.createdAt));
    res.json(msgs);
  } catch (err) {
    req.log.error({ err }, "Failed to get assistant messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
