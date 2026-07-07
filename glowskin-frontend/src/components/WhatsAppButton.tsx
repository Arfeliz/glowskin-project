export default function WhatsAppButton() {
  return (
    <a
      className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 md:bottom-8 md:right-8 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white z-40 ambient-glow hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-lg"
      href="https://wa.me/message/P7BWJKUAM2AEP1"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-current" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.512-2.96-2.628-.087-.117-.708-.941-.708-1.797 0-.856.448-1.274.607-1.446.16-.171.347-.214.464-.214.117 0 .234.005.336.011.107.005.25.032.392.37.144.343.49.1.597 1.22.043.447.086.76.128 1.073.117.848-.38 1.037-.38 1.037s.215.485.461.85c.335.508.725.93 1.157 1.25.432.32.748.448.748.448s.32-.384.534-.672c.214-.288.427-.245.705-.144.277.1.1.885.347 1.147.245.26.491.13.635-.275z" />
      </svg>
    </a>
  );
}
