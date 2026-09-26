const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface ProductImage {
  path: string;
  url: string;
  createdAt?: string;
}

async function imageRequest<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/images${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText })) as { error?: string };
    throw new Error(body.error ?? response.statusText);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getProductImages(token: string): Promise<ProductImage[]> {
  return imageRequest<ProductImage[]>("/", token);
}

export function uploadProductImage(file: File, token: string): Promise<ProductImage> {
  const body = new FormData();
  body.append("image", file);
  return imageRequest<ProductImage>("/", token, { method: "POST", body });
}

export function deleteProductImage(path: string, token: string): Promise<void> {
  return imageRequest<void>("/", token, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
}