import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];

interface LanguageToggleProps {
  current: string;
  onChange: (code: string) => void;
}

export default function LanguageToggle({ current, onChange }: LanguageToggleProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-primary-foreground/80 border border-primary-foreground/20 hover:bg-primary-foreground/10 transition-all"
      >
        <Globe size={13} />
        <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 py-1 min-w-[150px] animate-fade-in">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { onChange(lang.code); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition-all ${
                current === lang.code ? "text-accent font-semibold" : "text-foreground"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {current === lang.code && <span className="ml-auto text-xs">✓</span>}
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
