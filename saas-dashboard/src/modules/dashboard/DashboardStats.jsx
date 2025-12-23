import {
    ArrowUpRight,
    ArrowDownRight,
    Users,
    DollarSign,
    Percent,
    Clock,
    } from "lucide-react";
    import "../../styles/dashboard.css";

    export default function DashboardStats({ metrics, loading }) {
    const stats = [
        {
        label: "Total Revenue",
        value: loading
            ? "—"
            : `$${metrics?.revenue?.toLocaleString() ?? 0}`,
        trend: "+12%",
        trendType: "up",
        icon: DollarSign,
        subtitle: "from last month",
        },
        {
        label: "Active Users",
        value: loading
            ? "—"
            : metrics?.active_users?.toLocaleString() ?? 0,
        trend: "+5%",
        trendType: "up",
        icon: Users,
        subtitle: "from last week",
        },
        {
        label: "Conversion Rate",
        value: loading
            ? "—"
            : `${metrics?.conversion_rate ?? 0}%`,
        trend: "-2%",
        trendType: "down",
        icon: Percent,
        subtitle: "Good",
        },
        {
        label: "Avg. Session",
        value: "4m 32s",
        trend: "0%",
        trendType: "neutral",
        icon: Clock,
        subtitle: "no change",
        },
    ];

    return (
        <div className="stats-grid">
        {stats.map((item, index) => {
            const Icon = item.icon;

            return (
            <div className="stat-card" key={index}>
                <div className="stat-header">
                <span className="stat-label">{item.label}</span>
                <div className="stat-icon">
                    <Icon size={18} />
                </div>
                </div>

                <div className="stat-value">{item.value}</div>

                <div className={`stat-trend ${item.trendType}`}>
                {item.trendType === "up" && <ArrowUpRight size={14} />}
                {item.trendType === "down" && <ArrowDownRight size={14} />}
                <span>{item.trend}</span>
                <span className="stat-subtitle">{item.subtitle}</span>
                </div>
            </div>
            );
        })}
        </div>
    );
}

