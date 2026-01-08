import { Router } from "express";

const router = Router();

let categories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Housing" },
];

let expenses = [{ id: 1, label: "Pizza", amount: 12, categoryId: 1 }];

/**
 * GET /api/categories  
 */
router.get("/", (_req, res) => {
  res.status(200).json(categories);
});

/**
 * POST /api/categories
 */
router.post("/", (req, res) => {
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

/**
 * DELETE /api/categories/:id
 */
router.delete("/:id", (req, res) => {
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

export default router;
