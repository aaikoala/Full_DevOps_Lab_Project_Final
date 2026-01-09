import { useEffect, useState } from "react";
import { apiFetch, getSession } from "../utils/api";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");
  const [msg, setMsg] = useState("");

  function logoutBecauseTokenIsInvalid() {
    localStorage.removeItem("session");
    setData(null);
    setBudgetInput("");
    setMsg("Your session expired. Please login again.");
  }

  function getColors() {
    return ["#4f46e5", "#16a34a", "#f97316", "#dc2626", "#0ea5e9", "#a855f7"];
  }

  function getColor(i) {
    const colors = getColors();
    return colors[i % colors.length];
  }

  function buildGradient(items, total) {
    let start = 0;
    const parts = [];

    for (let i = 0; i < items.length; i = i + 1) {
      const x = items[i];
      const pct = (x.amount / total) * 100;
      const end = start + pct;
      const color = getColor(i);

      parts.push(color + " " + start + "% " + end + "%");
      start = end;
    }

    return "conic-gradient(" + parts.join(", ") + ")";
  }

  async function loadDashboard() {
    setMsg("");

    const session = getSession();
    if (!session) {
      setMsg("Please login to see your dashboard");
      setData(null);
      return;
    }

    try {
      const res = await apiFetch("/api/dashboard");
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          logoutBecauseTokenIsInvalid();
          return;
        }

        if (json && json.message) setMsg(json.message);
        else setMsg("Error loading dashboard");

        setData(null);
        return;
      }

      setData(json);
      setBudgetInput(String(json.monthlyBudget));
    } catch (err) {
      console.log(err);
      setMsg("Backend not reachable");
    }
  }

  async function saveBudget() {
    setMsg("");

    const session = getSession();
    if (!session) {
      setMsg("Please login before saving your budget");
      return;
    }

    const value = Number(budgetInput);
    if (Number.isNaN(value) || value < 0) {
      setMsg("Budget must be a non-negative number");
      return;
    }

    try {
      const res = await apiFetch("/api/budgetmensuel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget: value })
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          logoutBecauseTokenIsInvalid();
          return;
        }

        if (json && json.message) setMsg(json.message);
        else setMsg("Error saving budget");
        return;
      }

      if (typeof json.budget === "number") {
        setBudgetInput(String(json.budget));
      }

      setMsg("Budget saved");
      await loadDashboard();
    } catch (err) {
      console.log(err);
      setMsg("Backend not reachable");
    }
  }

  useEffect(function () {
    async function start() {
      await loadDashboard();
    }
    start();
  }, []);

  let byCategory = [];
  let total = 0;
  let gradient = "";

  if (data) {
    if (Array.isArray(data.byCategory)) byCategory = data.byCategory;
    if (typeof data.totalExpenses === "number") total = data.totalExpenses;
    if (total > 0) gradient = buildGradient(byCategory, total);
  }
  let isOverBudget = false;
  let isWarning = false;

  if (data) {
    if (typeof data.remaining === "number") {
      isOverBudget = data.remaining < 0;
      isWarning = data.remaining >= 0 && data.monthlyBudget > 0 && data.remaining <= data.monthlyBudget * 0.1;
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Home</h1>

        {msg !== "" && <p style={styles.msg}>{msg}</p>}
        {data && isOverBudget && (
            <div style={styles.alertDanger}>
                 <b>Overspending!</b> Your expenses are higher than your monthly budget.
            </div>
    )}

    {data && !isOverBudget && isWarning && (
        <div style={styles.alertWarn}>
             <b>Warning:</b> You are close to your budget limit.
     </div>
    )}


        <div style={styles.section}>
          <h2 style={styles.h2}>Monthly budget</h2>
          <div style={styles.row}>
            <input
              style={styles.input}
              value={budgetInput}
              onChange={function (e) {
                setBudgetInput(e.target.value);
              }}
              placeholder="Enter your monthly budget"
            />
            <button type="button" style={styles.button} onClick={saveBudget}>
              Save
            </button>
          </div>
        </div>

        {data && (
          <div style={styles.section}>
            <h2 style={styles.h2}>This month summary</h2>

            <div style={styles.grid}>
              <div style={styles.box}>
                <div style={styles.label}>Budget</div>
                <div style={styles.value}>{data.monthlyBudget}</div>
              </div>
              <div style={styles.box}>
                <div style={styles.label}>Expenses</div>
                <div style={styles.value}>{data.totalExpenses}</div>
              </div>
              <div style={styles.box}>
                <div style={styles.label}>Remaining</div>
                <div style={isOverBudget ? styles.valueRed : styles.value}>
                    {data.remaining}
                </div>
            </div>
          </div>
        </div>
        )}

        {data && (
          <div style={styles.section}>
            <h2 style={styles.h2}>Spending by category (this month)</h2>

            {total === 0 && <p>No expenses for this month yet.</p>}

            {total > 0 && (
              <div style={styles.chartRow}>
                <div style={styles.pieWrap}>
                  <div style={{ ...styles.pie, background: gradient }} />
                </div>

                <div style={styles.legend}>
                  {byCategory.map(function (x, index) {
                    const percent = Math.round((x.amount / total) * 100);
                    const color = getColor(index);

                    return (
                      <div key={x.category} style={styles.legendItem}>
                        <div style={{ ...styles.dot, background: color }} />
                        <div>
                          <div style={styles.legendTitle}>{x.category}</div>
                          <div style={styles.legendText}>
                            {x.amount} ({percent}%)
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button type="button" style={styles.refresh} onClick={loadDashboard}>
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 900, margin: "0 auto", padding: 20 },
  card: { background: "#fffefe22", border: "1px solid #e5e5e5", borderRadius: 12, padding: 20 },
  title: { marginTop: 0 },
  msg: { color: "red" },

  alertDanger: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ef4444",
    background: "#fee2e2",
    color: "#991b1b",
  },

  alertWarn: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #f59e0b",
    background: "#fef3c7",
    color: "#92400e",
  },

  valueRed: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 6,
    color: "red",
  },

  section: { marginTop: 20, paddingTop: 10, borderTop: "1px solid #eee" },
  h2: { margin: "0 0 10px 0", fontSize: 18 },
  row: { display: "flex", gap: 10, alignItems: "center" },
  input: { padding: "10px", borderRadius: 8, border: "1px solid #ccc", width: 280 },
  button: { padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", background: "#bebebed7", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  box: { border: "1px solid #eee", borderRadius: 10, padding: 12, background: "#fafafa51" },
  label: { fontSize: 18, color: "#ffffffff",fontWeight: "bold" },
  value: { fontSize: 25, fontWeight: "bold", marginTop: 6 },
  chartRow: { display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" },
  pieWrap: { width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center" },
  pie: { width: 200, height: 200, borderRadius: "50%", border: "1px solid #ddd" },
  legend: { minWidth: 260 },
  legendItem: { display: "flex", gap: 10, alignItems: "center", marginBottom: 10 },
  dot: { width: 12, height: 12, borderRadius: 999 },
  legendTitle: { fontWeight: "bold" },
  legendText: { color: "#ffffffff", fontSize: 14 },
  refresh: { marginTop: 12, padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" },
};

