const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: string;
  // Rich content shown in product detail page (editable from admin)
  description?: string;
  benefitPoints?: string[];
  ingredients?: { name: string; desc: string }[];
  usageSteps?: string[];
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}
