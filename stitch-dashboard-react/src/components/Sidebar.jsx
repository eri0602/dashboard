import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="sidebar">
        <h1 className="logo">Stitch</h1>

        <nav>
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/reports">Reports</NavLink>
        </nav>
        </aside>
    );
}
