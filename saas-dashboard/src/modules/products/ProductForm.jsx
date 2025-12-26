import { useState } from "react";
import { createProduct } from "../../services/products.service";
import { useAuth } from "../../context/auth.context";

export default function ProductForm({ onSuccess }) {
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        await createProduct({
        user_id: user.id,
        name,
        price: Number(price),
        });

        setLoading(false);
        onSuccess();
    }

    return (
        <form onSubmit={handleSubmit} className="form">
        <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
            Price
            <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            />
        </label>

        <button className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Create"}
        </button>
        </form>
    );
}
