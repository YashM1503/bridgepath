import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { TRANSLATIONS, detectLanguage, type LangCode, type TranslationSet } from "./translations";

interface LanguageContextType {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (key: keyof TranslationSet) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const stored = localStorage.getItem("bp-lang") as LangCode | null;
    return stored && TRANSLATIONS[stored] ? stored : detectLanguage();
  });

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
    localStorage.setItem("bp-lang", code);
    document.documentElement.lang = code;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key: keyof TranslationSet): string => {
      return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
