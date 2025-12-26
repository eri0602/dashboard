import { useEffect } from "react";

export default function Modal({ onClose, children }) {
    useEffect(() => {
        const onKey = (e) => {
        if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="modal-backdrop" onMouseDown={onClose}>
        <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            {children}
        </div>
        </div>
    );
}
