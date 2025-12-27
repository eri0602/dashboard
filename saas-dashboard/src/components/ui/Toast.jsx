// src/components/ui/Toast.jsx
import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} />,
        error: <XCircle size={20} />,
        warning: <AlertCircle size={20} />
    };

    const styles = {
        success: {
            bg: "#10b981",
            border: "#059669"
        },
        error: {
            bg: "#ef4444",
            border: "#dc2626"
        },
        warning: {
            bg: "#f59e0b",
            border: "#d97706"
        }
    };

    const style = styles[type] || styles.success;

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
                minWidth: "320px",
                maxWidth: "420px",
                background: style.bg,
                border: `2px solid ${style.border}`,
                borderRadius: "12px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                animation: "slideIn 0.3s ease-out"
            }}
        >
            <div style={{ color: "white", flexShrink: 0 }}>
                {icons[type]}
            </div>
            
            <div style={{ flex: 1, color: "white", fontSize: "14px", fontWeight: "500" }}>
                {message}
            </div>
            
            <button
                onClick={onClose}
                style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    opacity: 0.8,
                    transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.opacity = "1"}
                onMouseLeave={(e) => e.target.style.opacity = "0.8"}
            >
                <X size={18} />
            </button>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}