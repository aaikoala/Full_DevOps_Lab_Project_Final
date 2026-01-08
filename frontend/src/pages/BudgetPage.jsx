import useTransactions from "../hooks/useTransactions";
import TransactionRow from "../component/TransactionRow"; // Ton composant avec PropTypes
import TransactionForm from "../component/TransactionForm";

export default function BudgetPage() {
  // 👇 C'est ici la magie : en une ligne, on récupère toute la logique !
  const { transactions, loading, error, reload, deleteTransaction } = useTransactions();

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p style={{ color: "red" }}>Erreur: {error}</p>;

  return (
    <div>
      <h2>💰 Mon Budget</h2>
      
      {/* Quand le formulaire a fini d'ajouter, il appelle 'reload' pour mettre à jour la liste */}
      <TransactionForm onCreated={reload} />

      <button onClick={reload} style={{ marginBottom: "10px" }}>🔄 Actualiser</button>

      <ul>
        {transactions.map((t) => (
          <TransactionRow
            key={t._id}
            transaction={t}
            onDelete={deleteTransaction}
          />
        ))}
      </ul>
    </div>
  );
}