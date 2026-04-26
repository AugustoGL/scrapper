// pages/Login.jsx
import { useState } from "react";
import { Flex, Form, Input, Button, Divider, Typography, theme } from "antd";
import { GoogleOutlined, RocketOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function Login() {
    const { token } = theme.useToken();
    const [loading, setLoading] = useState(false);

    const handleLogin = (values) => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
        console.log(values);
    };

    return (
        <Flex style={{ minHeight: "100vh", backgroundColor: token.colorBgLayout }} align="center" justify="center">
            <Flex
                vertical
                gap={32}
                style={{
                    width: "100%",
                    maxWidth: 420,
                    backgroundColor: token.colorBgContainer,
                    padding: 48,
                    borderRadius: token.borderRadiusLG,
                    border: `1px solid ${token.colorBorderSecondary}`,
                }}
            >
                {/* Logo */}
                <Flex vertical align="center" gap={8}>
                    <Flex
                        align="center"
                        justify="center"
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: token.borderRadiusLG,
                            backgroundColor: token.colorPrimary,
                            fontSize: 22,
                            color: "#fff",
                        }}
                    >
                        <RocketOutlined />
                    </Flex>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Bienvenido
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        Ingresá a tu cuenta para continuar
                    </Typography.Text>
                </Flex>

                {/* Google */}
                <Button size="large" icon={<GoogleOutlined />} block>
                    Continuar con Google
                </Button>

                <Divider style={{ margin: 0 }}>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        o ingresá con tu email
                    </Typography.Text>
                </Divider>

                {/* Form */}
                <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Ingresá tu email" },
                            { type: "email",  message: "Email inválido" },
                        ]}
                    >
                        <Input size="large" placeholder="tu@email.com" />
                    </Form.Item>

                    <Form.Item
                        label={
                            <Flex justify="space-between" style={{ width: "100%" }}>
                                <span>Contraseña</span>
                                <Typography.Link style={{ fontSize: 13 }}>
                                    ¿Olvidaste tu contraseña?
                                </Typography.Link>
                            </Flex>
                        }
                        name="password"
                        rules={[{ required: true, message: "Ingresá tu contraseña" }]}
                    >
                        <Input.Password size="large" placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            block
                            loading={loading}
                        >
                            Ingresar
                        </Button>
                    </Form.Item>
                </Form>

                <Typography.Text type="secondary" style={{ textAlign: "center", fontSize: 13 }}>
                    ¿No tenés cuenta?{" "}
                    <Link to="/register">
                        <Typography.Link>Registrate</Typography.Link>
                    </Link>
                </Typography.Text>
            </Flex>
        </Flex>
    );
}