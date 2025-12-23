import { useEffect, useState } from "react";
import { getLatestMetrics } from "../services/dashboard.service";
import { useAuth } from "../context/auth.context";

export function useDashboardMetrics() {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        async function loadMetrics() {
        try {
            setLoading(true);
            const data = await getLatestMetrics(user.id);
            setMetrics(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }

        loadMetrics();
    }, [user]);

    return { metrics, loading, error };
}
