import { supabase } from "../lib/supabaseClient";

export async function getProducts() {
  // Si no hay usuario logueado, devolvemos array vacío (evita romper la UI)
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;

    if (!user) return { data: [], error: null };

    const { data, error } = await supabase
        .from("products")
        .select("id, name, description, price, status, created_at, category_id")
        .order("created_at", { ascending: false });

    return { data: Array.isArray(data) ? data : [], error };
    }

    export async function createProduct(payload) {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;

    if (!user) {
        return { data: null, error: { message: "No hay sesión. Inicia sesión para crear productos." } };
    }

    // Importante: NO mandes user_id si tu tabla lo llena con default auth.uid()
    const insertPayload = {
        name: payload.name?.trim(),
        description: payload.description?.trim() || null,
        price: Number(payload.price ?? 0),
        status: payload.status ?? "active",
        category_id: payload.category_id ?? null,
    };

    const { data, error } = await supabase
        .from("products")
        .insert(insertPayload)
        .select("id, name, description, price, status, created_at, category_id")
        .single();

    return { data, error };
}
