import { useEffect, useState } from "react";
import { getMonthlyRevenue } from "../services/dashboard.service";
import { useAuth } from "../context/auth.context";

export function useRevenueChart() {
    const { user } = useAuth();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
        setLoading(false);
        return;
        }

        async function loadRevenue() {
        try {
            setLoading(true);
            const result = await getMonthlyRevenue(user.id);
            setData(result);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }

        loadRevenue();
    }, [user]);

    return { data, loading, error };
}
