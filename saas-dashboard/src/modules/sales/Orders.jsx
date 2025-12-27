// src/modules/sales/Orders.jsx
import { useState, useMemo } from "react";
import { useSales } from "../../hooks/useSales";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/ui/Toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import OrderDetailsModal from "./OrderDetailsModal";
import { Search, Eye, XCircle, Trash2, Calendar, DollarSign } from "lucide-react";
import "../../styles/tables.css";
import "../../styles/filters.css";

export default function Orders() {
    const { orders, loading, saving, error, cancelOrder, deleteOrder } = useSales();
    const { toast, success, error: showError, hideToast } = useToast();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    
    // Estados para confirmaciones
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [orderToDelete, setOrderToDelete] = useState(null);

    // Filtrar órdenes
    const filteredOrders = useMemo(() => {
        let filtered = [...orders];

        if (searchTerm) {
            filtered = filtered.filter(o =>
                o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (o.notes && o.notes.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(o => o.status === statusFilter);
        }

        if (dateFilter !== "all") {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            filtered = filtered.filter(o => {
                const orderDate = new Date(o.created_at);
                
                switch (dateFilter) {
                    case "today":
                        return orderDate >= today;
                    case "week":
                        const weekAgo = new Date(today);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return orderDate >= weekAgo;
                    case "month":
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return orderDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    }, [orders, searchTerm, statusFilter, dateFilter]);

    // Calcular totales
    const totals = useMemo(() => {
        const completed = filteredOrders.filter(o => o.status === "completed");
        const totalRevenue = completed.reduce((sum, o) => sum + Number(o.total), 0);
        
        return {
            total: filteredOrders.length,
            completed: completed.length,
            cancelled: filteredOrders.filter(o => o.status === "cancelled").length,
            revenue: totalRevenue
        };
    }, [filteredOrders]);

    // Handlers
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handleCancelOrder = async () => {
        if (!orderToCancel) return;

        const result = await cancelOrder(orderToCancel);
        
        if (result?.ok) {
            success("Venta cancelada exitosamente");
        } else {
            showError(result?.error?.message || "Error al cancelar la venta");
        }
        
        setOrderToCancel(null);
    };

    const handleDeleteOrder = async () => {
        if (!orderToDelete) return;

        const result = await deleteOrder(orderToDelete);
        
        if (result?.ok) {
            success("Venta eliminada exitosamente");
        } else {
            showError(result?.error?.message || "Error al eliminar la venta");
        }
        
        setOrderToDelete(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return { label: "Completada", class: "nd-badge--ok" };
            case "cancelled":
                return { label: "Cancelada", class: "nd-badge--error" };
            case "pending":
                return { label: "Pendiente", class: "nd-badge--warn" };
            default:
                return { label: status, class: "" };
        }
    };

    return (
        <div className="dashboard-page">
            {/* Toast notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={hideToast}
                />
            )}

            {/* Confirm Dialog - Cancelar */}
            <ConfirmDialog
                isOpen={showCancelConfirm}
                onClose={() => {
                    setShowCancelConfirm(false);
                    setOrderToCancel(null);
                }}
                onConfirm={handleCancelOrder}
                title="Cancelar Venta"
                message="¿Estás seguro de cancelar esta venta? El stock de los productos será devuelto automáticamente."
                confirmText="Sí, cancelar"
                cancelText="No, mantener"
                type="warning"
            />

            {/* Confirm Dialog - Eliminar */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setOrderToDelete(null);
                }}
                onConfirm={handleDeleteOrder}
                title="Eliminar Venta"
                message="¿Estás seguro de eliminar esta venta? Esta acción no se puede deshacer."
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                type="danger"
            />

            {/* HEADER */}
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">Ventas</h1>
                    <p className="dashboard-subtitle">
                        Historial de todas las ventas · {filteredOrders.length} {filteredOrders.length === 1 ? 'venta' : 'ventas'}
                    </p>
                </div>
            </div>

            {/* CARDS DE RESUMEN */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
                gap: "16px",
                marginBottom: "20px"
            }}>
                <div className="dashboard-card" style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <div style={{ 
                            width: "40px", 
                            height: "40px", 
                            borderRadius: "8px", 
                            background: "#3b82f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <DollarSign size={20} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: "24px", fontWeight: "700" }}>
                                ${totals.revenue.toFixed(2)}
                            </div>
                            <div style={{ fontSize: "13px", color: "var(--color-text-secondary, #9ca3af)" }}>
                                Ingresos Totales
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card" style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ 
                            width: "40px", 
                            height: "40px", 
                            borderRadius: "8px", 
                            background: "#10b981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Calendar size={20} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: "24px", fontWeight: "700" }}>
                                {totals.completed}
                            </div>
                            <div style={{ fontSize: "13px", color: "var(--color-text-secondary, #9ca3af)" }}>
                                Ventas Completadas
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card" style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ 
                            width: "40px", 
                            height: "40px", 
                            borderRadius: "8px", 
                            background: "#ef4444",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <XCircle size={20} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: "24px", fontWeight: "700" }}>
                                {totals.cancelled}
                            </div>
                            <div style={{ fontSize: "13px", color: "var(--color-text-secondary, #9ca3af)" }}>
                                Ventas Canceladas
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTROS Y BÚSQUEDA */}
            <div className="dashboard-card" style={{ marginBottom: "20px" }}>
                <div className="filters-container">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por ID o notas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filters-row">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="completed">Completadas</option>
                            <option value="cancelled">Canceladas</option>
                            <option value="pending">Pendientes</option>
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">Todas las fechas</option>
                            <option value="today">Hoy</option>
                            <option value="week">Última semana</option>
                            <option value="month">Último mes</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="dashboard-card">
                {error && <div className="nd-alert nd-alert--error">{error}</div>}

                {loading ? (
                    <div className="empty-state">
                        <p className="empty-title">Cargando ventas...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-title">
                            {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                                ? "No se encontraron ventas"
                                : "No hay ventas registradas"
                            }
                        </p>
                        <p className="empty-subtitle">
                            {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                                ? "Intenta ajustar los filtros de búsqueda"
                                : "Crea tu primera venta para comenzar"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="nd-table-wrap">
                        <table className="nd-table">
                            <thead>
                                <tr>
                                    <th>ID Venta</th>
                                    <th>Fecha</th>
                                    <th>Productos</th>
                                    <th className="nd-col-num">Total</th>
                                    <th>Estado</th>
                                    <th>Notas</th>
                                    <th className="nd-col-actions">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredOrders.map((order) => {
                                    const statusBadge = getStatusBadge(order.status);
                                    const itemCount = order.order_items?.length || 0;

                                    return (
                                        <tr key={order.id}>
                                            <td>
                                                <div className="nd-cell-title" style={{ fontFamily: "monospace", fontSize: "13px" }}>
                                                    {order.id.substring(0, 8)}...
                                                </div>
                                            </td>

                                            <td>
                                                <div className="nd-cell-sub">
                                                    {formatDate(order.created_at)}
                                                </div>
                                            </td>

                                            <td>
                                                <span className="nd-badge">
                                                    {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                                                </span>
                                            </td>

                                            <td className="nd-col-num">
                                                <span style={{ fontWeight: "600", color: "#3b82f6" }}>
                                                    ${Number(order.total).toFixed(2)}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={`nd-badge ${statusBadge.class}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="nd-cell-sub" style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {order.notes || "-"}
                                                </div>
                                            </td>

                                            <td className="nd-col-actions">
                                                <div className="nd-actions">
                                                    <button
                                                        type="button"
                                                        className="nd-icon-btn"
                                                        title="Ver detalles"
                                                        onClick={() => handleViewDetails(order)}
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    {order.status === "completed" && (
                                                        <button
                                                            type="button"
                                                            className="nd-icon-btn nd-icon-btn--warn"
                                                            title="Cancelar venta"
                                                            onClick={() => {
                                                                setOrderToCancel(order.id);
                                                                setShowCancelConfirm(true);
                                                            }}
                                                            disabled={saving}
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    )}

                                                    {order.status === "cancelled" && (
                                                        <button
                                                            type="button"
                                                            className="nd-icon-btn nd-icon-btn--danger"
                                                            title="Eliminar"
                                                            onClick={() => {
                                                                setOrderToDelete(order.id);
                                                                setShowDeleteConfirm(true);
                                                            }}
                                                            disabled={saving}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL DE DETALLES */}
            {showDetailsModal && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
}