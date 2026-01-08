import { useState } from "react";

export default function TransactionForm() {
  const [titre, setTitre] = useState("");
  const [montant, setMontant] = useState("");
  const [type, setType] = useState("depense");

  async function handleSubmit(e) {
    e.preventDefault();
    
    await fetch("/api/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        titre: titre, 
        montant: Number(montant),
        type: type 
      }),
    });

    setTitre("");
    setMontant("");
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
      <h3>➕ Ajouter</h3>
      
      <input
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        placeholder="Titre (ex: Burger)"
        required
        style={{ marginRight: "10px" }}
      />
      
      <input
        type="number"
        value={montant}
        onChange={(e) => setMontant(e.target.value)}
        placeholder="Montant"
        required
        style={{ marginRight: "10px" }}
      />

      <select value={type} onChange={(e) => setType(e.target.value)} style={{ marginRight: "10px" }}>
        <option value="depense">Dépense</option>
        <option value="revenu">Revenu</option>
      </select>

      <button type="submit">Ajouter</button>
    </form>
  );
}