import { Router } from "express";
import { requireAuth } from "../../utils/requireAuth.js";
import { listTransactions, createTransaction } from "../../controllers/transaction.controller.js";

const router = Router();

router.get("/", requireAuth, listTransactions);
router.post("/", requireAuth, createTransaction);

export default router;