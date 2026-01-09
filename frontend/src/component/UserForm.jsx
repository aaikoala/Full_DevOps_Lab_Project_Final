import { useState } from "react";

//Allows an user to create an account
//Sends the data to the backend API
export default function UserForm(props) {
  const onCreated = props.onCreated;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Sends a POST request to the API to create a new user
  function handleSubmit(e) {
    e.preventDefault();

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
      .then((res) => {
        if (res.status === 201) return res.json();
        return res.json().then((x) => {
          throw new Error(x.message || "Error");
        });
      })
      .then(() => {
        setUsername("");
        setEmail("");
        setPassword("");
        if (onCreated) onCreated();
      })
      .catch((err) => alert(err.message)); //Catches error message
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}
