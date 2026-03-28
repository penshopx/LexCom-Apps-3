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

## 📱 FITUR-FITUR PLATFORM LENGKAP

1. **Agen AI Hukum** (/agents) — 11 agen spesialis, klik kartu untuk konsultasi (butuh login)
2. **Agentic AI Chat** (/agentic-chatbots) — Multi-agen kolaborasi (butuh login)
3. **LexBot** (/lexbot) — Asisten utama, gratis, floating widget di semua halaman
4. **Generator Dokumen** (/documents) — Draft hukum otomatis: Gugatan, Kontrak, dll (butuh login)
5. **Manajemen Perkara** (/cases) — Kelola perkara hukum Anda (butuh login)
6. **Peraturan** (/peraturan) — 22 peraturan hukum Indonesia, gratis
7. **Putusan** (/putusan) — 16 putusan pengadilan, gratis
8. **Panduan** (/panduan) — 15 artikel praktis, gratis
9. **Kursus** (/kursus) — 10 kursus hukum online, gratis
10. **Pengacara** (/pengacara) — Direktori 16 pengacara, gratis
11. **Forum Diskusi** (/forum) — Diskusi komunitas, posting anonim, gratis
12. **Komunitas** (/komunitas) — Events, networking, gratis

### Cara Login: Klik "Masuk" → Login dengan akun Replit
### Gratis tanpa login: Semua kecuali Chatbot AI, Generator Dokumen, Manajemen Perkara
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
      tool_choice: "required",
      max_completion_tokens: 1024,
    });

    const toolCall = orchestratorResult.choices[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      sendEvent({ type: "error", message: "Orchestrator tidak menghasilkan tool call" });
      res.end();
      return;
    }

    const fnName = toolCall.function.name;
    const fnArgs = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;

    let finalResponse = "";

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
