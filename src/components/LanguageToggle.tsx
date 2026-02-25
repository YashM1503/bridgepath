import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LANGUAGE_NAMES, LANGUAGE_FLAGS, type LangCode } from "@/i18n/translations";

const LANGUAGES: LangCode[] = ["en", "es", "hi", "zh", "pt"];

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-primary-foreground/80 border border-primary-foreground/20 hover:bg-primary-foreground/10 transition-all"
      >
        <Globe size={13} />
        <span>{LANGUAGE_FLAGS[lang]} {lang.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 py-1 min-w-[150px] animate-fade-in">
          {LANGUAGES.map((code) => (
            <button
              key={code}
              onClick={() => { setLang(code); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition-all ${
                lang === code ? "text-accent font-semibold" : "text-foreground"
              }`}
            >
              <span>{LANGUAGE_FLAGS[code]}</span>
              <span>{LANGUAGE_NAMES[code]}</span>
              {lang === code && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
          <div className="border-t border-border mt-1 pt-1 px-3 py-1.5">
            <p className="text-[10px] text-muted-foreground">Translation API coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}
