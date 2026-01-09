import { Router } from "express";

const router = Router();

const dashboardData = {
  monthlyBudget: 1200,
  totalExpenses: 750,
  limits: {
    food: 400,
    transport: 150,
    leisure: 200,
  },
  expenses: [
    { category: "food", amount: 320 },
    { category: "transport", amount: 120 },
    { category: "leisure", amount: 310 },
  ],
};

router.get("/", function (_req, res) {
  const remaining = dashboardData.monthlyBudget - dashboardData.totalExpenses;

  res.status(200).json({
    monthlyBudget: dashboardData.monthlyBudget,
    totalExpenses: dashboardData.totalExpenses,
    remaining,
    limits: dashboardData.limits,
    expenses: dashboardData.expenses,
  });
});

export default router;
