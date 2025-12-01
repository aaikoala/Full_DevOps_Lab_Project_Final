/**
 * Budget categories
 * Create and manage budget categories
 */

import { Router } from "express";

const router = Router();

// start with two default examples
let categories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Housing" }
];

// each expense is linked to a category Id
let expenses = [
  // { id: 1, label: "Pizza", amount: 12, categoryId: 1 }
];

/**
 * GET /api/categories
 * Return all budget categories
 */
router.get("/api/categories", (req, res) => {
  res.json(categories);
});

/**
 * POST /api/categories
 * create a new category
 * expected body JSON: { "name": "Transport" }
 */
router.post("/api/categories", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Category name is required"
    });
  }

  // create new category 
  const newCategory = {
    id: categories.length + 1,
    name
  };

  // add to our array
  categories.push(newCategory);

  // return the created category
  res.status(201).json(newCategory);
});

/**
 * DELETE /api/categories/:id
 * Remove a category by id
 * All existing expenses keep their data but we set categoryId to null for them
 */
router.delete("/api/categories/:id", (req, res) => {
  const id = Number(req.params.id);

  const categoryIndex = categories.findIndex(cat => cat.id === id);

  if (categoryIndex === -1) {
    return res.status(404).json({
      error: "Category not found"
    });
  }

  // remove category from the array
  const deletedCategory = categories[categoryIndex];
  categories.splice(categoryIndex, 1);

  // unlink this category from all expenses
  expenses = expenses.map(exp => {
    if (exp.categoryId === id) {
      return { ...exp, categoryId: null };
    }
    return exp;
  });

  res.json({
    message: "Category deleted",
    deletedCategory
  });
});

/**
 * GET /api/expenses
 * Return all expenses with their categoryId
 */
router.get("/api/expenses", (req, res) => {
  res.json(expenses);
});

/**
 * POST /api/expenses
 * Create a new expense linked to a category
 * Expected body JSON:
 * { "label": "Coffee", "amount": 3.5, "categoryId": 1 }
 */
router.post("/api/expenses", (req, res) => {
  const { label, amount, categoryId } = req.body;

  // validation
  if (!label || amount == null || !categoryId) {
    return res.status(400).json({
      error: "label, amount and categoryId are required"
    });
  }

  // check that the category exists
  const category = categories.find(cat => cat.id === Number(categoryId));
  if (!category) {
    return res.status(400).json({
      error: "Invalid categoryId, category does not exist"
    });
  }

  const newExpense = {
    id: expenses.length + 1,
    label,
    amount,
    categoryId: Number(categoryId)
  };

  expenses.push(newExpense);

  res.status(201).json(newExpense);
});

export default router;
