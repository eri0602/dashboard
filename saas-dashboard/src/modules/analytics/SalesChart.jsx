// src/modules/analytics/SalesChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SalesChart({ data, loading, startDate, endDate }) {
    // Generar array completo de fechas en el rango
    const generateDateRange = (start, end) => {
        const dates = [];
        const current = new Date(start);
        const endDate = new Date(end);

        while (current <= endDate) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return dates;
    };

    // Agrupar ventas por día
    const groupedData = {};
    
    data.forEach(order => {
        const date = new Date(order.created_at);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (!groupedData[dateKey]) {
            groupedData[dateKey] = { revenue: 0, orders: 0 };
        }
        
        groupedData[dateKey].revenue += Number(order.total);
        groupedData[dateKey].orders += 1;
    });

    // Crear datos del chart con TODAS las fechas del rango
    const allDates = generateDateRange(startDate, endDate);
    const chartData = allDates.map(date => {
        const dateKey = date.toISOString().split('T')[0];
        const dateLabel = date.toLocaleDateString("en-US", { 
            month: "short", 
            day: "numeric" 
        });

        return {
            date: dateLabel,
            revenue: groupedData[dateKey]?.revenue || 0,
            orders: groupedData[dateKey]?.orders || 0,
        };
    });

    if (loading) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">Sales Over Time</h3>
                <div className="chart-loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3 className="chart-title">Sales Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                        dataKey="date" 
                        stroke="rgba(229,231,235,0.6)"
                        style={{ fontSize: "12px" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis 
                        stroke="rgba(229,231,235,0.6)"
                        style={{ fontSize: "12px" }}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "#e5e7eb"
                        }}
                        formatter={(value, name) => {
                            if (name === "revenue") return [`$${value.toFixed(2)}`, "Revenue"];
                            return [value, "Orders"];
                        }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}