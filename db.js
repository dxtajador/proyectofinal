import sqlite3 from 'sqlite3';
await db.exec('PRAGMA foreign_keys = ON;');
await createSchema(db);
await seedIfEmpty(db);
return db;



async function createSchema(db) {
await db.exec(`
CREATE TABLE IF NOT EXISTS clientes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
usuario TEXT UNIQUE NOT NULL,
nombre TEXT NOT NULL,
telefono TEXT,
direccion TEXT,
contrasena TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS empleados (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nombre TEXT NOT NULL,
puesto TEXT NOT NULL,
turno TEXT NOT NULL CHECK(turno IN ('Matutino','Vespertino')),
contrasena TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS menu (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nombre TEXT NOT NULL,
descripcion TEXT,
precio REAL NOT NULL,
tipo TEXT NOT NULL,
imagen_url TEXT
);


CREATE TABLE IF NOT EXISTS pedidos (
id INTEGER PRIMARY KEY AUTOINCREMENT,
id_cliente INTEGER NOT NULL,
id_empleado INTEGER,
items_json TEXT NOT NULL, -- [{id, nombre, precio, cantidad}]
tipo_servicio TEXT NOT NULL CHECK(tipo_servicio IN ('llevar','recoger','comer_ahi')),
estado TEXT NOT NULL CHECK(estado IN ('pendiente','en_proceso','entregado')) DEFAULT 'pendiente',
fecha TEXT NOT NULL,
total REAL NOT NULL,
FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE,
FOREIGN KEY (id_empleado) REFERENCES empleados(id) ON DELETE SET NULL
);
`);
}


async function seedIfEmpty(db) {
const row = await db.get('SELECT COUNT(*) as c FROM menu');
if (row.c === 0) {
await db.run(
`INSERT INTO menu (nombre, descripcion, precio, tipo, imagen_url) VALUES
('Hamburguesa Clásica', 'Carne 150g, queso, lechuga, jitomate', 89.00, 'comida', 'https://picsum.photos/seed/burger/300/200'),
('Tacos de Asada', 'Orden de 4 tacos con guacamole', 75.00, 'comida', 'https://picsum.photos/seed/tacos/300/200'),
('Ensalada César', 'Pollo a la plancha opcional', 65.00, 'comida', 'https://picsum.photos/seed/salad/300/200'),
('Limonada', 'Vaso 500ml', 25.00, 'bebida', 'https://picsum.photos/seed/lemon/300/200'),
('Flan Napolitano', 'Rebanada', 35.00, 'postre', 'https://picsum.photos/seed/flan/300/200');`
);
}
const emp = await db.get('SELECT COUNT(*) as c FROM empleados');
if (emp.c === 0) {
await db.run(
`INSERT INTO empleados (nombre, puesto, turno, contrasena) VALUES
('Ana López', 'Cajero', 'Matutino', '1234'),
('Luis Pérez', 'Cocinero', 'Vespertino', '1234');`
);
}
}