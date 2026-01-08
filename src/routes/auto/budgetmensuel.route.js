/**
 * Monthly budget management
 * GET  /budgetmensuel -> { budget: number }
 * POST /budgetmensuel -> { budget: number }
 */

import { Router } from "express";

const router = Router();

// in-memory storage (no database)
let monthlyBudget = 0;

/**
 * Get current monthly budget
 */
router.get("/budgetmensuel", (_req, res) => {
  res.status(200).json({ budget: monthlyBudget });
});

/**
 * Define or update monthly budget
 */
router.post("/budgetmensuel", (req, res) => {
  const { budget } = req.body ?? {};

  // validation
  if (typeof budget !== "number" || Number.isNaN(budget) || budget < 0) {
    return res.status(400).json({
      error: "invalid_budget",
      message: "budget must be a non-negative number",
    });
  }

  monthlyBudget = budget;

  return res.status(200).json({ budget: monthlyBudget });
});

export default router;