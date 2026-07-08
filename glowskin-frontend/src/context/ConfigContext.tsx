import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getConfig } from "../services/config";

interface ConfigContextType {
  waPhone: string;
  setWaPhone: (phone: string) => void;
}

const ConfigContext = createContext<ConfigContextType>({
  waPhone: "",
  setWaPhone: () => {},
});

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [waPhone, setWaPhone] = useState("");

  useEffect(() => {
    getConfig()
      .then((cfg) => setWaPhone(cfg.wa_phone))
      .catch(() => {});
  }, []);

  return (
    <ConfigContext.Provider value={{ waPhone, setWaPhone }}>
      {children}
    </ConfigContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfig() {
  return useContext(ConfigContext);
}
