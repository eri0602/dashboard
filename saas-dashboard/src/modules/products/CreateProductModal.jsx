import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import "../../styles/modal.css";

export default function CreateProductModal({ open, onClose, onCreate, saving }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [estado, setEstado] = useState("active");

    // reset al abrir/cerrar
    useEffect(() => {
        if (!open) return;
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setEstado("active");
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;

        const res = await onCreate?.({
        name: nombre,
        description: descripcion,
        price: Number(precio || 0),
        status: estado,
        });

        // si ok, cerramos
        if (res?.ok) onClose?.();
    };

    if (!open) return null;

    return (
        <Modal onClose={onClose}>
        {/* HEADER */}
        <div className="modal-header">
            <div>
            <h3 className="modal-title">Crear producto</h3>
            <p className="modal-subtitle">Agrega un nuevo producto a tu catálogo</p>
            </div>

            <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
            ×
            </button>
        </div>

        {/* BODY */}
        <form className="modal-body" onSubmit={handleSubmit}>
            <label>
            Nombre
            <input
                type="text"
                placeholder="Ej. Plan Pro"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />
            </label>

            <label>
            Descripción
            <textarea
                placeholder="Descripción del producto"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
            />
            </label>

            <div className="modal-row">
            <label>
                Precio
                <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                />
            </label>

            <label>
                Estado
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                </select>
            </label>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
            <Button type="button" variant="secondary" onClick={onClose}>
                Cancelar
            </Button>

            <Button type="submit" disabled={saving}>
                {saving ? "Creando..." : "Crear"}
            </Button>
            </div>
        </form>
        </Modal>
    );
}
