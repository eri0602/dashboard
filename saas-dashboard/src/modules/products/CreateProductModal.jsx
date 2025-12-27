// src/modules/products/CreateProductModal.jsx
import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import "../../styles/modal.css";
import { createCategory } from "../../services/products.service";

export default function CreateProductModal({ open, onClose, onCreate, saving, categories = [], onCategoryCreated }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("0");
    const [categoryId, setCategoryId] = useState("");
    const [estado, setEstado] = useState("active");
    const [error, setError] = useState(null);

    // Estados para crear categoría
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [creatingCategory, setCreatingCategory] = useState(false);

    // Reset al abrir/cerrar
    useEffect(() => {
        if (!open) {
            setNombre("");
            setDescripcion("");
            setPrecio("");
            setStock("0");
            setCategoryId("");
            setEstado("active");
            setError(null);
            setShowNewCategory(false);
            setNewCategoryName("");
        }
    }, [open]);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            setError("El nombre de la categoría es requerido");
            return;
        }

        setCreatingCategory(true);
        setError(null);

        const { data, error: err } = await createCategory(newCategoryName);

        if (err) {
            setError(err.message || "Error al crear la categoría");
            setCreatingCategory(false);
            return;
        }

        // Notificar al padre para que recargue categorías
        onCategoryCreated?.(data);

        // Seleccionar la categoría recién creada
        setCategoryId(data.id.toString());
        setNewCategoryName("");
        setShowNewCategory(false);
        setCreatingCategory(false);
    };

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

        const res = await onCreate?.({
            name: nombre,
            description: descripcion,
            price: Number(precio || 0),
            initial_stock: Number(stock || 0),
            category_id: categoryId || null,
            status: estado,
        });

        // Si hay error, mostrarlo
        if (res?.error) {
            setError(res.error.message || "Error al crear el producto");
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
                        <h3 className="modal-title">Crear producto</h3>
                        <p className="modal-subtitle">Agrega un nuevo producto a tu catálogo</p>
                    </div>

                    <button 
                        type="button" 
                        className="modal-close" 
                        onClick={onClose} 
                        aria-label="Cerrar"
                        disabled={saving || creatingCategory}
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
                            disabled={saving || creatingCategory}
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
                            disabled={saving || creatingCategory}
                        />
                    </label>

                    <div className="modal-row">
                        <label>
                            Categoría
                            {!showNewCategory ? (
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <select 
                                        value={categoryId} 
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        disabled={saving || creatingCategory}
                                        style={{ flex: 1 }}
                                    >
                                        <option value="">Sin categoría</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    <button
                                        type="button"
                                        onClick={() => setShowNewCategory(true)}
                                        disabled={saving || creatingCategory}
                                        style={{
                                            padding: "0 12px",
                                            background: "var(--color-bg-secondary, #374151)",
                                            border: "1px solid var(--color-border, #4b5563)",
                                            borderRadius: "6px",
                                            color: "var(--color-text, white)",
                                            cursor: "pointer",
                                            fontSize: "18px",
                                            fontWeight: "bold"
                                        }}
                                        title="Crear nueva categoría"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <input
                                        type="text"
                                        placeholder="Nueva categoría"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleCreateCategory();
                                            }
                                        }}
                                        disabled={creatingCategory}
                                        style={{ flex: 1 }}
                                        autoFocus
                                    />
                                    
                                    <button
                                        type="button"
                                        onClick={handleCreateCategory}
                                        disabled={creatingCategory}
                                        style={{
                                            padding: "0 12px",
                                            background: "#10b981",
                                            border: "none",
                                            borderRadius: "6px",
                                            color: "white",
                                            cursor: "pointer",
                                            fontSize: "18px"
                                        }}
                                        title="Guardar categoría"
                                    >
                                        ✓
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowNewCategory(false);
                                            setNewCategoryName("");
                                            setError(null);
                                        }}
                                        disabled={creatingCategory}
                                        style={{
                                            padding: "0 12px",
                                            background: "var(--color-bg-secondary, #374151)",
                                            border: "1px solid var(--color-border, #4b5563)",
                                            borderRadius: "6px",
                                            color: "var(--color-text, white)",
                                            cursor: "pointer",
                                            fontSize: "18px"
                                        }}
                                        title="Cancelar"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </label>

                        <label>
                            Estado
                            <select 
                                value={estado} 
                                onChange={(e) => setEstado(e.target.value)}
                                disabled={saving || creatingCategory}
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
                                disabled={saving || creatingCategory}
                                required
                            />
                        </label>

                        <label>
                            Stock inicial
                            <input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="0"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                disabled={saving || creatingCategory}
                            />
                        </label>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn-secondary" 
                            onClick={onClose} 
                            disabled={saving || creatingCategory}
                        >
                            Cancelar
                        </button>

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            disabled={saving || creatingCategory}
                        >
                            {saving ? "Creando..." : creatingCategory ? "Guardando categoría..." : "Crear producto"}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}