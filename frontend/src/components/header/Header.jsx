import { Typography, Divider } from "antd";


export default function Header({title, subtitle}) {

    return (
        <>
            <Typography.Title level={1} style={{ margin: 0 }}>{title}</Typography.Title>
            <Typography.Text >{subtitle}</Typography.Text>
            <Divider />
        </>
    );
}