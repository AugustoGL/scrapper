// TableDetail.jsx — reemplazá buildAntColumns completo

import { useRef, useState } from "react";
import { Flex, Tag, Table, Skeleton, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { COLUMN_TYPES } from "../../columnTypes.js";

const buildAntColumns = (table, { searchText, searchedColumn, searchInput, handleSearch, handleReset }) => {
    if (!table) return [];

    return table.columns.map(col => {
        const base = {
            title: col.name,
            key: col.id,
            render: (_, record) => {
                const cell = record.values.find(v => v.id_column === col.id);
                if (cell === undefined) return "—";
                if (col.type === 4) return cell.value ? "✓" : "✗";
                if (col.type === 5) return <a href={cell.value} target="_blank" rel="noreferrer">Ver</a>;
                return cell.value ?? "—";
            },
        };

        // Tipo 1 — Texto: buscador
        if (col.type === 1) {
            return {
                ...base,
                render: (_, record) => {
                    const cell = record.values.find(v => v.id_column === col.id);
                    const text = cell?.value ?? "";
                    return searchedColumn === col.id ? (
                        <Highlighter
                            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                            searchWords={[searchText]}
                            autoEscape
                            textToHighlight={text.toString()}
                        />
                    ) : text || "—";
                },
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
                    <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                        <Input
                            ref={searchInput}
                            placeholder={`Buscar ${col.name}`}
                            value={selectedKeys[0]}
                            onChange={e => {
                                const val = e.target.value;
                                setSelectedKeys(val ? [val] : []);
                                handleSearch(val ? [val] : [], confirm, col.id); // busca al escribir
                            }}
                            onPressEnter={() => handleSearch(selectedKeys, confirm, col.id)}
                            style={{ marginBottom: 8, display: "block" }}
                        />
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => { handleSearch(selectedKeys, confirm, col.id); close() }}
                                icon={<SearchOutlined />}
                                size="small"
                                style={{ width: 90 }}
                            >
                                Buscar
                            </Button>
                            <Button
                                onClick={() => {
                                    handleReset(clearFilters);   // limpia filtro de ant + searchText
                                    setSelectedKeys([]);          // vacía el input visualmente
                                    confirm({ closeDropdown: false }); // reaplica sin filtro
                                    setSearchedColumn("");        // saca el highlight
                                }}
                                size="small"
                                style={{ width: 90 }}
                            >
                                Limpiar
                            </Button>
                            <Button type="link" size="small" onClick={() => close()}>
                                Cerrar
                            </Button>
                        </Space>
                    </div>
                ),
                filterIcon: filtered => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
                onFilter: (value, record) => {
                    const cell = record.values.find(v => v.id_column === col.id);
                    return cell?.value?.toString().toLowerCase().includes(value.toLowerCase()) ?? false;
                },
                filterDropdownProps: {
                    onOpenChange(open) {
                        if (open) setTimeout(() => searchInput.current?.select(), 100);
                    },
                },
            };
        }

        // Tipo 2 — Número / Tipo 3 — Fecha: ordenamiento
        if (col.type === 2 || col.type === 3) {
            return {
                ...base,
                sorter: (a, b) => {
                    const cellA = a.values.find(v => v.id_column === col.id)?.value;
                    const cellB = b.values.find(v => v.id_column === col.id)?.value;
                    if (col.type === 2) return (Number(cellA) || 0) - (Number(cellB) || 0);
                    // Fecha: comparación lexicográfica (ISO) o por Date
                    return new Date(cellA) - new Date(cellB);
                },
                sortDirections: ["ascend", "descend"],
            };
        }

        // Tipo 4 — Booleano: filtro
        if (col.type === 4) {
            return {
                ...base,
                filters: [
                    { text: "✓ Sí", value: true },
                    { text: "✗ No", value: false },
                ],
                onFilter: (value, record) => {
                    const cell = record.values.find(v => v.id_column === col.id);
                    return cell?.value === value;
                },
            };
        }

        return base; // Tipo 5 — URL: sin filtro ni orden
    });
};

const buildAntRows = (rows) => {
    if (!rows) return [];
    return rows.records.map(r => ({ ...r, key: r.key }));
};

export default function TableDetail({ selectedTable, tableRows, loading }) {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, colId) => {
        confirm({ closeDropdown: false });
        setSearchText(selectedKeys[0]);
        setSearchedColumn(colId);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const searchProps = { searchText, searchedColumn, searchInput, handleSearch, handleReset };

    return (
        <Flex vertical gap={16}>
            {loading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
                <Table
                    columns={buildAntColumns(selectedTable, searchProps)}
                    dataSource={buildAntRows(tableRows)}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    scroll={{ x: "max-content" }}   // scroll horizontal cuando no entran las columnas
                    sticky={{ offsetScroll: 0 }}    // scrollbar fijada al viewport (footer)
                />
            )}
        </Flex>
    );
}