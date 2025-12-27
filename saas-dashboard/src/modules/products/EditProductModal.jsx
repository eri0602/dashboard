// src/modules/products/EditProductModal.jsx
import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import "../../styles/modal.css";

export default function EditProductModal({ open, onClose, onUpdate, saving, product, categories = [] }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [estado, setEstado] = useState("active");
    const [error, setError] = useState(null);

    // Cargar datos del producto cuando se abre el modal
    useEffect(() => {
        if (open && product) {
            setNombre(product.name || "");
            setDescripcion(product.description || "");
            setPrecio(product.price?.toString() || "");
            setStock(product.stock?.toString() || "0");
            setCategoryId(product.category_id?.toString() || "");
            setEstado(product.status || "active");
            setError(null);
        }
    }, [open, product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!nombre.trim()) {
            setError("El nombre es requerido");
            return;
        }

        if (!precio || Number(precio) < 0) {
            setError("El precio debe ser mayor o igual a 0");
            return;
        }

        if (Number(stock) < 0) {
            setError("El stock no puede ser negativo");
            return;
        }

        const res = await onUpdate?.(product.id, {
            name: nombre,
            description: descripcion,
            price: Number(precio || 0),
            stock: Number(stock || 0),
            category_id: categoryId || null,
            status: estado,
        });

        // Si hay error, mostrarlo
        if (res?.error) {
            setError(res.error.message || "Error al actualizar el producto");
            return;
        }

        // Si todo ok, cerrar
        if (res?.ok) {
            onClose?.();
        }
    };

    if (!open) return null;

    return (
        <Modal onClose={onClose}>
            <form onSubmit={handleSubmit}>
                {/* HEADER */}
                <div className="modal-header">
                    <div>
                        <h3 className="modal-title">Editar producto</h3>
                        <p className="modal-subtitle">Modifica los datos del producto</p>
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
                    {error && (
                        <div className="nd-alert nd-alert--error">
                            {error}
                        </div>
                    )}

                    <label>
                        Nombre *
                        <input
                            type="text"
                            placeholder="Ej. Plan Pro"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            disabled={saving}
                            required
                            autoFocus
                        />
                    </label>

                    <label>
                        Descripción
                        <textarea
                            placeholder="Descripción del producto"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            disabled={saving}
                        />
                    </label>

                    <div className="modal-row">
                        <label>
                            Categoría
                            <select 
                                value={categoryId} 
                                onChange={(e) => setCategoryId(e.target.value)}
                                disabled={saving}
                            >
                                <option value="">Sin categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Estado
                            <select 
                                value={estado} 
                                onChange={(e) => setEstado(e.target.value)}
                                disabled={saving}
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </label>
                    </div>

                    <div className="modal-row">
                        <label>
                            Precio *
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                disabled={saving}
                                required
                            />
                        </label>

                        <label>
                            Stock
                            <input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="0"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                disabled={saving}
                            />
                        </label>
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
                            type="submit" 
                            className="btn-primary" 
                            disabled={saving}
                        >
                            {saving ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}