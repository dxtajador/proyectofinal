import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { AuthContext } from "../context/AuthContext";

const Auth = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isEmployeeLogin ? "/empleados/login" : "/clientes/login";
      const res = await api.post(endpoint, { usuario, password });
      const data = isEmployeeLogin ? res.data.empleado : res.data.cliente;
      login(data, isEmployeeLogin ? "employee" : "client");
      navigate(isEmployeeLogin ? "/empleados" : "/");
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">
        {isEmployeeLogin ? "Login Empleado" : "Login Cliente"}
      </h2>
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded p-6 w-80">
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <button type="submit" className="bg-red-600 text-white w-full py-2 rounded">
          Iniciar Sesión
        </button>
      </form>
      <p
        className="text-blue-600 mt-4 cursor-pointer"
        onClick={() => setIsEmployeeLogin(!isEmployeeLogin)}
      >
        {isEmployeeLogin
          ? "¿Eres cliente? Inicia aquí"
          : "¿Eres empleado? Inicia aquí"}
      </p>
      {!isEmployeeLogin && (
        <Link to="/register" className="text-blue-500 mt-2">
          Registrar Cliente
        </Link>
      )}
      {isEmployeeLogin && (
        <Link to="/empleado-register" className="text-blue-500 mt-2">
          Registrar Empleado
        </Link>
      )}
    </div>
  );
};

export default Auth;
