import { useState, useEffect, useCallback } from "react";
import {
    fetchTables,
    fetchTableById,
    createTable,
    deleteTable,
} from "../services/tablesService.js";

export const useTables = () => {
    const [tables, setTables]               = useState([]);
    const [loadingTables, setLoadingTables] = useState(true);
    const [error, setError]                 = useState(null);

    const loadTables = useCallback(async () => {
        setLoadingTables(true);
        setError(null);
        try {
            const data = await fetchTables();
            // ✅ Corregido: soporta respuesta como array directo o wrapper { items: [...] }
            setTables(Array.isArray(data) ? data : (data.items ?? []));
        } catch (err) {
            console.error("Tables error:", err);
            setError(err.message);
        } finally {
            setLoadingTables(false);
        }
    }, []);

    useEffect(() => { loadTables(); }, [loadTables]);

    // ✅ Corregido: manejo de errores en handleCreate
    const handleCreate = async (payload) => {
        try {
            const newTable = await createTable(payload);
            setTables(prev => [...prev, newTable]);
            return newTable;
        } catch (err) {
            console.error("Create error:", err);
            setError(err.message);
            throw err; // re-lanzamos para que el caller pueda reaccionar
        }
    };

    // ✅ Corregido: manejo de errores en handleDelete
    const handleDelete = async (id) => {
        try {
            await deleteTable(id);
            setTables(prev => prev.filter(t => t.id_table !== id));
        } catch (err) {
            console.error("Delete error:", err);
            setError(err.message);
            throw err;
        }
    };

    return { tables, loadingTables, error, loadTables, handleCreate, handleDelete };
};

export const useTableDetail = () => {
    const [selected, setSelected]           = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [loadingTable, setLoadingTable]   = useState(false);
    const [errorDetail, setErrorDetail]     = useState(null);

    const handleSelect = useCallback(async (id) => {
        if (id === selected) return;
        setSelected(id);
        setSelectedTable(null);
        setLoadingTable(true);
        setErrorDetail(null);
        try {
            const table = await fetchTableById(id);
            setSelectedTable(table);
        } catch (err) {
            console.error("Table detail error:", err);
            setErrorDetail(err.message);
        } finally {
            setLoadingTable(false);
        }
    }, [selected]);

    const handleBack = () => {
        setSelected(null);
        setSelectedTable(null);
    };

    return { selected, selectedTable, loadingTable, errorDetail, handleSelect, handleBack };
};