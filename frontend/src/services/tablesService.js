import { api } from "./api";

export const fetchTables = () =>
    api("/api/v1/tables/");

export const fetchTableById = (id) =>
    api(`/api/v1/tables/${id}`);

export const createTable = (payload) =>
    api("/api/v1/tables/", {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const updateTable = (id, payload) =>
    api(`/api/v1/tables/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

export const deleteTable = (id) =>
    api(`/api/v1/tables/${id}`, { method: "DELETE" });