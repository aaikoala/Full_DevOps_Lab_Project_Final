import { useEffect, useState } from "react";

export default function HomePage() {
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setError("");
      })
      .catch(() => {
        setError("Backend not reachable. Start your backend server.");
      });
  }, []);

  return (
    <div>
      <h1 className="pageTitle">Dashboard</h1>
      

      <div className="card">
        <div className="badge">Server message</div>
        <div style={{ marginTop: "12px" }}>
          {error ? <div className="errorBox">{error}</div> : <div>{message}</div>}
        </div>
      </div>
    </div>
  );
}
