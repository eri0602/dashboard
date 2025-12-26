import { useCallback, useEffect, useState } from "react";
import { createProduct as apiCreateProduct, getProducts as apiGetProducts } from "../services/products.service";

export function useProducts() {
    const [products, setProducts] = useState([]); // SIEMPRE array
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const refresh = useCallback(async () => {
        setLoading(true);
        setError("");

        const { data, error: err } = await apiGetProducts();

        if (err) {
        setError(err.message || "No se pudieron cargar los productos");
        setProducts([]);
        } else {
        setProducts(Array.isArray(data) ? data : []);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const createProduct = useCallback(async (payload) => {
        setSaving(true);
        setError("");

        const { data, error: err } = await apiCreateProduct(payload);

        if (err) {
        setError(err.message || "No se pudo crear el producto");
        setSaving(false);
        return { ok: false, error: err };
        }

        // opción rápida: insertar al inicio (sin esperar recarga)
        setProducts((prev) => [data, ...(Array.isArray(prev) ? prev : [])]);

        setSaving(false);
        return { ok: true, data };
    }, []);

    return { products, loading, saving, error, refresh, createProduct };
}
