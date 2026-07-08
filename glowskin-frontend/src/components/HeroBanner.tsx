export default function HeroBanner() {
  return (
    <section className="relative h-[420px] xs:h-[480px] sm:h-[540px] md:h-[600px] lg:h-[640px] w-full overflow-hidden mb-stack-sm md:mb-stack-md lg:mb-stack-lg">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center animate-soft-zoom"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCbxRbdQiW3RNA3i4WAH6leHH7gt5HqFjF8x2wpOIZtBapQbsEzTiUcr1Zkuw0o2iPIybWZQoMz2FyC9fpqPAxclEh_VGbZvHlk6lKnMPqg82oVzlMdEtgu37IXcSPkHJugEGVaC3GPOOn7cZbKmnPp93DBIK0sRSKuUANHWgXzIZSGmtm6iMtwMUEEYG99abkAWxP3XD61aYbRUsMxfj8W9SIpIjU3ZV61zQJw8w5kbCpRYqrM8j73kw')",
          }}
        />
      </div>

      {/* Overlays de degradado para profundidad y legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10 z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent z-10" />

      {/* Marco decorativo sutil */}
      <div className="absolute inset-4 sm:inset-6 md:inset-8 border border-surface/25 rounded-2xl z-20 pointer-events-none animate-fade-in delay-300" />

      <div className="relative z-30 h-full flex flex-col justify-end px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pb-stack-md md:pb-stack-lg lg:pb-stack-lg max-w-container-max mx-auto">
        {/* Overline */}
        <span className="animate-fade-up flex items-center gap-3 text-primary/90 uppercase text-label-sm font-label-sm tracking-luxe mb-4">
          <span className="h-px w-8 bg-primary/50" />
          Skincare & Bienestar
        </span>

        <h2 className="animate-fade-up delay-100 font-display-lg-mobile text-display-lg-mobile sm:text-display-lg md:text-[56px] md:leading-[1.05] text-on-surface mb-stack-sm md:mb-stack-md max-w-[300px] sm:max-w-[440px] md:max-w-[560px] lg:max-w-[640px]">
          Tu ritual de bienestar<br className="hidden sm:block" />
          <span className="italic text-gradient-gold">comienza aquí</span>
        </h2>

        <p className="animate-fade-up delay-200 font-body-md text-sm sm:text-base text-on-surface-variant max-w-[320px] sm:max-w-[420px] mb-stack-md leading-relaxed">
          Fórmulas cuidadosamente seleccionadas para realzar tu belleza natural, día a día.
        </p>

        <div className="animate-fade-up delay-300 flex items-center gap-3 sm:gap-4">
          <button className="group w-fit px-7 py-3 sm:px-9 sm:py-3.5 bg-primary text-on-primary rounded-full font-label-md text-label-md active:scale-95 hover:shadow-lg transition-all transform flex items-center gap-2 elegant-shadow">
            Explorar Ahora
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          <button className="w-fit px-7 py-3 sm:px-8 sm:py-3.5 bg-surface/70 backdrop-blur-md text-on-surface border border-outline-variant/50 rounded-full font-label-md text-label-md active:scale-95 hover:bg-surface transition-all transform">
            Ver Categorías
          </button>
        </div>
      </div>
    </section>
  );
}
