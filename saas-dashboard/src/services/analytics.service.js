// src/services/analytics.service.js
import { supabase } from "./supabase";

/**
 * Obtiene las ventas en un rango de fechas
 */
export async function getSalesData(startDate, endDate) {
    const { data, error } = await supabase
        .from("orders")
        .select("id, total, status, created_at")
        .eq("status", "completed")
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching sales:", error);
        return { data: [], error };
    }

    return { data: data || [], error: null };
}

/**
 * Obtiene productos más vendidos
 */
export async function getTopProducts(startDate, endDate, limit = 10) {
    const { data, error } = await supabase
        .from("order_items")
        .select(`
            product_id,
            product_name,
            quantity,
            subtotal,
            orders!inner (
                created_at,
                status
            )
        `)
        .gte("orders.created_at", startDate)
        .lte("orders.created_at", endDate)
        .eq("orders.status", "completed");

    if (error) {
        console.error("Error fetching top products:", error);
        return { data: [], error };
    }

    // Agrupar por producto
    const productMap = {};
    
    (data || []).forEach(item => {
        const productId = item.product_id || item.product_name;
        
        if (!productMap[productId]) {
            productMap[productId] = {
                id: productId,
                name: item.product_name,
                totalQuantity: 0,
                totalRevenue: 0,
            };
        }
        
        productMap[productId].totalQuantity += item.quantity;
        productMap[productId].totalRevenue += Number(item.subtotal);
    });

    // Convertir a array y ordenar
    const topProducts = Object.values(productMap)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, limit);

    return { data: topProducts, error: null };
}

/**
 * Obtiene ventas por categoría
 */
export async function getSalesByCategory(startDate, endDate) {
    const { data, error } = await supabase
        .from("order_items")
        .select(`
            quantity,
            subtotal,
            product_id,
            products!inner (
                id,
                name,
                category_id,
                categories (
                    id,
                    name
                )
            ),
            orders!inner (
                created_at,
                status
            )
        `)
        .gte("orders.created_at", startDate)
        .lte("orders.created_at", endDate)
        .eq("orders.status", "completed");

    if (error) {
        console.error("Error fetching sales by category:", error);
        return { data: [], error };
    }

    // Agrupar por categoría
    const categoryMap = {};
    
    (data || []).forEach(item => {
        const categoryName = item.products?.categories?.name || "Sin categoría";
        
        if (!categoryMap[categoryName]) {
            categoryMap[categoryName] = {
                name: categoryName,
                totalQuantity: 0,
                totalRevenue: 0,
            };
        }
        
        categoryMap[categoryName].totalQuantity += item.quantity;
        categoryMap[categoryName].totalRevenue += Number(item.subtotal);
    });

    return { data: Object.values(categoryMap), error: null };
}

/**
 * Obtiene estado del stock con alertas
 */
export async function getStockAnalytics() {
    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            price,
            status,
            categories:category_id (
                name
            ),
            product_stock (
                quantity
            )
        `)
        .eq("status", "active");

    if (error) {
        console.error("Error fetching stock analytics:", error);
        return { data: [], error };
    }

    // Mapear y clasificar
    const stockData = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        category: product.categories?.name || "Sin categoría",
        stock: product.product_stock?.[0]?.quantity || 0,
        status: product.product_stock?.[0]?.quantity === 0 
            ? "out_of_stock" 
            : product.product_stock?.[0]?.quantity < 10 
            ? "low_stock" 
            : "in_stock",
    }));

    return { data: stockData, error: null };
}

/**
 * Obtiene KPIs generales
 */
export async function getKPIs(startDate, endDate) {
    // Ventas totales
    const { data: salesData } = await getSalesData(startDate, endDate);
    
    const totalRevenue = salesData.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = salesData.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Productos con bajo stock
    const { data: stockData } = await getStockAnalytics();
    const lowStockCount = stockData.filter(p => p.status === "low_stock").length;
    const outOfStockCount = stockData.filter(p => p.status === "out_of_stock").length;

    return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        lowStockCount,
        outOfStockCount,
    };
}