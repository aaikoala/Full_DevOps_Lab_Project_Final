import { useEffect, useState } from "react";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");

  async function loadDashboard() {
    setMsg("");

    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();

      if (res.ok) {
        setData(json);
        return;
      }

      setMsg("Error loading dashboard");
    } catch {
      setMsg("Backend not reachable");
    }
  }

  useEffect(function () {
    async function run() {
        setMsg("");

        try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();

        if (res.ok) {
            setData(json);
            return;
        }

        setMsg("Error loading dashboard");
    }   catch {
      setMsg("Backend not reachable");
    }
  }

  run();
}, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Home</h1>

        <button type="button" style={styles.button} onClick={loadDashboard}>
          Refresh dashboard
        </button>

        {msg !== "" && <p style={styles.msg}>{msg}</p>}

        {data && (
          <div style={styles.box}>
            <p><b>Monthly budget:</b> {data.monthlyBudget}</p>
            <p><b>Total expenses:</b> {data.totalExpenses}</p>
            <p><b>Remaining:</b> {data.remaining}</p>

            <h3>Expenses</h3>
            <ul>
              {data.expenses.map(function (x) {
                return (
                  <li key={x.category}>
                    {x.category} : {x.amount}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 20,
  },
  card: {
    background: "#f5f5f538",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    marginTop: 0,
  },
  button: {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    background: "#f5f5f5",
    cursor: "pointer",
  },
  msg: {
    color: "red",
    marginTop: 10,
  },
  box: {
    marginTop: 15,
    padding: 15,
    border: "1px solid #eee",
    borderRadius: 8,
    background: "#fafafa27",
  },
};
