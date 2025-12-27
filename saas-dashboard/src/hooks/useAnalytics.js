// src/hooks/useAnalytics.js
import { useState, useEffect, useCallback } from "react";
import * as analyticsService from "../services/analytics.service";

export function useAnalytics(startDate, endDate) {
    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [kpis, setKPIs] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = useCallback(async () => {
        if (!startDate || !endDate) return;

        setLoading(true);
        setError(null);

        try {
            // Cargar todo en paralelo
            const [
                salesResult,
                productsResult,
                categoryResult,
                stockResult,
                kpisResult,
            ] = await Promise.all([
                analyticsService.getSalesData(startDate, endDate),
                analyticsService.getTopProducts(startDate, endDate, 10),
                analyticsService.getSalesByCategory(startDate, endDate),
                analyticsService.getStockAnalytics(),
                analyticsService.getKPIs(startDate, endDate),
            ]);

            if (salesResult.error) throw salesResult.error;
            if (productsResult.error) throw productsResult.error;
            if (categoryResult.error) throw categoryResult.error;
            if (stockResult.error) throw stockResult.error;

            setSalesData(salesResult.data);
            setTopProducts(productsResult.data);
            setCategoryData(categoryResult.data);
            setStockData(stockResult.data);
            setKPIs(kpisResult);
        } catch (err) {
            console.error("Error loading analytics:", err);
            setError(err.message || "Error al cargar analytics");
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return {
        salesData,
        topProducts,
        categoryData,
        stockData,
        kpis,
        loading,
        error,
        refetch: fetchAnalytics,
    };
}