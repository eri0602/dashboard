import "../../styles/dashboard.css";

export default function DashboardStatsSkeleton() {
    return (
        <div className="stats-grid">
        {Array.from({ length: 4 }).map((_, i) => (
            <div className="stat-card skeleton" key={i}>
            <div className="stat-header">
                <div className="skeleton-line skeleton-label" />
                <div className="skeleton-icon" />
            </div>

            <div className="skeleton-line skeleton-value" />

            <div className="skeleton-line skeleton-sub" />
            </div>
        ))}
        </div>
    );
}
