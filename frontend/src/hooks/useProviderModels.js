// hooks/useProviderModels.js
import { useState, useEffect } from "react";

const MODEL_ENDPOINTS = {
    gpt: {
        url: "https://api.openai.com/v1/models",
        headers: (apiKey) => ({ Authorization: `Bearer ${apiKey}` }),
        parse: (data) =>
            data.data
                .filter((m) => m.id.startsWith("gpt"))
                .map((m) => ({ label: m.id, value: m.id })),
    },
    claude: {
        url: "https://api.anthropic.com/v1/models",
        headers: (apiKey) => ({
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
        }),
        parse: (data) =>
            data.data.map((m) => ({ label: m.display_name ?? m.id, value: m.id })),
    },
    gemini: {
        url: "https://generativelanguage.googleapis.com/v1beta/models",
        headers: () => ({}),
        buildUrl: (apiKey) =>
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        parse: (data) =>
            data.models
                .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
                .map((m) => ({
                    label: m.displayName,
                    value: m.name.replace("models/", ""),
                })),
    },
};

export function useProviderModels(provider, apiKey) {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!provider || !apiKey?.trim()) {
            setModels([]);
            return;
        }

        const config = MODEL_ENDPOINTS[provider];
        if (!config) return;

        const controller = new AbortController();

        const fetchModels = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = config.buildUrl ? config.buildUrl(apiKey) : config.url;
                const res = await fetch(url, {
                    headers: config.headers(apiKey),
                    signal: controller.signal,
                });

                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

                const data = await res.json();
                setModels(config.parse(data));
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                    setModels([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchModels();

        return () => controller.abort();
    }, [provider, apiKey]);

    return { models, loading, error };
}