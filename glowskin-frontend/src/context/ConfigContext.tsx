import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getConfig } from "../services/config";

interface ConfigContextType {
  waPhone: string;
  setWaPhone: (phone: string) => void;
  instagramUrl: string;
  tiktokUrl: string;
  setSocialLinks: (instagramUrl: string, tiktokUrl: string) => void;
  promoBadge: string;
  promoTitle: string;
  promoSubtitle: string;
  bannerImageUrl: string;
  promoCta: string;
  setMarketingConfig: (promoBadge: string, promoTitle: string, promoSubtitle: string, bannerImageUrl: string, promoCta: string) => void;
}

const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/gloowskin1/";
const DEFAULT_TIKTOK_URL = "https://www.tiktok.com/@gloowskin2";
const DEFAULT_BANNER_IMAGE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuCbxRbdQiW3RNA3i4WAH6leHH7gt5HqFjF8x2wpOIZtBapQbsEzTiUcr1Zkuw0o2iPIybWZQoMz2FyC9fpqPAxclEh_VGbZvHlk6lKnMPqg82oVzlMdEtgu37IXcSPkHJugEGVaC3GPOOn7cZbKmnPp93DBIK0sRSKuUANHWgXzIZSGmtm6iMtwMUEEYG99abkAWxP3XD61aYbRUsMxfj8W9SIpIjU3ZV61zQJw8w5kbCpRYqrM8j73kw";
const DEFAULT_PROMO_BADGE = "Skincare & Bienestar";
const DEFAULT_PROMO_TITLE = "Tu ritual de bienestar";
const DEFAULT_PROMO_SUBTITLE = "Fórmulas cuidadosamente seleccionadas para realzar tu belleza natural, día a día.";
const DEFAULT_PROMO_CTA = "Explorar Ahora";

const ConfigContext = createContext<ConfigContextType>({
  waPhone: "",
  setWaPhone: () => {},
  instagramUrl: DEFAULT_INSTAGRAM_URL,
  tiktokUrl: DEFAULT_TIKTOK_URL,
  setSocialLinks: () => {},
  promoBadge: DEFAULT_PROMO_BADGE,
  promoTitle: DEFAULT_PROMO_TITLE,
  promoSubtitle: DEFAULT_PROMO_SUBTITLE,
  bannerImageUrl: DEFAULT_BANNER_IMAGE_URL,
  promoCta: DEFAULT_PROMO_CTA,
  setMarketingConfig: () => {},
});

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [waPhone, setWaPhone] = useState("");
  const [instagramUrl, setInstagramUrl] = useState(DEFAULT_INSTAGRAM_URL);
  const [tiktokUrl, setTiktokUrl] = useState(DEFAULT_TIKTOK_URL);
  const [promoBadge, setPromoBadge] = useState(DEFAULT_PROMO_BADGE);
  const [promoTitle, setPromoTitle] = useState(DEFAULT_PROMO_TITLE);
  const [promoSubtitle, setPromoSubtitle] = useState(DEFAULT_PROMO_SUBTITLE);
  const [bannerImageUrl, setBannerImageUrl] = useState(DEFAULT_BANNER_IMAGE_URL);
  const [promoCta, setPromoCta] = useState(DEFAULT_PROMO_CTA);

  useEffect(() => {
    getConfig()
      .then((cfg) => {
        setWaPhone(cfg.wa_phone ?? "");
        setInstagramUrl(cfg.instagram_url || DEFAULT_INSTAGRAM_URL);
        setTiktokUrl(cfg.tiktok_url || DEFAULT_TIKTOK_URL);
        setPromoBadge(cfg.promo_badge || DEFAULT_PROMO_BADGE);
        setPromoTitle(cfg.promo_title || DEFAULT_PROMO_TITLE);
        setPromoSubtitle(cfg.promo_subtitle || DEFAULT_PROMO_SUBTITLE);
        setBannerImageUrl(cfg.banner_image_url || DEFAULT_BANNER_IMAGE_URL);
        setPromoCta(cfg.promo_cta || DEFAULT_PROMO_CTA);
      })
      .catch(() => {});
  }, []);

  return (
    <ConfigContext.Provider value={{
      waPhone,
      setWaPhone,
      instagramUrl,
      tiktokUrl,
      setSocialLinks: (nextInstagramUrl, nextTiktokUrl) => {
        setInstagramUrl(nextInstagramUrl);
        setTiktokUrl(nextTiktokUrl);
      },
      promoBadge,
      promoTitle,
      promoSubtitle,
      bannerImageUrl,
      promoCta,
      setMarketingConfig: (nextPromoBadge, nextPromoTitle, nextPromoSubtitle, nextBannerImageUrl, nextPromoCta) => {
        setPromoBadge(nextPromoBadge);
        setPromoTitle(nextPromoTitle);
        setPromoSubtitle(nextPromoSubtitle);
        setBannerImageUrl(nextBannerImageUrl);
        setPromoCta(nextPromoCta);
      },
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfig() {
  return useContext(ConfigContext);
}
