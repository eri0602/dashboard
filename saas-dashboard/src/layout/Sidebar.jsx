// src/layout/Sidebar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, FileText, Users, Settings, Package, ShoppingCart, ChevronDown } from "lucide-react";
import "../styles/sidebar.css";

const nav = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/sales", label: "Sales", icon: ShoppingCart, submenu: [
        { to: "/sales/new", label: "Nueva Venta" },
        { to: "/sales/orders", label: "Órdenes" }
    ]},
    { to: "/products", label: "Products", icon: Package },
    { to: "/reports", label: "Reports", icon: FileText },
    { to: "/users", label: "Users", icon: Users },
    { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const toggleSubmenu = (label) => {
        setOpenSubmenu(openSubmenu === label ? null : label);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-title">NexusDash</div>
                <div className="brand-subtitle">Enterprise</div>
            </div>

            <nav className="sidebar-nav">
                {nav.map(({ to, label, icon: Icon, submenu }) => (
                    <div key={to}>
                        {submenu ? (
                            <>
                                {/* Item con submenú */}
                                <button
                                    onClick={() => toggleSubmenu(label)}
                                    className={`sidebar-link ${openSubmenu === label ? "active" : ""}`}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                    <ChevronDown 
                                        size={16} 
                                        style={{ 
                                            marginLeft: "auto",
                                            transition: "transform 0.2s",
                                            transform: openSubmenu === label ? "rotate(180deg)" : "rotate(0deg)"
                                        }} 
                                    />
                                </button>

                                {/* Submenú desplegable */}
                                {openSubmenu === label && (
                                    <div className="sidebar-submenu">
                                        {submenu.map((item) => (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                className={({ isActive }) => `sidebar-sublink ${isActive ? "active" : ""}`}
                                            >
                                                <span>{item.label}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Item normal sin submenú */
                            <NavLink
                                to={to}
                                end={to === "/"}
                                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                            </NavLink>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
}