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
    <nav className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/95 backdrop-blur-md flex justify-around items-center py-1 sm:py-2 px-2 sm:px-4 z-50 rounded-t-xl shadow-[0px_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
      {items.map((item) => {
        const isActive = item.page === activePage;
        return (
          <button
            key={item.label}
            onClick={() => onNavigate?.(item.page)}
            className={`flex flex-col items-center justify-center rounded-full px-3 sm:px-4 py-1 active:scale-90 transition-all duration-200 ${
              isActive
                ? "bg-secondary-container text-on-secondary-container"
                : "text-on-surface-variant hover:bg-surface-variant/50"
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px] sm:text-[24px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-label-sm text-[10px] sm:text-label-sm mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
