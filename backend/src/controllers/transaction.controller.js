import Transaction from "../models/transaction.model.js";

export async function listTransactions(req, res, next) {
  try {
    const userId = req.userId; // get the authenticated user's id
    // Find all transactions belonging to this user
    const items = await Transaction.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json(items); // Send the list of transactions
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
    // validate the fields required
    if (!titre || typeof montant !== "number" || !type) {
      return res.status(400).json({ message: "titre, montant and type are required" });
    }
    // new transaction 
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
