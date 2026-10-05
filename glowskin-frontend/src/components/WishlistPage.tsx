import { useState, type FormEvent } from "react";
import type { Product } from "../services/products";
import { useConfig } from "../context/ConfigContext";

interface WishlistPageProps {
  products: Product[];
  items: { productId: number; quantity: number }[];
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
}

export default function WishlistPage({ products, items: wishlistItems, onQuantityChange, onRemove, onClear }: WishlistPageProps) {
  const { waPhone } = useConfig();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [whatsAppOpened, setWhatsAppOpened] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const items = wishlistItems.flatMap((entry) => {
    const product = products.find((item) => item.id === entry.productId);
    return product ? [{ ...product, quantity: entry.quantity }] : [];
  });
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSendToWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || items.length === 0) return;

    const lines = items.map((item) =>
      `- ${item.name} | Cantidad: ${item.quantity} | Precio unitario: $${item.price.toFixed(2)} | Subtotal: $${(item.price * item.quantity).toFixed(2)}`
    );
    const message = encodeURIComponent(
      `Hola, me interesa hacer un pedido en GlowSkin.\n\n` +
      `Datos del cliente:\nNombre: ${customerName.trim()}\nTeléfono: ${customerPhone.trim()}\n\n` +
      `Productos:\n${lines.join("\n")}\n\n` +
      `Total estimado: $${total.toFixed(2)}`
    );
    const url = waPhone
      ? `https://wa.me/${waPhone}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setWhatsAppOpened(true);
  };

  return (
    <main className="pt-24 px-margin-mobile pb-32 max-w-container-max mx-auto">
      <header className="mb-stack-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Lista de deseos</h2>
            <p className="font-body-md text-on-surface-variant">
              Revisa los artículos y las cantidades antes de enviar tu pedido.
            </p>
          </div>
        </div>
        <p className="mt-2 font-body-md text-sm text-on-surface-variant">
          Tu lista se guarda en este dispositivo.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <span className="material-symbols-outlined text-6xl text-outline">favorite_border</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">Tu lista de deseos está vacía</p>
          <p className="font-body-md text-on-surface-variant max-w-xs">
            Explora los productos y agrégalos a tu lista con la cantidad que deseas.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-stack-md mb-stack-lg">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-xl p-4 flex gap-4"
                style={{ boxShadow: "0px 10px 30px rgba(220, 174, 150, 0.10)" }}
              >
                <div className="w-24 h-24 rounded-lg bg-secondary-container overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover" src={item.image} alt={item.alt} loading="lazy" />
                </div>

                <div className="flex-grow flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-body-md font-bold text-on-surface line-clamp-2">{item.name}</h3>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-on-surface-variant hover:text-error active:scale-90 transition-all flex-shrink-0"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <span className="material-symbols-outlined text-[22px]">delete</span>
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-on-surface-variant">${item.price.toFixed(2)} c/u</p>
                      <p className="font-body-md font-bold text-primary">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-outline-variant px-2 py-1">
                      <button
                        type="button"
                        onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center text-primary disabled:opacity-40"
                        aria-label={`Reducir cantidad de ${item.name}`}
                      >
                        <span className="material-symbols-outlined">remove</span>
                      </button>
                      <span className="min-w-6 text-center font-label-md">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-primary"
                        aria-label={`Aumentar cantidad de ${item.name}`}
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container p-6 rounded-2xl mb-12">
            <h3 className="font-label-md text-on-surface mb-4 uppercase tracking-widest">Resumen del pedido</h3>
            <div className="space-y-3">
              <div className="flex justify-between font-body-md text-on-surface-variant">
                <span>Artículos distintos</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between font-body-md text-on-surface-variant">
                <span>Unidades</span>
                <span>{totalQuantity}</span>
              </div>
              <div className="border-t border-outline-variant pt-3 mt-3 flex justify-between items-center">
                <span className="font-headline-sm text-headline-sm text-on-surface">Total del pedido</span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">${total.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleSendToWhatsApp} className="mt-8 space-y-4">
              <h4 className="font-label-md text-on-surface">Datos de contacto</h4>
              <label className="block space-y-1.5">
                <span className="text-sm text-on-surface-variant">Nombre</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  autoComplete="name"
                  required
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm text-on-surface-variant">Teléfono</span>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  autoComplete="tel"
                  required
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
                />
              </label>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-4 rounded-full flex items-center justify-center gap-3 hover:bg-green-700 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined" aria-hidden="true">chat</span>
                <span className="font-label-md uppercase tracking-widest font-bold">Enviar lista por WhatsApp</span>
              </button>
            </form>

            {whatsAppOpened && (
              <div role="status" className="mt-6 rounded-xl border border-green-700/20 bg-green-700/5 p-4">
                <p className="text-sm text-on-surface">
                  WhatsApp se abrió con tu pedido. Cuando termines de enviarlo, puedes vaciar la lista.
                </p>
                {!confirmClear ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-error hover:opacity-80"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                    Vaciar lista de deseos
                  </button>
                ) : (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-semibold text-on-surface">¿Vaciar todos los artículos de la lista?</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          onClear();
                          setCustomerName("");
                          setCustomerPhone("");
                          setWhatsAppOpened(false);
                          setConfirmClear(false);
                        }}
                        className="rounded-full bg-error px-4 py-2 text-sm font-semibold text-white"
                      >
                        Sí, vaciar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="rounded-full border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface-variant"
                      >
                        Conservar lista
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
