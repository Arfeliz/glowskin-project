import type { Product } from "../services/products";

interface FavoritesPageProps {
  products: Product[];
  favorites: number[];
  onRemove: (productId: number) => void;
  onSelectProduct: (product: Product) => void;
}

export default function FavoritesPage({
  products,
  favorites,
  onRemove,
  onSelectProduct,
}: FavoritesPageProps) {
  const items = favorites.flatMap((productId) => {
    const product = products.find((item) => item.id === productId);
    return product ? [product] : [];
  });

  return (
    <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24">
      <header className="mb-stack-lg">
        <h2 className="mb-2 font-headline-md text-headline-md text-on-surface">Favoritos</h2>
        <p className="font-body-md text-on-surface-variant">
          Artículos guardados para volver a consultar.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-outline">favorite_border</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">Aún no tienes favoritos</p>
          <p className="max-w-xs font-body-md text-on-surface-variant">
            Pulsa el corazón de un producto para guardarlo aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((product) => (
            <article key={product.id} className="flex gap-4 rounded-xl bg-surface-container-lowest p-4">
              <button
                type="button"
                onClick={() => onSelectProduct(product)}
                className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary-container"
                aria-label={`Ver ${product.name}`}
              >
                <img className="h-full w-full object-cover" src={product.image} alt={product.alt} loading="lazy" />
              </button>
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <button type="button" onClick={() => onSelectProduct(product)} className="text-left">
                  <h3 className="line-clamp-2 font-body-md font-bold text-on-surface">{product.name}</h3>
                  <p className="mt-1 font-body-md font-bold text-primary">${product.price.toFixed(2)}</p>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(product.id)}
                  className="self-start text-sm text-on-surface-variant underline underline-offset-2 hover:text-error"
                  aria-label={`Quitar ${product.name} de favoritos`}
                >
                  Quitar de Favoritos
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
