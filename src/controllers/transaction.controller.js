import Transaction from "../models/transaction.model.js";

//Lire les transactions
export async function listTransactions(req, res) {
  try {
    const transactions = await Transaction.find(); // Trouve tout dans la DB
    res.status(200).json(transactions);
  } catch (err) {
    console.error("ERREUR MONGO :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

//Créer une transaction
export async function createTransaction(req, res) {
  try {
    const nouvelleTransaction = await Transaction.create(req.body);
    res.status(201).json(nouvelleTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

//Fonction pour lire une transaction
export async function getTransaction(req, res) {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction non trouvée" });
    }
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "ID invalide" });
  }
}

//Function poour mettre à jour une transaction
export async function updateTransaction(req, res) {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Renvoie la transaction modifiée
    );
    
    if (!transaction) {
      return res.status(404).json({ error: "Transaction non trouvée" });
    }
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Erreur lors de la mise à jour" });
  }
}

//Fonction pour supprimer une transaction
export async function deleteTransaction(req, res) {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ error: "Transaction non trouvée" });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "ID invalide" });
  }
}