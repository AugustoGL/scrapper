const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const getTokens = () => ({
    access:  sessionStorage.getItem("access_token"),
    refresh: sessionStorage.getItem("refresh_token"),
});

export const saveTokens = ({ access_token, refresh_token }) => {
    sessionStorage.setItem("access_token", access_token);
    sessionStorage.setItem("refresh_token", refresh_token);
};

export const clearTokens = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
};

export const api = async (endpoint, options = {}) => {
    const { access } = getTokens();

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(access && { Authorization: `Bearer ${access}` }),
            ...options.headers,
        },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        throw new Error(data.detail || "Error en la petición");
    }

    return data;
};