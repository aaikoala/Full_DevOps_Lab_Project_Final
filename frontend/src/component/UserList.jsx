import { useEffect, useState } from "react";

//Displays the list of registered users 
export default function UserList() {
  const [users, setUsers] = useState([]);

  //Fetch the user data from the API
  function loadUsers() {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }

  //Uses to load the initial list
  useEffect(() => {
    loadUsers();
  }, []);

  //Deletes an user by ID and refreshes the list
  function deleteUser(id) {
    fetch("/api/users/" + id, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 204) {
        loadUsers();
      }
    });
  }

  //Displays a message if the list is empty
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
