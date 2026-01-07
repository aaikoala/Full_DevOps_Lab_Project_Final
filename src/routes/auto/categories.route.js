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

// each expense is linked to a category id
let expenses = [
   { id: 1, label: "Pizza", amount: 12, categoryId: 1 }];

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
 */
router.post("/api/categories", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Category name is required"
    });
  }
  const cleanName = name.trim();
  // check if the category already exists
  const alreadyExists = categories.find(
    (category) => category.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (alreadyExists) {
    return res.status(409).json({
      error: "Category already exists",
    });
  }
  // create new category 
  const newCategory = {
    id: categories.length + 1,
    name
  };

  categories.push(newCategory);

  // return the category created
  res.status(201).json(newCategory);
});

/**
 * Remove a category by id
 */
router.delete("/api/categories/:id", (req, res) => {
  const id = Number(req.params.id);

  const categoryIndex = categories.findIndex(category  => category .id === id);

  if (categoryIndex === -1) {
    return res.status(404).json({
      error: "Category is not found"
    });
  }

  // remove the category 
  const deletedCategory = categories.find(category => category.id === id);
  categories = categories.filter(category => category.id !== id);   

  // unlink this category from all the expenses
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
  const category = categories.find(category => category.id === Number(categoryId));
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
