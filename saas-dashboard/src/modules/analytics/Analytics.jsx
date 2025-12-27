// src/modules/analytics/Analytics.jsx
import { useState, useMemo } from "react";
import { useAnalytics } from "../../hooks/useAnalytics";
import TimeFilters from "./TimeFilters";
import KPICards from "./KPICards";
import SalesChart from "./SalesChart";
import ProductsChart from "./ProductsChart";
import CategoryChart from "./CategoryChart";
import StockChart from "./StockChart";
import "../../styles/analytics.css";

export default function Analytics() {
    const [selectedRange, setSelectedRange] = useState("30days");

    // Calcular fechas según el rango seleccionado
    const { startDate, endDate } = useMemo(() => {
        const end = new Date();
        let start = new Date();

        switch (selectedRange) {
            case "today":
                start.setHours(0, 0, 0, 0);
                break;
            case "7days":
                start.setDate(end.getDate() - 7);
                break;
            case "30days":
                start.setDate(end.getDate() - 30);
                break;
            case "90days":
                start.setDate(end.getDate() - 90);
                break;
            default:
                start.setDate(end.getDate() - 30);
        }

        return {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
        };
    }, [selectedRange]);

    const { 
        salesData, 
        topProducts, 
        categoryData, 
        stockData, 
        kpis, 
        loading, 
        error 
    } = useAnalytics(startDate, endDate);

    return (
        <div className="dashboard-page" style={{ paddingBottom: "40px" }}>
            {/* HEADER */}
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">Analytics</h1>
                    <p className="dashboard-subtitle">
                        Analyze your sales, products, and inventory performance
                    </p>
                </div>
            </div>

            {/* TIME FILTERS */}
            <div className="dashboard-card" style={{ marginBottom: "20px" }}>
                <TimeFilters 
                    selectedRange={selectedRange} 
                    onRangeChange={setSelectedRange} 
                />
            </div>

            {/* ERROR */}
            {error && (
                <div className="dashboard-card" style={{ marginBottom: "20px" }}>
                    <div className="nd-alert nd-alert--error">{error}</div>
                </div>
            )}

            {/* KPI CARDS */}
            <KPICards kpis={kpis} loading={loading} />

            {/* CHARTS GRID */}
            <div className="charts-grid">
                {/* Sales Over Time */}
                <div className="chart-card chart-card--full">
                    <SalesChart 
                        data={salesData} 
                        loading={loading}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </div>

                {/* Top Products */}
                <div className="chart-card">
                    <ProductsChart data={topProducts} loading={loading} />
                </div>

                {/* Sales by Category */}
                <div className="chart-card">
                    <CategoryChart data={categoryData} loading={loading} />
                </div>

                {/* Stock Status */}
                <div className="chart-card chart-card--full">
                    <StockChart data={stockData} loading={loading} />
                </div>
            </div>
        </div>
    );
}