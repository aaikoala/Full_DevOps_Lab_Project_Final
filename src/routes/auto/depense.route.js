import express from "express";

const router = express.Router();

// Base de données temporaire
let depenses = [
  { id: 1, titre: "Achat pizza", montant: 12.5, categorie: "nourriture", date: "2025-01-15" },
  { id: 2, titre: "Livres", montant: 45, categorie: "éducation", date: "2025-01-16" }
];

// GET all dépenses
router.get("/", (req, res) => {
  res.status(200).json(depenses);
});

// POST a new dépense
router.post("/", (req, res) => {
  const { titre, montant, categorie, date } = req.body;

  if (!titre || !montant) {
    return res.status(400).json({ error: "Les champs titre et montant sont obligatoires" });
  }

  const nouvelleDepense = {
    id: depenses.length + 1,
    titre,
    montant: Number(montant),
    categorie: categorie || "non spécifiée",
    date: date || new Date().toISOString()
  };

  depenses.push(nouvelleDepense);

  res.status(201).json(nouvelleDepense);
});

export default router;