import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { supabase } from "../config/supabase";

const BUCKET = "product-images";
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function listProductImages(_req: Request, res: Response): Promise<void> {
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 500,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const images = data
    .filter((file) => file.name && EXTENSIONS[file.metadata?.mimetype ?? ""])
    .map((file) => ({
      path: file.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl,
      createdAt: file.created_at,
    }));

  res.json(images);
}

export async function uploadProductImage(req: Request, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "Selecciona una imagen para subir" });
    return;
  }

  const extension = EXTENSIONS[file.mimetype];
  if (!extension) {
    res.status(400).json({ error: "Formato no permitido. Usa JPG, PNG, WebP o GIF" });
    return;
  }

  const path = `${randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file.buffer, {
    cacheControl: "31536000",
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  res.status(201).json({ path, url });
}

export async function deleteProductImage(req: Request, res: Response): Promise<void> {
  const { path } = req.body as { path?: unknown };
  if (typeof path !== "string" || !/^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/i.test(path)) {
    res.status(400).json({ error: "Ruta de imagen inválida" });
    return;
  }

  const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, images")
    .eq("image", url)
    .limit(1);

  if (productsError) {
    res.status(500).json({ error: productsError.message });
    return;
  }
  if (products?.length) {
    res.status(409).json({ error: "No se puede borrar: esta imagen está asignada a un producto" });
    return;
  }

  const { data: productsWithImage, error: imagesError } = await supabase
    .from("products")
    .select("id")
    .contains("images", [url])
    .limit(1);

  if (imagesError) {
    res.status(500).json({ error: imagesError.message });
    return;
  }
  if (productsWithImage?.length) {
    res.status(409).json({ error: "No se puede borrar: esta imagen está asignada a un producto" });
    return;
  }

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(204).send();
}