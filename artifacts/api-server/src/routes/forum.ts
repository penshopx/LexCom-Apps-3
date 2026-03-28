import { Router, type IRouter } from "express";
import { db, forumThreadsTable, forumRepliesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/forum/threads", async (req, res) => {
  try {
    const threads = await db
      .select()
      .from(forumThreadsTable)
      .orderBy(desc(forumThreadsTable.createdAt));
    res.json(threads);
  } catch (err) {
    req.log.error({ err }, "Failed to list forum threads");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/forum/threads", async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      res.status(400).json({ error: "title and content are required" });
      return;
    }
    const userId = req.user?.id ?? null;
    const authorName = req.user?.name || req.user?.email || "Anonim";
    const [thread] = await db
      .insert(forumThreadsTable)
      .values({
        userId,
        authorName,
        title,
        content,
        category: category || "Umum",
      })
      .returning();
    res.status(201).json(thread);
  } catch (err) {
    req.log.error({ err }, "Failed to create forum thread");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/forum/threads/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [thread] = await db.select().from(forumThreadsTable).where(eq(forumThreadsTable.id, id));
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }
    const replies = await db
      .select()
      .from(forumRepliesTable)
      .where(eq(forumRepliesTable.threadId, id))
      .orderBy(forumRepliesTable.createdAt);
    res.json({ thread, replies });
  } catch (err) {
    req.log.error({ err }, "Failed to get forum thread");
    res.status(500).json({ error: "Internal server error" });
  }
});

async function createReply(req: any, res: any) {
  try {
    const threadId = parseInt(req.params.id);
    const { content, authorName: anonName } = req.body;
    if (!content) {
      res.status(400).json({ error: "content is required" });
      return;
    }
    const [thread] = await db.select().from(forumThreadsTable).where(eq(forumThreadsTable.id, threadId));
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }
    const userId = req.user?.id ?? null;
    const authorName = req.user?.name || req.user?.email || anonName || "Anonim";
    const [reply] = await db
      .insert(forumRepliesTable)
      .values({ threadId, userId, authorName, content })
      .returning();
    await db
      .update(forumThreadsTable)
      .set({ replyCount: thread.replyCount + 1 })
      .where(eq(forumThreadsTable.id, threadId));
    res.status(201).json(reply);
  } catch (err) {
    req.log.error({ err }, "Failed to create reply");
    res.status(500).json({ error: "Internal server error" });
  }
}

router.post("/forum/threads/:id/replies", createReply);
router.post("/forum/threads/:id", createReply);

export default router;
