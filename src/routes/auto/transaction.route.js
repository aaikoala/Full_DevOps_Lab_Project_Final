import express from "express";

const router = express.Router();

// Base de données temporaire 
let transactions = [
  { id: 1, titre: "Achat pizza", montant: 12.5, type: "depense", categorie: "nourriture", date: "2025-01-15" },
  { id: 2, titre: "Salaire job d'été", montant: 500, type: "revenu", categorie: "salaire", date: "2025-01-16" }
];

//GET all (avoir les transactions dépense/revenu)
router.get("/", (req, res) => {
  res.status(200).json(transactions);
});

//GET by ID
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const transaction = transactions.find(t => t.id === id);

  if (!transaction) {
    return res.status(404).json({ error: "Transaction non trouvée" });
  }
  res.json(transaction);
});

//POST (Créer une transaction)
router.post("/", (req, res) => {
  const { titre, montant, categorie, date, type } = req.body;

  if (!titre || !montant || !type) {
    return res.status(400).json({ error: "Les champs titre, montant et type sont obligatoires" });
  }

  if (type !== "depense" && type !== "revenu") {
      return res.status(400).json({ error: "Le type doit être 'depense' ou 'revenu'" });
  }

  const nouvelleTransaction = {
    id: transactions.length + 1,
    titre,
    montant: Number(montant),
    type,
    categorie: categorie || "non spécifiée",
    date: date || new Date().toISOString()
  };

  transactions.push(nouvelleTransaction);
  res.status(201).json(nouvelleTransaction);
});

//PUT
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = transactions.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Transaction non trouvée" });
  }

  transactions[index] = { ...transactions[index], ...req.body };
  res.json(transactions[index]);
});

//DELETE
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const tailleAvant = transactions.length;

  transactions = transactions.filter(t => t.id !== id);

  if (transactions.length === tailleAvant) {
    return res.status(404).json({ error: "Transaction non trouvée" });
  }

  res.status(204).end(); 
});

export default router;