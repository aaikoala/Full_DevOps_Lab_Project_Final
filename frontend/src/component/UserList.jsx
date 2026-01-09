import { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);

  function loadUsers() {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function deleteUser(id) {
    fetch("/api/users/" + id, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 204) {
        loadUsers();
      }
    });
  }

  if (users.length === 0) {
    return <p>No users</p>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user._id}>
          {user.username} - {user.email}
          <button onClick={() => deleteUser(user._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
