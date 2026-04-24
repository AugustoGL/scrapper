// constants/columnTypes.js

export const COLUMN_TYPES = {
    1: { label: "Texto",    value: 1, color: "blue"   },
    2: { label: "Número",   value: 2, color: "green"  },
    3: { label: "Fecha",    value: 3, color: "orange" },
    4: { label: "Booleano", value: 4, color: "purple" },
    5: { label: "URL",      value: 5, color: "cyan"   },
};

export const COLUMN_TYPES_SELECT = Object.values(COLUMN_TYPES).map(({ label, value }) => ({ label, value }));