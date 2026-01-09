import { useState } from "react";
import UserList from "../component/UserList";
import UserForm from "../component/UserForm";

export default function UsersPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div>
      <h1>Users</h1>

      <UserForm onCreated={() => setRefresh(refresh + 1)} />

      <UserList key={refresh} />
    </div>
  );
}
