import { Router } from "express";
import User from "../../models/user.model.js";
import { requireAuth } from "../../utils/requireAuth.js";

const router = Router();

router.get("/", requireAuth, async function (req, res) {
  const user = await User.findById(req.userId).select("monthlyBudget").lean();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ budget: user.monthlyBudget });
});

router.post("/", requireAuth, async function (req, res) {
  const budget = req.body.budget;

  if (typeof budget !== "number" || Number.isNaN(budget) || budget < 0) {
    return res.status(400).json({ message: "Budget must be a non-negative number" });
  }

  const updated = await User.findByIdAndUpdate(
    req.userId,
    { monthlyBudget: budget },
    { new: true }
  ).select("monthlyBudget").lean();

  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ budget: updated.monthlyBudget });
});

export default router;
