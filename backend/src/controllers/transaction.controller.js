import Transaction from "../models/transaction.model.js";

export async function listTransactions(req, res, next) {
  try {
    const userId = req.userId;
    const items = await Transaction.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
}

export async function createTransaction(req, res, next) {
  try {
    const userId = req.userId;

    const titre = req.body.titre;
    const montant = req.body.montant;
    const type = req.body.type;
    const categorie = req.body.categorie;

    if (!titre || typeof montant !== "number" || !type) {
      return res.status(400).json({ message: "titre, montant and type are required" });
    }

    const created = await Transaction.create({
      userId,
      titre,
      montant,
      type,
      categorie
    });

    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}
