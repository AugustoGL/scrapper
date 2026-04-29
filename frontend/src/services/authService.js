import { api } from "./api";

export const register = async ({ email, password, username }) => {
  return await api("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, username }),
  });
};

export const login = async ({ email, password }) => {
  const data = await api("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);

  return data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
