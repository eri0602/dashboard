// src/modules/products/DeleteConfirmModal.jsx
import Modal from "../../components/ui/Modal";
import "../../styles/modal.css";

export default function DeleteConfirmModal({ open, onClose, onConfirm, saving, product }) {
    if (!open) return null;

    const handleConfirm = async () => {
        const res = await onConfirm?.(product.id);
        if (res?.ok) {
            onClose?.();
        }
    };

    return (
        <Modal onClose={onClose}>
            <div>
                {/* HEADER */}
                <div className="modal-header">
                    <div>
                        <h3 className="modal-title">¿Eliminar producto?</h3>
                        <p className="modal-subtitle">Esta acción no se puede deshacer</p>
                    </div>

                    <button 
                        type="button" 
                        className="modal-close" 
                        onClick={onClose} 
                        aria-label="Cerrar"
                        disabled={saving}
                    >
                        ×
                    </button>
                </div>

                {/* BODY */}
                <div className="modal-body">
                    <div style={{ 
                        padding: "16px 20px", 
                        background: "rgba(239, 68, 68, 0.08)", 
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: "10px",
                        marginBottom: "8px"
                    }}>
                        <p style={{ 
                            margin: 0, 
                            fontSize: "14px", 
                            color: "#fca5a5",
                            lineHeight: "1.5"
                        }}>
                            Estás a punto de eliminar el producto <strong>"{product?.name}"</strong>.
                            Esta acción es permanente y no se puede revertir.
                        </p>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn-secondary" 
                            onClick={onClose} 
                            disabled={saving}
                        >
                            Cancelar
                        </button>

                        <button 
                            type="button"
                            className="btn-danger" 
                            onClick={handleConfirm}
                            disabled={saving}
                        >
                            {saving ? "Eliminando..." : "Eliminar producto"}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}