// src/modules/sales/OrderDetailsModal.jsx
import Modal from "../../components/ui/Modal";
import { Package, Calendar, FileText, DollarSign } from "lucide-react";
import "../../styles/modal.css";

export default function OrderDetailsModal({ order, onClose }) {
    if (!order) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'long',
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

    const statusBadge = getStatusBadge(order.status);

    return (
        <Modal onClose={onClose}>
            {/* HEADER */}
            <div className="modal-header">
                <div>
                    <h3 className="modal-title">Detalles de la Venta</h3>
                    <p className="modal-subtitle" style={{ fontFamily: "monospace", fontSize: "13px" }}>
                        ID: {order.id}
                    </p>
                </div>

                <button 
                    type="button" 
                    className="modal-close" 
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    ×
                </button>
            </div>

            {/* BODY */}
            <div className="modal-body">
                {/* INFO GENERAL */}
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(2, 1fr)", 
                    gap: "16px",
                    marginBottom: "24px",
                    padding: "16px",
                    background: "var(--color-bg-secondary, #1f2937)",
                    borderRadius: "8px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Calendar size={20} color="#3b82f6" />
                        <div>
                            <div style={{ fontSize: "12px", color: "var(--color-text-secondary, #9ca3af)", marginBottom: "4px" }}>
                                Fecha
                            </div>
                            <div style={{ fontWeight: "500" }}>
                                {formatDate(order.created_at)}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Package size={20} color="#10b981" />
                        <div>
                            <div style={{ fontSize: "12px", color: "var(--color-text-secondary, #9ca3af)", marginBottom: "4px" }}>
                                Estado
                            </div>
                            <span className={`nd-badge ${statusBadge.class}`}>
                                {statusBadge.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* PRODUCTOS */}
                <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ 
                        fontSize: "14px", 
                        fontWeight: "600", 
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <Package size={16} />
                        Productos ({order.order_items?.length || 0})
                    </h4>

                    <div style={{ 
                        border: "1px solid var(--color-border, #374151)", 
                        borderRadius: "8px",
                        overflow: "hidden"
                    }}>
                        {order.order_items && order.order_items.length > 0 ? (
                            order.order_items.map((item, index) => (
                                <div 
                                    key={item.id}
                                    style={{
                                        padding: "12px 16px",
                                        borderBottom: index < order.order_items.length - 1 
                                            ? "1px solid var(--color-border, #374151)" 
                                            : "none",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                                            {item.product_name}
                                        </div>
                                        <div style={{ fontSize: "13px", color: "var(--color-text-secondary, #9ca3af)" }}>
                                            ${Number(item.price).toFixed(2)} × {item.quantity}
                                        </div>
                                    </div>
                                    <div style={{ 
                                        fontWeight: "600",
                                        color: "#3b82f6",
                                        fontSize: "15px"
                                    }}>
                                        ${Number(item.subtotal).toFixed(2)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: "20px", textAlign: "center", color: "var(--color-text-secondary, #9ca3af)" }}>
                                No hay productos en esta venta
                            </div>
                        )}
                    </div>
                </div>

                {/* NOTAS */}
                {order.notes && (
                    <div style={{ marginBottom: "24px" }}>
                        <h4 style={{ 
                            fontSize: "14px", 
                            fontWeight: "600", 
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}>
                            <FileText size={16} />
                            Notas
                        </h4>
                        <div style={{
                            padding: "12px 16px",
                            background: "var(--color-bg-secondary, #1f2937)",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "var(--color-text-secondary, #9ca3af)"
                        }}>
                            {order.notes}
                        </div>
                    </div>
                )}

                {/* TOTAL */}
                <div style={{
                    padding: "20px",
                    background: "var(--color-bg-secondary, #1f2937)",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <DollarSign size={24} color="#3b82f6" />
                        <span style={{ fontSize: "18px", fontWeight: "600" }}>
                            Total de la Venta
                        </span>
                    </div>
                    <span style={{ 
                        fontSize: "28px", 
                        fontWeight: "700",
                        color: "#3b82f6"
                    }}>
                        ${Number(order.total).toFixed(2)}
                    </span>
                </div>

                {/* FOOTER */}
                <div className="modal-footer" style={{ marginTop: "24px" }}>
                    <button 
                        type="button" 
                        className="btn-primary" 
                        onClick={onClose}
                        style={{ width: "100%" }}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
}