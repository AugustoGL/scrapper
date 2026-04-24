// mock/db.js

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const tables = [
    {
        id: "1",
        title: "Productos",
        columns: [
            { id: "c1", name: "Nombre",      type: 1 },
            { id: "c2", name: "Precio",      type: 2 },
            { id: "c3", name: "Fecha alta",  type: 3 },
            { id: "c4", name: "Activo",      type: 4 },
            { id: "c5", name: "Imagen",      type: 5 },
        ],
    },
    {
        id: "2",
        title: "Contactos",
        columns: [
            { id: "c1", name: "Nombre",    type: 1 },
            { id: "c2", name: "Teléfono",  type: 1 },
            { id: "c3", name: "Edad",      type: 2 },
            { id: "c4", name: "Activo",    type: 4 },
            { id: "c5", name: "Perfil",    type: 5 },
        ],
    },
    {
        id: "3",
        title: "Órdenes",
        columns: [
            { id: "c1", name: "Cliente",   type: 1 },
            { id: "c2", name: "Total",     type: 2 },
            { id: "c3", name: "Fecha",     type: 3 },
            { id: "c4", name: "Pagado",    type: 4 },
            { id: "c5", name: "Factura",   type: 5 },
        ],
    },
];

const rows = {
    "1": {
        id_table: "1",
        records: [
            { key: "r1", values: [ { id_column: "c1", value: "Zapatillas Nike" }, { id_column: "c2", value: 12000 }, { id_column: "c3", value: "2024-01-15" }, { id_column: "c4", value: true  }, { id_column: "c5", value: "https://nike.com/img/zap.jpg" } ] },
            { key: "r2", values: [ { id_column: "c1", value: "Remera Adidas"  }, { id_column: "c2", value: 4500  }, { id_column: "c3", value: "2024-02-20" }, { id_column: "c4", value: true  }, { id_column: "c5", value: "https://adidas.com/img/rem.jpg" } ] },
            { key: "r3", values: [ { id_column: "c1", value: "Gorra Puma"     }, { id_column: "c2", value: 2800  }, { id_column: "c3", value: "2024-03-10" }, { id_column: "c4", value: false }, { id_column: "c5", value: "https://puma.com/img/gor.jpg" } ] },
        ],
    },
    "2": {
        id_table: "2",
        records: [
            { key: "r1", values: [ { id_column: "c1", value: "Juan Pérez"   }, { id_column: "c2", value: "11-2345-6789" }, { id_column: "c3", value: 34 }, { id_column: "c4", value: true  }, { id_column: "c5", value: "https://linkedin.com/in/juanperez" } ] },
            { key: "r2", values: [ { id_column: "c1", value: "María García" }, { id_column: "c2", value: "11-9876-5432" }, { id_column: "c3", value: 28 }, { id_column: "c4", value: true  }, { id_column: "c5", value: "https://linkedin.com/in/mariagarcia" } ] },
            { key: "r3", values: [ { id_column: "c1", value: "Carlos López" }, { id_column: "c2", value: "11-1111-2222" }, { id_column: "c3", value: 45 }, { id_column: "c4", value: false }, { id_column: "c5", value: "https://linkedin.com/in/carloslopez" } ] },
        ],
    },
    "3": {
        id_table: "3",
        records: [
            { key: "r1", values: [ { id_column: "c1", value: "Ana Martínez"  }, { id_column: "c2", value: 58000 }, { id_column: "c3", value: "2024-03-01" }, { id_column: "c4", value: true  }, { id_column: "c5", value: "https://facturas.com/001.pdf" } ] },
            { key: "r2", values: [ { id_column: "c1", value: "Luis Fernández" }, { id_column: "c2", value: 23400 }, { id_column: "c3", value: "2024-03-15" }, { id_column: "c4", value: false }, { id_column: "c5", value: "https://facturas.com/002.pdf" } ] },
            { key: "r3", values: [ { id_column: "c1", value: "Paula Suárez"  }, { id_column: "c2", value: 91000 }, { id_column: "c3", value: "2024-04-02" }, { id_column: "c4", value: true  }, { id_column: "c5", value: "https://facturas.com/003.pdf" } ] },
        ],
    },
};

// —— API simulada ——

export async function getTables() {
    await delay(800);
    return tables;
}

export async function getTableById(id) {
    await delay(600);
    return tables.find(t => t.id === id) ?? null;
}

export async function getRowsByTableId(id) {
    await delay(700);
    return rows[id] ?? { id_table: id, records: [] };
}