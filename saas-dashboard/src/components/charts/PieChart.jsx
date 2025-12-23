    import {
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    Tooltip,
    } from "recharts";
    import "../../styles/charts.css";

    const data = [
    { name: "Direct", value: 45 },
    { name: "Organic", value: 30 },
    { name: "Social", value: 15 },
    { name: "Referral", value: 10 },
    ];

    const COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#64748b"];

    export default function PieChart() {
    return (
        <div className="chart-card">
        <div className="chart-header">
            <h3>Traffic Sources</h3>
            <span>Distribution</span>
        </div>

        <div className="donut-container">
            <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
                <Pie
                data={data}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                stroke="none"
                >
                {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                ))}
                </Pie>

                <Tooltip
                contentStyle={{
                    background: "#0f172a",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#fff",
                }}
                labelStyle={{ color: "#cbd5f5" }}
                />
            </RePieChart>
            </ResponsiveContainer>
        </div>

        <div className="donut-legend">
            {data.map((item, i) => (
            <div key={item.name} className="legend-item">
                <span
                className="legend-dot"
                style={{ backgroundColor: COLORS[i] }}
                />
                <span className="legend-text">
                {item.name} — {item.value}%
                </span>
            </div>
            ))}
        </div>
        </div>
    );
}
