import { Router } from "express";
import { requireAuth } from "../../utils/requireAuth.js";
import { listTransactions, createTransaction } from "../../controllers/transaction.controller.js";

const router = Router();

//get all the transactions for the user
router.get("/", requireAuth, listTransactions);
// Create a new transaction for the user
router.post("/", requireAuth, createTransaction);

export default router;