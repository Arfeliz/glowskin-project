import { useState } from "react";
import type { Product } from "../services/products";
import {
  loginAdmin,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
} from "../services/products";
import AdminProductEditPage, { type AdminProduct } from "./AdminProductEditPage";

const STOCK_DEFAULTS = [24, 3, 12, 1, 8, 15, 9, 22];
const CATEGORIES = ["Skincare", "Cuidado Corporal", "Aromas y Velas", "Suplementos", "Cuidado Masculino"];

type AdminTab = "overview" | "inventory" | "config";

interface AdminPageProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onGoToStore: () => void;
}

// ── Shared sub-components ────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-bold text-primary uppercase tracking-wide ml-1">
      {children}
    </label>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function AdminPage({ products, onUpdateProducts, onGoToStore }: AdminPageProps) {
  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Navigation
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Editable inventory
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>(() =>
    products.map((p, i) => ({ ...p, stock: p.stock ?? STOCK_DEFAULTS[i] ?? 10 }))
  );
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Sync adminProducts when parent reloads from API (render-time update, no effect needed)
  const [prevProducts, setPrevProducts] = useState(products);
  if (prevProducts !== products) {
    setPrevProducts(products);
    setAdminProducts(products.map((p, i) => ({ ...p, stock: p.stock ?? STOCK_DEFAULTS[i] ?? 10 })));
  }

  // Config
  const [waLink, setWaLink] = useState("https://wa.me/message/P7BWJKUAM2AEP1");
  const [waEditing, setWaEditing] = useState(false);
  const [waSaved, setWaSaved] = useState(false);
  const [igLink, setIgLink] = useState("https://www.instagram.com/gloowskin1/");
  const [ttLink, setTtLink] = useState("https://www.tiktok.com/@gloowskin2");
  const [socialSaved, setSocialSaved] = useState(false);

  // Auth
  const handleLogin = () => {
    setAuthLoading(true);
    setAuthError("");
    loginAdmin(email.trim(), password)
      .then((t) => {
        setToken(t);
        setIsLoggedIn(true);
      })
      .catch(() => setAuthError("Usuario o contraseña incorrectos."))
      .finally(() => setAuthLoading(false));
  };
  const handleLogout = () => { setIsLoggedIn(false); setToken(""); setEmail(""); setPassword(""); };

  // Inventory
  const [fullEditProduct, setFullEditProduct] = useState<AdminProduct | null>(null);

  const openEdit = (p: AdminProduct) => { setFullEditProduct(p); setIsNewProduct(false); };
  const openAdd = () => {
    setFullEditProduct({ id: 0, name: "", price: 0, category: CATEGORIES[0], image: "", alt: "", stock: 0 });
    setIsNewProduct(true);
  };
  const handleSaveProduct = (p: AdminProduct) => {
    const apiCall = isNewProduct
      ? apiCreateProduct({ name: p.name, price: p.price, image: p.image, alt: p.alt, category: p.category, stock: p.stock, description: p.description, benefitPoints: p.benefitPoints, ingredients: p.ingredients, usageSteps: p.usageSteps }, token)
      : apiUpdateProduct(p.id, p, token);
    apiCall
      .then((saved) => {
        const asAdmin: AdminProduct = { ...saved, stock: p.stock };
        setAdminProducts((prev) =>
          isNewProduct ? [...prev, asAdmin] : prev.map((x) => (x.id === p.id ? asAdmin : x))
        );
        onUpdateProducts([]);
        setFullEditProduct(null);
        setActiveTab("inventory");
      })
      .catch(() => { /* error silenciado */ })
      .finally(() => {});
  };
  const handleDelete = (id: number) => {
    if (deletingId === id) {
      apiDeleteProduct(id, token)
        .then(() => {
          setAdminProducts((prev) => prev.filter((p) => p.id !== id));
          onUpdateProducts([]);
          setDeletingId(null);
        })
        .catch(() => setDeletingId(null));
    } else {
      setDeletingId(id);
    }
  };

  const TABS: { id: AdminTab; icon: string; label: string }[] = [
    { id: "overview",   icon: "dashboard",    label: "Resumen"    },
    { id: "inventory",  icon: "inventory_2",  label: "Inventario" },
    { id: "config",     icon: "settings",     label: "Config"     },
  ];

  const lowStock = adminProducts.filter((p) => p.stock <= 3);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Login gate ── */}
      {!isLoggedIn && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-md px-margin-mobile">
          <div
            className="w-full max-w-sm bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 space-y-6"
            style={{ boxShadow: "0px 10px 30px rgba(220, 174, 150, 0.18)" }}
          >
            <div className="text-center space-y-2">
              <span className="material-symbols-outlined text-primary text-4xl block">lock</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Acceso Restringido</h2>
              <p className="text-sm text-on-surface-variant">Inicie sesión para gestionar su tienda.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <FieldLabel>Usuario</FieldLabel>
                <input
                  type="text"
                  value={email}
                  autoComplete="username"
                  onChange={(e) => { setEmail(e.target.value); setAuthError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="admin@glowskin.com"
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary text-sm bg-white outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel>Contraseña</FieldLabel>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => { setPassword(e.target.value); setAuthError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-12 py-3 rounded-lg border border-outline-variant focus:border-primary text-sm bg-white outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary active:scale-90 transition-all"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              {authError && <p className="text-xs text-error font-semibold pl-1">{authError}</p>}
            </div>
            <button
              onClick={handleLogin}
              disabled={authLoading}
              className="w-full bg-primary text-on-primary py-4 rounded-full font-label-md text-label-md shadow-lg active:scale-95 transition-all disabled:opacity-60"
            >
              {authLoading ? "Verificando..." : "Entrar al Panel"}
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-md flex justify-between items-center px-margin-mobile h-14 sm:h-16 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            admin_panel_settings
          </span>
          <h1 className="font-headline-md text-headline-sm text-primary tracking-tight select-none">ADMIN</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onGoToStore} className="flex items-center gap-1 text-on-surface-variant hover:text-primary active:scale-90 transition-all">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            <span className="text-label-sm font-label-sm hidden sm:inline">Tienda</span>
          </button>
          {isLoggedIn && (
            <button onClick={handleLogout} className="flex items-center gap-1 text-on-surface-variant hover:text-error active:scale-90 transition-all">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="text-label-sm font-label-sm hidden sm:inline">Salir</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Tab bar (only when logged in) ── */}
      {isLoggedIn && (
        <div className="fixed top-14 sm:top-16 w-full z-40 bg-surface border-b border-outline-variant/30 flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface border-b-2 border-transparent"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Main content ── */}
      <main
        className={`px-margin-mobile max-w-lg mx-auto pb-32 ${
          isLoggedIn ? "pt-28 sm:pt-32" : "pt-20 sm:pt-24 blur-sm pointer-events-none select-none"
        }`}
      >

        {/* ═══ OVERVIEW ═══ */}
        {(!isLoggedIn || activeTab === "overview") && (
          <div className="space-y-stack-lg">
            <section>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Panel de Control</h2>
              <p className="font-body-md text-on-surface-variant">Bienvenido de nuevo, Admin.</p>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 gap-4">
              <div
                className="col-span-2 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30"
                style={{ boxShadow: "0px 10px 30px rgba(220, 174, 150, 0.15)" }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-label-sm font-label-sm text-on-surface-variant">Ventas Totales (Mes)</span>
                  <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                </div>
                <div className="text-headline-md font-headline-md text-primary">$12,480.50</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-green-600 text-sm">trending_up</span>
                  <span className="text-xs text-green-600 font-medium">+12% vs anterior</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
                <div className="text-label-sm font-label-sm text-on-surface-variant mb-1">Pedidos</div>
                <div className="text-headline-sm font-headline-sm text-primary">142</div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
                <div className="text-label-sm font-label-sm text-on-surface-variant mb-1">Productos</div>
                <div className="text-headline-sm font-headline-sm text-primary">{adminProducts.length}</div>
              </div>
            </section>

            {/* Low stock alert */}
            {lowStock.length > 0 && (
              <section className="bg-error-container/30 border border-error/20 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                  <span className="font-label-md text-label-md text-error uppercase tracking-widest">Stock Crítico</span>
                </div>
                {lowStock.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-on-surface line-clamp-1">{p.name}</span>
                    <span className="text-error font-bold ml-2 flex-shrink-0">
                      {p.stock === 0 ? "Agotado" : `${p.stock} restantes`}
                    </span>
                  </div>
                ))}
                <button onClick={() => setActiveTab("inventory")} className="text-xs text-primary font-semibold underline">
                  Ir al inventario →
                </button>
              </section>
            )}

            {/* Popular products */}
            <section className="space-y-stack-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Productos Populares</h3>
                <button onClick={() => setActiveTab("inventory")} className="text-label-sm font-label-sm text-primary underline">
                  Ver todos
                </button>
              </div>
              <div className="flex overflow-x-auto hide-scrollbar gap-4 -mx-margin-mobile px-margin-mobile pb-2">
                {adminProducts.slice(0, 6).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => { openEdit(p); setActiveTab("inventory"); }}
                    className="flex-shrink-0 w-28 space-y-2 cursor-pointer group"
                  >
                    <div className="aspect-square bg-secondary-container rounded-lg overflow-hidden relative">
                      {p.image ? (
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={p.image} alt={p.alt} loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant text-[28px]">image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-white text-[20px]">edit</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-primary font-semibold">${p.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ═══ INVENTORY ═══ */}
        {isLoggedIn && activeTab === "inventory" && (
          <div className="space-y-stack-md">
            <div className="flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Inventario</h2>
              <button
                onClick={openAdd}
                className="flex items-center gap-1 bg-primary text-on-primary rounded-full px-4 py-2 font-label-md text-label-md active:scale-95 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Nuevo</span>
              </button>
            </div>

            {/* Category chips */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => {
                const count = adminProducts.filter((p) => p.category === cat).length;
                if (!count) return null;
                return (
                  <span key={cat} className="text-[11px] px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-medium">
                    {cat} ({count})
                  </span>
                );
              })}
            </div>

            {/* Product list */}
            <div className="space-y-2">
              {adminProducts.map((item) => (
                <div key={item.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
                  <div className="flex items-center gap-3 p-3">
                    <div className="w-14 h-14 bg-secondary-container rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img className="w-full h-full object-cover" src={item.image} alt={item.alt} loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant text-[24px]">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-on-surface line-clamp-1">{item.name}</div>
                      <div className="text-xs text-on-surface-variant">{item.category}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-primary">${item.price.toFixed(2)}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          item.stock > 5 ? "bg-green-100 text-green-700"
                          : item.stock > 0 ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}>
                          {item.stock > 0 ? `${item.stock} en stock` : "Agotado"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEdit(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-secondary-container text-on-surface-variant hover:text-primary active:scale-90 transition-all"
                        aria-label="Editar"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full active:scale-90 transition-all ${
                          deletingId === item.id
                            ? "bg-error text-on-error"
                            : "bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-error"
                        }`}
                        aria-label={deletingId === item.id ? "Confirmar eliminación" : "Eliminar"}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {deletingId === item.id ? "check" : "delete"}
                        </span>
                      </button>
                    </div>
                  </div>
                  {deletingId === item.id && (
                    <div className="flex items-center justify-between bg-error-container/40 px-4 py-2 border-t border-error/20">
                      <span className="text-xs text-error font-medium">¿Eliminar "{item.name}"?</span>
                      <button onClick={() => setDeletingId(null)} className="text-xs text-on-surface-variant underline ml-4">
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {adminProducts.length === 0 && (
                <div className="text-center py-16">
                  <span className="material-symbols-outlined text-5xl text-outline block mb-3">inventory_2</span>
                  <p className="text-on-surface-variant font-body-md">Sin productos. Agrega uno.</p>
                  <button onClick={openAdd} className="mt-4 bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md active:scale-95 transition-all">
                    Agregar producto
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ CONFIG ═══ */}
        {isLoggedIn && activeTab === "config" && (
          <div className="space-y-stack-lg">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Configuración</h2>

            {/* WhatsApp */}
            <section className="bg-primary-container/20 p-6 rounded-2xl border border-primary-container/40 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">chat_bubble</span>
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">WhatsApp</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Enlace donde los clientes recibirán asesoría y confirmación de pedidos.
              </p>
              <div className="space-y-1">
                <FieldLabel>Enlace</FieldLabel>
                <div className="relative">
                  <input
                    type="text"
                    value={waLink}
                    readOnly={!waEditing}
                    onChange={(e) => setWaLink(e.target.value)}
                    className={`w-full pl-4 pr-12 py-3 rounded-lg border text-sm outline-none transition-colors ${
                      waEditing ? "border-primary bg-white" : "border-outline-variant bg-white"
                    }`}
                  />
                  <button
                    onClick={() => setWaEditing((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-outlined">{waEditing ? "check" : "edit"}</span>
                  </button>
                </div>
              </div>
              <button
                onClick={() => { setWaEditing(false); setWaSaved(true); setTimeout(() => setWaSaved(false), 2000); }}
                className="w-full bg-primary text-on-primary py-3 rounded-full font-label-md text-label-md shadow-lg active:scale-[0.98] transition-all"
              >
                {waSaved ? "¡Guardado!" : "Guardar Cambios"}
              </button>
            </section>

            {/* Social links */}
            <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">link</span>
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Redes Sociales</h3>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <FieldLabel>Instagram</FieldLabel>
                  <input
                    type="text"
                    value={igLink}
                    onChange={(e) => setIgLink(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary text-sm bg-white outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>TikTok</FieldLabel>
                  <input
                    type="text"
                    value={ttLink}
                    onChange={(e) => setTtLink(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary text-sm bg-white outline-none transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={() => { setSocialSaved(true); setTimeout(() => setSocialSaved(false), 2000); }}
                className="w-full border border-primary text-primary py-3 rounded-full font-label-md text-label-md hover:bg-primary/5 active:scale-[0.98] transition-all"
              >
                {socialSaved ? "¡Guardado!" : "Guardar enlaces"}
              </button>
            </section>

            {/* Session */}
            <section className="bg-surface-container p-6 rounded-2xl border border-outline-variant/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">key</span>
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Sesión</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Las credenciales se gestionan en <code className="bg-surface-container-high px-1 rounded text-primary">AdminPage.tsx</code>. Conecta un backend con auth segura antes de producción.
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-error hover:opacity-80 active:scale-95 transition-all font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Cerrar sesión
              </button>
            </section>
          </div>
        )}
      </main>

      {/* ── Full-page product editor ── */}
      {fullEditProduct && (
        <div className="fixed inset-0 z-[60] bg-background overflow-y-auto">
          <AdminProductEditPage
            product={fullEditProduct}
            onSave={handleSaveProduct}
            onClose={() => setFullEditProduct(null)}
          />
        </div>
      )}
    </div>
  );
}

