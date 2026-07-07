import { useState } from "react";
import type { Product } from "../services/products";

const CATEGORIES = ["Skincare", "Cuidado Corporal", "Aromas y Velas", "Suplementos", "Cuidado Masculino"];

export interface AdminProduct extends Product {
  stock: number;
}

interface AdminProductEditPageProps {
  product: AdminProduct;
  onSave: (p: AdminProduct) => void;
  onClose: () => void;
}

// ── Small helpers ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest border-b border-outline-variant pb-2 mb-3">
      {children}
    </h3>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-bold text-primary uppercase tracking-wide ml-1 block mb-1">
      {children}
    </label>
  );
}

function TextInput({
  value, onChange, placeholder, type = "text",
}: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary text-sm bg-white outline-none transition-colors"
    />
  );
}

// ── Main edit page ───────────────────────────────────────────────────────────

export default function AdminProductEditPage({
  product,
  onSave,
  onClose,
}: AdminProductEditPageProps) {
  const [form, setForm] = useState<AdminProduct>({
    description: "",
    benefitPoints: ["Hidratación profunda 24h", "Efecto antioxidante potente"],
    ingredients: [
      { name: "Vitamina C Estabilizada", desc: "Aclara y unifica el tono de la piel sin irritación." },
      { name: "Extracto de Rosa Mosqueta", desc: "Regeneración celular natural y ácidos grasos esenciales." },
    ],
    usageSteps: [
      "Limpia tu rostro con el Cleanser Botanical.",
      "Aplica 3–4 gotas del producto sobre la piel ligeramente húmeda.",
      "Realiza masajes ascendentes hasta su total absorción.",
    ],
    ...product,
  });

  const set = <K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Benefit points
  const setBenefitPoint = (i: number, v: string) => {
    const arr = [...(form.benefitPoints ?? [])];
    arr[i] = v;
    set("benefitPoints", arr);
  };
  const addBenefitPoint = () => set("benefitPoints", [...(form.benefitPoints ?? []), ""]);
  const removeBenefitPoint = (i: number) =>
    set("benefitPoints", (form.benefitPoints ?? []).filter((_, idx) => idx !== i));

  // Ingredients
  const setIngredient = (i: number, field: "name" | "desc", v: string) => {
    const arr = [...(form.ingredients ?? [])];
    arr[i] = { ...arr[i], [field]: v };
    set("ingredients", arr);
  };
  const addIngredient = () =>
    set("ingredients", [...(form.ingredients ?? []), { name: "", desc: "" }]);
  const removeIngredient = (i: number) =>
    set("ingredients", (form.ingredients ?? []).filter((_, idx) => idx !== i));

  // Usage steps
  const setUsageStep = (i: number, v: string) => {
    const arr = [...(form.usageSteps ?? [])];
    arr[i] = v;
    set("usageSteps", arr);
  };
  const addUsageStep = () => set("usageSteps", [...(form.usageSteps ?? []), ""]);
  const removeUsageStep = (i: number) =>
    set("usageSteps", (form.usageSteps ?? []).filter((_, idx) => idx !== i));

  const valid = form.name.trim().length > 0 && form.price > 0;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-margin-mobile h-14 sm:h-16">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-on-surface-variant hover:text-primary active:scale-90 transition-all"
          aria-label="Volver"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-label-sm font-label-sm hidden sm:inline">Volver</span>
        </button>
        <h1 className="font-headline-md text-headline-sm text-primary tracking-tight select-none truncate mx-4 max-w-[160px] sm:max-w-xs text-center">
          {form.name || "Nuevo producto"}
        </h1>
        <button
          onClick={() => valid && onSave(form)}
          disabled={!valid}
          className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md active:scale-95 transition-all disabled:opacity-40 shadow-md"
        >
          Guardar
        </button>
      </header>

      <div className="max-w-lg mx-auto px-margin-mobile space-y-8 pt-6">

        {/* ── Hero preview ── */}
        {form.image && (
          <div className="relative w-full h-52 sm:h-72 rounded-2xl overflow-hidden bg-secondary-container">
            <img src={form.image} alt={form.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className="px-3 py-1 bg-secondary-container/80 text-on-secondary-container text-label-sm rounded-full backdrop-blur-sm">
                {form.category}
              </span>
            </div>
          </div>
        )}

        {/* ── 1. Datos básicos ── */}
        <section className="space-y-4">
          <SectionTitle>Datos básicos</SectionTitle>

          <div className="space-y-1">
            <FieldLabel>Nombre del producto</FieldLabel>
            <TextInput value={form.name} onChange={(v) => set("name", v)} placeholder="Ej. Serum Iluminador Aurora" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <FieldLabel>Precio ($)</FieldLabel>
              <TextInput
                type="number"
                value={form.price ? String(form.price) : ""}
                onChange={(v) => set("price", Number(v) || 0)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1">
              <FieldLabel>Stock</FieldLabel>
              <TextInput
                type="number"
                value={form.stock ? String(form.stock) : ""}
                onChange={(v) => set("stock", Number(v) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-1">
            <FieldLabel>Categoría</FieldLabel>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary text-sm bg-white outline-none transition-colors"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <FieldLabel>URL de imagen</FieldLabel>
            <TextInput value={form.image} onChange={(v) => set("image", v)} placeholder="https://..." />
          </div>

          <div className="space-y-1">
            <FieldLabel>Texto alternativo (alt)</FieldLabel>
            <TextInput value={form.alt} onChange={(v) => set("alt", v)} placeholder="Descripción de la imagen para accesibilidad" />
          </div>
        </section>

        {/* ── 2. Beneficios ── */}
        <section className="space-y-4">
          <SectionTitle>Beneficios</SectionTitle>

          <div className="space-y-1">
            <FieldLabel>Descripción general</FieldLabel>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe los beneficios principales del producto..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary text-sm bg-white outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>Puntos destacados</FieldLabel>
            {(form.benefitPoints ?? []).map((point, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px] flex-shrink-0">check_circle</span>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => setBenefitPoint(i, e.target.value)}
                  placeholder="Ej. Hidratación profunda 24h"
                  className="flex-1 px-3 py-2 rounded-lg border border-outline-variant focus:border-primary text-sm bg-white outline-none transition-colors"
                />
                <button
                  onClick={() => removeBenefitPoint(i)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-error-container text-on-surface-variant hover:text-error active:scale-90 transition-all flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
              </div>
            ))}
            <button
              onClick={addBenefitPoint}
              className="flex items-center gap-1 text-sm text-primary hover:opacity-80 active:scale-95 transition-all font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Agregar punto
            </button>
          </div>
        </section>

        {/* ── 3. Ingredientes ── */}
        <section className="space-y-3">
          <SectionTitle>Ingredientes Clave</SectionTitle>
          {(form.ingredients ?? []).map((ing, i) => (
            <div key={i} className="bg-surface-container-low rounded-xl p-3 space-y-2 relative">
              <button
                onClick={() => removeIngredient(i)}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-error-container text-on-surface-variant hover:text-error active:scale-90 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
              <div className="space-y-1 pr-8">
                <FieldLabel>Nombre</FieldLabel>
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => setIngredient(i, "name", e.target.value)}
                  placeholder="Ej. Vitamina C Estabilizada"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant focus:border-primary text-sm bg-white outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel>Descripción</FieldLabel>
                <input
                  type="text"
                  value={ing.desc}
                  onChange={(e) => setIngredient(i, "desc", e.target.value)}
                  placeholder="Breve descripción del ingrediente"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant focus:border-primary text-sm bg-white outline-none transition-colors"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addIngredient}
            className="flex items-center gap-1 text-sm text-primary hover:opacity-80 active:scale-95 transition-all font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Agregar ingrediente
          </button>
        </section>

        {/* ── 4. Modo de uso ── */}
        <section className="space-y-3">
          <SectionTitle>Modo de Uso</SectionTitle>
          {(form.usageSteps ?? []).map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="font-headline-sm text-primary-container text-lg flex-shrink-0 mt-2 w-7 text-center">
                {String(i + 1).padStart(2, "0")}
              </span>
              <input
                type="text"
                value={step}
                onChange={(e) => setUsageStep(i, e.target.value)}
                placeholder={`Paso ${i + 1}...`}
                className="flex-1 px-3 py-2 rounded-lg border border-outline-variant focus:border-primary text-sm bg-white outline-none transition-colors"
              />
              <button
                onClick={() => removeUsageStep(i)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-error-container text-on-surface-variant hover:text-error active:scale-90 transition-all flex-shrink-0 mt-1"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
            </div>
          ))}
          <button
            onClick={addUsageStep}
            className="flex items-center gap-1 text-sm text-primary hover:opacity-80 active:scale-95 transition-all font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Agregar paso
          </button>
        </section>
      </div>

      {/* ── Sticky bottom bar ── */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 px-margin-mobile py-3 flex gap-3 z-40">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container active:scale-95 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={() => valid && onSave(form)}
          disabled={!valid}
          className="flex-1 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-md active:scale-95 transition-all disabled:opacity-40"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
