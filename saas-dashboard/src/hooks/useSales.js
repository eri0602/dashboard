// src/hooks/useSales.js
import { useState, useEffect, useCallback } from "react";
import * as salesService from "../services/sales.service";

export function useSales() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Cargar órdenes al montar
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);

        const { data, error: err } = await salesService.getOrders();

        if (err) {
            console.error("Error cargando órdenes:", err);
            setError(err.message || "Error al cargar órdenes");
            setOrders([]);
        } else {
            setOrders(Array.isArray(data) ? data : []);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Crear orden
    const createOrder = useCallback(async (payload) => {
        setSaving(true);
        setError(null);

        const { data, error: err } = await salesService.createOrder(payload);

        if (err) {
            console.error("Error creando orden:", err);
            setError(err.message || "Error al crear orden");
            setSaving(false);
            return { ok: false, error: err };
        }

        // Recargar órdenes
        await fetchOrders();
        setSaving(false);
        return { ok: true, data };
    }, [fetchOrders]);

    // Cancelar orden
    const cancelOrder = useCallback(async (orderId) => {
        setSaving(true);
        setError(null);

        const { error: err } = await salesService.cancelOrder(orderId);

        if (err) {
            console.error("Error cancelando orden:", err);
            setError(err.message || "Error al cancelar orden");
            setSaving(false);
            return { ok: false, error: err };
        }

        // Recargar órdenes
        await fetchOrders();
        setSaving(false);
        return { ok: true };
    }, [fetchOrders]);

    // Eliminar orden
    const deleteOrder = useCallback(async (orderId) => {
        setSaving(true);
        setError(null);

        const { error: err } = await salesService.deleteOrder(orderId);

        if (err) {
            console.error("Error eliminando orden:", err);
            setError(err.message || "Error al eliminar orden");
            setSaving(false);
            return { ok: false, error: err };
        }

        // Eliminar de la lista local
        setOrders(prev => prev.filter(o => o.id !== orderId));
        setSaving(false);
        return { ok: true };
    }, []);

    return {
        orders,
        loading,
        saving,
        error,
        createOrder,
        cancelOrder,
        deleteOrder,
        refetch: fetchOrders
    };
}