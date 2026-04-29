import { useState, useEffect, useCallback } from "react";
import { fetchTables, fetchTableById, createTable, deleteTable } from "../services/tablesService.js";
export const useTables = () => {
    const [tables, setTables]               = useState([]);
    const [loadingTables, setLoadingTables] = useState(true);
    const [error, setError]                 = useState(null);

const loadTables = useCallback(async () => {
    setLoadingTables(true);
    setError(null);
    try {
        const data = await fetchTables();
        console.log("Tables response:", data);
        setTables(data);
    } catch (err) {
        console.error("Tables error:", err);
        setError(err.message);
    } finally {
        setLoadingTables(false);
    }
}, []);

    useEffect(() => { loadTables(); }, [loadTables]);

    const handleCreate = async (payload) => {
        const newTable = await createTable(payload);
        setTables(prev => [...prev, newTable]);
        return newTable;
    };

    const handleDelete = async (id) => {
        await deleteTable(id);
        setTables(prev => prev.filter(t => t.id_table !== id));
    };

    return { tables, loadingTables, error, handleCreate, handleDelete };
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