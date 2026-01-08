/**
 * Budget overspending alerts
 * GET /alertes -> returns alerts about global budget & category limits
 */

import { Router } from "express";

const router = Router();

/**
 * In-memory mocked data (replace later with shared storage / DB)
 */
const budgetMensuel = 1200;

const limites = {
  nourriture: 400,
  transport: 150,
  loisirs: 200,
};

// expenses list
const depenses = [
  { categorie: "nourriture", montant: 320 },
  { categorie: "transport", montant: 180 },
  { categorie: "loisirs", montant: 210 },
];

/**
 * Helper: sum expenses by category
 */
const sumByCategorie = (items) => {
  const totals = {};
  for (const d of items) {
    totals[d.categorie] = (totals[d.categorie] ?? 0) + d.montant;
  }
  return totals;
};

router.get("/alertes", (_req, res) => {
  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);
  const reste = budgetMensuel - totalDepenses;

  const depensesParCategorie = sumByCategorie(depenses);

  const alertes = [];

  // global budget alert
  if (reste < 0) {
    alertes.push({
      type: "budget_mensuel",
      status: "EXCEEDED",
      message: "budget mensuel dépassé",
      budgetMensuel,
      totalDepenses,
      depassement: Math.abs(reste),
    });
  } else if (reste <= budgetMensuel * 0.1) {
    alertes.push({
      type: "budget_mensuel",
      status: "WARNING",
      message: "vous approchez de la limite du budget mensuel",
      budgetMensuel,
      totalDepenses,
      reste,
    });
  }

  // category limits alerts
  for (const categorie of Object.keys(limites)) {
    const limite = limites[categorie];
    const depenseCat = depensesParCategorie[categorie] ?? 0;
    const resteCat = limite - depenseCat;

    if (resteCat < 0) {
      alertes.push({
        type: "limite_categorie",
        categorie,
        status: "EXCEEDED",
        message: `limite dépassée pour ${categorie}`,
        limite,
        depense: depenseCat,
        depassement: Math.abs(resteCat),
      });
    } else if (resteCat <= limite * 0.1) {
      alertes.push({
        type: "limite_categorie",
        categorie,
        status: "WARNING",
        message: `vous approchez de la limite pour ${categorie}`,
        limite,
        depense: depenseCat,
        reste: resteCat,
      });
    }
  }

  return res.status(200).json({
    budgetMensuel,
    totalDepenses,
    reste,
    limites,
    depensesParCategorie,
    alertes,
  });
});

export default router;