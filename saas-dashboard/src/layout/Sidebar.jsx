import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, FileText, Users, Settings } from "lucide-react";
import "../styles/sidebar.css"; // ✅ Importar los estilos

const nav = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/reports", label: "Reports", icon: FileText },
    { to: "/users", label: "Users", icon: Users },
    { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-title">NexusDash</div>
                <div className="brand-subtitle">Enterprise</div>
            </div>

            <nav className="sidebar-nav">
                {nav.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
