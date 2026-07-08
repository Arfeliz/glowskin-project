import { useCart } from "../context/CartContext";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  alt: string;
  category?: string;
  onSelect?: () => void;
}

export default function ProductCard({ id, name, price, image, alt, category, onSelect }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="flex flex-col group cursor-pointer hover-lift" onClick={onSelect}>
      <div className="relative aspect-[3/4] mb-3 bg-surface-container rounded-xl md:rounded-2xl overflow-hidden elegant-shadow group-hover:elegant-shadow-lg transition-shadow duration-500">
        <img
          className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          src={image}
          alt={alt}
          loading="lazy"
        />

        {/* Velo de degradado inferior en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge de categoría */}
        {category && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-surface/85 backdrop-blur-md text-on-surface-variant text-[10px] font-label-sm uppercase tracking-wide rounded-full border border-outline-variant/20 shadow-sm">
            {category}
          </span>
        )}

        {/* Botón agregar — se revela con elegancia en hover, siempre visible en mobile */}
        <button
          onClick={(e) => { e.stopPropagation(); addItem({ id, name, price, image }); }}
          className="absolute bottom-3 right-3 w-10 h-10 sm:w-11 sm:h-11 bg-primary/95 backdrop-blur-sm rounded-full flex items-center justify-center text-on-primary hover:bg-primary active:scale-90 transition-all duration-300 shadow-lg sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0"
          aria-label={`Agregar ${name} al carrito`}
        >
          <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
        </button>
      </div>

      <div className="px-0.5">
        <p className="font-headline-sm text-base sm:text-[17px] leading-snug text-on-surface line-clamp-1 group-hover:text-primary transition-colors duration-300">{name}</p>
        <div className="flex items-center justify-between mt-0.5">
          <p className="font-body-md text-sm sm:text-base font-semibold text-primary">${price.toFixed(2)}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
            className="hidden sm:inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 duration-300"
          >
            Ver más
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
        {/* Ver más — solo visible en mobile */}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
          className="mt-1 text-label-sm text-primary underline underline-offset-2 text-left sm:hidden"
        >
          Ver más detalles
        </button>
      </div>
    </div>
  );
}
