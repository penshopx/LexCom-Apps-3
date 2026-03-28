import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db, conversations, messages } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

interface AgentMeta {
  name: string;
  emoji: string;
  color: string;
}

const AGENT_META: Record<string, AgentMeta> = {
  corporate:      { name: "Corporate Lawyer AI",        emoji: "🏢", color: "#6366f1" },
  tax:            { name: "Tax Lawyer AI",               emoji: "💰", color: "#f59e0b" },
  employment:     { name: "Employment Lawyer AI",        emoji: "👔", color: "#10b981" },
  immigration:    { name: "Immigration Lawyer AI",       emoji: "✈️",  color: "#06b6d4" },
  bankruptcy:     { name: "Bankruptcy Lawyer AI",        emoji: "📊", color: "#ef4444" },
  securities:     { name: "Securities Lawyer AI",        emoji: "📈", color: "#8b5cf6" },
  civilrights:    { name: "Civil Rights Lawyer AI",      emoji: "⚖️",  color: "#f97316" },
  criminal:       { name: "Criminal Defense Lawyer AI",  emoji: "🛡️",  color: "#64748b" },
  family:         { name: "Family Lawyer AI",            emoji: "👨‍👩‍👧", color: "#ec4899" },
  realestate:     { name: "Real Estate Lawyer AI",       emoji: "🏠", color: "#14b8a6" },
  personalinjury: { name: "Personal Injury Lawyer AI",   emoji: "🩺", color: "#eab308" },
};

const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  corporate: `Anda adalah Corporate Lawyer AI dari LexCom, pengacara korporasi Indonesia berpengalaman.
Spesialisasi: pendirian PT/CV/Yayasan, merger & akuisisi, tata kelola perusahaan, kontrak bisnis, due diligence, kepatuhan korporasi.
Rujuk: UU PT No. 40/2007, UU Investasi No. 25/2007, UU Cipta Kerja.
Bahasa: Indonesia profesional. Akhiri dengan disclaimer konsultasi pengacara berlisensi.`,

  tax: `Anda adalah Tax Lawyer AI dari LexCom, ahli perpajakan Indonesia.
Spesialisasi: PPh Badan & Orang Pribadi, PPN, BPHTB, perencanaan pajak, sengketa pajak, transfer pricing, kepatuhan fiskal.
Rujuk: UU PPh, UU PPN, PMK terkait, ketentuan DJP.
Bahasa: Indonesia profesional.`,

  employment: `Anda adalah Employment Lawyer AI dari LexCom, spesialis ketenagakerjaan Indonesia.
Spesialisasi: PHK & pesangon, kontrak kerja (PKWT/PKWTT), upah minimum, K3, BPJS Ketenagakerjaan, perselisihan industrial.
Rujuk: UU Ketenagakerjaan No. 13/2003, UU Cipta Kerja, PP 35/2021.
Bahasa: Indonesia profesional.`,

  immigration: `Anda adalah Immigration Lawyer AI dari LexCom, spesialis imigrasi Indonesia.
Spesialisasi: visa (B211A, D212, dll), KITAS/KITAP, izin kerja TKA (RPTKA, IMTA), deportasi, naturalisasi.
Rujuk: UU Keimigrasian No. 6/2011, Perpres 20/2018.
Bahasa: Indonesia profesional.`,

  bankruptcy: `Anda adalah Bankruptcy Lawyer AI dari LexCom, ahli kepailitan & PKPU.
Spesialisasi: kepailitan, Penundaan Kewajiban Pembayaran Utang (PKPU), restrukturisasi utang, perlindungan kreditor & debitor, kurator.
Rujuk: UU No. 37/2004 tentang Kepailitan dan PKPU.
Bahasa: Indonesia profesional.`,

  securities: `Anda adalah Securities Lawyer AI dari LexCom, ahli pasar modal Indonesia.
Spesialisasi: IPO, reksa dana, obligasi, MTN, kepatuhan OJK, POJK, insider trading, perlindungan investor.
Rujuk: UU Pasar Modal No. 8/1995, peraturan OJK.
Bahasa: Indonesia profesional.`,

  civilrights: `Anda adalah Civil Rights Lawyer AI dari LexCom, pembela HAM dan hak sipil Indonesia.
Spesialisasi: pelanggaran HAM, diskriminasi, kebebasan berekspresi, hak privasi, gugatan perdata terhadap lembaga publik.
Rujuk: UUD 1945, UU HAM No. 39/1999, ICCPR.
Bahasa: Indonesia profesional.`,

  criminal: `Anda adalah Criminal Defense Lawyer AI dari LexCom, ahli hukum pidana Indonesia.
Spesialisasi: pembelaan tersangka/terdakwa, analisis pasal dakwaan, praperadilan, penangguhan penahanan, strategi pembelaan.
Rujuk: KUHP, KUHAP, UU KPK, UU Tipikor.
Bahasa: Indonesia profesional.`,

  family: `Anda adalah Family Lawyer AI dari LexCom, spesialis hukum keluarga Indonesia.
Spesialisasi: perceraian (cerai gugat/talak), hak asuh anak, pembagian harta gono-gini, nafkah, waris, adopsi, KDRT.
Rujuk: UU Perkawinan No. 1/1974, KHI (bagi Muslim), UU Perlindungan Anak.
Bahasa: Indonesia profesional.`,

  realestate: `Anda adalah Real Estate Lawyer AI dari LexCom, spesialis properti dan pertanahan.
Spesialisasi: SHM/HGB/HGU, PPAT, jual beli tanah, sengketa lahan, kepemilikan properti WNA, sertifikasi tanah.
Rujuk: UUPA No. 5/1960, PP Pendaftaran Tanah No. 24/1997, PP No. 18/2021.
Bahasa: Indonesia profesional.`,

  personalinjury: `Anda adalah Personal Injury Lawyer AI dari LexCom, spesialis cedera dan kecelakaan.
Spesialisasi: kecelakaan lalu lintas, malpraktik medis, klaim asuransi Jasa Raharja, tuntutan ganti rugi, negligence.
Rujuk: KUHPerdata, UU LLAJ No. 22/2009, UU Perlindungan Konsumen.
Bahasa: Indonesia profesional.`,
};

const ORCHESTRATOR_SYSTEM = `Anda adalah Orchestrator Agent dari LexCom Agentic AI System.
Tugas: analisis pertanyaan pengguna dan tentukan agent spesialis mana yang harus terlibat.

Agent yang tersedia:
- corporate: hukum perusahaan, bisnis, korporasi, kontrak, investasi
- tax: perpajakan, pajak penghasilan, PPN, sengketa pajak
- employment: ketenagakerjaan, PHK, pesangon, kontrak kerja, upah
- immigration: visa, KITAS, izin tinggal, tenaga kerja asing
- bankruptcy: kepailitan, PKPU, restrukturisasi utang
- securities: pasar modal, saham, OJK, investasi sekuritas
- civilrights: HAM, hak sipil, diskriminasi, gugatan publik
- criminal: hukum pidana, tersangka, pembelaan, praperadilan
- family: perceraian, hak asuh, waris, pernikahan, KDRT
- realestate: properti, tanah, sertifikat, sengketa lahan, PPAT
- personalinjury: kecelakaan, cedera, klaim asuransi, malpraktik

Gunakan tool orchestrate() untuk menentukan agent dan mode eksekusi.
Pertanyaan lintas-bidang hukum → pilih 2-3 agent + mode "multi"
Pertanyaan spesifik satu bidang → pilih 1 agent + mode "single"`;

const ORCHESTRATE_TOOL = [
  {
    type: "function" as const,
    function: {
      name: "orchestrate",
      description: "Tentukan agent spesialis yang akan menangani pertanyaan ini",
      parameters: {
        type: "object",
        properties: {
          agents: {
            type: "array",
            items: {
              type: "string",
              enum: Object.keys(AGENT_META),
            },
            minItems: 1,
            maxItems: 3,
            description: "Daftar agent yang akan dilibatkan (urut dari paling relevan)",
          },
          mode: {
            type: "string",
            enum: ["single", "multi"],
            description: "'single' jika 1 agent cukup, 'multi' jika perlu sintesis lintas-agen",
          },
          reasoning: {
            type: "string",
            description: "Singkat — mengapa agent ini dipilih",
          },
        },
        required: ["agents", "mode", "reasoning"],
      },
    },
  },
];

const SYNTHESIS_SYSTEM = `Anda adalah Synthesis Agent dari LexCom Agentic AI System.
Tugas: gabungkan perspektif beberapa agent spesialis hukum menjadi satu jawaban yang koheren, komprehensif, dan tidak berulang.

Panduan:
- Buat struktur yang jelas (heading, poin-poin)
- Highlight area overlap dan area yang saling melengkapi  
- Identifikasi jika ada perbedaan pandangan antar agent
- Berikan rekomendasi tindakan konkret berdasarkan semua perspektif
- Sertakan disclaimer untuk konsultasi pengacara berlisensi
- Gunakan Bahasa Indonesia profesional`;

router.post("/agentic/conversations", async (req, res) => {
  try {
    const userId = req.user?.id ?? null;
    const { title = "Agentic Chat" } = req.body as { title?: string };
    const [conv] = await db
      .insert(conversations)
      .values({ title, agentType: "agentic", userId })
      .returning();
    res.status(201).json(conv);
  } catch (err) {
    req.log.error({ err }, "Failed to create agentic conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/agentic/conversations/:id/chat", async (req, res) => {
  try {
    const convId = parseInt(req.params.id);
    const { content, forcedAgents } = req.body as {
      content: string;
      forcedAgents?: string[];
    };

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

    const emit = (data: Record<string, unknown>) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    emit({ type: "orchestrating" });

    let selectedAgents: string[];
    let mode: "single" | "multi";
    let reasoning: string;

    if (forcedAgents && forcedAgents.length > 0) {
      selectedAgents = forcedAgents.filter((a) => AGENT_META[a]);
      mode = selectedAgents.length === 1 ? "single" : "multi";
      reasoning = `Mode manual — agen dipilih oleh pengguna: ${selectedAgents.map((a) => AGENT_META[a]?.name).join(", ")}`;
    } else {
      const orchestratorResult = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: ORCHESTRATOR_SYSTEM },
          ...chatHistory,
          { role: "user", content },
        ],
        tools: ORCHESTRATE_TOOL,
        tool_choice: "required",
        max_completion_tokens: 512,
      });

      const toolCall = orchestratorResult.choices[0]?.message?.tool_calls?.[0];
      if (!toolCall) {
        emit({ type: "error", message: "Orchestrator gagal memutuskan" });
        res.end();
        return;
      }

      const args = JSON.parse(toolCall.function.arguments) as {
        agents: string[];
        mode: "single" | "multi";
        reasoning: string;
      };

      selectedAgents = args.agents.filter((a) => AGENT_META[a]);
      mode = selectedAgents.length > 1 ? "multi" : "single";
      reasoning = args.reasoning;
    }

    const agentMetas = selectedAgents.map((key) => ({
      key,
      ...AGENT_META[key]!,
    }));

    emit({
      type: "agents_selected",
      agents: agentMetas,
      mode,
      reasoning,
    });

    const agentResponses: { agent: string; content: string }[] = [];

    for (const agentKey of selectedAgents) {
      const agentMeta = AGENT_META[agentKey]!;
      emit({ type: "agent_start", agent: agentKey, agentName: agentMeta.name, emoji: agentMeta.emoji, color: agentMeta.color });

      const systemPrompt = AGENT_SYSTEM_PROMPTS[agentKey] ?? AGENT_SYSTEM_PROMPTS.corporate;

      const agentMessages = [
        { role: "system" as const, content: systemPrompt },
        ...chatHistory,
        { role: "user" as const, content },
      ];

      let agentContent = "";
      const agentStream = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: agentMessages,
        max_completion_tokens: 3000,
        stream: true,
      });

      for await (const chunk of agentStream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          agentContent += delta;
          emit({ type: "agent_chunk", agent: agentKey, content: delta });
        }
      }

      agentResponses.push({ agent: agentKey, content: agentContent });
      emit({ type: "agent_done", agent: agentKey });
    }

    let synthesisContent = "";

    if (mode === "multi" && agentResponses.length > 1) {
      emit({ type: "synthesis_start" });

      const agentSummaries = agentResponses
        .map(({ agent, content }) => {
          const meta = AGENT_META[agent];
          return `=== ${meta?.name ?? agent} ===\n${content}`;
        })
        .join("\n\n");

      const synthStream = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: SYNTHESIS_SYSTEM },
          {
            role: "user",
            content: `Pertanyaan pengguna:\n${content}\n\n---\n\nPerspektif dari agent spesialis:\n\n${agentSummaries}\n\n---\n\nBuat sintesis komprehensif yang menggabungkan semua perspektif di atas.`,
          },
        ],
        max_completion_tokens: 4096,
        stream: true,
      });

      for await (const chunk of synthStream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          synthesisContent += delta;
          emit({ type: "synthesis_chunk", content: delta });
        }
      }

      emit({ type: "synthesis_done" });
    }

    const savedContent =
      mode === "multi" && synthesisContent
        ? `[Sintesis dari ${agentResponses.map((r) => AGENT_META[r.agent]?.name).join(", ")}]\n\n${synthesisContent}`
        : agentResponses[0]?.content ?? "";

    await db.insert(messages).values({
      conversationId: convId,
      role: "assistant",
      content: savedContent,
    });

    emit({ type: "done" });
    res.end();
  } catch (err) {
    req.log.error({ err }, "Agentic chat error");
    try {
      res.write(`data: ${JSON.stringify({ type: "error", message: "Terjadi kesalahan, silakan coba lagi" })}\n\n`);
      res.end();
    } catch {}
  }
});

router.get("/agentic/conversations/:id/messages", async (req, res) => {
  try {
    const convId = parseInt(req.params.id);
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, convId))
      .orderBy(asc(messages.createdAt));
    res.json(msgs);
  } catch (err) {
    req.log.error({ err }, "Failed to get agentic messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
