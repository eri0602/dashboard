// src/modules/analytics/TimeFilters.jsx
import { Calendar } from "lucide-react";

export default function TimeFilters({ selectedRange, onRangeChange }) {
    const timeRanges = [
        { id: "today", label: "Today" },
        { id: "7days", label: "Last 7 days" },
        { id: "30days", label: "Last 30 days" },
        { id: "90days", label: "Last 90 days" },
        { id: "custom", label: "Custom range" },
    ];

    return (
        <div className="time-filters">
            <div className="time-filters-label">
                <Calendar size={18} />
                <span>Time Range</span>
            </div>
            
            <div className="time-filters-buttons">
                {timeRanges.map((range) => (
                    <button
                        key={range.id}
                        className={`time-filter-btn ${selectedRange === range.id ? "active" : ""}`}
                        onClick={() => onRangeChange(range.id)}
                    >
                        {range.label}
                    </button>
                ))}
            </div>
        </div>
    );
}