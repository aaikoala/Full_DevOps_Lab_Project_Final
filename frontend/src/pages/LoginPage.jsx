import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // login or register

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function clearForm() {
    setUsername("");
    setEmail("");
    setPassword("");
  }

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    if (mode === "register") {
      if (!username || !email || !password) {
        setMsg("Please fill username, email and password");
        return;
      }
    }

    if (mode === "login") {
      if (!email || !password) {
        setMsg("Please fill email and password");
        return;
      }
    }

    setLoading(true);

    try {
      let url = "/api/auth/login";
      let body = { email, password };

      if (mode === "register") {
        url = "/api/auth/register";
        body = { username, email, password };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data && data.message) setMsg(data.message);
        else setMsg("Request failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      setMsg("Success. You are connected.");

      if (mode === "register") {
        setMode("login");
      }

      clearForm();
    } catch {
      setMsg("Backend not reachable");
    }

    setLoading(false);
  }

  const saved = localStorage.getItem("user");
  let currentUser = null;
  if (saved) currentUser = JSON.parse(saved);

  function logout() {
    localStorage.removeItem("user");
    setMsg("You are disconnected.");
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20, border: "1px solid #ddd", borderRadius: 10 }}>
      <h1 style={{ marginTop: 0 }}>Login</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <button onClick={() => setMode("login")} disabled={mode === "login"}>
          Login
        </button>
        <button onClick={() => setMode("register")} disabled={mode === "register"}>
          Register
        </button>
      </div>

      {currentUser && (
        <div style={{ padding: 10, background: "#f7f7f7", borderRadius: 8, marginBottom: 15 }}>
          <div><b>Connected as:</b> {currentUser.username} ({currentUser.email})</div>
          <button onClick={logout} style={{ marginTop: 10 }}>Logout</button>
        </div>
      )}

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mode === "register" && (
          <div>
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              style={{ width: "100%" }}
            />
          </div>
        )}

        <div>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>

      {msg && <p style={{ marginTop: 15 }}>{msg}</p>}
    </div>
  );
}
