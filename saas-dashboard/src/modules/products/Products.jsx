import { useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import CreateProductModal from "./CreateProductModal";
import "../../styles/tables.css";
import { Pencil, Trash2 } from "lucide-react";

export default function Products() {
    const { products, loading, error, createProduct } = useProducts();
    const [openCreate, setOpenCreate] = useState(false);

    return (
        <div className="dashboard-page">
        {/* HEADER */}
        <div className="page-header">
            <div>
            <h1 className="dashboard-title">Products</h1>
            <p className="dashboard-subtitle">Manage your products catalog</p>
            </div>

            <button
            className="nd-btn nd-btn--primary"
            onClick={() => setOpenCreate(true)}
            >
            + New product
            </button>
        </div>

        {/* CARD */}
        <div className="dashboard-card">
            {error && <div className="nd-alert nd-alert--error">{error}</div>}

            {loading ? (
            <p className="nd-muted">Loading products…</p>
            ) : products.length === 0 ? (
            <p className="nd-muted">No products yet</p>
            ) : (
            <div className="nd-table-wrap">
                <table className="nd-table">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th className="nd-col-num">Price</th>
                    <th>Status</th>
                    <th className="nd-col-actions">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((p) => (
                    <tr key={p.id}>
                        <td>
                        <div className="nd-cell-title">{p.name}</div>
                        {p.description && (
                            <div className="nd-cell-sub">{p.description}</div>
                        )}
                        </td>

                        <td className="nd-col-num">
                        ${Number(p.price).toFixed(2)}
                        </td>

                        <td>
                        <span
                            className={`nd-badge ${
                            p.status === "active"
                                ? "nd-badge--ok"
                                : "nd-badge--warn"
                            }`}
                        >
                            {p.status}
                        </span>
                        </td>

                        <td className="nd-col-actions">
                        <div className="nd-actions">
                            <button
                            className="nd-icon-btn"
                            title="Editar"
                            onClick={() => console.log("Editar", p.id)}
                            >
                            <Pencil size={16} />
                            </button>

                            <button
                            className="nd-icon-btn nd-icon-btn--danger"
                            title="Eliminar"
                            onClick={() => console.log("Eliminar", p.id)}
                            >
                            <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="nd-actions-hint">
                            Edit/Delete in B3.2
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>

        {/* MODAL */}
        <CreateProductModal
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            onCreated={createProduct}
        />
        </div>
    );
}
