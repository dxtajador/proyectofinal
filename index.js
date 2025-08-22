import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT UNIQUE,
      nombre TEXT,
      telefono TEXT,
      direccion TEXT,
      password TEXT
    );
    CREATE TABLE IF NOT EXISTS empleados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      puesto TEXT,
      turno TEXT,
      password TEXT
    );
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      descripcion TEXT,
      precio REAL,
      imagen TEXT
    );
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER,
      empleado_id INTEGER,
      detalles TEXT,
      tipo TEXT,
      estado TEXT DEFAULT 'pendiente',
      total REAL,
      direccion_envio TEXT,
      pago TEXT,
      FOREIGN KEY(cliente_id) REFERENCES clientes(id),
      FOREIGN KEY(empleado_id) REFERENCES empleados(id)
    );
  `);

  // Crear un empleado de prueba
  await db.run(
    `INSERT OR IGNORE INTO empleados (nombre, puesto, turno, password) VALUES ('Admin','Cajero','matutino','1234')`
  );

  // Crear platillos de ejemplo
  await db.run(
    `INSERT OR IGNORE INTO menu (nombre, descripcion, precio, imagen) VALUES 
      ('Hamburguesa', 'Hamburguesa con queso y bacon', 80, 'https://i.imgur.com/U9f5oVb.jpg'),
      ('Pizza', 'Pizza de pepperoni', 120, 'https://i.imgur.com/Y2nVwRV.jpg'),
      ('Ensalada', 'Ensalada de vegetales frescos', 60, 'https://i.imgur.com/kZ8G6nE.jpg')
    `
  );
})();

// ----- Clientes -----
app.post("/clientes/register", async (req, res) => {
  const { usuario, nombre, telefono, direccion, password } = req.body;
  try {
    const result = await db.run(
      "INSERT INTO clientes (usuario,nombre,telefono,direccion,password) VALUES (?,?,?,?,?)",
      [usuario, nombre, telefono, direccion, password]
    );
    res.json({ success: true, id: result.lastID });
  } catch (err) {
    res.status(400).json({ success: false, message: "Usuario ya existe" });
  }
});

app.post("/clientes/login", async (req, res) => {
  const { usuario, password } = req.body;
  const cliente = await db.get(
    "SELECT * FROM clientes WHERE usuario=? AND password=?",
    [usuario, password]
  );
  if (cliente) res.json({ success: true, cliente });
  else res.status(400).json({ success: false, message: "Credenciales incorrectas" });
});

// ----- Empleados -----
app.post("/empleados/register", async (req, res) => {
  const { nombre, puesto, turno, password } = req.body;
  try {
    const result = await db.run(
      "INSERT INTO empleados (nombre,puesto,turno,password) VALUES (?,?,?,?)",
      [nombre, puesto, turno, password]
    );
    res.json({ success: true, id: result.lastID });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error al registrar empleado" });
  }
});

app.post("/empleados/login", async (req, res) => {
  const { nombre, password } = req.body;
  const empleado = await db.get(
    "SELECT * FROM empleados WHERE nombre=? AND password=?",
    [nombre, password]
  );
  if (empleado) res.json({ success: true, empleado });
  else res.status(400).json({ success: false, message: "Credenciales incorrectas" });
});

// ----- Menu -----
app.get("/menu", async (req, res) => {
  const items = await db.all("SELECT * FROM menu");
  res.json(items);
});

// ----- Pedidos -----
app.get("/pedidos", async (req, res) => {
  const pedidos = await db.all("SELECT * FROM pedidos");
  res.json(pedidos);
});

app.post("/pedidos", async (req, res) => {
  const { cliente_id, empleado_id, detalles, tipo, total, direccion_envio, pago } = req.body;
  const result = await db.run(
    "INSERT INTO pedidos (cliente_id, empleado_id, detalles, tipo, total, direccion_envio, pago) VALUES (?,?,?,?,?,?,?)",
    [cliente_id, empleado_id, detalles, tipo, total, direccion_envio, pago]
  );
  res.json({ success: true, id: result.lastID });
});

app.listen(4000, () => console.log("Servidor corriendo en http://localhost:4000"));
