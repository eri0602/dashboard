import DashboardStats from "./DashboardStats";
import RevenueChart from "../../components/charts/RevenueChart";
import RecentTransactions from "./RecentTransactions";
import "../../styles/dashboard.css";
import { useDashboardMetrics } from "../../hooks/useDashboardMetrics";

export default function Dashboard() {
    const { loading, metrics } = useDashboardMetrics();

    return (
        <div className="dashboard-page">
            {/* ===== HEADER ===== */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard Overview</h1>
                    <p className="dashboard-subtitle">
                        Key metrics and performance summary
                    </p>
                </div>
            </div>

            {/* ===== STATS ===== */}
            <section className="dashboard-section">
                <DashboardStats loading={loading} metrics={metrics}  />
            </section>

            {/* ===== GRÁFICO ===== */}
            <section className="dashboard-section">
                <div className="dashboard-card dashboard-card-full">
                    <div className="card-header">
                        <h3>Revenue Trends</h3>
                        <span className="card-subtitle">Monthly comparison</span>
                    </div>

                    <div className="card-content">
                        <RevenueChart />
                    </div>
                </div>
            </section>

            {/* ===== TABLA ===== */}
            <section className="dashboard-section">
                <div className="dashboard-card dashboard-card-full dashboard-card-table">
                    <div className="card-header">
                        <h3>Recent Transactions</h3>
                    </div>

                    <div className="card-content card-content-table">
                        <RecentTransactions />
                    </div>
                </div>
            </section>
        </div>
    );
}
