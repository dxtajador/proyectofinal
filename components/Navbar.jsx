import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, isEmployee, logout } = useContext(AuthContext);

  return (
    <nav className="bg-red-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Restaurante</h1>
      <div className="flex gap-4">
        {user && !isEmployee && (
          <>
            <Link to="/">Menú</Link>
            <Link to="/mis-pedidos">Mis Pedidos</Link>
          </>
        )}
        {user && isEmployee && (
          <>
            <Link to="/">Inicio</Link>
            <Link to="/empleados">Pedidos</Link>
          </>
        )}
        {!user && <Link to="/login">Iniciar Sesión</Link>}
        {user && <button onClick={logout}>Cerrar Sesión</button>}
      </div>
    </nav>
  );
};

export default Navbar;
