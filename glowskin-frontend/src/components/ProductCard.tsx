import { useCart } from "../context/CartContext";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  alt: string;
  onSelect?: () => void;
}

export default function ProductCard({ id, name, price, image, alt, onSelect }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="flex flex-col group cursor-pointer" onClick={onSelect}>
      <div className="relative aspect-[3/4] mb-1 sm:mb-2 bg-surface-container rounded-lg md:rounded-xl overflow-hidden ambient-glow">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={image}
          alt={alt}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        <button
          onClick={(e) => { e.stopPropagation(); addItem({ id, name, price, image }); }}
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary hover:bg-surface active:scale-90 transition-all shadow-sm"
          aria-label={`Agregar ${name} al carrito`}
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">add</span>
        </button>
      </div>
      <p className="font-body-md text-sm sm:text-base font-semibold text-on-surface line-clamp-1">{name}</p>
      <p className="font-body-md text-sm sm:text-base text-on-surface-variant">${price.toFixed(2)}</p>
      {/* Ver más — solo visible en mobile */}
      <button
        onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
        className="mt-1 text-label-sm text-primary underline underline-offset-2 text-left sm:hidden"
      >
        Ver más detalles
      </button>
    </div>
  );
}
