// src/components/UserManager.jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState("user");

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, role")
      .order("created_at", { ascending: false });

    if (data) setUsers(data);
  };

  const handleCreateUser = async () => {
    if (!email.includes("@") || password.length < 6) {
      setErrorMsg("Email válido y contraseña ≥ 6 caract.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const { error: profErr } = await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      role: "user",
    });

    if (profErr) {
      setErrorMsg(profErr.message);
    } else {
      setEmail("");
      setPassword("");
      setErrorMsg("");
      fetchUsers();
      alert("Usuario creado. Se envió email de confirmación.");
    }
  };

  const handleDelete = async (id) => {
    await supabase.from("profiles").delete().eq("id", id);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEmail(user.email);
    setEditRole(user.role);
  };

  const handleUpdateUser = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ email, role: editRole })
      .eq("id", editingUser.id);

    if (!error) {
      setEditingUser(null);
      setEmail("");
      setEditRole("user");
      fetchUsers();
    } else {
      setErrorMsg(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Usuarios</h2>

      <div className="flex gap-2 flex-wrap items-center">
        <input
          type="email"
          placeholder="correo@dominio"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-800 p-2 rounded grow"
        />
        {!editingUser && (
          <input
            type="password"
            placeholder="contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 p-2 rounded grow"
          />
        )}
        {editingUser && (
          <select
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            className="bg-gray-800 p-2 rounded"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        )}
        <button
          onClick={editingUser ? handleUpdateUser : handleCreateUser}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          {editingUser ? "Actualizar" : "Crear"}
        </button>
        {editingUser && (
          <button
            onClick={() => {
              setEditingUser(null);
              setEmail("");
              setPassword("");
              setEditRole("user");
            }}
            className="bg-gray-600 px-4 py-2 rounded"
          >
            Cancelar
          </button>
        )}
      </div>

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      <ul className="divide-y divide-gray-700">
        {users.map((u) => (
          <li key={u.id} className="py-2 flex justify-between items-center">
            <span>{u.email}</span>
            <div className="flex gap-2 text-sm">
              <span className="text-gray-400">{u.role}</span>
              <button onClick={() => handleEdit(u)} className="text-blue-400">
                Editar
              </button>
              <button
                onClick={() => handleDelete(u.id)}
                className="text-red-400"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
