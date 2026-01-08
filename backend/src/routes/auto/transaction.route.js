import express from "express";

import {
  listTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction
} from "../../controllers/transaction.controller.js";

const router = express.Router();


router.get("/", listTransactions);
router.post("/", createTransaction);

router.get("/:id", getTransaction); 
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;