// src/modules/sales/NewSale.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSales } from "../../hooks/useSales";
import { useToast } from "../../hooks/useToast";  // ✅ AÑADIR
import Toast from "../../components/ui/Toast";     // ✅ AÑADIR
import { getProducts } from "../../services/products.service";
import { Search, Plus, Minus, Trash2, ShoppingCart, X } from "lucide-react";
import "../../styles/tables.css";
import "../../styles/filters.css";

export default function NewSale() {
    const navigate = useNavigate();
    const { createOrder, saving } = useSales();
    const { toast, success, error: showError, hideToast } = useToast();  // ✅ AÑADIR
    
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState("");

    // Cargar productos
    useEffect(() => {
        async function loadProducts() {
            setLoading(true);
            const { data } = await getProducts();
            setProducts((data || []).filter(p => p.status === "active"));
            setLoading(false);
        }
        loadProducts();
    }, []);

    // Filtrar productos por búsqueda
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    // Calcular total del carrito
    const total = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.subtotal, 0);
    }, [cart]);

    // Agregar producto al carrito
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.product_id === product.id);

        if (existingItem) {
            // Verificar stock disponible
            if (existingItem.quantity >= product.stock) {
                setError(`Stock máximo disponible: ${product.stock}`);
                return;
            }

            // Incrementar cantidad
            setCart(cart.map(item =>
                item.product_id === product.id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                        subtotal: (item.quantity + 1) * item.price
                    }
                    : item
            ));
        } else {
            // Agregar nuevo item
            if (product.stock === 0) {
                setError("Producto sin stock disponible");
                return;
            }

            setCart([...cart, {
                product_id: product.id,
                product_name: product.name,
                quantity: 1,
                price: Number(product.price),
                subtotal: Number(product.price),
                stock_available: product.stock
            }]);
        }

        setError(null);
    };

    // Modificar cantidad en el carrito
    const updateQuantity = (productId, change) => {
        setCart(cart.map(item => {
            if (item.product_id === productId) {
                const newQuantity = item.quantity + change;

                // Validaciones
                if (newQuantity < 1) return item;
                if (newQuantity > item.stock_available) {
                    setError(`Stock máximo disponible: ${item.stock_available}`);
                    return item;
                }

                setError(null);
                return {
                    ...item,
                    quantity: newQuantity,
                    subtotal: newQuantity * item.price
                };
            }
            return item;
        }));
    };

    // Eliminar item del carrito
    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product_id !== productId));
        setError(null);
    };

    // Limpiar carrito
    const clearCart = () => {
        setCart([]);
        setNotes("");
        setError(null);
    };

    // Confirmar venta
    const [showToast, setShowToast] = useState(false);
    const handleConfirmSale = async () => {
    console.log("🔵 INICIANDO VENTA");
    
    if (cart.length === 0) {
        setError("Debes agregar al menos un producto");
        return;
    }

    setError(null);

    const payload = {
        items: cart,
        total: total,
        notes: notes.trim() || null
    };

    console.log("📦 PAYLOAD:", payload);

    const result = await createOrder(payload);

    console.log("✅ RESULTADO:", result);

    if (result?.error) {
        console.error("❌ ERROR:", result.error);
        showError(result.error.message || "Error al crear la venta");  // ✅ CAMBIAR
        return;
    }

    if (result?.ok) {
        console.log("🎉 VENTA EXITOSA");
        clearCart();
        success("¡Venta creada exitosamente! 🎉");
        navigate("/sales/orders");
    }
};

    return (
    <div className="dashboard-page">
        {/* Toast notification */}
        {toast && (
            <Toast
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onClose={hideToast}
            />
        )}
            <div className="page-header">
                <div>
                    <h1 className="dashboard-title">Nueva Venta</h1>
                    <p className="dashboard-subtitle">
                        Registra una nueva venta en el sistema
                    </p>
                </div>

                {cart.length > 0 && (
                    <button
                        className="nd-btn nd-btn--secondary"
                        onClick={clearCart}
                        disabled={saving}
                    >
                        <Trash2 size={16} />
                        Limpiar carrito
                    </button>
                )}
            </div>

            {error && (
                <div className="nd-alert nd-alert--error" style={{ marginBottom: "20px" }}>
                    {error}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "20px" }}>
                {/* SELECTOR DE PRODUCTOS */}
                <div className="dashboard-card">
                    <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "600" }}>
                        Productos disponibles
                    </h3>

                    {/* Búsqueda */}
                    <div className="search-box" style={{ marginBottom: "16px" }}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Lista de productos */}
                    {loading ? (
                        <div className="empty-state">
                            <p className="empty-title">Cargando productos...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="empty-state">
                            <p className="empty-title">No hay productos disponibles</p>
                        </div>
                    ) : (
                        <div style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "12px",
                                        borderBottom: "1px solid var(--color-border, #374151)",
                                        cursor: product.stock === 0 ? "not-allowed" : "pointer",
                                        opacity: product.stock === 0 ? 0.5 : 1
                                    }}
                                    onClick={() => product.stock > 0 && addToCart(product)}
                                >
                                    <div>
                                        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                                            {product.name}
                                        </div>
                                        <div style={{ fontSize: "13px", color: "var(--color-text-secondary, #9ca3af)" }}>
                                            Stock: {product.stock} · ${Number(product.price).toFixed(2)}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="nd-btn nd-btn--primary"
                                        style={{ minWidth: "auto", padding: "8px 12px" }}
                                        disabled={product.stock === 0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product);
                                        }}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CARRITO */}
                <div className="dashboard-card" style={{ position: "sticky", top: "20px", maxHeight: "calc(100vh - 40px)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <ShoppingCart size={20} />
                        <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
                            Carrito ({cart.length})
                        </h3>
                    </div>

                    {cart.length === 0 ? (
                        <div className="empty-state" style={{ padding: "40px 20px" }}>
                            <ShoppingCart size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                            <p className="empty-title">Carrito vacío</p>
                            <p className="empty-subtitle">Agrega productos para comenzar</p>
                        </div>
                    ) : (
                        <>
                            {/* Items del carrito */}
                            <div style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto", marginBottom: "16px" }}>
                                {cart.map(item => (
                                    <div
                                        key={item.product_id}
                                        style={{
                                            padding: "12px",
                                            borderBottom: "1px solid var(--color-border, #374151)",
                                            marginBottom: "8px"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <div style={{ fontWeight: "500", flex: 1 }}>
                                                {item.product_name}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFromCart(item.product_id)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "#ef4444",
                                                    cursor: "pointer",
                                                    padding: "0 4px"
                                                }}
                                                title="Eliminar"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        <div style={{ fontSize: "13px", color: "var(--color-text-secondary, #9ca3af)", marginBottom: "8px" }}>
                                            ${item.price.toFixed(2)} × {item.quantity} = ${item.subtotal.toFixed(2)}
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.product_id, -1)}
                                                disabled={item.quantity <= 1}
                                                style={{
                                                    padding: "4px 8px",
                                                    background: "var(--color-bg-secondary, #374151)",
                                                    border: "1px solid var(--color-border, #4b5563)",
                                                    borderRadius: "4px",
                                                    color: "white",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <Minus size={14} />
                                            </button>

                                            <span style={{ minWidth: "30px", textAlign: "center" }}>
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.product_id, 1)}
                                                disabled={item.quantity >= item.stock_available}
                                                style={{
                                                    padding: "4px 8px",
                                                    background: "var(--color-bg-secondary, #374151)",
                                                    border: "1px solid var(--color-border, #4b5563)",
                                                    borderRadius: "4px",
                                                    color: "white",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Notas */}
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
                                    Notas (opcional)
                                </label>
                                <textarea
                                    placeholder="Agrega notas sobre esta venta..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    style={{
                                        width: "100%",
                                        padding: "8px",
                                        background: "var(--color-bg-input, #0f1419)",
                                        border: "1px solid var(--color-border, #374151)",
                                        borderRadius: "6px",
                                        color: "white",
                                        resize: "none"
                                    }}
                                />
                            </div>

                            {/* Total */}
                            <div style={{
                                padding: "16px",
                                background: "var(--color-bg-secondary, #374151)",
                                borderRadius: "8px",
                                marginBottom: "16px"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "18px", fontWeight: "600" }}>Total:</span>
                                    <span style={{ fontSize: "24px", fontWeight: "700", color: "#3b82f6" }}>
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Botón confirmar */}
                            <button
                                className="nd-btn nd-btn--primary"
                                style={{ width: "100%", fontSize: "16px", padding: "12px" }}
                                onClick={handleConfirmSale}
                                disabled={saving || cart.length === 0}
                            >
                                {saving ? "Procesando..." : "Confirmar Venta"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}