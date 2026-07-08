import type { Request, Response } from "express";
import { supabase } from "../config/supabase.js";

type ConfigRow = { key: string; value: string };
type ConfigMap = Record<string, string>;

// GET /api/config — público
export async function getConfig(_req: Request, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from("config")
    .select("key, value");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const cfg = Object.fromEntries(
    (data as ConfigRow[]).map(({ key, value }) => [key, value])
  ) as ConfigMap;

  res.json(cfg);
}

// PUT /api/config — solo admin
export async function updateConfig(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, string>;
  const entries = Object.entries(body);

  for (const [key, value] of entries) {
    const { error } = await supabase
      .from("config")
      .upsert({ key, value }, { onConflict: "key" });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
  }

  const { data, error } = await supabase.from("config").select("key, value");
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const cfg = Object.fromEntries(
    (data as ConfigRow[]).map(({ key, value }) => [key, value])
  ) as ConfigMap;

  res.json(cfg);
}
