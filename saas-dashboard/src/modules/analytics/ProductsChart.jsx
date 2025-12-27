// src/modules/analytics/ProductsChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ProductsChart({ data, loading }) {
    if (loading) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">Top Products</h3>
                <div className="chart-loading">Loading...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">Top Products</h3>
                <div className="chart-empty">No product data for selected period</div>
            </div>
        );
    }

    // Tomar solo los top 8 para mejor visualización
    const chartData = data.slice(0, 8).map(product => ({
        name: product.name.length > 20 ? product.name.substring(0, 20) + "..." : product.name,
        quantity: product.totalQuantity,
        revenue: product.totalRevenue,
    }));

    return (
        <div className="chart-container">
            <h3 className="chart-title">Top Products (by units sold)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                        type="number"
                        stroke="rgba(229,231,235,0.6)"
                        style={{ fontSize: "12px" }}
                    />
                    <YAxis 
                        type="category"
                        dataKey="name" 
                        stroke="rgba(229,231,235,0.6)"
                        style={{ fontSize: "11px" }}
                        width={120}
                    />
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "#e5e7eb"
                        }}
                        formatter={(value, name) => {
                            if (name === "quantity") return [value, "Units Sold"];
                            return [`$${value.toFixed(2)}`, "Revenue"];
                        }}
                    />
                    <Bar 
                        dataKey="quantity" 
                        fill="#10b981" 
                        radius={[0, 8, 8, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}