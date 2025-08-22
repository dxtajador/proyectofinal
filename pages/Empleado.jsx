import { useEffect, useState, useContext } from "react";
import { api } from "../api/client";
import { AuthContext } from "../context/AuthContext";

export default function Empleado() {
  const [pedidos, setPedidos] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!user || user.tipo !== "empleado") return;
      const res = await api.get("/pedidos");
      setPedidos(res.data);
    };
    fetchPedidos();
  }, [user]);

  if (!user || user.tipo !== "empleado") return <p className="p-6">Debes iniciar sesión como empleado.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pedidos Recibidos</h1>
      {pedidos.length === 0 ? <p>No hay pedidos aún.</p> : null}
      {pedidos.map(p => (
        <div key={p.id} className="bg-white p-4 rounded shadow mb-2">
          <p><strong>Cliente ID:</strong> {p.cliente_id}</p>
          <p><strong>Detalles:</strong> {p.detalles}</p>
          <p><strong>Tipo:</strong> {p.tipo}</p>
          <p><strong>Estado:</strong> {p.estado}</p>
        </div>
      ))}
    </div>
  );
}
