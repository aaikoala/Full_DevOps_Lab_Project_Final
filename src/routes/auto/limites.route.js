/**
 * Expense limits management
 * GET  /limites
 * POST /limites 
 */

import { Router } from "express";

const router = Router();

const limites = {};

/**
 * Get all limits
 */
router.get("/limites", (_req, res) => {
  res.status(200).json({ limites });
});

/**
 * Define or update a limit for a category
 */
router.post("/limites", (req, res) => {
  let categorie;
  let limite;

  if (req.body) {
    categorie = req.body.categorie;
    limite = req.body.limite;
  }

  // validation
  if (typeof categorie !== "string" || categorie.trim() === "") {
    return res.status(400).json({
      error: "invalid_categorie",
      message: "categorie must be a non-empty string",
    });
  }

  if (typeof limite !== "number" || Number.isNaN(limite) || limite < 0) {
    return res.status(400).json({
      error: "invalid_limite",
      message: "limite must be a non-negative number",
    });
  }

  limites[categorie] = limite;

  return res.status(200).json({
    categorie,
    limite,
  });
});

export default router;