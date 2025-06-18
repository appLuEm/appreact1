import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Header({ user }) {
  const nav = useNavigate();
  const logout = async () => {
    await supabase.auth.signOut();
    nav("/login");
  };
  return (
    <header className="bg-black shadow py-2 md:py-4">
      <div className="container mx-auto flex justify-between items-center px-2 md:px-4">
        <Link to="/" className="text-lg md:text-2xl font-bold text-red-500">MySaaS Stream</Link>
        <nav className="space-x-2 md:space-x-4 text-sm md:text-base">
          <Link to="/" className="hover:text-red-400">Inicio</Link>
          {user ? (
            <>
              <Link to="/admin" className="hover:text-red-400">Panel</Link>
              <button onClick={logout} className="ml-2 bg-red-500 hover:bg-red-600 px-2 md:px-3 py-1 rounded text-white text-sm md:text-base">Cerrar sesión</button>
            </>
          ) : <Link to="/login" className="bg-red-500 hover:bg-red-600 px-2 md:px-3 py-1 rounded text-white text-sm md:text-base">Iniciar sesión</Link>}
        </nav>
      </div>
    </header>
  );
}
