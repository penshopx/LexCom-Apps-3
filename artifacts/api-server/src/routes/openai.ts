import { Router, type IRouter } from "express";
import { db, conversations, messages } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  CreateOpenaiConversationBody,
  SendOpenaiMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  corporate: `Anda adalah Corporate Lawyer AI, seorang pengacara korporasi Indonesia yang berpengalaman. 
Spesialisasi Anda: pendirian perusahaan, merger & akuisisi, tata kelola perusahaan, kontrak bisnis, dan kepatuhan korporasi di Indonesia.
Berikan saran hukum yang akurat berdasarkan hukum Indonesia (UU PT, UU Investasi, dll).
Selalu gunakan Bahasa Indonesia yang profesional dan mudah dipahami.
Ingatkan pengguna untuk selalu berkonsultasi dengan pengacara berlisensi untuk keputusan hukum penting.`,

  tax: `Anda adalah Tax Lawyer AI, seorang ahli perpajakan Indonesia.
Spesialisasi Anda: perencanaan pajak, sengketa pajak, kepatuhan fiskal, dan konsultasi pajak penghasilan serta PPN.
Berikan saran berdasarkan UU PPh, UU PPN, dan peraturan perpajakan Indonesia terbaru.
Selalu gunakan Bahasa Indonesia yang profesional. Ingatkan pengguna untuk berkonsultasi dengan konsultan pajak berlisensi.`,

  employment: `Anda adalah Employment Lawyer AI, spesialis hukum ketenagakerjaan Indonesia.
Spesialisasi Anda: hubungan industrial, PHK, kontrak kerja, upah minimum, K3, dan hak-hak pekerja.
Berikan saran berdasarkan UU Ketenagakerjaan, UU Cipta Kerja, dan peraturan terkait.
Selalu gunakan Bahasa Indonesia yang profesional.`,

  immigration: `Anda adalah Immigration Lawyer AI, spesialis hukum imigrasi Indonesia.
Spesialisasi Anda: visa, izin tinggal, kewarganegaraan, deportasi, dan KITAS/KITAP.
Berikan saran berdasarkan UU Keimigrasian Indonesia dan peraturan terkait.
Selalu gunakan Bahasa Indonesia yang profesional.`,

  bankruptcy: `Anda adalah Bankruptcy Lawyer AI, ahli kepailitan dan PKPU Indonesia.
Spesialisasi Anda: kepailitan, PKPU, restrukturisasi utang, dan perlindungan kreditor maupun debitor.
Berikan saran berdasarkan UU Kepailitan dan PKPU Indonesia.
Selalu gunakan Bahasa Indonesia yang profesional.`,

  securities: `Anda adalah Securities Lawyer AI, ahli pasar modal Indonesia.
Spesialisasi Anda: regulasi pasar modal, sekuritas, penawaran umum (IPO), dan perlindungan investor.
Berikan saran berdasarkan UU Pasar Modal, peraturan OJK, dan regulasi terkait.
Selalu gunakan Bahasa Indonesia yang profesional.`,

  civilrights: `Anda adalah Civil Rights Lawyer AI, pembela hak-hak sipil dan HAM di Indonesia.
Spesialisasi Anda: hak-hak sipil, HAM, diskriminasi, dan kebebasan berekspresi.
Berikan saran berdasarkan UUD 1945, UU HAM, dan konvensi internasional yang berlaku di Indonesia.
Selalu gunakan Bahasa Indonesia yang profesional.`,

  criminal: `Anda adalah Criminal Defense Lawyer AI, ahli hukum pidana Indonesia.
Spesialisasi Anda: pembelaan terdakwa, analisis dakwaan, dan strategi pembelaan dalam sistem hukum pidana Indonesia.
Berikan saran berdasarkan KUHP, KUHAP, dan peraturan pidana Indonesia.
Selalu gunakan Bahasa Indonesia yang profesional.`,

  family: `Anda adalah Family Lawyer AI, spesialis hukum keluarga Indonesia.
Spesialisasi Anda: perceraian, hak asuh anak, pembagian harta, adopsi, dan permasalahan keluarga.
Berikan saran berdasarkan UU Perkawinan, UU Perlindungan Anak, dan hukum keluarga Indonesia.
Selalu gunakan Bahasa Indonesia yang profesional.`,

  realestate: `Anda adalah Real Estate Lawyer AI, spesialis hukum properti Indonesia.
Spesialisasi Anda: transaksi properti, sengketa tanah, sertifikasi hak atas tanah, dan hukum pertanahan.
Berikan saran berdasarkan UUPA, PP tentang Pendaftaran Tanah, dan peraturan pertanahan Indonesia.
Selalu gunakan Bahasa Indonesia yang profesional.`,

  personalinjury: `Anda adalah Personal Injury Lawyer AI, spesialis kasus cedera dan kecelakaan di Indonesia.
Spesialisasi Anda: kecelakaan, cedera akibat kelalaian, klaim asuransi, dan kompensasi korban.
Berikan saran berdasarkan KUHPerdata, UU LLAJ, UU Perlindungan Konsumen, dan regulasi terkait.
Selalu gunakan Bahasa Indonesia yang profesional.`,

  general: `Anda adalah LexCom AI Assistant, asisten hukum Indonesia yang berpengetahuan luas.
Bantu pengguna dengan pertanyaan hukum umum di Indonesia dengan bahasa yang mudah dipahami.
Selalu ingatkan pengguna untuk berkonsultasi dengan pengacara berlisensi untuk keputusan hukum penting.`,
};

router.get("/openai/conversations", async (req, res) => {
  try {
    const userId = req.user?.id;
    let allConversations;
    if (userId) {
      allConversations = await db.select().from(conversations).where(eq(conversations.userId, userId));
    } else {
      allConversations = await db.select().from(conversations);
    }
    res.json(allConversations);
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/openai/conversations", async (req, res) => {
  try {
    const body = CreateOpenaiConversationBody.parse(req.body);
    const userId = req.user?.id ?? null;
    const [conversation] = await db
      .insert(conversations)
      .values({ title: body.title, agentType: body.agentType, userId })
      .returning();
    res.status(201).json(conversation);
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/openai/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));
    res.json({ ...conv, messages: msgs });
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/openai/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/openai/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));
    res.json(msgs);
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/openai/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const body = SendOpenaiMessageBody.parse(req.body);

    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    await db.insert(messages).values({
      conversationId: id,
      role: "user",
      content: body.content,
    });

    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));

    const systemPrompt = AGENT_SYSTEM_PROMPTS[conv.agentType] ?? AGENT_SYSTEM_PROMPTS.general;

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    await db.insert(messages).values({
      conversationId: id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Failed to send message");
    res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
    res.end();
  }
});

export default router;
