import { useEffect, useState } from "react";
import useTransactions from "../hooks/useTransactions";

export default function BudgetPage() {
  const { items, msg, load, add } = useTransactions();

  const [titre, setTitre] = useState("");
  const [montant, setMontant] = useState("");
  const [type, setType] = useState("depense");
  const [categorie, setCategorie] = useState("food");

  useEffect(function () {
    load();
  }, []);

  function submit(e) {
    e.preventDefault();

    const amount = Number(montant);
    if (Number.isNaN(amount)) return;

    add({
      titre: titre,
      montant: amount,
      type: type,
      categorie: categorie
    });

    setTitre("");
    setMontant("");
  }

  function getBadgeColor(t) {
    if (t.type === "revenu") return "#dcfce7";
    return "#fee2e2";
  }

  function getBadgeBorder(t) {
    if (t.type === "revenu") return "1px solid #22c55e";
    return "1px solid #ef4444";
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>My Budget</h1>

        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Title"
            value={titre}
            onChange={function (e) {
              setTitre(e.target.value);
            }}
          />

          <input
            style={styles.input}
            placeholder="Amount"
            value={montant}
            onChange={function (e) {
              setMontant(e.target.value);
            }}
          />

          <select
            style={styles.select}
            value={type}
            onChange={function (e) {
              setType(e.target.value);
            }}
          >
            <option value="depense">Expense</option>
            <option value="revenu">Income</option>
          </select>

          <select
            style={styles.select}
            value={categorie}
            onChange={function (e) {
              setCategorie(e.target.value);
            }}
          >
            <option value="food">Food</option>
            <option value="home">Home</option>
            <option value="transport">Transport</option>
            <option value="fun">Fun</option>
            <option value="other">Other</option>
          </select>

          <button type="submit" style={styles.button}>Add</button>
        </form>

        {msg !== "" && <p style={styles.msg}>{msg}</p>}

        <h2 style={styles.h2}>My transactions</h2>

        {items.length === 0 && <p style={styles.empty}>No transactions yet</p>}

        {items.length > 0 && (
          <div style={styles.list}>
            {items.map(function (t) {
              return (
                <div key={t._id} style={styles.row}>
                  <div>
                    <div style={styles.rowTitle}>{t.titre}</div>
                    <div style={styles.rowSub}>
                      {t.categorie} • {new Date(t.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={styles.right}>
                    <div style={{ ...styles.badge, background: getBadgeColor(t), border: getBadgeBorder(t) }}>
                      {t.type}
                    </div>
                    <div style={styles.amount}>{t.montant}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button type="button" onClick={load} style={styles.refresh}>Refresh</button>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 900, margin: "0 auto", padding: 20 },
  card: { background: "#fffefe34", border: "1px solid #e5e5e59d", borderRadius: 12, padding: 20 },
  title: { marginTop: 0 },
  form: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ccc", minWidth: 160 },
  select: { padding: 10, borderRadius: 8, border: "1px solid #ccc" },
  button: { padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" },
  msg: { color: "red", marginTop: 10 },
  h2: { marginTop: 25 },
  empty: { color: "#555" },
  list: { display: "flex", flexDirection: "column", gap: 10, marginTop: 10 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #111111ff", borderRadius: 10, padding: 12, background: "#f3f0f0ff" },
  rowTitle: { fontWeight: "bold",color: "#000000ff" },
  rowSub: { fontSize: 13, color: "#000000ff", marginTop: 4 },
  right: { display: "flex", gap: 12, alignItems: "center" },
  badge: { padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: "bold",color: "#0c0c0cff" },
  amount: { fontWeight: "bold", fontSize: 16,color: "#0f0f0fff" },
  refresh: { marginTop: 15, padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }
};
