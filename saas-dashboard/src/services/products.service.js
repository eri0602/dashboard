// src/services/products.service.js
import { supabase } from "./supabase";

/**
 * Obtiene todos los productos del usuario autenticado
 * Incluye categoría y stock con LEFT JOIN
 */
export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            user_id,
            name,
            description,
            price,
            status,
            category_id,
            created_at,
            categories:category_id (
                id,
                name
            ),
            product_stock (
                quantity
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
        return { data: [], error };
    }

    // Mapear los datos para facilitar el uso
    const mappedData = (data || []).map(product => ({
        ...product,
        category_name: product.categories?.name || "Sin categoría",
        stock: product.product_stock?.[0]?.quantity || 0,
    }));

    return { data: mappedData, error: null };
}

/**
 * Obtiene todas las categorías del usuario
 */
export async function getCategories() {
    const { data, error } = await supabase
        .from("categories")
        .select("id, name, status")
        .eq("status", "active")
        .order("name", { ascending: true });

    return { data: data ?? [], error };
}

/**
 * Crea un nuevo producto
 */
export async function createProduct(payload) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        console.error("❌ Error de autenticación:", authError);
        return { 
            data: null, 
            error: authError || new Error("Usuario no autenticado") 
        };
    }

    const body = {
        user_id: user.id,
        name: payload.name,
        description: payload.description ?? null,
        price: Number(payload.price ?? 0),
        status: payload.status ?? "active",
        category_id: payload.category_id || null,
    };

    const { data, error } = await supabase
        .from("products")
        .insert([body])
        .select(`
            id,
            user_id,
            name,
            description,
            price,
            status,
            category_id,
            created_at,
            categories:category_id (
                id,
                name
            )
        `)
        .single();

    if (error) {
        console.error("❌ Error al crear:", error);
        return { data: null, error };
    }

    // Si se especificó stock inicial, crearlo
    if (payload.initial_stock !== undefined && Number(payload.initial_stock) >= 0) {
        const { error: stockError } = await supabase
            .from("product_stock")
            .insert([{
                product_id: data.id,
                quantity: Number(payload.initial_stock),
            }]);

        if (stockError) {
            console.error("⚠️ Error al crear stock:", stockError);
        }
    }

    console.log("✅ Producto creado:", data);
    
    // Mapear datos
    const mappedData = {
        ...data,
        category_name: data.categories?.name || "Sin categoría",
        stock: payload.initial_stock || 0,
    };

    return { data: mappedData, error: null };
}

/**
 * Actualiza un producto existente
 */
export async function updateProduct(id, payload) {
    const body = {};

    if (payload.name !== undefined) body.name = payload.name;
    if (payload.description !== undefined) body.description = payload.description;
    if (payload.price !== undefined) body.price = Number(payload.price);
    if (payload.status !== undefined) body.status = payload.status;
    if (payload.category_id !== undefined) body.category_id = payload.category_id || null;

    const { data, error } = await supabase
        .from("products")
        .update(body)
        .eq("id", id)
        .select(`
            id,
            user_id,
            name,
            description,
            price,
            status,
            category_id,
            created_at,
            categories:category_id (
                id,
                name
            ),
            product_stock (
                quantity
            )
        `)
        .single();

    if (error) {
        console.error("❌ Error al actualizar:", error);
        return { data: null, error };
    }

    // Actualizar stock si se especificó
    if (payload.stock !== undefined) {
        await updateStock(id, Number(payload.stock));
    }

    console.log("✅ Producto actualizado:", data);
    
    // Mapear datos
    const mappedData = {
        ...data,
        category_name: data.categories?.name || "Sin categoría",
        stock: payload.stock !== undefined ? Number(payload.stock) : (data.product_stock?.[0]?.quantity || 0),
    };

    return { data: mappedData, error: null };
}

/**
 * Elimina un producto
 */
export async function deleteProduct(id) {
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("❌ Error al eliminar:", error);
        return { error };
    }

    console.log("✅ Producto eliminado:", id);
    return { error: null };
}

/**
 * Actualiza el stock de un producto
 */
export async function updateStock(productId, newQuantity) {
    // Primero verificar si existe un registro de stock
    const { data: existingStock } = await supabase
        .from("product_stock")
        .select("id")
        .eq("product_id", productId)
        .single();

    if (existingStock) {
        // Actualizar
        const { error } = await supabase
            .from("product_stock")
            .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
            .eq("product_id", productId);

        return { error };
    } else {
        // Crear
        const { error } = await supabase
            .from("product_stock")
            .insert([{ product_id: productId, quantity: newQuantity }]);

        return { error };
    }
}


/**
 * Crea una nueva categoría
 */
export async function createCategory(name) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        console.error("❌ Error de autenticación:", authError);
        return { 
            data: null, 
            error: authError || new Error("Usuario no autenticado") 
        };
    }

    // Verificar si ya existe una categoría con ese nombre
    const { data: existing } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", user.id)
        .ilike("name", name.trim())
        .single();

    if (existing) {
        return { 
            data: null, 
            error: new Error("Ya existe una categoría con ese nombre") 
        };
    }

    const { data, error } = await supabase
        .from("categories")
        .insert([{
            user_id: user.id,
            name: name.trim(),
            status: "active"
        }])
        .select()
        .single();

    if (error) {
        console.error("❌ Error al crear categoría:", error);
        return { data: null, error };
    }

    console.log("✅ Categoría creada:", data);
    return { data, error: null };
}