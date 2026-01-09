import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//Displays the authenticated user's account details
export default function ProfilePage() {
  //navigation tool
  const navigate = useNavigate();

  //Initialize user state
  const [user, setUser] = useState(function () {
    const raw = localStorage.getItem("session");
    if (!raw) return null;

    try {
      const session = JSON.parse(raw);
      //Check if the session object contains user details
      if (session && session.user) return session.user;
      return null;
    } catch (error) {
      console.log(error);
      return null; //Return null if parsing fails
    }
  });

  const [msg, setMsg] = useState("");

  //Handles the logout process
  //Updates state and redirects the user
  function logout() {
    localStorage.removeItem("session");
    setUser(null);
    setMsg("Logged out");
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h1>My Account</h1>

      {user === null && (
        <div>
          <p>You are not logged in.</p>
          <Link to="/login">Go to Login</Link>
        </div>
      )}

      {user !== null && (
        <div>
          <p><b>Username:</b> {user.username}</p>
          <p><b>Email:</b> {user.email}</p>

          <button type="button" onClick={logout}>Logout</button>

          {msg !== "" && <p>{msg}</p>}
        </div>
      )}
    </div>
  );
}
