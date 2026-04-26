import { useState, useEffect } from "react";
import Header from "../components/header/Header.jsx";
import { Flex, theme, Button, Modal, Form, Input, Select, Divider, Tag, Table, Skeleton } from "antd";
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import SelectableCardTable from "../components/selectableCard/SelectableCardTable.jsx";
import { COLUMN_TYPES_SELECT, COLUMN_TYPES } from "../columnTypes.js";
import { getTables, getTableById, getRowsByTableId } from "../../shared/mock/db.js";
import TableDetail from "../components/tableDetail/TableDetail.jsx";


const EMPTY_COLUMN = { nombre: "", descripcion: "", tipo: null };

export default function TablesConfigurations() {
    const [tables, setTables] = useState([]);
    const [loadingTables, setLoadingTables] = useState(true);
    const [selected, setSelected] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableRows, setTableRows] = useState(null);
    const [loadingTable, setLoadingTable] = useState(false);
    const [open, setOpen] = useState(false);
    const [columns, setColumns] = useState([{ ...EMPTY_COLUMN }]);
    const [form] = Form.useForm();
    const { token } = theme.useToken();

    // Carga inicial de tablas
    useEffect(() => {
        getTables().then(data => {
            setTables(data);
            setLoadingTables(false);
        });
    }, []);

    const handleSelect = async (id) => {
        if (id === selected) return;
        setSelected(id);
        setSelectedTable(null);
        setTableRows(null);
        setLoadingTable(true);
        const [table, rows] = await Promise.all([
            getTableById(id),
            getRowsByTableId(id),
        ]);
        setSelectedTable(table);
        setTableRows(rows);
        setLoadingTable(false);
    };

    const handleBack = () => {
        setSelected(null);
        setSelectedTable(null);
        setTableRows(null);
    };

    // Construye las columnas del Table de antd a partir de la estructura dinámica
    const buildAntColumns = (table) => {
        if (!table) return [];
        return table.columns.map(col => ({
            title: col.name,
            key: col.id,
            render: (_, record) => {
                const cell = record.values.find(v => v.id_column === col.id);
                if (cell === undefined) return "—";
                if (col.type === 4) return cell.value ? "✓" : "✗";
                if (col.type === 5) return <a href={cell.value} target="_blank" rel="noreferrer">Ver</a>;
                return cell.value ?? "—";
            },
        }));
    };

    const buildAntRows = (rows) => {
        if (!rows) return [];
        return rows.records.map(r => ({ ...r, key: r.key }));
    };

    const handleAddColumn = () => setColumns(prev => [...prev, { ...EMPTY_COLUMN }]);

    const handleRemoveColumn = (index) => setColumns(prev => prev.filter((_, i) => i !== index));

    const handleColumnChange = (index, field, value) => {
        setColumns(prev => prev.map((col, i) => i === index ? { ...col, [field]: value } : col));
    };

    const handleClose = () => {
        setOpen(false);
        form.resetFields();
        setColumns([{ ...EMPTY_COLUMN }]);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            console.log({ nombre: values.nombre, columns });
            handleClose();
        });
    };

    return (
        <>
            <Header title="Tablas" subtitle="Gestioná tus tablas para organizar los datos extraidos" />
            <Flex
                vertical
                style={{
                    backgroundColor: token.colorBgContainer,
                    padding: 64,
                    paddingTop: 32,
                    borderRadius: token.borderRadiusLG,
                    border: `1px solid ${token.colorBorderSecondary}`,
                }}
                gap={32}
            >
                {/* Toolbar */}
                <Flex wrap={false} justify="space-between" align="center">
                    {selected ? (
                        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                            Volver a tablas
                        </Button>
                    ) : (
                        <span />
                    )}
                    <Button icon={<PlusOutlined />} color="primary" variant="outlined" onClick={() => setOpen(true)}>
                        Agregar Tabla
                    </Button>
                </Flex>

                {/* Cards */}
                {!selected && (
                    loadingTables ? (
                        <Skeleton active paragraph={{ rows: 3 }} />
                    ) : (
                        <Flex wrap gap={25}>
                            {tables.map((table) => (
                                <SelectableCardTable
                                    id={table.id}
                                    title={table.title}
                                    tags={table.columns}
                                    onSelect={handleSelect}
                                />
                            ))}
                        </Flex>
                    )
                )}

                {/* Tabla */}
                {selected && (
                    <Flex vertical gap={16}>
                        {loadingTable ? (
                            <Skeleton active paragraph={{ rows: 5 }} />
                        ) : (
                            <TableDetail
                                selectedTable={selectedTable}
                                tableRows={tableRows}
                                loading={loadingTable}
                            />
                        )}
                    </Flex>
                )}
            </Flex>

            {/* Modal nueva tabla */}
            <Modal
                title="Nueva tabla"
                open={open}
                onCancel={handleClose}
                onOk={handleSave}
                okText="Crear tabla"
                cancelText="Cancelar"
                width={620}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        label="Nombre de la tabla"
                        name="nombre"
                        rules={[{ required: true, message: "Ingresá un nombre" }]}
                    >
                        <Input placeholder="Ej: Productos, Contactos, Órdenes..." size="large" />
                    </Form.Item>
                </Form>

                <Divider orientation="left" style={{ fontSize: 13, color: token.colorTextSecondary }}>
                    Columnas ({columns.length})
                </Divider>

                <Flex vertical gap={12}>
                    {columns.map((col, index) => (
                        <Flex
                            key={index}
                            gap={8}
                            align="flex-start"
                            style={{
                                backgroundColor: token.colorFillAlter,
                                padding: 12,
                                borderRadius: token.borderRadiusLG,
                                border: `1px solid ${token.colorBorderSecondary}`,
                            }}
                        >
                            <Flex vertical gap={8} style={{ flex: 1 }}>
                                <Flex gap={8}>
                                    <Input
                                        placeholder="Nombre"
                                        value={col.nombre}
                                        onChange={e => handleColumnChange(index, "nombre", e.target.value)}
                                        style={{ flex: 2 }}
                                    />
                                    <Select
                                        placeholder="Tipo"
                                        value={col.tipo}
                                        onChange={val => handleColumnChange(index, "tipo", val)}
                                        options={COLUMN_TYPES_SELECT}
                                        style={{ flex: 1 }}
                                        optionRender={({ label, value }) => (
                                            <Tag variant="outlined" color={COLUMN_TYPES[value]?.color}>
                                                {label}
                                            </Tag>
                                        )}
                                    />
                                </Flex>
                                <Input
                                    placeholder="Descripción (opcional)"
                                    value={col.descripcion}
                                    onChange={e => handleColumnChange(index, "descripcion", e.target.value)}
                                />
                            </Flex>
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveColumn(index)}
                                disabled={columns.length === 1}
                            />
                        </Flex>
                    ))}
                    <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddColumn} block>
                        Agregar columna
                    </Button>
                </Flex>
            </Modal>
        </>
    );
}