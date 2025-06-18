// components/CreateUserForm.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const crearUsuario = async () => {
    setLoading(true);

    // Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { rol: "user" }
    });

    if (error) {
      alert("Error creando usuario: " + error.message);
      setLoading(false);
      return;
    }

    // Guardar también en app_users
    await supabase.from("app_users").insert({
      email,
      rol: "user"
    });

    alert("✅ Usuario creado");
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>➕ Crear nuevo usuario para la app</h3>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={crearUsuario} disabled={loading}>
        {loading ? "Creando..." : "Crear usuario"}
      </button>
    </div>
  );
}
