const categories = [
  "Todos",
  "Cuidado Corporal",
  "Skincare",
  "Aromas y Velas",
  "Suplementos",
  "Cuidado Masculino",
];

interface FiltersProps {
  active: string;
  sortBy: "featured" | "price-asc" | "price-desc" | "name";
  maxPrice: number | null;
  onChange: (category: string) => void;
  onSortChange: (value: "featured" | "price-asc" | "price-desc" | "name") => void;
  onMaxPriceChange: (value: number | null) => void;
}

export default function Filters({
  active,
  sortBy,
  maxPrice,
  onChange,
  onSortChange,
  onMaxPriceChange,
}: FiltersProps) {
  return (
    <section className="mb-stack-sm md:mb-stack-md lg:mb-stack-lg">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex overflow-x-auto gap-2 md:gap-3 hide-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`whitespace-nowrap px-4 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-2.5 rounded-full font-label-md text-label-sm sm:text-label-md transition-all flex-shrink-0 ${
                active === cat
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-secondary-container text-primary hover:bg-surface-variant/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-primary">sort</span>
            <select
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value as "featured" | "price-asc" | "price-desc" | "name")}
              className="w-full bg-transparent outline-none text-on-surface"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name">Nombre A–Z</option>
            </select>
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
            <select
              value={maxPrice ?? "all"}
              onChange={(event) => {
                const value = event.target.value;
                onMaxPriceChange(value === "all" ? null : Number(value));
              }}
              className="w-full bg-transparent outline-none text-on-surface"
            >
              <option value="all">Todos los precios</option>
              <option value="30">Hasta $30</option>
              <option value="50">Hasta $50</option>
              <option value="80">Hasta $80</option>
              <option value="120">Hasta $120</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
