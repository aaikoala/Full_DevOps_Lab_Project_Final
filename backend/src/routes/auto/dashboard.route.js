import { Router } from "express";
import Transaction from "../../models/transaction.model.js";

const router = Router();

function toNumber(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return n;
}

router.get("/", async function (req, res, next) {
  try {
    
    const monthlyBudget = 1200;

    const transactions = await Transaction.find({}).lean();

    let totalExpenses = 0;
    const byCategoryMap = {};

    for (let i = 0; i < transactions.length; i = i + 1) {
      const t = transactions[i];

      const type = t.type;
      const amount = toNumber(t.montant);
      const category = t.categorie || "other";

      if (type === "depense") {
        totalExpenses = totalExpenses + amount;

        if (!byCategoryMap[category]) {
          byCategoryMap[category] = 0;
        }
        byCategoryMap[category] = byCategoryMap[category] + amount;
      }
    }

    const remaining = monthlyBudget - totalExpenses;

    const byCategory = Object.keys(byCategoryMap).map(function (key) {
      return {
        category: key,
        amount: byCategoryMap[key],
      };
    });

    // sort biggest first
    byCategory.sort(function (a, b) {
      return b.amount - a.amount;
    });

    return res.status(200).json({
      monthlyBudget: monthlyBudget,
      totalExpenses: totalExpenses,
      remaining: remaining,
      byCategory: byCategory,
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
