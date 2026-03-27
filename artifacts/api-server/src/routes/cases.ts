import { Router, type IRouter } from "express";
import { db, casesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/cases", async (req, res) => {
  try {
    const userId = req.user?.id;
    let cases;
    if (userId) {
      cases = await db.select().from(casesTable).where(eq(casesTable.userId, userId));
    } else {
      cases = await db.select().from(casesTable);
    }
    res.json(cases);
  } catch (err) {
    req.log.error({ err }, "Failed to list cases");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cases", async (req, res) => {
  try {
    const { title, description, caseType, hearingDate } = req.body;
    if (!title || !caseType) {
      res.status(400).json({ error: "title and caseType are required" });
      return;
    }
    const userId = req.user?.id ?? null;
    const [newCase] = await db
      .insert(casesTable)
      .values({
        title,
        description,
        caseType,
        hearingDate: hearingDate ? new Date(hearingDate) : null,
        userId,
      })
      .returning();
    res.status(201).json(newCase);
  } catch (err) {
    req.log.error({ err }, "Failed to create case");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/cases/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [c] = await db.select().from(casesTable).where(eq(casesTable.id, id));
    if (!c) {
      res.status(404).json({ error: "Case not found" });
      return;
    }
    res.json(c);
  } catch (err) {
    req.log.error({ err }, "Failed to get case");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/cases/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, status, caseType, hearingDate } = req.body;
    const [updated] = await db
      .update(casesTable)
      .set({
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(caseType && { caseType }),
        ...(hearingDate !== undefined && { hearingDate: hearingDate ? new Date(hearingDate) : null }),
      })
      .where(eq(casesTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Case not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update case");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cases/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [deleted] = await db.delete(casesTable).where(eq(casesTable.id, id)).returning();
    if (!deleted) {
      res.status(404).json({ error: "Case not found" });
      return;
    }
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete case");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
