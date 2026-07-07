import { useCart } from "../context/CartContext";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, total, sendToWhatsApp } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-[380px] bg-surface shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 sm:h-16 border-b border-outline-variant flex-shrink-0">
          <h2 className="font-headline-sm text-headline-sm text-primary">
            Tu Carrito
          </h2>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:text-on-surface active:scale-90 transition-all"
          >
            close
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-on-surface-variant text-center py-12">
              Tu carrito está vacío
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-surface-container-low rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-body-md text-sm font-semibold text-on-surface truncate">
                    {item.name}
                  </p>
                  <p className="font-body-md text-xs text-on-surface-variant">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <p className="font-body-md text-sm font-semibold text-on-surface mx-3">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="material-symbols-outlined text-[20px] text-on-surface-variant hover:text-error active:scale-90 transition-all"
                >
                  remove_shopping_cart
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-outline-variant bg-surface space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-body-md font-semibold text-on-surface">Total</span>
            <span className="font-headline-sm text-headline-sm text-primary">
              ${total.toFixed(2)}
            </span>
          </div>
          <button
            onClick={sendToWhatsApp}
            disabled={items.length === 0}
            className={`w-full block text-center py-3 rounded-full font-label-md text-label-md active:scale-95 transition-all ${
              items.length > 0
                ? "bg-primary text-on-primary hover:opacity-90"
                : "bg-surface-variant text-on-surface-variant cursor-not-allowed"
            }`}
          >
            Consultar por WhatsApp
          </button>
        </div>
      </aside>
    </>
  );
}
