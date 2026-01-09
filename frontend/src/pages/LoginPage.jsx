import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    let url = "/api/auth/login";
    let body = { email: email, password: password };

    if (mode === "register") {
      url = "/api/auth/register";
      body = {
        username: username,
        email: email,
        password: password,
      };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data));
      setMsg("Success");
    } catch {
      setMsg("Backend not reachable");
    }
  }

  function switchMode() {
    if (mode === "login") {
      setMode("register");
    } else {
      setMode("login");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {mode === "login" && "Login"}
          {mode === "register" && "Register"}
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
            Submit
          </button>
        </form>

        {msg !== "" && <p style={styles.msg}>{msg}</p>}

        <button style={styles.switch} onClick={switchMode}>
          Switch to {mode === "login" && "Register"}
          {mode === "register" && "Login"}
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
    background: "#ffffff35",
  },
  card: {
    width: 350,
    padding: 30,
    borderRadius: 10,
    border: "1px solid #dddddd37",
    background: "#ffffff35",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: "white",
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    padding: 8,
    borderRadius: 5,
    border: "1px solid #aaa",
  },
  button: {
    marginTop: 20,
    padding: 10,
    background: "black",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  switch: {
    marginTop: 15,
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    textDecoration: "underline",
  },
  msg: {
    marginTop: 10,
    color: "red",
    textAlign: "center",
  },
};
