import { Plus, Pencil, Trash2 } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import "../../styles/tables.css";

export default function Products() {
    const { products, loading } = useProducts();

    return (
        <div className="dashboard-page">
        {/* ===== HEADER ===== */}
        <div className="dashboard-header dashboard-header--row">
            <div>
            <h1 className="dashboard-title">Products</h1>
            <p className="dashboard-subtitle">
                Manage your products catalog
            </p>
            </div>

            <button className="btn-primary">
            <Plus size={16} />
            New product
            </button>
        </div>

        {/* ===== TABLE ===== */}
        <div className="dashboard-card">
            {loading ? (
            <p>Loading products…</p>
            ) : products.length === 0 ? (
            <p>No products yet</p>
            ) : (
            <div className="table-wrapper">
                <table className="table">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th className="th-actions">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((p) => (
                    <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>${p.price}</td>
                        <td>{p.stock ?? "—"}</td>
                        <td>
                        <span className={`badge ${p.active ? "completed" : "pending"}`}>
                            {p.active ? "Active" : "Inactive"}
                        </span>
                        </td>

                        <td className="td-actions">
                        <button className="icon-action" aria-label="Edit">
                            <Pencil size={16} />
                        </button>

                        <button className="icon-action danger" aria-label="Delete">
                            <Trash2 size={16} />
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>
        </div>
    );
}



