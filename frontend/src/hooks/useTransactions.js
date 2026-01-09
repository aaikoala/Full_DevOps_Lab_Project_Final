import { useState } from "react";
import { apiFetch } from "../utils/api";

//Centralizes the logic to fetch and add transactions from the API
export default function useTransactions() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  //Function to fetch the transaction list from the backend
  async function load() {
    setMsg("");
    try {
      const res = await apiFetch("/api/transaction");
      //Checks if the server returns an error
      if (!res.ok) {
        const data = await res.json();
        if (data && data.message) setMsg(data.message);
        else setMsg("Cannot load transactions");
        return;
      }
      const data = await res.json();
      setItems(data);
    } catch  {
      setMsg("Backend not reachable");
    }
  }

  //Function to create a new transaction data via POST
  async function add(payload) {
    setMsg("");
    try {
      const res = await apiFetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      //Handles server errors
      if (!res.ok) {
        const data = await res.json();
        if (data && data.message) setMsg(data.message);
        else setMsg("Cannot add transaction");
        return;
      }
      //Reloads the list to show the new item
      await load();
    } catch  {
      setMsg("Backend not reachable");
    }
  }

  //Return the data and functions, so components can use them
  return { items, msg, load, add };
}
