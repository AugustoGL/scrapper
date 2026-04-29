import { api, saveTokens, clearTokens } from "./api";

export const login = async ({ email, password }) => {
    const data = await api("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
    saveTokens(data);

    window.postMessage({ type: "SAVE_TOKEN", token: data.access_token }, "*");

    return data;
};


export const register = async ({ email, password, username }) => {
    return await api("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, username }),
    });
};

export const logout = () => {
    clearTokens();
    window.postMessage({ type: "CLEAR_TOKEN" }, "*");
};