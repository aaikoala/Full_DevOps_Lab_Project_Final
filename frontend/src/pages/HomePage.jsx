import { useCallback, useEffect, useState } from "react";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const loadDashboard = useCallback(async function () {
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();

      if (res.ok) {
        setData(json);
        setLoading(false);
        return;
      }

      setMsg("Error loading dashboard");
      setLoading(false);
    } catch (err) {
      setMsg("Backend not reachable");
      setLoading(false);
    }
  }, []);

  useEffect(function () {
    loadDashboard();
  }, [loadDashboard]);

  let spentPercent = 0;
  if (data && data.monthlyBudget > 0) {
    spentPercent = (data.totalExpenses / data.monthlyBudget) * 100;
  }
  if (spentPercent < 0) spentPercent = 0;
  if (spentPercent > 100) spentPercent = 100;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Home</h1>

          <button type="button" style={styles.button} onClick={loadDashboard}>
            Refresh
          </button>
        </div>

        {msg !== "" && <p style={styles.msg}>{msg}</p>}
        {loading && <p style={styles.small}>Loading...</p>}

        {data && (
          <div>
            <div style={styles.grid}>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Monthly budget</div>
                <div style={styles.statValue}>{data.monthlyBudget}</div>
              </div>

              <div style={styles.statBox}>
                <div style={styles.statLabel}>Total expenses</div>
                <div style={styles.statValue}>{data.totalExpenses}</div>
              </div>

              <div style={styles.statBox}>
                <div style={styles.statLabel}>Remaining</div>
                <div style={styles.statValue}>{data.remaining}</div>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.h2}>Budget usage</h2>
              <div style={styles.progressOuter}>
                <div style={{ ...styles.progressInner, width: spentPercent + "%" }} />
              </div>
              <div style={styles.small}>{Math.round(spentPercent)} percent spent</div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.h2}>Expenses by category</h2>

              {data.byCategory.length === 0 && <p style={styles.small}>No expenses yet.</p>}

              {data.byCategory.length > 0 && (
                <div>
                  {data.byCategory.map(function (x) {
                    // bar width relative to biggest category
                    const max = data.byCategory[0].amount;
                    let w = 0;
                    if (max > 0) {
                      w = (x.amount / max) * 100;
                    }

                    return (
                      <div key={x.category} style={styles.row}>
                        <div style={styles.rowLeft}>
                          <div style={styles.categoryName}>{x.category}</div>
                          <div style={styles.categoryAmount}>{x.amount}</div>
                        </div>

                        <div style={styles.barOuter}>
                          <div style={{ ...styles.barInner, width: w + "%" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
    background: "#f5f5f51d",
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: 20,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    margin: 0,
  },
  button: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "#f5f5f5ff",
    cursor: "pointer",
  },
  msg: {
    color: "red",
    marginTop: 10,
  },
  small: {
    color: "#f6f4f4ff",
    marginTop: 8,
    fontSize: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
    marginTop: 15,
  },
  statBox: {
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 12,
    background: "#fafafab5",
  },
  statLabel: {
    fontSize: 13,
    color: "#171717ff",
    fontWeight: "bold",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 6,
    color: "#171717ff",
  },
  section: {
    marginTop: 18,
    paddingTop: 10,
    borderTop: "1px solid #eee",
  },
  h2: {
    margin: "0 0 10px 0",
    fontSize: 18,
  },
  progressOuter: {
    height: 14,
    background: "#eee",
    borderRadius: 999,
    overflow: "hidden",
    border: "1px solid #ddd",
  },
  progressInner: {
    height: "100%",
    background: "#2b6cb0",
  },
  row: {
    marginBottom: 10,
  },
  rowLeft: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 10,
  },
  categoryName: {
    fontWeight: "bold",
  },
  categoryAmount: {
    color: "#ffffffff",
  },
  barOuter: {
    height: 10,
    background: "#eee",
    borderRadius: 999,
    overflow: "hidden",
    border: "1px solid #ddd",
  },
  barInner: {
    height: "100%",
    background: "#38a169",
  },
};
