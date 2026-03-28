import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db, conversations, messages } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

const PLATFORM_KNOWLEDGE = `
## LexCom — Platform LegalTech Indonesia

### Fitur-Fitur Tersedia:
1. **Agen AI Hukum** (/agents) — 11 agen spesialis hukum, klik langsung di halaman /agents
   - Corporate, Tax, Employment, Immigration, Bankruptcy, Securities (Bisnis & Korporasi)
   - Civil Rights, Criminal Defense, Family, Real Estate, Personal Injury (Personal & Keluarga)
   - Cara pakai: Klik kartu agen → Tekan "Mulai Konsultasi" → Ketik pertanyaan (butuh login)

2. **Agentic AI Chatbot** (/agentic-chatbots) — Sidebar 11 agen + area chat real-time
   - Cara pakai: Buka halaman → pilih agen di sidebar kiri → mulai chat (butuh login)

3. **Generator Dokumen** (/documents) — Buat draft dokumen hukum otomatis dengan AI
   - Jenis: Gugatan, Jawaban, Replik, Duplik, Surat Kuasa, Kontrak
   - Cara pakai: Login → Pilih jenis dokumen → Isi detail → Klik "Generate" (butuh login)

4. **Manajemen Perkara** (/cases) — Kelola daftar perkara hukum Anda
   - Cara pakai: Login → Klik "+ Tambah Perkara" → Isi detail → Simpan (butuh login)

5. **Peraturan** (/peraturan) — Database 22 peraturan hukum Indonesia, bisa difilter dan dicari
6. **Putusan** (/putusan) — 16 putusan pengadilan lengkap dengan amar dan majelis hakim
7. **Panduan** (/panduan) — 15 artikel praktis: cara gugat, hak tersangka, PHK, dll
8. **Kursus** (/kursus) — 10 kursus hukum online dari pemula hingga lanjutan
9. **Pengacara** (/pengacara) — Direktori 16 pengacara terpercaya, filter spesialisasi & kota
10. **Forum Diskusi** (/forum) — Tanya jawab hukum komunitas, bisa anonim
11. **Komunitas** (/komunitas) — Komunitas hukum, events, networking

### Cara Login:
Klik tombol "Masuk" di pojok kanan atas → Login dengan akun Replit.
Fitur yang butuh login: Chatbot AI, Generator Dokumen, Manajemen Perkara.

### Fitur Gratis Tanpa Login:
Peraturan, Putusan, Panduan, Kursus, Pengacara, Forum (baca & anonim), Komunitas.
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
