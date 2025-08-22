import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function EmpleadoLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/empleados/login", { nombre, password });
      login({ ...res.data.empleado, isEmployee: true });
      navigate("/"); // va al Home o Dashboard de empleado
    } catch (err) {
      alert(err.response?.data?.message || "Nombre o contraseña incorrectos");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión como Empleado</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
