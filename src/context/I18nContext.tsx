'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/lib/i18n/translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.uz) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('uz');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('chronova_lang') as Language | null;
      if (savedLang && (savedLang === 'uz' || savedLang === 'ru' || savedLang === 'en')) {
        setLanguageState(savedLang);
      }
    } catch {
      // LocalStorage error ignored
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('chronova_lang', lang);
    } catch {}
  };

  const t = (key: keyof typeof translations.uz): string => {
    const dict = translations[language] || translations.uz;
    return (dict as any)[key] || translations.uz[key] || (key as string);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
