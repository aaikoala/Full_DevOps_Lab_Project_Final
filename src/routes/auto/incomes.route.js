/**
 * Incomes: manages incomes (money received)
 */

import { Router } from "express";

const router = Router();

// list of incomes
let incomes = [
  {
    id: 1,
    label: "Student job",
    amount: 800,
  },
];

/**
 * GET /api/incomes
 * Return all the incomes
 */
router.get("/api/incomes", (_req, res) => {
  res.status(200).json(incomes);
});

/**
 * POST /api/incomes
 * Create a new income
 */
router.post("/api/incomes", (req, res) => {
  const { label, amount } = req.body;

  // Check required fields
  if (!label || amount == null) {
    return res.status(400).json({
      error: true,
      message: "label and amount are required",
    });
  }

  // Create new income 
  const newIncome = {
    id: incomes.length + 1,
    label: String(label).trim(),
    amount: Number(amount),
  };

  // Add income to the list
  incomes.push(newIncome);

  // Send a response
  res.status(201).json(newIncome);
});

/**
 * DELETE /api/incomes/:id
 * Delete an income by its id
 */
router.delete("/api/incomes/:id", (req, res) => {
  const id = Number(req.params.id);

  // Check if the income exists
  const exists = incomes.some((income) => income.id === id);
  if (!exists) {
    return res.status(404).json({
      error: true,
      message: "Income not found",
    });
  }

  // Remove the income
  incomes = incomes.filter((income) => income.id !== id);

  res.status(200).json({
    message: "Income deleted",
  });
});

export default router;
