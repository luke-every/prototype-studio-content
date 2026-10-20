"use client";

import { Suspense, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { isLocale, DEFAULT_LOCALE } from "@/lib/locale";

const MealDetailModal = dynamic(
  () => import("@/components/shared/modals/MealDetailModal").then((m) => ({ default: m.MealDetailModal })),
  { ssr: false }
);

export type MealDetailOpts = {
  price?: string;
  strikethroughPrice?: string;
  cartQty?: number;
  isOneTime?: boolean;
  onQuantityChange?: (id: string, qty: number, meta: { title: string; image: string }) => void;
  /** When true, hides the quantity button in the meal detail modal. Defaults to false. */
  hideQuantityButton?: boolean;
  /**
   * The photo the card that opened the modal was already showing. Painted immediately so the panel
   * opens with its image rather than a grey pulse while the story request is in flight, and it is
   * normally the same URL the modal resolves anyway, so the browser has it (PRODUCT-815).
   */
  heroImage?: string;
  /** PROTOTYPE DEVIATION: a photo that replaces the story's own in the modal, not just until it loads. */
  imageOverride?: string;
  /** PROTOTYPE DEVIATION: CSS aspect-ratio for the modal's photo, e.g. "393/360"; the default is the fixed heights. */
  imageRatio?: string;
  /** PROTOTYPE DEVIATION: replaces the story's description text in the modal. */
  descriptionOverride?: string;
  /** PROTOTYPE DEVIATION: text colour class for the description, e.g. "text-light-text" for grey. Defaults to dark. */
  descriptionClassName?: string;
};

type MealDetailContextValue = {
  openMeal: (productId: string, slug: string, opts?: MealDetailOpts) => void;
};

const MealDetailContext = createContext<MealDetailContextValue | null>(null);

type OpenMealState = { id: string; slug: string } | null;

export function MealDetailProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params.locale ?? "") ? (params.locale as string) : DEFAULT_LOCALE;
  const [meal, setMeal] = useState<OpenMealState>(null);
  const [opts, setOpts] = useState<MealDetailOpts | undefined>(undefined);
  const originalPathRef = useRef<string | null>(null);
  // Paths the open modal belongs to: the one it was opened on, plus the /products/<slug> URL the
  // rewrite below moves to. Next patches history.replaceState, so that rewrite moves usePathname()
  // without a real navigation — watching the pathname alone would shut the modal the instant it
  // opened on a public page.
  const openedOnRef = useRef<string[]>([]);

  const openMeal = useCallback((id: string, slug: string, options?: MealDetailOpts) => {
    setMeal({ id, slug });
    setOpts(options);
    openedOnRef.current = [pathname];
    if (!pathname.includes('/account/')) {
      if (!originalPathRef.current) {
        // PROTOTYPE DEVIATION: keep the query string (e.g. ?v=1) so closing the modal doesn't drop the open variant.
        originalPathRef.current = pathname + window.location.search;
      }
      const productPath = pathname.startsWith(`/${locale}`) ? `/${locale}/products/${slug}` : `/products/${slug}`;
      // The pathname alone is what usePathname reports, so that is what the "still on this page" check needs.
      openedOnRef.current.push(productPath);
      window.history.replaceState(null, '', productPath + window.location.search);
    }
  }, [locale, pathname]);

  const closeModal = useCallback(() => {
    setMeal(null);
    setOpts(undefined);
    openedOnRef.current = [];
    if (originalPathRef.current) {
      window.history.replaceState(null, '', originalPathRef.current);
      originalPathRef.current = null;
    }
  }, []);

  // This provider sits above every route in the locale layout, so a client-side navigation never
  // unmounts it and an open modal rides along onto the next page. That is what the account swap
  // flow does: it pushes back to /account/my-plan with the meal card still open (PRODUCT-672).
  useEffect(() => {
    if (!meal || openedOnRef.current.includes(pathname)) return;
    setMeal(null);
    setOpts(undefined);
    openedOnRef.current = [];
    // We have already left the page the URL rewrite was made on, so there is nothing to restore.
    originalPathRef.current = null;
  }, [pathname, meal]);

  return (
    <MealDetailContext.Provider value={{ openMeal }}>
      {children}
      <MealDetailModal productId={meal?.id ?? null} slug={meal?.slug ?? null} opts={opts} locale={locale} onClose={closeModal} />
      <Suspense>
        <MealDeepLinkHandler openMeal={openMeal} />
      </Suspense>
    </MealDetailContext.Provider>
  );
}

function MealDeepLinkHandler({ openMeal }: { openMeal: (id: string, slug: string) => void }) {
  const searchParams = useSearchParams();
  const processedRef = useRef<boolean>(false);

  useEffect(() => {
    if (processedRef.current) return;
    const slug = searchParams.get("meal");
    if (!slug) return;
    processedRef.current = true;
    openMeal("", slug);
    // Remove ?meal= from the URL without triggering navigation.
    // On non-account pages openMeal already replaces the URL with /products/<slug>,
    // so the delete below is a no-op there. On account pages it cleans up the param.
    const url = new URL(window.location.href);
    url.searchParams.delete("meal");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, [searchParams, openMeal]);

  return null;
}

export function useMealDetail(): MealDetailContextValue {
  const ctx = useContext(MealDetailContext);
  if (!ctx) throw new Error("useMealDetail must be used within MealDetailProvider");
  return ctx;
}
