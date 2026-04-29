import { Card, Typography, Tag, Flex, theme, Button } from "antd";
import { COLUMN_TYPES } from "../../columnTypes";

export default function SelectableCardTable({ id, tags, title, onSelect }) {
    const cardTags = tags ? tags : [];
    const { token } = theme.useToken();


    return (
        <Card
            title={<Typography.Text >{title}</Typography.Text>}
            style={{
                width: 300,
                flexShrink: 0,
                flexGrow: 1,
                border: `1px solid ${token.colorBorderDisabled}`,
                header: {
                    backgroundColor: token.colorBgContainer,
                    color: token.colorText,
                    borderBottom: `5px solid red`,
                }
            }}
            extra={<Button type="link" size="small" onClick={() => {
                onSelect(id);
            }}>Ver mas</Button>}

        >
            <Flex wrap gap={15} align="center">
                {cardTags.map((tag) => (
                    <Tag key={tag.id_column} color={COLUMN_TYPES[tag.data_type]?.color} variant="outlined">
                        {tag.name}
                    </Tag>
                ))}
            </Flex>
        </Card>

    );
}