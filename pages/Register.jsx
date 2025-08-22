import { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/clientes/register", { usuario, nombre, telefono, direccion, password });
      alert("Usuario registrado");
      navigate("/login");
    } catch (err) {
      alert("Error: usuario ya existe");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Registrar Cliente</h2>
      <form onSubmit={handleRegister} className="bg-white shadow-md rounded p-6 w-80">
        <input type="text" placeholder="Usuario" value={usuario} onChange={(e)=>setUsuario(e.target.value)} className="border p-2 mb-2 w-full"/>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} className="border p-2 mb-2 w-full"/>
        <input type="text" placeholder="Teléfono" value={telefono} onChange={(e)=>setTelefono(e.target.value)} className="border p-2 mb-2 w-full"/>
        <input type="text" placeholder="Dirección" value={direccion} onChange={(e)=>setDireccion(e.target.value)} className="border p-2 mb-2 w-full"/>
        <input type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} className="border p-2 mb-4 w-full"/>
        <button type="submit" className="bg-red-600 text-white w-full py-2 rounded">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
