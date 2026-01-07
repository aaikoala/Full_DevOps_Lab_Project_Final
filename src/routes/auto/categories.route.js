import { Router } from "express";

const router = Router();

let categories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Housing" },
];

let expenses = [
  { id: 1, label: "Pizza", amount: 12, categoryId: 1 },
];

// GET /api/categories
router.get("/api/categories", (_req, res) => {
  res.status(200).json(categories);
});

// POST /api/categories
router.post("/api/categories", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: true, message: "Category name is required" });
  }

  const cleanName = String(name).trim();

  const exists = categories.some((c) => c.name.toLowerCase() === cleanName.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: true, message: "Category already exists" });
  }

  const newCategory = { id: categories.length + 1, name: cleanName };
  categories.push(newCategory);

  res.status(201).json(newCategory);
});

// DELETE /api/categories/:id
router.delete("/api/categories/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = categories.some((c) => c.id === id);
  if (!exists) {
    return res.status(404).json({ error: true, message: "Category not found" });
  }

  categories = categories.filter((c) => c.id !== id);

  // unlink category from expenses
  expenses = expenses.map((e) => (e.categoryId === id ? { ...e, categoryId: null } : e));

  res.status(200).json({ message: "Category deleted" });
});

// GET /api/expenses
router.get("/api/expenses", (_req, res) => {
  res.status(200).json(expenses);
});

// POST /api/expenses
router.post("/api/expenses", (req, res) => {
  const { label, amount, categoryId } = req.body;

  if (!label || amount == null || !categoryId) {
    return res.status(400).json({ error: true, message: "label, amount and categoryId are required" });
  }

  const categoryExists = categories.some((c) => c.id === Number(categoryId));
  if (!categoryExists) {
    return res.status(400).json({ error: true, message: "Invalid categoryId, category does not exist" });
  }

  const newExpense = {
    id: expenses.length + 1,
    label,
    amount,
    categoryId: Number(categoryId),
  };

  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

export default router;
