import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // login or register

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");

    if (mode === "register") {
      if (!username || !email || !password) {
        setStatus("Please fill username, email and password");
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, email: email, password: password })
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.message || "Register failed");
        return;
      }

      setUser(data);
      setStatus("Register success. You are now saved in database.");
      return;
    }

    if (!email || !password) {
      setStatus("Please fill email and password");
      return;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data.message || "Login failed");
      return;
    }

    setUser(data);
    setStatus("Login success.");
  }

  function reset() {
    setUsername("");
    setEmail("");
    setPassword("");
    setStatus("");
    setUser(null);
  }

  return (
    <div style={{ maxWidth: "420px", margin: "40px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h1 style={{ marginTop: 0 }}>{mode === "login" ? "Login" : "Register"}</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button onClick={() => { setMode("login"); reset(); }} style={{ padding: "8px 12px" }}>
          Login
        </button>
        <button onClick={() => { setMode("register"); reset(); }} style={{ padding: "8px 12px" }}>
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <div style={{ marginBottom: "10px" }}>
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
              placeholder="john_doe"
            />
          </div>
        )}

        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
            placeholder="john@mail.com"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            style={{ width: "100%", padding: "8px" }}
            placeholder="123456"
          />
        </div>

        <button type="submit" style={{ padding: "10px 14px", width: "100%" }}>
          {mode === "login" ? "Login" : "Create account"}
        </button>
      </form>

      {status && <p style={{ marginTop: "15px" }}>{status}</p>}

      {user && (
        <div style={{ marginTop: "15px", padding: "10px", background: "#f6f6f6", borderRadius: "8px" }}>
          <div><b>Logged user:</b></div>
          <div>Username: {user.username}</div>
          <div>Email: {user.email}</div>
          <div>Id: {user._id}</div>
        </div>
      )}
    </div>
  );
}
