import { Card, Typography, Tag, Flex, theme, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { COLUMN_TYPES } from "../../columnTypes";

// ✅ Corregido: agregado onDelete a las props
export default function SelectableCardTable({ id, tags, title, onSelect, onDelete }) {
    const cardTags = tags ? tags : [];
    const { token } = theme.useToken();

    return (
        <Card
            title={<Typography.Text>{title}</Typography.Text>}
            style={{
                width: 300,
                flexShrink: 0,
                flexGrow: 1,
                border: `1px solid ${token.colorBorderDisabled}`,
            }}
            extra={
                <Flex gap={4} align="center">
                    {/* ✅ Agregado: botón eliminar con confirmación */}
                    <Popconfirm
                        title="¿Eliminar tabla?"
                        description="Esta acción no se puede deshacer."
                        onConfirm={() => onDelete(id)}
                        okText="Eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                    <Button type="link" size="small" onClick={() => onSelect(id)}>
                        Ver más
                    </Button>
                </Flex>
            }
        >
            <Flex wrap gap={15} align="center">
                {cardTags.map((tag) => (
                    <Tag
                        key={tag.id_column}
                        color={COLUMN_TYPES[tag.data_type]?.color}
                        variant="outlined"
                    >
                        {tag.name}
                    </Tag>
                ))}
            </Flex>
        </Card>
    );
}