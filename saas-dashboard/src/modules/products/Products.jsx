// src/modules/products/Products.jsx
import { useState, useMemo, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { getCategories } from "../../services/products.service";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import "../../styles/tables.css";
import "../../styles/filters.css";
import { Pencil, Trash2, Search, ArrowUpDown } from "lucide-react";

export default function Products() {
    const { products, loading, saving, error, createProduct, updateProduct, deleteProduct } = useProducts();
    
    // Estados para modales
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Estados para filtros y búsqueda
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [categories, setCategories] = useState([]);

    // Cargar categorías
    useEffect(() => {
        async function loadCategories() {
            const { data } = await getCategories();
            setCategories(data || []);
        }
        loadCategories();
    }, []);

    // Filtrar y ordenar productos
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Búsqueda por nombre
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por categoría
        if (categoryFilter !== "all") {
            filtered = filtered.filter(p => 
                p.category_id?.toString() === categoryFilter
            );
        }

        // Filtro por estado
        if (statusFilter !== "all") {
            if (statusFilter === "out_of_stock") {
                filtered = filtered.filter(p => p.stock === 0);
            } else {
                filtered = filtered.filter(p => p.status === statusFilter);
            }
        }

        // Ordenar
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "price":
                    comparison = a.price - b.price;
                    break;
                case "stock":
                    comparison = a.stock - b.stock;
                    break;
                case "created_at":
                default:
                    comparison = new Date(a.created_at) - new Date(b.created_at);
                    break;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

        return filtered;
    }, [products, searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);

    // Handlers
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setOpenEdit(true);
    };

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setOpenDelete(true);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: "Sin stock", class: "nd-badge--error" };
        if (stock < 10) return { label: `${stock} unid.`, class: "nd-badge--warn" };
        return { label: `${stock} unid.`, class: "nd-badge--ok" };
    };

    return (
        <div className="dashboard-page">
            {/* HEADER */}
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">Products</h1>
                    <p className="dashboard-subtitle">
                        Manage your products catalog · {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                    </p>
                </div>

                <button 
                    className="nd-btn nd-btn--primary" 
                    onClick={() => setOpenCreate(true)}
                >
                    + New product
                </button>
            </div>

            {/* FILTROS Y BÚSQUEDA */}
            <div className="dashboard-card" style={{ marginBottom: "20px" }}>
                <div className="filters-container">
                    {/* Búsqueda */}
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search products by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filtros */}
                    <div className="filters-row">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="created_at">Sort by Date</option>
                            <option value="name">Sort by Name</option>
                            <option value="price">Sort by Price</option>
                            <option value="stock">Sort by Stock</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="sort-btn"
                            title={sortOrder === "asc" ? "Ascending" : "Descending"}
                        >
                            <ArrowUpDown size={16} />
                            {sortOrder === "asc" ? "↑" : "↓"}
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="dashboard-card">
                {error && <div className="nd-alert nd-alert--error">{error}</div>}

                {loading ? (
                    <div className="empty-state">
                        <p className="empty-title">Loading products…</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-title">
                            {searchTerm || categoryFilter !== "all" || statusFilter !== "all" 
                                ? "No products found" 
                                : "No products yet"
                            }
                        </p>
                        <p className="empty-subtitle">
                            {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                                ? "Try adjusting your filters or search term"
                                : "Create your first product to get started"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="nd-table-wrap">
                        <table className="nd-table">
                            <thead>
                                <tr>
                                    <th 
                                        onClick={() => handleSort("name")} 
                                        style={{ cursor: "pointer", userSelect: "none" }}
                                    >
                                        Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th>Category</th>
                                    <th 
                                        className="nd-col-num" 
                                        onClick={() => handleSort("price")}
                                        style={{ cursor: "pointer", userSelect: "none" }}
                                    >
                                        Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th 
                                        onClick={() => handleSort("stock")}
                                        style={{ cursor: "pointer", userSelect: "none" }}
                                    >
                                        Stock {sortBy === "stock" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th>Status</th>
                                    <th className="nd-col-actions">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.map((p) => {
                                    const stockStatus = getStockStatus(p.stock);
                                    return (
                                        <tr key={p.id}>
                                            <td>
                                                <div className="nd-cell-title">{p.name}</div>
                                                {p.description && (
                                                    <div className="nd-cell-sub">{p.description}</div>
                                                )}
                                            </td>

                                            <td>
                                                <span className="category-label">
                                                    {p.category_name}
                                                </span>
                                            </td>

                                            <td className="nd-col-num">
                                                ${Number(p.price).toFixed(2)}
                                            </td>

                                            <td>
                                                <span className={`nd-badge ${stockStatus.class}`}>
                                                    {stockStatus.label}
                                                </span>
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
                                                        type="button"
                                                        className="nd-icon-btn"
                                                        title="Edit"
                                                        onClick={() => handleEdit(p)}
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="nd-icon-btn nd-icon-btn--danger"
                                                        title="Delete"
                                                        onClick={() => handleDelete(p)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODALES */}
            <CreateProductModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreate={createProduct}
                saving={saving}
                categories={categories}
                onCategoryCreated={(newCategory) => {
                    // Agregar la nueva categoría a la lista
                    setCategories(prev => [...prev, newCategory]);
                }}
            />

            <EditProductModal
                open={openEdit}
                onClose={() => {
                    setOpenEdit(false);
                    setSelectedProduct(null);
                }}
                onUpdate={updateProduct}
                saving={saving}
                product={selectedProduct}
                categories={categories}
            />

            <DeleteConfirmModal
                open={openDelete}
                onClose={() => {
                    setOpenDelete(false);
                    setSelectedProduct(null);
                }}
                onConfirm={deleteProduct}
                saving={saving}
                product={selectedProduct}
            />
        </div>
    );
}