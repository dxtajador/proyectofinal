import { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

const EmpleadoRegister = () => {
  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [turno, setTurno] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/empleados/register", { nombre, puesto, turno, password });
      alert("Empleado registrado");
      navigate("/login");
    } catch (err) {
      alert("Error al registrar empleado");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Registrar Empleado</h2>
      <form onSubmit={handleRegister} className="bg-white shadow-md rounded p-6 w-80">
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} className="border p-2 mb-2 w-full"/>
        <input type="text" placeholder="Puesto" value={puesto} onChange={(e)=>setPuesto(e.target.value)} className="border p-2 mb-2 w-full"/>
        <input type="text" placeholder="Turno" value={turno} onChange={(e)=>setTurno(e.target.value)} className="border p-2 mb-2 w-full"/>
        <input type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} className="border p-2 mb-4 w-full"/>
        <button type="submit" className="bg-red-600 text-white w-full py-2 rounded">Registrar</button>
      </form>
    </div>
  );
};

export default EmpleadoRegister;
