import { useEffect, useState } from "react";
import { getProducts } from "../services/products.service";
import { useAuth } from "../context/auth.context";

export function useProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function load() {
        setLoading(true);
        const data = await getProducts(user.id);
        setProducts(data);
        setLoading(false);
        }

        load();
    }, [user]);

    return { products, loading, setProducts };
}
