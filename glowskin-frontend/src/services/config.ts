const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface AppConfig {
  wa_phone: string;
  instagram_url: string;
  tiktok_url: string;
  promo_badge?: string;
  promo_title?: string;
  promo_subtitle?: string;
  banner_image_url?: string;
  promo_cta?: string;
}

export async function getConfig(): Promise<AppConfig> {
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok) throw new Error("Error al obtener configuración");
  return res.json() as Promise<AppConfig>;
}

export async function updateConfig(config: Partial<AppConfig>, token: string): Promise<AppConfig> {
  const res = await fetch(`${API_BASE}/config`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Error al guardar configuración" })) as { error?: string };
    throw new Error(error.error ?? "Error al guardar configuración");
  }
  return res.json() as Promise<AppConfig>;
}
