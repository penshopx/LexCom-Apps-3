import { Router } from "express";
import { db } from "@workspace/db";
import { subscriptionsTable, plansTable, usageLogsTable } from "@workspace/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

const router = Router();

// GET /api/user/profile — returns current user's plan + usage today
router.get("/user/profile", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get subscription
    const subs = await db
      .select({ planId: subscriptionsTable.planId, status: subscriptionsTable.status, expiresAt: subscriptionsTable.expiresAt })
      .from(subscriptionsTable)
      .where(and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.status, "active")))
      .limit(1);

    const planId = subs[0]?.planId ?? "free";

    // Count usage today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const usageRows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(usageLogsTable)
      .where(and(eq(usageLogsTable.userId, userId), gte(usageLogsTable.usedAt, todayStart)));

    const usageToday = usageRows[0]?.count ?? 0;

    return res.json({ planId, usageToday, status: subs[0]?.status ?? "none" });
  } catch (err) {
    console.error(err);
    return res.json({ planId: "free", usageToday: 0 });
  }
});

// POST /api/user/usage — log a usage event
router.post("/user/usage", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { feature = "ai_query" } = req.body;
  try {
    await db.insert(usageLogsTable).values({ userId, feature });
    return res.json({ ok: true });
  } catch {
    return res.json({ ok: false });
  }
});

// POST /api/user/subscription — create/update subscription (manual, admin sets this)
router.post("/user/subscription", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { planId = "free" } = req.body;

  try {
    // Upsert subscription (deactivate old, create new)
    await db.update(subscriptionsTable).set({ status: "inactive" }).where(eq(subscriptionsTable.userId, userId));
    await db.insert(subscriptionsTable).values({ userId, planId, status: "active" });
    return res.json({ ok: true, planId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

export default router;
