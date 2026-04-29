const API_URL = import.meta.env.VITE_API_URL;

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  console.log("STATUS:", response.status);
  console.log("RESPONSE:", text);
  
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.detail || "Error en la petición");
  }

  return data;
};
