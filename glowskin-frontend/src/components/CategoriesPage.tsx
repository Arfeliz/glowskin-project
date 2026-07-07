const CATEGORIES = [
  {
    id: 1,
    name: "Skincare",
    label: "Explorar",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAd4zY_Q13ghGdRoF8OjuyYQtGCmMwZVC7eTXPROrnTJPXr_vOuQ6qmRCWEnXd3vuc6XDx5ZzcD6F6kzQHsb1xdqzyUNYe83ctDiLkvUt9wjbDpg0DlOW0B_ef8iVsXa5QHuevgbzOK6J3rVyvseKZEJ8PuzmGVgNDeqSBLPrx3qAwXNF7sL2Gxcfh-HO0iJPiFwEfleCEiK2_4uV9Q_vInZ89pUdl3imFRAcG7wfQXktzs6cpfqVlWWA",
    alt: "Close up of luxury face serum being applied to glowing skin",
  },
  {
    id: 2,
    name: "Cuidado Corporal",
    label: "Ver más",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqrEkeeLijLTxbU1TCUbxHd2v1w1xPyNhae2_ENCoOT0snMyvWoqkbtv8tSpCnGnHOjrPJeibUOcE_0Ky_nECUrU0MxyQPXfUt5d1WaktmdLybZ8RyU99kUee5o8OsFJo4X2Yw5WVkUO4H8k2ALHQd9O-2gHyYvBgTYY0V6uEDfNwGRkBf0slunGMYlkzCkc-JYY5Tcj4_5vIWY3kXxZu6UBmAsaR_a_daewLT4l1_lCSbkd_AgiHQDA",
    alt: "Aesthetic display of body oils and creams on marble surface",
  },
  {
    id: 3,
    name: "Aromas y Velas",
    label: "Explorar",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQdetL8Zvs1gb6oyQEIfyyFu4e6_ZSwOH9A3EBHPVaWogwPtyFnR7TDxQeaNNtuJ5nmTBMHeMPzIuhI_0ek99DotxQekDbboGFboPP9X6094mvs-fxumuz5SpxYlUMLVC5AJPyXEVkF7fTLEnk-hljohnSgVJ-qJNypRfEkRwj4fTFkE0_D3cBN5PLKT1XK_HoaI6Aylg6vpznKcga7iHsV2rztboaRti33-SWyVEoXAIXNi_Cupc0pw",
    alt: "Luxury scented candle in frosted glass container",
  },
  {
    id: 4,
    name: "Suplementos",
    label: "Ver más",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC-JYQ8EFagrgHBaOMHnF75msiKsnq15WwE7u39l-LGRX5BVclJZC1hCDo6qBUOKxBa3WCvt7plc6l_-Iqc1-s0vGihn3TL8Bx7LLo29eyySDe5Nrq7sKnM5OnPl7QbpJRribQiX-kI3Wo62f_s6h5spleXtmZ_elu-qUzmG14RT2rh-nNR1R4U6k-EfjWqE-GAgIYLlK9DywQpwh_lmjCOiwtlPY8pmo0Eb87apchq_K8hUM8pjRw7ag",
    alt: "Minimalist collection of health supplements in amber glass bottles",
  },
  {
    id: 5,
    name: "Cuidado Masculino",
    label: "Explorar",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAllRkA7Fdavy9DjCTeGz5DpPtICj1fL73cIxaIJdvZG-juNfmSU84rgzZVE7fAFY2WZ-Olf_PwTWtKkngmQg8c1c1d-cWh-ioYh9Wdtk4d5AVQi5YyDz-rO9aWY3s8tZyyuKhvfRMcTjDKMRDoEkx_NXARxqUvJEC-KIOuSkq3NaEkNKruwBs6Wn0-kMU7gv2GRUkT41iHnnWR0NyVDUrVwsgsW2R6vCMfnYUvCZk4xpajiLPoCV5kLA",
    alt: "Modern grooming kit for men on textured slate background",
  },
];

interface CategoriesPageProps {
  onCategorySelect?: (category: string) => void;
}

export default function CategoriesPage({ onCategorySelect }: CategoriesPageProps) {
  return (
    <main className="pt-24 px-margin-mobile pb-32 max-w-container-max mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-stack-md">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="relative w-full h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden cursor-pointer active:scale-[0.98] transition-transform duration-200"
            style={{ boxShadow: "0px 10px 30px rgba(220, 174, 150, 0.15)" }}
            onClick={() => onCategorySelect?.(cat.name)}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${cat.image}')` }}
              role="img"
              aria-label={cat.alt}
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 flex flex-col justify-end p-6"
              style={{
                background:
                  "linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 70%)",
              }}
            >
              <h2 className="font-headline-sm text-headline-sm text-white mb-1">
                {cat.name}
              </h2>
              <div className="flex items-center gap-2 text-white/90">
                <span className="font-label-md text-label-md">{cat.label}</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
