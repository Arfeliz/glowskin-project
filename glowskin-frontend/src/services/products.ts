const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: string;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}
