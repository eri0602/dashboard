import { supabase } from "./supabase";

/**
 * KPI: último snapshot
 */
export async function getLatestMetrics(userId) {
    if (!userId) return null;

    const { data, error } = await supabase
        .from("metrics")
        .select("revenue, active_users, conversion_rate, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error("Error fetching metrics:", error.message);
        throw error;
    }

    return data;
    }

    /**
     * 📊 RevenueChart: histórico mensual
     */
    export async function getMonthlyRevenue(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
        .from("metrics")
        .select("revenue, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching monthly revenue:", error.message);
        throw error;
    }

    return data;
}

