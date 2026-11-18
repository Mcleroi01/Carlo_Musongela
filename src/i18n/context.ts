import { createContext, useContext } from "react";
import { translations, type Dictionary, type Lang } from "./translations";

export interface I18nValue {
  lang: Lang;
  t: Dictionary;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

export const I18nContext = createContext<I18nValue>({
  lang: "en",
  t: translations.en,
  setLang: () => {},
  toggleLang: () => {},
});

export const useI18n = () => useContext(I18nContext);
