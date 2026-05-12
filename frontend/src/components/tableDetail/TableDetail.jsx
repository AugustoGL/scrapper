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
            // ✅ Corregido: col.id → col.id_column
            key: col.id_column,
            dataIndex: col.id_column,
            render: (_, record) => {
                // ✅ Corregido: col.id → col.id_column
                const cell = record.values.find(v => v.id_column === col.id_column);
                if (cell === undefined) return "—";
                // ✅ Corregido: col.type → col.data_type (comparar con string)
                if (col.data_type === "4") return cell.value ? "✓" : "✗";
                if (col.data_type === "5") return <a href={cell.value} target="_blank" rel="noreferrer">Ver</a>;
                return cell.value ?? "—";
            },
        };

        // Tipo 1 — Texto: buscador
        if (col.data_type === "1") {
            return {
                ...base,
                render: (_, record) => {
                    const cell = record.values.find(v => v.id_column === col.id_column);
                    const text = cell?.value ?? "";
                    return searchedColumn === col.id_column ? (
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
                                handleSearch(val ? [val] : [], confirm, col.id_column);
                            }}
                            onPressEnter={() => handleSearch(selectedKeys, confirm, col.id_column)}
                            style={{ marginBottom: 8, display: "block" }}
                        />
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => { handleSearch(selectedKeys, confirm, col.id_column); close(); }}
                                icon={<SearchOutlined />}
                                size="small"
                                style={{ width: 90 }}
                            >
                                Buscar
                            </Button>
                            <Button
                                onClick={() => {
                                    handleReset(clearFilters);
                                    setSelectedKeys([]);
                                    confirm({ closeDropdown: false });
                                    setSearchedColumn("");
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
                    const cell = record.values.find(v => v.id_column === col.id_column);
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
        if (col.data_type === "2" || col.data_type === "3") {
            return {
                ...base,
                sorter: (a, b) => {
                    const cellA = a.values.find(v => v.id_column === col.id_column)?.value;
                    const cellB = b.values.find(v => v.id_column === col.id_column)?.value;
                    if (col.data_type === "2") return (Number(cellA) || 0) - (Number(cellB) || 0);
                    return new Date(cellA) - new Date(cellB);
                },
                sortDirections: ["ascend", "descend"],
            };
        }

        // Tipo 4 — Booleano: filtro
        if (col.data_type === "4") {
            return {
                ...base,
                filters: [
                    { text: "✓ Sí", value: true },
                    { text: "✗ No", value: false },
                ],
                onFilter: (value, record) => {
                    const cell = record.values.find(v => v.id_column === col.id_column);
                    return cell?.value === value;
                },
            };
        }

        return base;
    });
};

// ✅ Corregido: recibe el array directo, usa id_record como key
const buildAntRows = (records) => {
    if (!records || !Array.isArray(records)) return [];
    return records.map(r => ({ ...r, key: r.id_record }));
};

// ✅ Corregido: ya no recibe tableRows como prop separada — los records vienen dentro de selectedTable
export default function TableDetail({ selectedTable, loading }) {
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
                    // ✅ Corregido: selectedTable.records en lugar de tableRows.records
                    dataSource={buildAntRows(selectedTable?.records)}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    scroll={{ x: "max-content" }}
                    sticky={{ offsetScroll: 0 }}
                />
            )}
        </Flex>
    );
}