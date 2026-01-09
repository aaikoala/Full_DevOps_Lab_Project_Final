import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(function () {
    const raw = localStorage.getItem("currentUser");
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw);

    setTimeout(function () {
      setUser(parsed);
    }, 0);
  }, []);

  function logout() {
    localStorage.removeItem("currentUser");
    setUser(null);
    setMsg("Logged out");
  }

  async function deleteAccount() {
    setMsg("");

    if (!user) {
      setMsg("You are not logged in");
      return;
    }

    try {
      const res = await fetch("/api/users/" + user._id, {
        method: "DELETE",
      });

      if (res.status === 204) {
        localStorage.removeItem("currentUser");
        setUser(null);
        setMsg("Account deleted");
        return;
      }

      const data = await res.json();
      setMsg(data.message || "Delete failed");
    } catch  {
      setMsg("Backend not reachable");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>My Account</h1>

        {!user ? (
          <div>
            <p style={styles.text}>You are not logged in.</p>
            <Link to="/login" style={styles.link}>Go to Login</Link>
          </div>
        ) : (
          <div>
            <p style={styles.text}>
              <b>Username:</b> {user.username}
            </p>
            <p style={styles.text}>
              <b>Email:</b> {user.email}
            </p>

            <div style={styles.row}>
              <button type="button" onClick={logout} style={styles.btn}>
                Logout
              </button>
              <button type="button" onClick={deleteAccount} style={styles.dangerBtn}>
                Delete account
              </button>
            </div>
          </div>
        )}

        {msg !== "" ? <p style={styles.msg}>{msg}</p> : null}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#ffffff14",
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: 450,
    border: "1px solid #dddddd28",
    borderRadius: 10,
    padding: 24,
    background: "#ffffff14",
  },
  title: {
    marginTop: 0,
    marginBottom: 15,
    color: "#fefefeff",
  },
  text: {
    color: "#fcfafaff",
    marginBottom: 10,
  },
  row: {
    display: "flex",
    gap: 10,
    marginTop: 15,
  },
  btn: {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #aaa",
    background: "#fdfafafd",
    cursor: "pointer",
  },
  dangerBtn: {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #ff7a7a",
    background: "#ffe5e5",
    cursor: "pointer",
  },
  msg: {
    marginTop: 15,
    color: "#fffdfdff",
  },
  link: {
    color: "#faf9f9ff",
    textDecoration: "underline",
  },
};
