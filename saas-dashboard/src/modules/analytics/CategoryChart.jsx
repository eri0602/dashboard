// src/modules/analytics/CategoryChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function CategoryChart({ data, loading }) {
    if (loading) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">Sales by Category</h3>
                <div className="chart-loading">Loading...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">Sales by Category</h3>
                <div className="chart-empty">No category data for selected period</div>
            </div>
        );
    }

    const chartData = data.map(cat => ({
        name: cat.name,
        value: cat.totalRevenue,
        quantity: cat.totalQuantity,
    }));

    return (
        <div className="chart-container">
            <h3 className="chart-title">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "#e5e7eb"
                        }}
                        formatter={(value, name) => {
                            if (name === "value") return [`$${value.toFixed(2)}`, "Revenue"];
                            return [value, name];
                        }}
                    />
                    <Legend 
                        wrapperStyle={{ fontSize: "12px" }}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}