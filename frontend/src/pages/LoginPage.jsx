import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // login or register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    try {
      const url =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const body =
        mode === "login"
          ? { email, password }
          : { username, email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Error");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data));
      setMsg("Success");
    } catch {
      setMsg("Backend not reachable");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {mode === "login" ? "Login" : "Register"}
        </h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === "register" && (
            <>
              <label style={styles.label}>Username</label>
              <input
                style={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button}>
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        {msg && <p style={styles.msg}>{msg}</p>}

        <button
          style={styles.switch}
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
        >
          {mode === "login"
            ? "Create an account"
            : "Already have an account"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0efef24",
  },
  card: {
    width: "350px",
    padding: "30px",
    borderRadius: "10px",
    border: "1px solid #666666ff",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#fcfcfcff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: "#ffffffff",
    marginBottom: "5px",
    marginTop: "10px",
    fontWeight: "bold",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #aaa",
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  switch: {
    marginTop: "15px",
    background: "none",
    border: "none",
    color: "#ffffffff",
    cursor: "pointer",
    textDecoration: "underline",
  },
  msg: {
    marginTop: "10px",
    color: "red",
    textAlign: "center",
  },
};
