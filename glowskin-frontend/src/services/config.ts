const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface AppConfig {
  wa_phone: string;
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
  if (!res.ok) throw new Error("Error al guardar configuración");
  return res.json() as Promise<AppConfig>;
}
