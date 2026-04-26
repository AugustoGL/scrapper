// pages/Register.jsx
import { useState } from "react";
import { Flex, Form, Input, Button, Divider, Typography, theme, Steps } from "antd";
import { GoogleOutlined, RocketOutlined, MailOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const STEPS = ["Cuenta", "Verificación"];

export default function Register() {
    const { token } = theme.useToken();
    const [step, setStep]       = useState(0);
    const [loading, setLoading] = useState(false);
    const [email, setEmail]     = useState("");
    const [form]                = Form.useForm();
    const [codeForm]            = Form.useForm();

    const handleRegister = (values) => {
        setLoading(true);
        setEmail(values.email);
        setTimeout(() => {
            setLoading(false);
            setStep(1);
        }, 1500);
    };

    const handleVerify = (values) => {
        setLoading(true);
        console.log("Código ingresado:", values.code);
        setTimeout(() => setLoading(false), 1500);
    };

    const handleResend = () => {
        console.log("Reenviar código a", email);
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
                        Crear cuenta
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        Empezá gratis, sin tarjeta requerida
                    </Typography.Text>
                </Flex>

                {/* Steps */}
                <Steps
                    size="small"
                    current={step}
                    items={STEPS.map(s => ({ title: s }))}
                />

                {/* Step 0 — Datos */}
                {step === 0 && (
                    <>
                        <Button size="large" icon={<GoogleOutlined />} block>
                            Continuar con Google
                        </Button>

                        <Divider style={{ margin: 0 }}>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                o completá el formulario
                            </Typography.Text>
                        </Divider>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleRegister}
                            requiredMark={false}
                        >
                            <Form.Item
                                label="Nombre"
                                name="name"
                                rules={[{ required: true, message: "Ingresá tu nombre" }]}
                            >
                                <Input
                                    size="large"
                                    placeholder="Tu nombre"
                                    prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Ingresá tu email" },
                                    { type: "email",  message: "Email inválido" },
                                ]}
                            >
                                <Input
                                    size="large"
                                    placeholder="tu@email.com"
                                    prefix={<MailOutlined style={{ color: token.colorTextTertiary }} />}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Contraseña"
                                name="password"
                                rules={[
                                    { required: true,  message: "Ingresá una contraseña" },
                                    { min: 8,          message: "Mínimo 8 caracteres" },
                                ]}
                            >
                                <Input.Password
                                    size="large"
                                    placeholder="Mínimo 8 caracteres"
                                    prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Confirmar contraseña"
                                name="confirm"
                                dependencies={["password"]}
                                rules={[
                                    { required: true, message: "Confirmá tu contraseña" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject("Las contraseñas no coinciden");
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    size="large"
                                    placeholder="Repetí tu contraseña"
                                    prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    block
                                    loading={loading}
                                >
                                    Crear cuenta
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {/* Step 1 — Verificación */}
                {step === 1 && (
                    <Flex vertical gap={24}>
                        <Flex vertical align="center" gap={8}>
                            <Flex
                                align="center"
                                justify="center"
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: "50%",
                                    backgroundColor: token.colorPrimaryBg,
                                    fontSize: 26,
                                    color: token.colorPrimary,
                                }}
                            >
                                <MailOutlined />
                            </Flex>
                            <Typography.Text strong style={{ fontSize: 15 }}>
                                Revisá tu bandeja de entrada
                            </Typography.Text>
                            <Typography.Text type="secondary" style={{ textAlign: "center", fontSize: 13 }}>
                                Enviamos un código de 6 dígitos a{" "}
                                <Typography.Text strong>{email}</Typography.Text>
                            </Typography.Text>
                        </Flex>

                        <Form
                            form={codeForm}
                            layout="vertical"
                            onFinish={handleVerify}
                            requiredMark={false}
                        >
                            <Form.Item
                                label="Código de verificación"
                                name="code"
                                rules={[
                                    { required: true, message: "Ingresá el código" },
                                    { len: 6,         message: "El código tiene 6 dígitos" },
                                ]}
                            >
                                <Input
                                    size="large"
                                    placeholder="000000"
                                    maxLength={6}
                                    style={{ letterSpacing: 8, textAlign: "center", fontSize: 20 }}
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    block
                                    loading={loading}
                                >
                                    Verificar email
                                </Button>
                            </Form.Item>
                        </Form>

                        <Flex justify="center" gap={4}>
                            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                                ¿No te llegó?
                            </Typography.Text>
                            <Typography.Link style={{ fontSize: 13 }} onClick={handleResend}>
                                Reenviar código
                            </Typography.Link>
                        </Flex>
                    </Flex>
                )}

                <Typography.Text type="secondary" style={{ textAlign: "center", fontSize: 13 }}>
                    ¿Ya tenés cuenta?{" "}
                    <Link to="/login">
                        <Typography.Link>Ingresá</Typography.Link>
                    </Link>
                </Typography.Text>
            </Flex>
        </Flex>
    );
}