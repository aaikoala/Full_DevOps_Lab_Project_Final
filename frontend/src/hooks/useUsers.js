import { useEffect, useState } from "react";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => setError(String(err)));
  }, []);

  return { users, error };
}
