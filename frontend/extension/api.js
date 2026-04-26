const MOCK_TABLES = [
  { id: 1, title: "Productos",  columns: [{ name: "Nombre" }, { name: "Precio"  }, { name: "Descripción" }] },
  { id: 2, title: "Contactos",  columns: [{ name: "Nombre" }, { name: "Email"   }, { name: "Teléfono"    }] },
  { id: 3, title: "Órdenes",    columns: [{ name: "ID"     }, { name: "Fecha"   }, { name: "Total"       }, { name: "Estado" }] },
];

function getTables() {
  return Promise.resolve(MOCK_TABLES);
}