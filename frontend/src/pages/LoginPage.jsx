import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

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
      body = { username: username, email: email, password: password };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message);
        return;
      }

      localStorage.setItem("session", JSON.stringify(data));
      setMsg("Success");

      navigate("/profile");
    } catch  {
      setMsg("Backend not reachable");
    }
  }

  function switchMode() {
    if (mode === "login") setMode("register");
    else setMode("login");
  }
  let titleText = "Login";
  let switchText = "Register";

  if (mode === "register") {
    titleText = "Register";
    switchText = "Login";
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <h1>{titleText}</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mode === "register" && (
          <>
            <label>Username</label>
            <input value={username} onChange={function (e) { setUsername(e.target.value); }} />
          </>
        )}

        <label>Email</label>
        <input value={email} onChange={function (e) { setEmail(e.target.value); }} />

        <label>Password</label>
        <input type="password" value={password} onChange={function (e) { setPassword(e.target.value); }} />

        <button type="submit">Submit</button>
      </form>

      {msg !== "" && <p style={{ color: "red" }}>{msg}</p>}

      <button type="button" onClick={switchMode} style={{ marginTop: 10 }}>
        Switch to {switchText}
      </button>
    </div>
  );
}
