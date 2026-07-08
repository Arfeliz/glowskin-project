const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: string;
  stock?: number;
  // Rich content shown in product detail page (editable from admin)
  description?: string;
  benefitPoints?: string[];
  ingredients?: { name: string; desc: string }[];
  usageSteps?: string[];
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
    throw new Error(err.error ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/products");
}

export async function loginAdmin(email: string, password: string): Promise<string> {
  const data = await apiFetch<{ token: string }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return data.token;
}

export async function createProduct(product: Omit<Product, "id">, token: string): Promise<Product> {
  return apiFetch<Product>("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id: number, product: Partial<Product>, token: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: number, token: string): Promise<void> {
  return apiFetch<void>(`/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
