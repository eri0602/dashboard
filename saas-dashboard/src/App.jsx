// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./auth/Login";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./modules/dashboard/Dashboard";
import Analytics from "./modules/analytics/Analytics";
import Products from "./modules/products/Products";
import Reports from "./modules/reports/Reports";
import Users from "./modules/users/Users";
import Settings from "./modules/settings/Settings";

// Sales
import NewSale from "./modules/sales/NewSale";
import Orders from "./modules/sales/Orders";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="products" element={<Products />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Sales Routes */}
          <Route path="sales">
            <Route index element={<Navigate to="/sales/new" replace />} />
            <Route path="new" element={<NewSale />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}