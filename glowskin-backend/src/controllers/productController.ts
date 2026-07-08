import type { Request, Response } from "express";
import { supabase } from "../config/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DbProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: string;
  stock: number;
  description: string | null;
  benefit_points: string[] | null;
  ingredients: { name: string; desc: string }[] | null;
  usage_steps: string[] | null;
}

interface ApiProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: string;
  stock: number;
  description?: string;
  benefitPoints?: string[];
  ingredients?: { name: string; desc: string }[];
  usageSteps?: string[];
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function toApi(row: DbProduct): ApiProduct {
  const product: ApiProduct = {
    id: row.id,
    name: row.name,
    price: row.price,
    image: row.image,
    alt: row.alt,
    category: row.category,
    stock: row.stock,
  };
  if (row.description)    product.description   = row.description;
  if (row.benefit_points) product.benefitPoints = row.benefit_points;
  if (row.ingredients)    product.ingredients   = row.ingredients;
  if (row.usage_steps)    product.usageSteps    = row.usage_steps;
  return product;
}

function toDb(body: Partial<ApiProduct>): Partial<DbProduct> {
  const row: Partial<DbProduct> = {};
  if (body.name        !== undefined) row.name         = body.name;
  if (body.price       !== undefined) row.price        = body.price;
  if (body.image       !== undefined) row.image        = body.image;
  if (body.alt         !== undefined) row.alt          = body.alt;
  if (body.category    !== undefined) row.category     = body.category;
  if (body.stock       !== undefined) row.stock        = body.stock;
  if (body.description !== undefined) row.description  = body.description ?? null;
  if (body.benefitPoints !== undefined) row.benefit_points = body.benefitPoints ?? null;
  if (body.ingredients   !== undefined) row.ingredients    = body.ingredients ?? null;
  if (body.usageSteps    !== undefined) row.usage_steps    = body.usageSteps ?? null;
  return row;
}

// ── Controllers ───────────────────────────────────────────────────────────────

export async function getAllProducts(_req: Request, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json((data as DbProduct[]).map(toApi));
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.json(toApi(data as DbProduct));
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const { name, price, image, alt, category, stock } = req.body as Partial<ApiProduct>;

  if (!name || !price || !image || !alt || !category) {
    res.status(400).json({ error: "Campos requeridos: name, price, image, alt, category" });
    return;
  }

  const row = toDb({ ...req.body as ApiProduct, stock: stock ?? 0 });

  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(toApi(data as DbProduct));
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const row = toDb(req.body as Partial<ApiProduct>);

  const { data, error } = await supabase
    .from("products")
    .update(row)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    res.status(404).json({ error: "Producto no encontrado o error al actualizar" });
    return;
  }

  res.json(toApi(data as DbProduct));
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(204).send();
}
