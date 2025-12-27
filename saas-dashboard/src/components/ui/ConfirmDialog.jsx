// src/components/ui/ConfirmDialog.jsx
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Confirmar acción", 
    message, 
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "danger" // danger, warning, info
}) {
    if (!isOpen) return null;

    const colors = {
        danger: {
            icon: "#ef4444",
            button: "#ef4444",
            buttonHover: "#dc2626"
        },
        warning: {
            icon: "#f59e0b",
            button: "#f59e0b",
            buttonHover: "#d97706"
        },
        info: {
            icon: "#3b82f6",
            button: "#3b82f6",
            buttonHover: "#2563eb"
        }
    };

    const color = colors[type] || colors.danger;

    return (
        <div 
            className="modal-backdrop" 
            style={{ 
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "20px"
            }}
            onClick={onClose}
        >
            <div 
                style={{
                    background: "#1a1f2e",
                    borderRadius: "12px",
                    maxWidth: "440px",
                    width: "100%",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                    animation: "modalSlideIn 0.2s ease-out"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #374151",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            background: `${color.icon}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <AlertTriangle size={22} color={color.icon} />
                        </div>
                        <h3 style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "white",
                            margin: 0
                        }}>
                            {title}
                        </h3>
                    </div>
                    
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#9ca3af",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            transition: "color 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "white"}
                        onMouseLeave={(e) => e.target.style.color = "#9ca3af"}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div style={{
                    padding: "24px",
                    color: "#d1d5db",
                    fontSize: "15px",
                    lineHeight: "1.6"
                }}>
                    {message}
                </div>

                {/* Footer */}
                <div style={{
                    padding: "16px 24px",
                    borderTop: "1px solid #374151",
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end"
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "10px 20px",
                            background: "#374151",
                            border: "1px solid #4b5563",
                            borderRadius: "8px",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#4b5563"}
                        onMouseLeave={(e) => e.target.style.background = "#374151"}
                    >
                        {cancelText}
                    </button>
                    
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        style={{
                            padding: "10px 20px",
                            background: color.button,
                            border: "none",
                            borderRadius: "8px",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.background = color.buttonHover}
                        onMouseLeave={(e) => e.target.style.background = color.button}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}