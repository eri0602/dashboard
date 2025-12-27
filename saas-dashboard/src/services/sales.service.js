// src/services/sales.service.js
import { supabase } from "./supabase";

/**
 * Obtiene todas las órdenes del usuario autenticado
 * Incluye los items de cada orden
 */
export async function getOrders() {
    const { data, error } = await supabase
        .from("orders")
        .select(`
            id,
            user_id,
            total,
            status,
            notes,
            created_at,
            order_items (
                id,
                product_id,
                product_name,
                quantity,
                price,
                subtotal
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error al obtener órdenes:", error);
        return { data: [], error };
    }

    return { data: data || [], error: null };
}

/**
 * Obtiene una orden específica por ID
 */
export async function getOrderById(orderId) {
    const { data, error } = await supabase
        .from("orders")
        .select(`
            id,
            user_id,
            total,
            status,
            notes,
            created_at,
            order_items (
                id,
                product_id,
                product_name,
                quantity,
                price,
                subtotal
            )
        `)
        .eq("id", orderId)
        .single();

    if (error) {
        console.error("Error al obtener orden:", error);
        return { data: null, error };
    }

    return { data, error: null };
}

/**
 * Crea una nueva venta (orden)
 * - Valida stock antes de crear
 * - Descuenta stock automáticamente
 * - Registra movimientos de stock
 * - Crea evento de revenue
 */
export async function createOrder(payload) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        console.error("❌ Error de autenticación:", authError);
        return { 
            data: null, 
            error: authError || new Error("Usuario no autenticado") 
        };
    }

    // Validar que haya items
    if (!payload.items || payload.items.length === 0) {
        return {
            data: null,
            error: new Error("Debes agregar al menos un producto")
        };
    }

    // 1. Validar stock disponible para todos los productos
    for (const item of payload.items) {
        const { data: stockData } = await supabase
            .from("product_stock")
            .select("quantity")
            .eq("product_id", item.product_id)
            .single();

        const availableStock = stockData?.quantity || 0;

        if (availableStock < item.quantity) {
            const { data: product } = await supabase
                .from("products")
                .select("name")
                .eq("id", item.product_id)
                .single();

            return {
                data: null,
                error: new Error(
                    `Stock insuficiente para "${product?.name || 'producto'}". Disponible: ${availableStock}, Solicitado: ${item.quantity}`
                )
            };
        }
    }

    // 2. Crear la orden
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
            user_id: user.id,
            total: payload.total,
            status: "completed",
            notes: payload.notes || null
        }])
        .select()
        .single();

    if (orderError) {
        console.error("❌ Error al crear orden:", orderError);
        return { data: null, error: orderError };
    }

    // 3. Crear los items de la orden
    const orderItems = payload.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
    }));

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) {
        console.error("❌ Error al crear items de orden:", itemsError);
        // Rollback: eliminar la orden creada
        await supabase.from("orders").delete().eq("id", order.id);
        return { data: null, error: itemsError };
    }

    // 4. Descontar stock y registrar movimientos
    for (const item of payload.items) {
        // Obtener stock actual
        const { data: stockData } = await supabase
            .from("product_stock")
            .select("quantity, id")
            .eq("product_id", item.product_id)
            .single();

        if (stockData) {
            // Actualizar stock
            const newQuantity = stockData.quantity - item.quantity;
            
            await supabase
                .from("product_stock")
                .update({ 
                    quantity: newQuantity,
                    updated_at: new Date().toISOString()
                })
                .eq("product_id", item.product_id);

            // Registrar movimiento
            await supabase
                .from("stock_movements")
                .insert([{
                    product_id: item.product_id,
                    change: -item.quantity,
                    reason: "sale",
                    order_id: order.id
                }]);
        }
    }

    // 5. Crear evento de revenue (opcional)
    await supabase
        .from("revenue_events")
        .insert([{
            user_id: user.id,
            amount: payload.total,
            order_id: order.id
        }]);

    console.log("✅ Venta creada exitosamente:", order);

    return { data: order, error: null };
}

/**
 * Cancela una orden
 * - Devuelve el stock
 * - Actualiza el estado a "cancelled"
 */
export async function cancelOrder(orderId) {
    // Obtener la orden con sus items
    const { data: order, error: fetchError } = await getOrderById(orderId);

    if (fetchError || !order) {
        return { error: fetchError || new Error("Orden no encontrada") };
    }

    // Devolver stock de cada producto
    for (const item of order.order_items) {
        if (item.product_id) {
            const { data: stockData } = await supabase
                .from("product_stock")
                .select("quantity")
                .eq("product_id", item.product_id)
                .single();

            if (stockData) {
                const newQuantity = stockData.quantity + item.quantity;

                await supabase
                    .from("product_stock")
                    .update({ 
                        quantity: newQuantity,
                        updated_at: new Date().toISOString()
                    })
                    .eq("product_id", item.product_id);

                // Registrar movimiento
                await supabase
                    .from("stock_movements")
                    .insert([{
                        product_id: item.product_id,
                        change: item.quantity,
                        reason: "return",
                        order_id: orderId
                    }]);
            }
        }
    }

    // Actualizar estado de la orden
    const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId);

    if (updateError) {
        console.error("❌ Error al cancelar orden:", updateError);
        return { error: updateError };
    }

    console.log("✅ Orden cancelada:", orderId);
    return { error: null };
}

/**
 * Elimina una orden (solo si está cancelada)
 */
export async function deleteOrder(orderId) {
    const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

    if (error) {
        console.error("❌ Error al eliminar orden:", error);
        return { error };
    }

    console.log("✅ Orden eliminada:", orderId);
    return { error: null };
}