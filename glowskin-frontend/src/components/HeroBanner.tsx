export default function HeroBanner() {
  return (
    <section className="relative h-[300px] xs:h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] w-full overflow-hidden mb-stack-sm md:mb-stack-md lg:mb-stack-lg">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCbxRbdQiW3RNA3i4WAH6leHH7gt5HqFjF8x2wpOIZtBapQbsEzTiUcr1Zkuw0o2iPIybWZQoMz2FyC9fpqPAxclEh_VGbZvHlk6lKnMPqg82oVzlMdEtgu37IXcSPkHJugEGVaC3GPOOn7cZbKmnPp93DBIK0sRSKuUANHWgXzIZSGmtm6iMtwMUEEYG99abkAWxP3XD61aYbRUsMxfj8W9SIpIjU3ZV61zQJw8w5kbCpRYqrM8j73kw')",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent z-10" />
      <div className="relative z-20 h-full flex flex-col justify-end px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pb-stack-sm md:pb-stack-md lg:pb-stack-lg max-w-container-max mx-auto">
        <h2 className="font-display-lg-mobile text-display-lg-mobile sm:text-display-lg text-primary mb-stack-xs md:mb-stack-sm max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
          Tu ritual de bienestar comienza aquí
        </h2>
        <button className="w-fit px-6 py-2.5 sm:px-8 sm:py-3 bg-primary text-on-primary rounded-full font-label-md text-label-md active:scale-95 hover:opacity-90 transition-all transform">
          Explorar Ahora
        </button>
      </div>
    </section>
  );
}
