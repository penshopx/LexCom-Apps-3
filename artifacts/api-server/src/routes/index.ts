import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import openaiRouter from "./openai";
import casesRouter from "./cases";
import documentsRouter from "./documents";
import forumRouter from "./forum";
import assistantRouter from "./assistant";
import agenticRouter from "./agentic";
import userProfileRouter from "./userProfile";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(openaiRouter);
router.use(casesRouter);
router.use(documentsRouter);
router.use(forumRouter);
router.use(assistantRouter);
router.use(agenticRouter);
router.use(userProfileRouter);

export default router;
