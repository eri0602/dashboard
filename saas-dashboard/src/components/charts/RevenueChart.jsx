import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    } from "recharts";
    import "../../styles/charts.css";
    import { useRevenueChart } from "../../hooks/useRevenueChart";

    export default function RevenueChart() {
    const { data, loading } = useRevenueChart();

    if (loading) {
        return (
        <div style={{ padding: 24, color: "#94a3b8" }}>
            Loading chart…
        </div>
        );
    }

    if (!data || data.length === 0) {
        return (
        <div style={{ padding: 24, color: "#94a3b8" }}>
            No revenue data yet
        </div>
        );
    }

    return (
        <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
            <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
            </defs>

            <XAxis
                dataKey="month"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
            />

            <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
            />

            <Tooltip
                contentStyle={{
                background: "#0f172a",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                }}
                labelStyle={{ color: "#cbd5f5" }}
            />

            <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ r: 5 }}
            />
            </AreaChart>
        </ResponsiveContainer>
        </div>
    );
}


