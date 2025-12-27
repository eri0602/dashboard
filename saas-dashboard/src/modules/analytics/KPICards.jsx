// src/modules/analytics/KPICards.jsx
import { DollarSign, ShoppingCart, TrendingUp, Package, AlertTriangle } from "lucide-react";

export default function KPICards({ kpis, loading }) {
    const cards = [
        {
            id: "revenue",
            title: "Total Revenue",
            value: `$${kpis.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: "blue",
        },
        {
            id: "orders",
            title: "Total Orders",
            value: kpis.totalOrders.toLocaleString(),
            icon: ShoppingCart,
            color: "green",
        },
        {
            id: "average",
            title: "Average Order",
            value: `$${kpis.averageOrderValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: TrendingUp,
            color: "purple",
        },
        {
            id: "low_stock",
            title: "Low Stock",
            value: kpis.lowStockCount.toLocaleString(),
            icon: Package,
            color: "orange",
        },
        {
            id: "out_stock",
            title: "Out of Stock",
            value: kpis.outOfStockCount.toLocaleString(),
            icon: AlertTriangle,
            color: "red",
        },
    ];

    return (
        <div className="kpi-grid">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div key={card.id} className={`kpi-card kpi-card--${card.color}`}>
                        <div className="kpi-card-icon">
                            <Icon size={24} />
                        </div>
                        <div className="kpi-card-content">
                            <p className="kpi-card-title">{card.title}</p>
                            <p className="kpi-card-value">
                                {loading ? "..." : card.value}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}