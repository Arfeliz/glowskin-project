import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getConfig } from "../services/config";

interface ConfigContextType {
  waPhone: string;
  setWaPhone: (phone: string) => void;
  instagramUrl: string;
  tiktokUrl: string;
  setSocialLinks: (instagramUrl: string, tiktokUrl: string) => void;
}

const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/gloowskin1/";
const DEFAULT_TIKTOK_URL = "https://www.tiktok.com/@gloowskin2";

const ConfigContext = createContext<ConfigContextType>({
  waPhone: "",
  setWaPhone: () => {},
  instagramUrl: DEFAULT_INSTAGRAM_URL,
  tiktokUrl: DEFAULT_TIKTOK_URL,
  setSocialLinks: () => {},
});

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [waPhone, setWaPhone] = useState("");
  const [instagramUrl, setInstagramUrl] = useState(DEFAULT_INSTAGRAM_URL);
  const [tiktokUrl, setTiktokUrl] = useState(DEFAULT_TIKTOK_URL);

  useEffect(() => {
    getConfig()
      .then((cfg) => {
        setWaPhone(cfg.wa_phone ?? "");
        setInstagramUrl(cfg.instagram_url || DEFAULT_INSTAGRAM_URL);
        setTiktokUrl(cfg.tiktok_url || DEFAULT_TIKTOK_URL);
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
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfig() {
  return useContext(ConfigContext);
}
