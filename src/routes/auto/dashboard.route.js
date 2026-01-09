/**
 * Dashboard overview
 * GET /dashboard
 */

import { Router } from "express";

const router = Router();

let dashboardData = {
  budgetMensuel: 1200,
  totalDepenses: 750,
  limites: {
    nourriture: 400,
    transport: 150,
    loisirs: 200,
  },
  depenses: [
    { categorie: "nourriture", montant: 320 },
    { categorie: "transport", montant: 120 },
    { categorie: "loisirs", montant: 310 },
  ],
};

/**
 * Get dashboard summary
 */
router.get("/dashboard", (_req, res) => {
  const reste = dashboardData.budgetMensuel - dashboardData.totalDepenses;

  res.status(200).json({
    budgetMensuel: dashboardData.budgetMensuel,
    totalDepenses: dashboardData.totalDepenses,
    reste,
    limites: dashboardData.limites,
    depenses: dashboardData.depenses,
  });
});

export default router;