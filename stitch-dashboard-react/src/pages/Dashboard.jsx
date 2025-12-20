import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import StatCard from "../components/StatCard";

export default function Dashboard() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
        const { data, error } = await supabase
            .from("stats")
            .select("*")
            .order("id");

        if (!error) setStats(data);
        };

        fetchStats();
    }, []);

    return (
        <section className="dashboard">
        <h2 className="dashboard-title">Dashboard Overview</h2>

        <div className="stats-grid">
            {stats.map(stat => (
            <StatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
            />
            ))}
        </div>
        </section>
    );
}
