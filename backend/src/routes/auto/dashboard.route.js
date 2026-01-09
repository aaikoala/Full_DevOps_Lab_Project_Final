import { Router } from "express";
import { requireAuth } from "../../utils/requireAuth.js";
import Transaction from "../../models/transaction.model.js";
import User from "../../models/user.model.js";

const router = Router();
// dashboard data for the current month
router.get("/", requireAuth, async function (req, res, next) {
  try {
    const user = await User.findById(req.userId).select("monthlyBudget").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date(); // get current date
    const start = new Date(now.getFullYear(), now.getMonth(), 1); // first day of the current month
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1); // first day of the next month
    // get all the expenses for the current month
    const expenses = await Transaction.find({
      userId: req.userId,
      type: "depense",
      date: { $gte: start, $lt: end }
    }).lean();

    let total = 0; // Total expenses
    const by = {}; // Expenses grouped by category
    // Calculate total expenses and group by category
    for (let i = 0; i < expenses.length; i = i + 1) {
      const t = expenses[i];
      total = total + t.montant;

      const cat = t.categorie || "other";
      if (!by[cat]) by[cat] = 0;
      by[cat] = by[cat] + t.montant;
    }

    const keys = Object.keys(by);
    const byCategory = [];

    for (let j = 0; j < keys.length; j = j + 1) {
      const k = keys[j];
      byCategory.push({ category: k, amount: by[k] });
    }
    // get the monthly budget, by default it's 0
    const monthlyBudget = user.monthlyBudget || 0;
    // Calculate remaining budget
    const remaining = monthlyBudget - total;   
    res.status(200).json({
      monthlyBudget: monthlyBudget,
      totalExpenses: total,
      remaining: remaining,
      byCategory: byCategory
    });
  } catch (err) {
    next(err);
  }
});

export default router;
