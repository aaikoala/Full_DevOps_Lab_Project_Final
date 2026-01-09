import { useState } from "react";
import { apiFetch } from "../utils/api";

export default function useTransactions() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    try {
      const res = await apiFetch("/api/transaction");
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

  async function add(payload) {
    setMsg("");
    try {
      const res = await apiFetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        if (data && data.message) setMsg(data.message);
        else setMsg("Cannot add transaction");
        return;
      }

      await load();
    } catch  {
      setMsg("Backend not reachable");
    }
  }

  return { items, msg, load, add };
}
