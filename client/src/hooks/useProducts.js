import { useState, useEffect } from "react";
import { API_URL } from "../lib/api";

function mapProduct(p) {
  return {
    id: p.id,
    driver: p.driver,
    year: p.year,
    set: p.set_name,
    condition: p.condition,
    price: Number(p.price),
    image: p.image_url,
    sport: p.sport,
    product_type: p.product_type,
    stock: p.stock,
    featured: p.featured,
  };
}

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) query.set(key, value);
    }

    fetch(`${API_URL}/api/products?${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.map(mapProduct));
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { products, loading, error };
}
