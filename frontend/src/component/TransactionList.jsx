import { useEffect, useState } from "react";
import TransactionRow from "./TransactionRow";

export default function TransactionList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/transaction")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Erreur fetch:", err));
  }, []);

  async function handleDelete(id) {
    const res = await fetch(`/api/transaction/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((x) => x._id !== id));
    }
  }

  return (
    <div>
      <h3>📜 Historique</h3>
      <ul>
        {items.map((item) => (
          <TransactionRow 
            key={item._id} 
            transaction={item} 
            onDelete={handleDelete} 
          />
        ))}
      </ul>
    </div>
  );
}