import { Card, Typography, Avatar, Flex, Grid, theme } from "antd";

const { useBreakpoint } = Grid;

export default function SelectableCard({ icon, name, company, value, color, selected, onSelect }) {
    const isActive = selected === value;
    const { token } = theme.useToken();


    return (
        <Card
            onClick={() => onSelect(value)}
            hoverable
            style={{
                cursor: "pointer",
                flexGrow: 1,
                textAlign: "center",
                boxShadow: isActive ? `0 0 5px ${color}` : "none",
                border: isActive ? `1px solid transparent` : `1px solid ${token.colorBorderDisabled}`,
            }}
        >
            <Flex justify="space-evenly" align="center">
                <Avatar
                    size={{ lg: 40, xl: 64, xxl: 80 }}
                    icon={icon}
                    style={{ backgroundColor: isActive ? color : null }}
                />

                <div>
                    <Typography.Title disabled={isActive ? false : true} style={{ margin: 0 }} level={4}>
                        {name}
                    </Typography.Title>

                    <Typography.Text italic disabled={isActive ? false : true} >
                        {company}
                    </Typography.Text>
                </div>
            </Flex>
        </Card>
    );
}