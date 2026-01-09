import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Handles user authentification including login and registration
export default function LoginPage() {
  //Hook for redirecting after login
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  //Handles form submission
  async function handleSubmit(e) {
    e.preventDefault(); //Prevent default browser reload
    setMsg("");

    //Default configuration for login
    let url = "/api/auth/login";
    let body = { email: email, password: password };

    //If in register mode include username
    if (mode === "register") {
      url = "/api/auth/register";
      body = { username: username, email: email, password: password };
    }

    try {
      //Send the request to the backend
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      //Handles server-side errors
      if (!res.ok) {
        setMsg(data.message);
        return;
      }

      //Redirect the user to their profile page
      localStorage.setItem("session", JSON.stringify(data));
      setMsg("Success");

      navigate("/profile");
    } catch  {
      setMsg("Backend not reachable");
    }
  }

  //Toggles the state between login and register
  function switchMode() {
    if (mode === "login") setMode("register");
    else setMode("login");
  }

  //Dynamic text variables based on current mode
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
