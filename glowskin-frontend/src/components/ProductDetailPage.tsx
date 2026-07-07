import { useState } from "react";
import { useCart } from "../context/CartContext";
import type { Product } from "../services/products";

// ─── Accordion ────────────────────────────────────────────────────────────────
function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-outline-variant pb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center py-2 text-left"
      >
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary">
          {title}
        </span>
        <span
          className="material-symbols-outlined transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          expand_more
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "600px" : "0px" }}
      >
        <div className="pt-2">{children}</div>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProductDetailPage({
  product,
  relatedProducts,
  onBack,
  onSelectProduct,
}: ProductDetailPageProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
    setQuantity(1);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* ── Hero ── */}
      <header className="relative w-full h-[300px] sm:h-[420px] md:h-[520px] overflow-hidden">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-md text-on-surface active:scale-95 transition-transform"
          aria-label="Volver"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <button
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-md text-on-surface active:scale-95 transition-transform"
          aria-label="Compartir"
        >
          <span className="material-symbols-outlined">share</span>
        </button>
        <img
          className="w-full h-full object-cover"
          src={product.image}
          alt={product.alt}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </header>

      {/* ── Content ── */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-stack-md">
        {/* Title & info */}
        <div className="flex flex-col space-y-2 mb-stack-md">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-label-sm font-label-sm rounded-full tracking-wide uppercase">
              {product.category}
            </span>
            <div className="flex items-center text-primary">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-label-sm font-label-sm ml-1">4.9 (124)</span>
            </div>
          </div>
          <h1 className="font-headline-md text-headline-md md:text-display-lg text-on-surface">
            {product.name}
          </h1>
          <p className="text-primary font-headline-sm text-headline-sm">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* Accordions */}
        <section className="space-y-4 border-t border-outline-variant pt-stack-md">
          <AccordionItem title="Beneficios" defaultOpen>
            <p className="text-on-surface-variant leading-relaxed">
              Nuestra fórmula magistral penetra profundamente para restaurar el brillo natural de
              tu piel. Diseñado para combatir la opacidad y las manchas leves, dejando un acabado
              aterciopelado y radiante desde la primera aplicación.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <span className="text-body-md">Hidratación profunda 24h</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <span className="text-body-md">Efecto antioxidante potente</span>
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Ingredientes Clave">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {[
                { name: "Vitamina C Estabilizada", desc: "Aclara y unifica el tono de la piel sin irritación." },
                { name: "Extracto de Rosa Mosqueta", desc: "Regeneración celular natural y ácidos grasos esenciales." },
                { name: "Ácido Hialurónico Botánico", desc: "Retención de humedad de origen vegetal." },
              ].map((ing) => (
                <div key={ing.name} className="p-4 bg-surface-container-low rounded-xl">
                  <h4 className="font-label-md text-primary mb-1">{ing.name}</h4>
                  <p className="text-label-sm text-on-surface-variant">{ing.desc}</p>
                </div>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem title="Modo de Uso">
            <p className="text-on-surface-variant italic mb-4">
              "Un ritual para despertar tu belleza interior."
            </p>
            <ol className="space-y-3">
              {[
                "Limpia tu rostro con el Cleanser Botanical.",
                "Aplica 3–4 gotas del producto sobre la piel ligeramente húmeda.",
                "Realiza masajes ascendentes hasta su total absorción.",
              ].map((step, i) => (
                <li key={i} className="flex space-x-4">
                  <span className="font-headline-sm text-primary-container flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-body-md">{step}</span>
                </li>
              ))}
            </ol>
          </AccordionItem>
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-stack-lg pb-stack-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-md">
              Completa tu ritual
            </h3>
            <div className="flex overflow-x-auto gap-gutter hide-scrollbar pb-4 -mx-margin-mobile px-margin-mobile">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="flex-shrink-0 w-44 sm:w-52 md:w-64 group cursor-pointer"
                  onClick={() => onSelectProduct(rel)}
                >
                  <div className="aspect-[4/5] bg-secondary-container rounded-2xl overflow-hidden mb-3">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={rel.image}
                      alt={rel.alt}
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-label-md text-label-md text-on-surface truncate">{rel.name}</h4>
                  <p className="text-primary font-label-sm">${rel.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Sticky bottom bar ── */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant/30 px-margin-mobile py-3 z-50 flex items-center gap-3 shadow-[0px_-5px_20px_rgba(0,0,0,0.04)]">
        {/* Quantity stepper */}
        <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1 border border-outline-variant/20 flex-shrink-0">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 flex items-center justify-center text-primary active:scale-75 transition-transform"
            aria-label="Disminuir cantidad"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <span className="w-7 text-center font-label-md text-on-surface">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 flex items-center justify-center text-primary active:scale-75 transition-transform"
            aria-label="Aumentar cantidad"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {/* Add to list */}
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-primary text-on-primary font-label-md text-label-md h-12 rounded-full active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          style={{ boxShadow: "0px 10px 30px rgba(122, 86, 66, 0.25)" }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          <span>Añadir a mi lista</span>
        </button>
      </nav>
    </div>
  );
}
