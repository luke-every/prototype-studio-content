"use client";

import { createContext, useContext } from "react";
import type { PublicTranslations } from "@/lib/public-translations";
import enTranslations from "@/locales/public/en.json";

const fallback = enTranslations as PublicTranslations;

const PublicTranslationsContext = createContext<PublicTranslations>(fallback);

type Props = {
  translations: PublicTranslations;
  children: React.ReactNode;
};

export function PublicTranslationsProvider({ translations, children }: Props) {
  return (
    <PublicTranslationsContext.Provider value={translations}>
      {children}
    </PublicTranslationsContext.Provider>
  );
}

export function usePublicTranslations(): PublicTranslations {
  return useContext(PublicTranslationsContext);
}
