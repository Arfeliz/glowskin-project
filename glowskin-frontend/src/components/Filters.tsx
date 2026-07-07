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
  onChange: (category: string) => void;
}

export default function Filters({ active, onChange }: FiltersProps) {
  return (
    <section className="mb-stack-sm md:mb-stack-md lg:mb-stack-lg">
      <div className="flex overflow-x-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop gap-2 md:gap-3 hide-scrollbar max-w-container-max mx-auto">
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
    </section>
  );
}
