import { supabase } from "./supabase";

export async function getRevenueHistory(userId) {
    const { data, error } = await supabase
        .from("metrics")
        .select("revenue, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
    }
