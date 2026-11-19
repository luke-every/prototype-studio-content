"use client";

import { createContext, useContext } from "react";
import type { Translations } from "@/lib/translations";
import enTranslations from "@/locales/account/en.json";

const fallback = enTranslations as unknown as Translations;

const TranslationsContext = createContext<Translations>(fallback);

type Props = {
  translations: Translations;
  children: React.ReactNode;
};

export function TranslationsProvider({ translations, children }: Props) {
  return (
    <TranslationsContext.Provider value={translations}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations(): Translations {
  return useContext(TranslationsContext);
}
