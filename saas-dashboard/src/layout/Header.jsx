import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, LogOut } from "lucide-react";
import { signOut } from "../services/auth.service";
import { useAuth } from "../context/auth.context";
import "../styles/header.css";


export default function Header() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const email = user?.email ?? "";
    const initial = email.charAt(0).toUpperCase();

    async function handleLogout() {
        await signOut();
        navigate("/login", { replace: true });
    }

    return (
        <header className="header">
        {/* LEFT */}
        <div className="header-left">
            <div className="search">
            <Search size={16} />
            <input placeholder="Search metrics, reports, or logs..." />
            </div>
        </div>

        {/* RIGHT */}
        <div className="header-right">
            <button className="icon-btn" aria-label="notifications">
            <Bell size={18} />
            </button>

            {/* USER MENU */}
            <div className="user-menu">
            <button
                className="avatar"
                onClick={() => setOpen(!open)}
                aria-label="User menu"
            >
                {initial}
            </button>

            {open && (
                <div className="dropdown">
                <div className="dropdown-user">
                    <div className="avatar-sm">{initial}</div>
                    <div>
                    <div className="user-email">{email}</div>
                    </div>
                </div>

                <div className="dropdown-divider" />

                <button className="dropdown-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                </button>
                </div>
            )}
            </div>
        </div>
        </header>
    );
}



