import { Router } from "express";

const router = Router();

let expenses = [{ id: 1, label: "Pizza", amount: 12, categoryId: 1 }];

// GET /api/expenses, get all the  expenses
router.get("/", function (_req, res) {
  res.status(200).json(expenses);
});

// create a new expense
router.post("/", function (req, res) {
  const body = req.body || {};
  const label = body.label;
  const amount = body.amount;
  const categoryId = body.categoryId;

  if (!label || amount == null || categoryId == null) {
    return res.status(400).json({ error: true, message: "label, amount and categoryId are required" });
  }

  const newExpense = {
    id: expenses.length + 1,
    label: label,
    amount: amount,
    categoryId: Number(categoryId)
  };

  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

export default router;
