import {
    ArrowUpRight,
    ArrowDownRight,
    Users,
    DollarSign,
    Percent,
    Clock,
    } from "lucide-react";
    import "../../styles/dashboard.css";

    /* ===== SKELETON CARD ===== */
    function StatCardSkeleton() {
    return (
        <div className="stat-card stat-card--skeleton" aria-busy="true">
        <div className="stat-header">
            <span className="skeleton skeleton-text skeleton-text--sm" />
            <div className="stat-icon stat-icon--skeleton skeleton" />
        </div>

        <div className="skeleton skeleton-text skeleton-text--lg" />

        <div className="stat-trend">
            <span className="skeleton skeleton-text skeleton-text--md" />
            <span className="skeleton skeleton-text skeleton-text--sm" />
        </div>
        </div>
    );
    }

    export default function DashboardStats({ loading = false, metrics = null }) {
    /* ===== LOADING ===== */
    if (loading) {
        return (
        <div className="stats-grid">
            {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
            ))}
        </div>
        );
    }

    /* ===== SAFE METRICS ===== */
    const safe = metrics ?? {
        revenue: null,
        active_users: null,
        conversion_rate: null,
        avg_session: null, // luego lo harás real
    };

    const stats = [
        {
        label: "Total Revenue",
        value:
            safe.revenue == null
            ? "—"
            : `$${Number(safe.revenue).toLocaleString()}`,
        trend: null,
        trendType: "neutral",
        icon: DollarSign,
        subtitle: safe.revenue == null ? "No data yet" : "from last month",
        },
        {
        label: "Active Users",
        value:
            safe.active_users == null
            ? "—"
            : Number(safe.active_users).toLocaleString(),
        trend: null,
        trendType: "neutral",
        icon: Users,
        subtitle: safe.active_users == null ? "No data yet" : "from last week",
        },
        {
        label: "Conversion Rate",
        value:
            safe.conversion_rate == null
            ? "—"
            : `${Number(safe.conversion_rate).toFixed(1)}%`,
        trend: null,
        trendType: "neutral",
        icon: Percent,
        subtitle: safe.conversion_rate == null ? "No data yet" : "Good",
        },
        {
        label: "Avg. Session",
        value: safe.avg_session == null ? "—" : safe.avg_session,
        trend: null,
        trendType: "neutral",
        icon: Clock,
        subtitle: safe.avg_session == null ? "No data yet" : "no change",
        },
    ];

    return (
        <div className="stats-grid">
        {stats.map((item, index) => {
            const Icon = item.icon;
            const showTrend = Boolean(item.trend);

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
                {showTrend && item.trendType === "up" && (
                    <ArrowUpRight size={14} />
                )}
                {showTrend && item.trendType === "down" && (
                    <ArrowDownRight size={14} />
                )}
                {showTrend && <span>{item.trend}</span>}
                <span className="stat-subtitle">{item.subtitle}</span>
                </div>
            </div>
            );
        })}
        </div>
    );
}



