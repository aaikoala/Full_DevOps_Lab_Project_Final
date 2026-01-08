import { Router } from "express";

const router = Router();

let categories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Housing" },
];

let expenses = [
  { id: 1, label: "Pizza", amount: 12, categoryId: 1 },
];

/**
 * GET /api/categories
 * Return all budget categories
 */
router.get("/api/categories", function (req, res) {
  res.status(200).json(categories);
});

/**
 * POST /api/categories
 * Create a new category
 */
router.post("/api/categories", function (req, res) {
  const name = req.body && req.body.name;

  if (!name) {
    return res.status(400).json({ error: true, message: "Category name is required" });
  }

  const cleanName = String(name).trim();

  const exists = categories.some(function (c) {
    return c.name.toLowerCase() === cleanName.toLowerCase();
  });

  if (exists) {
    return res.status(409).json({ error: true, message: "Category already exists" });
  }

  const newCategory = { id: categories.length + 1, name: cleanName };
  categories.push(newCategory);

  res.status(201).json(newCategory);
});

/**
 * DELETE /api/categories/:id
 * Remove a category by id
 */
router.delete("/api/categories/:id", function (req, res) {
  const id = Number(req.params.id);

  const exists = categories.some(function (c) {
    return c.id === id;
  });

  if (!exists) {
    return res.status(404).json({ error: true, message: "Category not found" });
  }

  // remove category
  categories = categories.filter(function (c) {
    return c.id !== id;
  });

  // unlink category from expenses
  expenses = expenses.map(function (e) {
    if (e.categoryId === id) {
      return { id: e.id, label: e.label, amount: e.amount, categoryId: null };
    }
    return e;
  });

  res.status(200).json({ message: "Category deleted" });
});

/**
 * GET /api/expenses
 * Return all expenses
 */
router.get("/api/expenses", function (_req, res) {
  res.status(200).json(expenses);
});

/**
 * POST /api/expenses
 * Create a new expense
 */
router.post("/api/expenses", function (req, res) {
  const label = req.body && req.body.label;
  const amount = req.body && req.body.amount;
  const categoryId = req.body && req.body.categoryId;

  // categoryId 
  if (!label || amount == null || categoryId == null) {
    return res.status(400).json({ error: true, message: "label, amount and categoryId are required" });
  }

  const catIdNumber = Number(categoryId);

  const categoryExists = categories.some(function (c) {
    return c.id === catIdNumber;
  });

  if (!categoryExists) {
    return res.status(400).json({ error: true, message: "Invalid categoryId, category does not exist" });
  }

  const newExpense = {
    id: expenses.length + 1,
    label: label,
    amount: amount,
    categoryId: catIdNumber,
  };

  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

export default router;
