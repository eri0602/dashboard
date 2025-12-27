// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from "react";
import * as productsService from "../services/products.service";

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Cargar productos al montar
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        const { data, error: err } = await productsService.getProducts();

        if (err) {
            console.error("Error loading products:", err);
            setError(err.message || "Error al cargar productos");
            setProducts([]);
        } else {
            setProducts(Array.isArray(data) ? data : []);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Crear producto
    const createProduct = useCallback(async (payload) => {
        setSaving(true);
        setError(null);

        const { data, error: err } = await productsService.createProduct(payload);

        if (err) {
            console.error("Error creating product:", err);
            setError(err.message || "Error al crear producto");
            setSaving(false);
            return { ok: false, error: err };
        }

        // Agregar el nuevo producto a la lista
        setProducts((prev) => [data, ...prev]);
        setSaving(false);
        return { ok: true, data };
    }, []);

    // Actualizar producto
    const updateProduct = useCallback(async (id, payload) => {
        setSaving(true);
        setError(null);

        const { data, error: err } = await productsService.updateProduct(id, payload);

        if (err) {
            console.error("Error updating product:", err);
            setError(err.message || "Error al actualizar producto");
            setSaving(false);
            return { ok: false, error: err };
        }

        // Actualizar el producto en la lista
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? data : p))
        );
        setSaving(false);
        return { ok: true, data };
    }, []);

    // Eliminar producto
    const deleteProduct = useCallback(async (id) => {
        setSaving(true);
        setError(null);

        const { error: err } = await productsService.deleteProduct(id);

        if (err) {
            console.error("Error deleting product:", err);
            setError(err.message || "Error al eliminar producto");
            setSaving(false);
            return { ok: false, error: err };
        }

        // Eliminar el producto de la lista
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setSaving(false);
        return { ok: true };
    }, []);

    return {
        products,
        loading,
        saving,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        refetch: fetchProducts,
    };
}