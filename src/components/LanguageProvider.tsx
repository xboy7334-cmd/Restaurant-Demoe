import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import type { Language } from '../types/api';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('your-choice-language');
    return saved === 'bn' ? 'bn' : 'en';
  });

  const value = useMemo(() => ({
    language,
    setLanguage: (next: Language) => {
      setLanguage(next);
      localStorage.setItem('your-choice-language', next);
    },
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
