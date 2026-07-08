import { useState, useEffect, useRef } from "react";
import { CartProvider } from "./context/CartContext";
import { ConfigProvider } from "./context/ConfigContext";
import { useCart } from "./context/CartContext";
import HeroBanner from "./components/HeroBanner";
import Filters from "./components/Filters";
import ProductCard from "./components/ProductCard";
import BottomNav from "./components/BottomNav";
import WhatsAppButton from "./components/WhatsAppButton";
import CategoriesPage from "./components/CategoriesPage";
import WishlistPage from "./components/WishlistPage";
import ProductDetailPage from "./components/ProductDetailPage";
import AdminPage from "./components/AdminPage";
import type { Product } from "./services/products";
import { getProducts } from "./services/products";

type Page = "home" | "categories" | "wishlist" | "product" | "admin";

function AppContent() {
  const { items } = useCart();
  const [activePage, setActivePage] = useState<Page>("home");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const reloadProducts = () => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : "Error al cargar productos");
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  };

  useEffect(() => {
    reloadProducts();
  }, []);

  // Secret admin access: type /admin anywhere on the page
  const bufferRef = useRef("");
  useEffect(() => {
    const SECRET = "/admin";
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      bufferRef.current = (bufferRef.current + e.key).slice(-SECRET.length);
      if (bufferRef.current === SECRET) {
        bufferRef.current = "";
        setActivePage("admin");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Reload products from API after admin changes, then refresh selected product if open
  const handleUpdateProducts = () => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setSelectedProduct((prev) => {
          if (!prev) return prev;
          return data.find((p) => p.id === prev.id) ?? prev;
        });
      })
      .catch(() => { /* silenciado — la tienda sigue mostrando el último catálogo */ });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setSearchQuery("");
    setActivePage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveCategory("Todos");
      setActivePage("home");
    }
  };

  // Search takes priority over category filter
  const filtered = (() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          String(p.id).includes(q)
      );
    }
    return activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory);
  })();

  return (
    <>
      {/* ========== TOP APP BAR — hidden on product detail and admin (both have their own header) ========== */}
      {activePage !== "product" && activePage !== "admin" && (
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-tablet lg:px-margin-desktop h-14 sm:h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/25">
        <button
          className="md:hidden material-symbols-outlined text-primary hover:opacity-80 transition-opacity active:scale-95 transition-transform text-[24px] sm:text-[28px]"
          aria-label="Menú"
        >
          menu
        </button>
        <h1 className="font-headline-md text-headline-sm sm:text-headline-md text-primary tracking-[0.18em] select-none">
          {activePage === "categories" ? "CATEGORÍAS" : activePage === "wishlist" ? "MI LISTA" : "GLOWSKIN"}
        </h1>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Nav links — solo desktop. El bolso ya cubre "Mi Lista" con badge */}
          <nav className="hidden md:flex items-center gap-6 mr-4">
            {(["home", "categories"] as Page[]).map((page) => {
              const labels: Record<string, string> = { home: "Inicio", categories: "Categorías" };
              return (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className={`font-label-md text-label-md transition-colors pb-0.5 ${
                    activePage === page
                      ? "text-primary border-b-2 border-primary"
                      : "text-on-surface-variant hover:text-primary border-b-2 border-transparent"
                  }`}
                >
                  {labels[page]}
                </button>
              );
            })}
          </nav>
          {/* Buscar */}
          <button
            onClick={() => setIsSearchOpen((o) => !o)}
            className={`active:scale-90 transition-all ${
              isSearchOpen ? "text-primary" : "text-on-surface-variant hover:text-primary"
            }`}
            aria-label="Buscar"
          >
            <span
              className="material-symbols-outlined text-[24px] sm:text-[26px]"
              style={isSearchOpen ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >search</span>
          </button>
          {/* Bolso — única entrada a Mi Lista en desktop, con badge de cantidad */}
          <button
            onClick={() => setActivePage("wishlist")}
            className="relative text-primary hover:opacity-80 transition-opacity active:scale-95 transition-transform"
            aria-label="Mi Lista"
          >
            <span className="material-symbols-outlined text-[24px] sm:text-[28px]"
              style={activePage === "wishlist" ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </header>
      )}

      {/* ========== SEARCH OVERLAY ========== */}
      {isSearchOpen && activePage !== "product" && activePage !== "admin" && (
        <>
          {/* Backdrop — click fuera para cerrar */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsSearchOpen(false)}
          />
          {/* Barra de búsqueda */}
          <div
            className="fixed top-14 sm:top-16 left-0 w-full z-40 bg-surface/98 backdrop-blur-md border-b border-outline-variant/30 px-margin-mobile py-3 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-container-max mx-auto flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0">search</span>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por nombre de producto..."
                className="flex-1 bg-transparent font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none min-w-0"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsSearchOpen(false);
                  if (e.key === "Enter") setIsSearchOpen(false);
                }}
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-on-surface-variant hover:text-error active:scale-90 transition-all flex-shrink-0"
                  aria-label="Limpiar"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface active:scale-90 transition-all flex-shrink-0"
                  aria-label="Cerrar búsqueda"
                >
                  <span className="material-symbols-outlined text-[18px]">keyboard_return</span>
                </button>
              )}
            </div>
            {searchQuery.trim() && (
              <p className="font-label-sm text-[11px] text-on-surface-variant mt-2 px-7">
                {filtered.length === 0
                  ? "Sin resultados para"
                  : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} para`}{" "}
                <span className="font-semibold text-primary">"{searchQuery}"</span>
              </p>
            )}
          </div>
        </>
      )}

      {/* ========== MAIN CONTENT ========== */}
      {activePage === "product" && selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          relatedProducts={products.filter((p) => p.id !== selectedProduct.id).slice(0, 5)}
          onBack={() => setActivePage("home")}
          onSelectProduct={handleSelectProduct}
        />
      ) : activePage === "admin" ? (
        <AdminPage
          products={products}
          onUpdateProducts={handleUpdateProducts}
          onGoToStore={() => setActivePage("home")}
        />
      ) : activePage === "categories" ? (
        <CategoriesPage onCategorySelect={handleCategorySelect} />
      ) : activePage === "wishlist" ? (
        <WishlistPage />
      ) : (
        <main className="pt-14 sm:pt-16 pb-20 md:pb-12">
          <HeroBanner />

          {/* ── Buscador ── */}
          <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max mx-auto pt-4 pb-2">
            <div className="flex items-center gap-3 bg-surface-container rounded-full px-4 py-3 border border-outline-variant/20 focus-within:border-primary/40 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] flex-shrink-0">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por nombre de producto..."
                className="flex-1 bg-transparent font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none min-w-0"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); }}
                  className="text-on-surface-variant hover:text-on-surface active:scale-90 transition-all flex-shrink-0"
                  aria-label="Limpiar búsqueda"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
            {searchQuery.trim() && (
              <p className="font-label-sm text-on-surface-variant mt-2 px-1">
                {filtered.length === 0
                  ? "Sin resultados para"
                  : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} para`}{" "}
                <span className="font-semibold text-primary">"{searchQuery}"</span>
              </p>
            )}
          </div>

          {/* Filtros de categoría — se ocultan si hay búsqueda activa */}
          {!searchQuery.trim() && (
            <Filters active={activeCategory} onChange={setActiveCategory} />
          )}

          {/* Encabezado de sección elegante */}
          {!searchQuery.trim() && !loadingProducts && !loadError && (
            <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max mx-auto text-center pt-stack-sm pb-stack-sm">
              <span className="text-primary/80 uppercase text-label-sm font-label-sm tracking-luxe">Nuestra Colección</span>
              <h2 className="font-headline-md text-headline-sm sm:text-headline-md text-on-surface mt-2">
                {activeCategory === "Todos" ? "Productos Destacados" : activeCategory}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="h-px w-8 bg-outline-variant" />
                <span className="material-symbols-outlined text-primary/60 text-[16px]">spa</span>
                <span className="h-px w-8 bg-outline-variant" />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <section className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max mx-auto">
            {loadingProducts ? (
              <div className="flex justify-center items-center py-20">
                <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
              </div>
            ) : loadError ? (
              <div className="text-center py-16 space-y-3">
                <span className="material-symbols-outlined text-5xl text-error block">cloud_off</span>
                <p className="text-on-surface-variant font-body-md">{loadError}</p>
                <button
                  onClick={() => { setLoadingProducts(true); void reloadProducts(); }}
                  className="mt-2 font-label-md text-label-md text-primary hover:opacity-80 transition-opacity"
                >
                  Reintentar
                </button>
              </div>
            ) : (
            <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-gutter">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onSelect={() => handleSelectProduct(product)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
                <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
                <p className="font-body-md text-on-surface-variant">
                  {searchQuery.trim()
                    ? `No hay productos que coincidan con "${searchQuery}"`
                    : "No hay productos en esta categoría"}
                </p>
                {searchQuery.trim() && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 font-label-md text-label-md text-primary hover:opacity-80 transition-opacity"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
            </>
            )}
          </section>
        </main>
      )}

      {activePage !== "product" && activePage !== "admin" && <WhatsAppButton />}
      {activePage !== "product" && (
        <BottomNav activePage={activePage} onNavigate={setActivePage} />
      )}

      {/* ========== DESKTOP FOOTER ========== */}
      {activePage !== "product" && activePage !== "admin" && (
        <footer className="hidden md:block bg-surface-container-lowest border-t border-outline-variant/30 pt-12 pb-8 px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            {/* Top row */}
            <div className="grid grid-cols-3 gap-12 mb-10">
              {/* Brand */}
              <div>
                <p className="font-headline-md text-headline-sm text-primary mb-3">GLOWSKIN</p>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  Tienda digital de skincare y bienestar. Productos cuidadosamente seleccionados
                  para tu ritual diario.
                </p>
              </div>

              {/* Navegación */}
              <div>
                <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface mb-4">Explorar</p>
                <ul className="space-y-2">
                  {([["home","Inicio"],["categories","Categorías"],["wishlist","Mi Lista"]] as [Page,string][]).map(([page, label]) => (
                    <li key={page}>
                      <button
                        onClick={() => setActivePage(page)}
                        className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contacto & redes */}
              <div>
                <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface mb-4">Contacto</p>
                <ul className="space-y-3">
                  {/* WhatsApp */}
                  <li>
                    <a
                      href="https://wa.me/message/P7BWJKUAM2AEP1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.011.897 3.146.897 3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.739-5.768-5.739zm3.377 8.203c-.152.427-.751.776-1.042.825-.264.043-.604.072-1.001-.132-.206-.107-.442-.234-.844-.413-1.72-.765-2.836-2.525-2.922-2.639-.086-.114-.698-.928-.698-1.769s.442-1.253.599-1.424c.158-.171.343-.214.457-.214l.328.009c.102.004.24-.038.376.289.141.339.484 1.18.526 1.265.043.085.072.185.014.3-.058.114-.086.185-.172.285-.086.1-.182.224-.259.3-.086.085-.176.177-.076.35.1.171.442.729.948 1.18.653.581 1.203.762 1.374.847.171.086.271.071.371-.043.1-.114.427-.498.541-.669.114-.171.229-.142.385-.086.158.057 1.001.471 1.173.557.171.086.285.128.328.2.043.072.043.414-.109.84z"/>
                        <path d="M12.036 3c-4.956 0-8.993 3.963-8.997 8.914-.002 1.812.546 3.535 1.577 4.99l-1.616 5.896 6.037-1.584c1.405.767 3.012 1.171 4.673 1.171h.004c4.954 0 8.993-4.046 8.997-8.997.001-4.952-4.021-8.394-8.675-8.394zm-.005 16.335c-1.61 0-3.187-.433-4.561-1.25l-.327-.194-3.393.89.905-3.303-.214-.341c-.901-1.428-1.378-3.091-1.376-4.8.004-4.536 3.693-8.225 8.232-8.225 4.54 0 8.228 3.69 8.232 8.228.004 4.538-3.692 8.645-8.232 8.645z"/>
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  </li>
                  {/* Instagram */}
                  <li>
                    <a
                      href="https://www.instagram.com/gloowskin1/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>@gloowskin1</span>
                    </a>
                  </li>
                  {/* TikTok */}
                  <li>
                    <a
                      href="https://www.tiktok.com/@gloowskin2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z"/>
                      </svg>
                      <span>@gloowskin2</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom row */}
            <div className="border-t border-outline-variant/40 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
              <div className="flex items-center gap-3">
                <p className="font-body-md text-xs text-on-surface-variant">
                  © 2025 GlowSkin · Tienda digital · Todos los derechos reservados.
                </p>
                <button
                  onClick={() => setActivePage("admin")}
                  className="text-[10px] text-outline hover:text-on-surface-variant transition-colors"
                  aria-label="Panel de administración"
                >
                  Admin
                </button>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://wa.me/message/P7BWJKUAM2AEP1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-secondary-container text-on-surface-variant hover:text-primary transition-all"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.011.897 3.146.897 3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.739-5.768-5.739zm3.377 8.203c-.152.427-.751.776-1.042.825-.264.043-.604.072-1.001-.132-.206-.107-.442-.234-.844-.413-1.72-.765-2.836-2.525-2.922-2.639-.086-.114-.698-.928-.698-1.769s.442-1.253.599-1.424c.158-.171.343-.214.457-.214l.328.009c.102.004.24-.038.376.289.141.339.484 1.18.526 1.265.043.085.072.185.014.3-.058.114-.086.185-.172.285-.086.1-.182.224-.259.3-.086.085-.176.177-.076.35.1.171.442.729.948 1.18.653.581 1.203.762 1.374.847.171.086.271.071.371-.043.1-.114.427-.498.541-.669.114-.171.229-.142.385-.086.158.057 1.001.471 1.173.557.171.086.285.128.328.2.043.072.043.414-.109.84z"/>
                    <path d="M12.036 3c-4.956 0-8.993 3.963-8.997 8.914-.002 1.812.546 3.535 1.577 4.99l-1.616 5.896 6.037-1.584c1.405.767 3.012 1.171 4.673 1.171h.004c4.954 0 8.993-4.046 8.997-8.997.001-4.952-4.021-8.394-8.675-8.394zm-.005 16.335c-1.61 0-3.187-.433-4.561-1.25l-.327-.194-3.393.89.905-3.303-.214-.341c-.901-1.428-1.378-3.091-1.376-4.8.004-4.536 3.693-8.225 8.232-8.225 4.54 0 8.228 3.69 8.232 8.228.004 4.538-3.692 8.645-8.232 8.645z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/gloowskin1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-secondary-container text-on-surface-variant hover:text-primary transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@gloowskin2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-secondary-container text-on-surface-variant hover:text-primary transition-all"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

function App() {
  return (
    <ConfigProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ConfigProvider>
  );
}

export default App;
