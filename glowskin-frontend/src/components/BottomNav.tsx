type Page = "home" | "categories" | "wishlist" | "admin";

const items: { icon: string; label: string; page: Page }[] = [
  { icon: "home", label: "Home", page: "home" },
  { icon: "category", label: "Categorías", page: "categories" },
  { icon: "favorite", label: "Mi Lista", page: "wishlist" },
  // Admin tab is intentionally hidden — access via /admin
];

interface BottomNavProps {
  activePage?: Page;
  onNavigate?: (page: Page) => void;
}

export default function BottomNav({ activePage = "home", onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden px-4 pb-3 pt-1">
      <div className="max-w-sm mx-auto bg-surface-container-lowest/90 backdrop-blur-xl flex justify-around items-center py-2 px-3 rounded-full border border-outline-variant/25 elegant-shadow-lg">
        {items.map((item) => {
          const isActive = item.page === activePage;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate?.(item.page)}
              className={`relative flex flex-col items-center justify-center rounded-full px-4 sm:px-5 py-1.5 active:scale-90 transition-all duration-300 ${
                isActive
                  ? "bg-primary text-on-primary shadow-md"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className={`font-label-sm text-[10px] mt-0.5 transition-all ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
