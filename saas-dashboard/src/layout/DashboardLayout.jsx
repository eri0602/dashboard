import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/layout.css";

export default function DashboardLayout() {
    return (
        <div className="app-shell">
        {/* SIDEBAR */}
        <aside className="app-sidebar">
            <Sidebar />
        </aside>

        {/* MAIN */}
        <div className="app-main">
            <Header />

            <main className="app-content">
            <Outlet />
            </main>
        </div>
        </div>
    );
}




