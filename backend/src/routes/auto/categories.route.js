import { Router } from "express";

const router = Router();

let categories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Housing" }
];

// GET /api/categories
router.get("/", function (_req, res) {
  res.status(200).json(categories);
});

// POST /api/categories
router.post("/", function (req, res) {
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

// DELETE /api/categories/:id
router.delete("/:id", function (req, res) {
  const id = Number(req.params.id);

  const exists = categories.some(function (c) {
    return c.id === id;
  });

  if (!exists) {
    return res.status(404).json({ error: true, message: "Category not found" });
  }

  categories = categories.filter(function (c) {
    return c.id !== id;
  });

  res.status(200).json({ message: "Category deleted" });
});

export default router;
