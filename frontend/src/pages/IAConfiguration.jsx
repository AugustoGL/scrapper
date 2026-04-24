import { useState, useEffect } from "react";
import { Flex, Space, theme, Input, Button, Select, InputNumber, message, Typography } from "antd";
import SelectableCard from "../components/selectableCard/SelectableCard.jsx";
import { Icon } from '@iconify/react';
import Header from "../components/header/Header.jsx";
import { useProviderModels } from "../hooks/useProviderModels.js";

export default function IAConfiguration() {
    const [selected, setSelected] = useState("gemini");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [confirmedKey, setConfirmedKey] = useState("");
    const [model, setModel] = useState(null);
    const [maxTokens, setMaxTokens] = useState(4000);
    const [instructions, setInstructions] = useState("");
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [isValid, setIsValid] = useState(false);
    const { models, loading, error } = useProviderModels(selected, confirmedKey);
    const [testStart, setTestStart] = useState(0);
    const [testLoading, setTestLoading] = useState(false);

    const handleProviderChange = (value) => {
        setSelected(value);
        setModel(null);
        setConfirmedKey("");
        setApiKey("");
        setIsValid(false);
    };

    const handleTest = () => {
        setTestStart(Date.now());
        setTestLoading(true);
        setConfirmedKey(apiKey);
    };

    useEffect(() => {
        if (!confirmedKey) return;
        if (loading) return;

        const elapsed = Date.now() - testStart;
        const remaining = Math.max(1500 - elapsed, 0);

        const timer = setTimeout(() => {
            if (error) {
                messageApi.error(`API Key inválida: ${error}`);
                setIsValid(false);
            } else if (models.length > 0) {
                messageApi.success("API Key válida — modelos cargados correctamente");
                setIsValid(true);
            }
            setTestLoading(false);
        }, remaining);

        return () => clearTimeout(timer);
    }, [loading, error, models, confirmedKey]);

    return (
        <>
            {contextHolder}
            <Header title="Configuracion" subtitle="Elige tu proveedor de IA y configura tu API Key" />
            <Flex
                vertical
                style={{
                    backgroundColor: token.colorBgContainer,
                    padding: 64,
                    borderRadius: token.borderRadiusLG,
                    border: `1px solid ${token.colorBorderSecondary}`,
                }}
                gap={32}
            >
                <Flex wrap gap={16}>
                    <SelectableCard
                        icon={<Icon icon="simple-icons:openai" />}
                        name="ChatGPT"
                        company="OpenAI"
                        value="gpt"
                        color={'#10A37F'}
                        selected={selected}
                        onSelect={handleProviderChange}
                    />
                    <SelectableCard
                        icon={<Icon icon="simple-icons:claude" />}
                        name="Claude"
                        company="Anthropic"
                        value="claude"
                        color={'#D97706'}
                        selected={selected}
                        onSelect={handleProviderChange}
                    />
                    <SelectableCard
                        icon={<Icon icon="simple-icons:google" />}
                        name="Gemini"
                        company="Google"
                        value="gemini"
                        color={'#4285F4'}
                        selected={selected}
                        onSelect={handleProviderChange}
                    />
                </Flex>

                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        type={passwordVisible ? "text" : "password"}
                        autoComplete="off"
                        readOnly
                        onFocus={e => e.target.removeAttribute("readonly")}
                        name="api-key-field-x"
                        placeholder="API Key del proveedor seleccionado"
                        value={apiKey}
                        onChange={e => {
                            setApiKey(e.target.value);
                            setIsValid(false);
                        }}
                        size="large"
                        suffix={
                            <Icon
                                icon={passwordVisible ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                                style={{ cursor: "pointer", fontSize: 16 }}
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            />
                        }
                    />
                    <Button
                        loading={loading || testLoading}
                        disabled={!apiKey.trim() || isValid}
                        onClick={handleTest}
                        size="large"
                        type="primary"
                    >
                        Probar API Key
                    </Button>
                </Space.Compact>

                <Flex gap={16} wrap>
                    <Select
                        style={{ flex: 3, minWidth: 200 }}
                        size="large"
                        placeholder={
                            !confirmedKey ? "Primero ingresá tu API Key" :
                            loading ? "Cargando modelos..." :
                            error ? "Error al cargar modelos" :
                            "Seleccioná un modelo"
                        }
                        value={model}
                        onChange={setModel}
                        options={models}
                        loading={loading}
                        disabled={!confirmedKey || loading || !!error}
                    />
                    <InputNumber
                        style={{ flex: 1, minWidth: 120 }}
                        size="large"
                        min={256}
                        max={128000}
                        step={256}
                        value={maxTokens}
                        onChange={val => setMaxTokens(val ?? 1024)}
                        formatter={val => Number(val).toLocaleString()}
                        parser={val => val.replace(/\D/g, "")}
                        addonBefore="Max tokens"
                    />
                </Flex>

                <Flex vertical gap={8}>
                    <Flex justify="space-between" align="baseline">
                        <Typography.Text type="secondary">Instrucciones generales</Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {instructions.length} caracteres
                        </Typography.Text>
                    </Flex>
                    <Input.TextArea
                        placeholder="Ej: Siempre respondé en español. Sé conciso y directo. Evitá usar markdown salvo que se pida explícitamente..."
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                        autoSize={{ minRows: 4, maxRows: 10 }}
                        showCount={false}
                        maxLength={4000}
                    />
                    <Typography.Text type="secondary" style={{ fontSize: 12 }} >
                        Estas instrucciones se envían como prompt en cada conversación.
                    </Typography.Text>
                </Flex>

                <Button
                    type="primary"
                    size="large"
                    disabled={!model || !confirmedKey}
                    style={{ alignSelf: "flex-start" }}
                >
                    Guardar perfil
                </Button>
            </Flex>
        </>
    );
}