import { useState } from "react";
import Header from "../components/header/Header.jsx";
import { Flex, theme, Button, Modal, Form, Input, Select, Divider, Tag, Skeleton, Alert, Empty } from "antd";
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import SelectableCardTable from "../components/selectableCard/SelectableCardTable.jsx";
import { COLUMN_TYPES_SELECT, COLUMN_TYPES } from "../columnTypes.js";
import TableDetail from "../components/tableDetail/TableDetail.jsx";
import { useTables, useTableDetail } from "../hooks/useTable.js";

const EMPTY_COLUMN = { nombre: "", descripcion: "", tipo: null };

export default function TablesConfigurations() {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [open, setOpen]       = useState(false);
    const [columns, setColumns] = useState([{ ...EMPTY_COLUMN }]);
    const [saving, setSaving]   = useState(false);

    const { tables, loadingTables, error, handleCreate, handleDelete } = useTables();
    const { selected, selectedTable, loadingTable, errorDetail, handleSelect, handleBack } = useTableDetail();

    const handleAddColumn    = () => setColumns(prev => [...prev, { ...EMPTY_COLUMN }]);
    const handleRemoveColumn = (i) => setColumns(prev => prev.filter((_, idx) => idx !== i));
    const handleColumnChange = (i, field, value) =>
        setColumns(prev => prev.map((col, idx) => idx === i ? { ...col, [field]: value } : col));

    const handleClose = () => {
        setOpen(false);
        form.resetFields();
        setColumns([{ ...EMPTY_COLUMN }]);
    };

const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
        await handleCreate({
            name: values.nombre,
            columns: columns.map(col => ({
                name: col.nombre,
                data_type: String(col.tipo),
                description: col.descripcion,
            })),
        });
        handleClose();
    } finally {
        setSaving(false);
    }
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

                {error && <Alert />}

                {/* Cards */}
                {!selected && (
                    loadingTables ? (
                        <Skeleton active paragraph={{ rows: 3 }} />
                    ) : tables.length === 0 ? (
                        <Empty description="No hay tablas creadas todavía" />
                    ) : (
                        <Flex wrap gap={25}>
                            {tables.map((table) => (
                                <SelectableCardTable
                                    key={table.id_table}
                                    id={table.id_table}
                                    title={table.name}
                                    tags={table.columns}
                                    onSelect={handleSelect}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </Flex>
                    )
                )}

                {/* Detalle */}
                {selected && (
                    <Flex vertical gap={16}>
                        {errorDetail && <Alert message="No se pudo cargar la tabla" type="error" showIcon />}
                        {loadingTable ? (
                            <Skeleton active paragraph={{ rows: 5 }} />
                        ) : !selectedTable ? null : (
                            <TableDetail
                                selectedTable={selectedTable}
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
                confirmLoading={saving}
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