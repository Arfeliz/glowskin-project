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
            className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full font-label-md text-label-md active:scale-95 transition-all ${
              items.length > 0
                ? "bg-primary text-on-primary hover:opacity-90 elegant-shadow"
                : "bg-surface-variant text-on-surface-variant cursor-not-allowed"
            }`}
          >
            <svg className="w-[18px] h-[18px] fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.867-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
            </svg>
            Consultar por WhatsApp
          </button>
        </div>
      </aside>
    </>
  );
}
