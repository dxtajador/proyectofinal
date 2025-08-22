import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/client";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [menu, setMenu] = useState([]);
  const [pedidoTipo, setPedidoTipo] = useState("comer_ahi"); // tipo de pedido

  // Inicializamos menú con platillos si el backend no tiene
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu");
        if (res.data.length === 0) {
          // Inserción de ejemplo en backend
          const platillos = [
            { nombre: 'Tacos al Pastor', descripcion: 'Deliciosos tacos con piña y salsa especial', precio: 50, imagen: 'https://i.imgur.com/1X9xYJw.jpg' },
            { nombre: 'Hamburguesa Especial', descripcion: 'Con doble carne, queso y vegetales', precio: 80, imagen: 'https://i.imgur.com/0JkT6Cq.jpg' },
            { nombre: 'Enchiladas Verdes', descripcion: 'Con pollo y salsa verde casera', precio: 70, imagen: 'https://i.imgur.com/VzMZcMf.jpg' },
            { nombre: 'Pizza Pepperoni', descripcion: 'Con mucho queso y pepperoni', precio: 120, imagen: 'https://i.imgur.com/7d0H1Xk.jpg' },
            { nombre: 'Sushi Variado', descripcion: 'Rollos surtidos frescos', precio: 150, imagen: 'https://i.imgur.com/T7fLJ0a.jpg' },
          ];

          for (let p of platillos) {
            await api.post("/menu", p);
          }
          const res2 = await api.get("/menu");
          setMenu(res2.data);
        } else {
          setMenu(res.data);
        }
      } catch (err) {
        console.log("Error al cargar el menú:", err);
      }
    };
    fetchMenu();
  }, []);

  const handlePedir = async (item) => {
    if (!user || user.isEmployee) return alert("Solo clientes pueden pedir");

    const extra = pedidoTipo === "llevar" ? 20 : 0;
    const total = item.precio + extra;

    try {
      await api.post("/pedidos", {
        cliente_id: user.id,
        empleado_id: 1, // se puede asignar empleado real
        detalles: item.nombre,
        tipo: pedidoTipo,
        total,
        direccion_envio: user.direccion,
        pago: "efectivo",
      });
      alert(`Pedido realizado: ${item.nombre}\nTotal: $${total}`);
    } catch (err) {
      console.log("Error al crear pedido:", err);
      alert("Error al realizar el pedido");
    }
  };

  if (!user) return <div className="p-4">Inicia sesión para ver el menú</div>;

  if (user.isEmployee)
    return (
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Bienvenido Empleado</h1>
        <img
          src="https://i.imgur.com/1aX5Vvb.jpg"
          alt="Restaurante"
          className="mx-auto rounded-lg shadow-lg"
        />
        <p className="mt-4 text-lg">Aquí puedes ver los pedidos de los clientes.</p>
      </div>
    );

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="mr-2 font-semibold">Tipo de pedido:</label>
        <select
          className="border px-2 py-1 rounded"
          onChange={(e) => setPedidoTipo(e.target.value)}
          value={pedidoTipo}
        >
          <option value="comer_ahi">Comer aquí</option>
          <option value="llevar">Para llevar (+$20)</option>
          <option value="recoger">Recoger</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menu.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition p-2"
          >
            <img
              src={item.imagen}
              alt={item.nombre}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="font-bold text-xl mt-2">{item.nombre}</h2>
            <p className="text-gray-700">{item.descripcion}</p>
            <p className="font-semibold mt-1">${item.precio}</p>
            {pedidoTipo === "llevar" && (
              <p className="text-red-600 font-bold">Costo extra: $20</p>
            )}
            <button
              onClick={() => handlePedir(item)}
              className="bg-blue-500 text-white w-full py-2 rounded mt-2 hover:bg-blue-600 transition"
            >
              Pedir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
