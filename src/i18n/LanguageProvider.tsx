import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { I18nContext } from "./context";
import { LANGS, translations, type Lang } from "./translations";

const STORAGE_KEY = "portfolio-lang";

/** Saved choice first, then `?lang=` in the URL, then the browser language; English otherwise. */
function initialLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl && LANGS.includes(fromUrl as Lang)) return fromUrl as Lang;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && LANGS.includes(saved as Lang)) return saved as Lang;
  } catch {
    // Storage can be blocked (private mode); fall through to the browser language.
  }
  return navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore: the choice just won't persist.
    }
  }, []);

  const toggleLang = useCallback(() => setLang(lang === "en" ? "fr" : "en"), [lang, setLang]);

  useEffect(() => {
    const t = translations[lang];
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
  }, [lang]);

  const value = useMemo(() => ({ lang, t: translations[lang], setLang, toggleLang }), [lang, setLang, toggleLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
