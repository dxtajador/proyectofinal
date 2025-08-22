import { useState, useEffect, useContext } from "react";
import { api } from "../api/client";
import { AuthContext } from "../context/AuthContext";

const EmpleadoDashboard = () => {
  const { user } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await api.get("/pedidos");
        setPedidos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPedidos();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pedidos del Restaurante</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos</p>
      ) : (
        <ul>
          {pedidos.map((p) => (
            <li key={p.id} className="border p-2 mb-2">
              <p><strong>Cliente ID:</strong> {p.cliente_id}</p>
              <p><strong>Detalles:</strong> {p.detalles}</p>
              <p><strong>Tipo:</strong> {p.tipo}</p>
              <p><strong>Estado:</strong> {p.estado}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmpleadoDashboard;
