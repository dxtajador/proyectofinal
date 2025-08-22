import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/client";

const MisPedidos = () => {
  const { user, isEmployee } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (user) fetchPedidos();
  }, [user]);

  const fetchPedidos = async () => {
    try {
      const res = await api.get("/pedidos");
      if (!isEmployee) {
        // Filtrar solo los pedidos del cliente actual
        const misPedidos = res.data.filter(p => p.cliente_id === user.id);
        setPedidos(misPedidos);
      } else {
        // Empleado ve todos los pedidos
        setPedidos(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return <p className="text-center mt-10">Inicia sesión como cliente para ver tus pedidos</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{isEmployee ? "Pedidos de Clientes" : "Mis Pedidos"}</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos.</p>
      ) : (
        <div className="grid gap-4">
          {pedidos.map(p => (
            <div key={p.id} className="border p-4 rounded shadow">
              <p><strong>Detalles:</strong> {p.detalles}</p>
              <p><strong>Tipo:</strong> {p.tipo}</p>
              <p><strong>Estado:</strong> {p.estado}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
