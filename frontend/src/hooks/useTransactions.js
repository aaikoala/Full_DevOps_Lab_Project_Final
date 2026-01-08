import { useEffect, useState } from "react";

export default function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadTransactions() {
        try {
            setError("");
            setLoading(true);
            const res = await fetch("/api/transaction");
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`); 
            
            const data = await res.json();
            setTransactions(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function deleteTransaction(id) {
        if (!window.confirm("Voulez-vous vraiment supprimer ?")) return;

        try {
            const res = await fetch(`/api/transaction/${id}`, { method: "DELETE" });
            if (res.ok) {
                setTransactions((prev) => prev.filter((t) => t._id !== id));
            }
        } catch (e) {
            console.error("Erreur delete:", e);
        }
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    return { 
        transactions, 
        loading, 
        error, 
        reload: loadTransactions,
        deleteTransaction 
    };
}