import { useCart } from "../context/CartContext";

export default function WishlistPage() {
  const { items, removeItem, updateQuantity, total, sendToWhatsApp } = useCart();

  const subtotal = total;

  return (
    <main className="pt-24 px-margin-mobile pb-32 max-w-container-max mx-auto">
      {/* Page header */}
      <header className="mb-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Mi Lista</h2>
        <p className="font-body-md text-on-surface-variant">
          Revisa tus favoritos antes de finalizar tu pedido.
        </p>
      </header>

      {items.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <span className="material-symbols-outlined text-6xl text-outline">favorite_border</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">Tu lista está vacía</p>
          <p className="font-body-md text-on-surface-variant max-w-xs">
            Agrega productos desde la tienda para verlos aquí.
          </p>
        </div>
      ) : (
        <>
          {/* Product list */}
          <div className="space-y-stack-md mb-stack-lg">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-xl p-4 flex gap-4"
                style={{ boxShadow: "0px 10px 30px rgba(220, 174, 150, 0.10)" }}
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-lg bg-secondary-container overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-body-md font-bold text-on-surface line-clamp-2">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-on-surface-variant hover:text-error active:scale-90 transition-all flex-shrink-0"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <span className="material-symbols-outlined text-[22px]">delete</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="font-body-md font-bold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-3 bg-surface-container-low rounded-full px-3 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-variant active:scale-90 transition-all disabled:opacity-40"
                        aria-label="Disminuir cantidad"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="font-label-md text-on-surface w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-variant active:scale-90 transition-all"
                        aria-label="Aumentar cantidad"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-surface-container p-6 rounded-2xl mb-12">
            <h3 className="font-label-md text-on-surface mb-4 uppercase tracking-widest">
              Resumen del pedido
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between font-body-md text-on-surface-variant">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body-md text-on-surface-variant">
                <span>Envío</span>
                <span className="text-green-500 font-semibold">Gratis</span>
              </div>
              <div className="border-t border-outline-variant pt-3 mt-3 flex justify-between items-center">
                <span className="font-headline-sm text-headline-sm text-on-surface">Total</span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={sendToWhatsApp}
              className="w-full mt-8 bg-green-500 text-white py-4 rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
              style={{ boxShadow: "0px 8px 20px rgba(34, 197, 94, 0.3)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.011.897 3.146.897 3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.739-5.768-5.739zm3.377 8.203c-.152.427-.751.776-1.042.825-.264.043-.604.072-1.001-.132-.206-.107-.442-.234-.844-.413-1.72-.765-2.836-2.525-2.922-2.639-.086-.114-.698-.928-.698-1.769s.442-1.253.599-1.424c.158-.171.343-.214.457-.214.114 0 .229.004.328.009.102.004.24-.038.376.289.141.339.484 1.18.526 1.265.043.085.072.185.014.3-.058.114-.086.185-.172.285-.086.1-.182.224-.259.3-.086.085-.176.177-.076.35.1.171.442.729.948 1.18.653.581 1.203.762 1.374.847.171.086.271.071.371-.043.1-.114.427-.498.541-.669.114-.171.229-.142.385-.086.158.057 1.001.471 1.173.557.171.086.285.128.328.2.043.072.043.414-.109.84z" />
                <path d="M12.036 3c-4.956 0-8.993 3.963-8.997 8.914-.002 1.812.546 3.535 1.577 4.99l-1.616 5.896 6.037-1.584c1.405.767 3.012 1.171 4.673 1.171l.004 0c4.954 0 8.993-4.046 8.997-8.997.001-4.952-4.021-8.394-8.675-8.394zm-.005 16.335c-1.61 0-3.187-.433-4.561-1.25l-.327-.194-3.393.89.905-3.303-.214-.341c-.901-1.428-1.378-3.091-1.376-4.8.004-4.536 3.693-8.225 8.232-8.225 4.54 0 8.228 3.69 8.232 8.228.004 4.538-3.692 8.645-8.232 8.645z" />
              </svg>
              <span className="font-label-md uppercase tracking-widest font-bold">
                Generar Pedido por WhatsApp
              </span>
            </button>
          </div>
        </>
      )}
    </main>
  );
}
