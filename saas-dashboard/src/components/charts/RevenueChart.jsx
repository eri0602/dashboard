import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    } from "recharts";
    import "../../styles/charts.css";

    const data = [
    { month: "Jan", revenue: 3200 },
    { month: "Feb", revenue: 4200 },
    { month: "Mar", revenue: 6100 },
    { month: "Apr", revenue: 8200 },
    { month: "May", revenue: 7600 },
    { month: "Jun", revenue: 12500 },
    ];

    export default function RevenueChart() {
    return (
        <div className="chart-card">
        <div className="chart-header">
            <h3>Revenue Trends</h3>
            <span>Last 6 months</span>
        </div>

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
                cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
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
        </div>
    );
}
