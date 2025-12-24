// src/services/products.service.js
import { supabase } from "./supabase";

// Obtener productos del usuario
export async function getProducts(userId) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
    }

    // Crear producto
    export async function createProduct(product) {
    const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

    if (error) throw error;
    return data;
    }

    // Actualizar producto
    export async function updateProduct(id, updates) {
    const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
    }

    // Soft delete (inactivar)
    export async function deactivateProduct(id) {
    const { error } = await supabase
        .from("products")
        .update({ status: "inactive" })
        .eq("id", id);

    if (error) throw error;
}
