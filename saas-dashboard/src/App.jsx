import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./auth/Login";
import DashboardLayout from "./layout/DashboardLayout";
import Products from "./modules/products/Products";
import Dashboard from "./modules/dashboard/Dashboard";
import Analytics from "./modules/analytics/Analytics";
import Reports from "./modules/reports/Reports";
import Users from "./modules/users/Users";
import Settings from "./modules/settings/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="products" element={<Products />} />
        <Route path="reports" element={<Reports />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      </Route>


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

