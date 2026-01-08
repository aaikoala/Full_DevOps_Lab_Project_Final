import { Router } from "express";

const router = Router();

let expenses = [{ id: 1, label: "Pizza", amount: 12, categoryId: 1 }];

// GET /api/expenses
router.get("/api/expenses", (_req, res) => {
  res.status(200).json(expenses);
});

// POST /api/expenses
router.post("/api/expenses", (req, res) => {
  const { label, amount, categoryId } = req.body;

  if (!label || amount == null || categoryId == null) {
    return res.status(400).json({
      error: true,
      message: "label, amount and categoryId are required",
    });
  }

  const newExpense = {
    id: expenses.length + 1,
    label: String(label).trim(),
    amount: Number(amount),
    categoryId: Number(categoryId),
  };

  expenses.push(newExpense);

  res.status(201).json(newExpense);
});

export default router;
