import { Router } from "express";

const router = Router();


const expenses = [
  { id: 1, label: "Pizza", amount: 12, category: "Food", createdAt: "2026-01-02" },
  { id: 2, label: "Rent", amount: 500, category: "Housing", createdAt: "2026-01-05" },
  { id: 3, label: "Bus", amount: 20, category: "Transport", createdAt: "2026-02-01" },
];

const incomes = [
  { id: 1, label: "Salary", amount: 1200, source: "Job", createdAt: "2026-01-01" },
  { id: 2, label: "Freelance", amount: 300, source: "Side", createdAt: "2026-02-03" },
];

// Convert any value to a valid number
function toNumber(value) {
  const n = Number(value);

  if (Number.isFinite(n)) {
    return n;
  }

  return 0;
}

// extract YYYY-MM from a date 
function getMonthKey(dateStr) {
  if (typeof dateStr !== "string") {
    return "unknown";
  }

  if (dateStr.length >= 7) {
    return dateStr.slice(0, 7);
  }

  return "unknown";
}

/**
 * GET /api/visuals/summary
 * Returns totalIncome, totalExpense, balance
 */
router.get("/api/visuals/summary", (_req, res) => {
  let totalExpense = 0;
  let totalIncome = 0;

  for (const e of expenses) {
    totalExpense += toNumber(e.amount);
  }

  for (const i of incomes) {
    totalIncome += toNumber(i.amount);
  }

  const balance = totalIncome - totalExpense;

  res.status(200).json({
    totalIncome,
    totalExpense,
    balance,
  });
});

/**
 * GET /api/visuals/expenses-by-category
 * Returns an array of { category, total }
 */
router.get("/api/visuals/expenses-by-category", (_req, res) => {
  const map = {};

  for (const e of expenses) {
    let key = "Uncategorized";

    if (e.category) {
      key = e.category;
    }

    const amount = toNumber(e.amount);

    if (!map[key]) {
      map[key] = 0;
    }

    map[key] += amount;
  }

  const result = [];

  for (const key in map) {
    result.push({
      category: key,
      total: map[key],
    });
  }

  res.status(200).json(result);
});

/**
 * GET /api/visuals/incomes-by-source
 * Returns an array 
 */
router.get("/api/visuals/incomes-by-source", (_req, res) => {
  const map = {};

  for (const i of incomes) {
    let key = "Other";

    if (i.source) {
      key = i.source;
    }

    const amount = toNumber(i.amount);

    if (!map[key]) {
      map[key] = 0;
    }

    map[key] += amount;
  }

  const result = [];

  for (const key in map) {
    result.push({
      source: key,
      total: map[key],
    });
  }

  res.status(200).json(result);
});

/**
 * GET /api/visuals/cashflow-by-month
 * Returns an array of { month, income, expense }
 */
router.get("/api/visuals/cashflow-by-month", (_req, res) => {
  const map = {};

  for (const i of incomes) {
    const month = getMonthKey(i.createdAt);

    if (!map[month]) {
      map[month] = { income: 0, expense: 0 };
    }

    map[month].income += toNumber(i.amount);
  }

  for (const e of expenses) {
    const month = getMonthKey(e.createdAt);

    if (!map[month]) {
      map[month] = { income: 0, expense: 0 };
    }

    map[month].expense += toNumber(e.amount);
  }

  const months = Object.keys(map).sort();
  const result = [];

  for (const m of months) {
    result.push({
      month: m,
      income: map[m].income,
      expense: map[m].expense,
    });
  }

  res.status(200).json(result);
});

export default router;
