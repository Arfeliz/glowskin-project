import { useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import type { Product } from "../services/products";
import { DEFAULT_PRODUCT_BENEFIT_POINTS, DEFAULT_PRODUCT_DESCRIPTION } from "./productContent";

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
  isFavorite: boolean;
  onToggleFavorite: (productId: number) => void;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProductDetailPage({
  product,
  relatedProducts,
  isFavorite,
  onToggleFavorite,
  onBack,
  onSelectProduct,
}: ProductDetailPageProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [shareMessage, setShareMessage] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const galleryImages = product.images?.length ? product.images : product.image ? [product.image] : [];

  const showPreviousImage = () => {
    setActiveImage((index) => (index - 1 + galleryImages.length) % galleryImages.length);
  };
  const showNextImage = () => {
    setActiveImage((index) => (index + 1) % galleryImages.length);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
    setQuantity(1);
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("pagina");
    url.searchParams.set("producto", String(product.id));
    const shareUrl = url.toString();

    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: `Mira ${product.name} en GlowSkin`, url: shareUrl });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("Enlace copiado");
        window.setTimeout(() => setShareMessage(""), 2500);
        return;
      } catch {
        // Usa el cuadro del navegador si el portapapeles no está disponible.
      }
    }

    window.prompt("Copia el enlace del artículo:", shareUrl);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* ── Hero ── */}
      <header
        className="relative w-full h-[300px] sm:h-[420px] md:h-[520px] overflow-hidden"
        role="group"
        aria-label={`Galería de imágenes de ${product.name}`}
        aria-roledescription="carrusel"
        onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current;
          const endX = event.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (startX === null || endX === undefined || Math.abs(endX - startX) < 45 || galleryImages.length < 2) return;
          if (endX < startX) showNextImage();
          else showPreviousImage();
        }}
      >
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-md text-on-surface active:scale-95 transition-transform"
          aria-label="Volver"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <button
          onClick={() => void handleShare()}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-md text-on-surface active:scale-95 transition-transform"
          aria-label="Compartir"
          title="Compartir artículo"
        >
          <span className="material-symbols-outlined">share</span>
        </button>
        {shareMessage && (
          <div role="status" className="absolute top-16 right-4 z-20 rounded-lg bg-surface-container-lowest px-3 py-2 text-sm text-on-surface shadow-lg">
            {shareMessage}
          </div>
        )}
        <img
          className="w-full h-full object-cover"
          src={galleryImages[activeImage] ?? product.image}
          alt={product.alt}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/80 text-on-surface backdrop-blur-md active:scale-95"
              aria-label="Imagen anterior"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/80 text-on-surface backdrop-blur-md active:scale-95"
              aria-label="Imagen siguiente"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2" aria-label="Seleccionar imagen">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-2.5 w-2.5 rounded-full border border-white transition-colors ${activeImage === index ? "bg-white" : "bg-black/30"}`}
                  aria-label={`Ver imagen ${index + 1} de ${galleryImages.length}`}
                  aria-current={activeImage === index ? "true" : undefined}
                />
              ))}
            </div>
          </>
        )}
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
              {product.description ?? DEFAULT_PRODUCT_DESCRIPTION}
            </p>
            {(product.benefitPoints ?? DEFAULT_PRODUCT_BENEFIT_POINTS).length > 0 && (
              <ul className="mt-4 space-y-2">
                {(product.benefitPoints ?? DEFAULT_PRODUCT_BENEFIT_POINTS).map((point) => (
                  <li key={point} className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span className="text-body-md">{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </AccordionItem>

          <AccordionItem title="Ingredientes Clave">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {(product.ingredients ?? [
                { name: "Vitamina C Estabilizada", desc: "Aclara y unifica el tono de la piel sin irritación." },
                { name: "Extracto de Rosa Mosqueta", desc: "Regeneración celular natural y ácidos grasos esenciales." },
                { name: "Ácido Hialurónico Botánico", desc: "Retención de humedad de origen vegetal." },
              ]).map((ing) => (
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
              {(product.usageSteps ?? [
                "Limpia tu rostro con el Cleanser Botanical.",
                "Aplica 3–4 gotas del producto sobre la piel ligeramente húmeda.",
                "Realiza masajes ascendentes hasta su total absorción.",
              ]).map((step, i) => (
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

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-outline-variant text-primary transition-transform active:scale-90"
          aria-label={`Agregar ${quantity} ${quantity === 1 ? "artículo" : "artículos"} al carrito`}
          title="Agregar al carrito"
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          aria-pressed={isFavorite}
          className={`flex-1 h-12 rounded-full font-label-md text-label-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            isFavorite
              ? "bg-secondary-container text-primary"
              : "bg-primary text-on-primary"
          }`}
          style={!isFavorite ? { boxShadow: "0px 10px 30px rgba(122, 86, 66, 0.25)" } : undefined}
        >
          <span
            className={`material-symbols-outlined transition-transform duration-300 ${isFavorite ? "scale-125" : "scale-100"}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          <span>{isFavorite ? "En mi lista" : "Añadir a mi lista"}</span>
        </button>
      </nav>
    </div>
  );
}
