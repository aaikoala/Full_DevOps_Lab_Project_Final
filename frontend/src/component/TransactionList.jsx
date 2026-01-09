import { useEffect, useState } from "react";
import TransactionRow from "./TransactionRow";

//Transaction List Component
//Fetches and displays a history of the transactions
export default function TransactionList() {
  const [items, setItems] = useState([]);

  //Calls the API to retrieve the list of transactions
  useEffect(() => {
    fetch("/api/transaction")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Erreur fetch:", err));
  }, []);

  //Deletes a transaction by its ID
  //Sends a Delete request to the backend
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