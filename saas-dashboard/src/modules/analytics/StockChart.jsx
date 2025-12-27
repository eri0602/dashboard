// src/modules/analytics/StockChart.jsx
import { AlertTriangle, CheckCircle, XCircle, Package } from "lucide-react";

export default function StockChart({ data, loading }) {
    if (loading) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">Stock Status</h3>
                <div className="chart-loading">Loading...</div>
            </div>
        );
    }

    const inStock = data.filter(p => p.status === "in_stock");
    const lowStock = data.filter(p => p.status === "low_stock");
    const outOfStock = data.filter(p => p.status === "out_of_stock");

    // Calcular stock total
    const totalStockUnits = data.reduce((sum, p) => sum + p.stock, 0);

    const stats = [
        {
            id: "total",
            label: "Total Stock",
            count: totalStockUnits,
            suffix: "units",
            icon: Package,
            color: "#3b82f6",
            products: [],
            showProducts: false,
        },
        {
            id: "in_stock",
            label: "In Stock",
            count: inStock.length,
            suffix: "products",
            icon: CheckCircle,
            color: "#10b981",
            products: inStock.slice(0, 5),
            showProducts: true,
        },
        {
            id: "low_stock",
            label: "Low Stock",
            count: lowStock.length,
            suffix: "products",
            icon: AlertTriangle,
            color: "#f59e0b",
            products: lowStock,
            showProducts: true,
        },
        {
            id: "out_of_stock",
            label: "Out of Stock",
            count: outOfStock.length,
            suffix: "products",
            icon: XCircle,
            color: "#ef4444",
            products: outOfStock,
            showProducts: true,
        },
    ];

    return (
        <div className="chart-container">
            <h3 className="chart-title">Stock Status</h3>
            
            {data.length === 0 ? (
                <div className="chart-empty">No stock data available</div>
            ) : (
                <div className="stock-stats">
                    {stats.map(stat => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.id} className="stock-stat">
                                <div className="stock-stat-header">
                                    <Icon size={20} style={{ color: stat.color }} />
                                    <span className="stock-stat-label">{stat.label}</span>
                                    <span className="stock-stat-count">
                                        {stat.count.toLocaleString()} {stat.suffix}
                                    </span>
                                </div>
                                
                                {/* Solo mostrar productos si hay alguno y está habilitado */}
                                {stat.showProducts && stat.count > 0 && stat.products.length > 0 && (
                                    <div className="stock-products">
                                        {stat.products.map(product => (
                                            <div key={product.id} className="stock-product-item">
                                                <span className="stock-product-name">{product.name}</span>
                                                <span className="stock-product-qty">
                                                    {product.stock} {product.stock === 1 ? "unit" : "units"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}