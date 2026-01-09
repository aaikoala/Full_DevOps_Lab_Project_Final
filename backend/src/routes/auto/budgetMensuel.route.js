import { Router } from "express";

const router = Router();

let monthlyBudget = 0;

router.get("/", function (_req, res) {
  return res.status(200).json({ budget: monthlyBudget });
});

router.post("/", function (req, res) {
  const body = req.body || {};
  const budget = body.budget;

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
