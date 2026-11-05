"use client";
import Image from "next/image";
import {useEffect, useMemo, useRef, useState} from "react";
import {CloseFilledIcon, ChevronLeftIcon} from "@/components/icons";
import {Tags} from "@/components/shared/Tags";
import {MealQuantityButton} from "@/components/shared/MealQuantityButton";
import {MealRichText} from "@/components/account/meal/MealRichText";
import {AppRichText, type RichTextDoc} from "@/components/shared/AppRichText";
import {MacroStat} from "@/components/shared/MacroStat";
import {buildMacroStats} from "@/lib/meals/macroStats";
import {PartialFillStars} from "@/components/shared/PartialFillStars";
import {ImageFallback} from "@/components/shared/ImageFallback";
import {ReviewsIOWriteReviewWidget} from "@/components/shared/ReviewsIOWriteReviewWidget";
import {captureError} from "@/lib/error";
import { trackSelectItem } from "@/lib/analytics";
import { interpolate } from "@/lib/translations";
import type { MealDetailOpts } from "@/providers/MealDetailProvider";
import type {MealDetailApiResponse} from "@/lib/meals/meal-detail";
import {buildFilterLabelLookup} from "@/lib/storyblok/filterLabels";
import {shopifyImageUrl} from "@/lib/shopify/image";
import {resolveStoryblokProductImage} from "@/lib/storyblok/image";
import {useMealDetailQuantity} from "@/hooks/useMealDetailQuantity";
import {useSkuRating} from "@/hooks/useSkuRating";
import {useProductReviews} from "@/hooks/useProductReviews";
import {useTranslations} from "@/providers/TranslationsProvider";

function MealDetailModalSkeleton() {
    const t = useTranslations();
    return (
        <div className="animate-pulse flex flex-col gap-4">
            <div className="h-9 w-2/3 rounded bg-gray-200"/>
            <div className="h-4 w-1/3 rounded bg-gray-200"/>
            <div className="h-4 w-full rounded bg-gray-200"/>
            <div className="h-4 w-5/6 rounded bg-gray-200"/>
            <div className="flex flex-wrap gap-2">
                {[t.shared.modals.mealDetail.protein, t.shared.modals.mealDetail.carbs, t.shared.modals.mealDetail.fat, t.shared.modals.mealDetail.kcal].map((l) => (
                    <div key={l} className="rounded-[14px] bg-gray-200 w-20 h-18.25 lg:w-30 lg:h-20.75"/>
                ))}
            </div>
            {[t.shared.modals.mealDetail.ingredients, t.shared.modals.mealDetail.nutritionalValues, t.shared.modals.mealDetail.preparation].map((l) => (
                <div key={l} className="flex flex-col gap-2">
                    <div className="h-3 w-28 rounded bg-gray-200"/>
                    <div className="h-4 w-full rounded bg-gray-200"/>
                </div>
            ))}
        </div>
    );
}

type ReviewsSectionProps = {
    sku: string | null | undefined;
    ariaLabel: string;
    locale: string;
};

function ReviewsSection({sku, ariaLabel, locale}: ReviewsSectionProps) {
    const t = useTranslations();
    const {rating, loading: ratingLoading} = useSkuRating(sku);
    const {reviews, loadingMore, hasMore, loadMore} = useProductReviews(sku, 10);
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el || !hasMore) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) loadMore();
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, loadMore]);

    if (!sku) return null;

    return (
        <section aria-label={ariaLabel} className="flex flex-col">
            {rating && !ratingLoading && (
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-book text-[34px] leading-8.5 tracking-[-0.68px] text-dark">{rating.average.toFixed(1).replace(".", ",")}</span>
                    <div className="flex flex-col">
                        <PartialFillStars average={rating.average}/>
                        <span className="font-sans text-xs leading-4">
                            {interpolate(t.shared.starRating.reviews, {count: rating.count.toLocaleString()})}
                        </span>
                    </div>
                </div>
            )}

            <ReviewsIOWriteReviewWidget sku={sku} locale={locale}/>

            <div className="flex flex-col gap-4">
                {reviews.map((review, i) => (
                    <div key={i} className="flex flex-col gap-2 p-4.25 rounded-[14px] bg-[#f4f4f4] border border-[#eeeae6] shadow-[0px_1px_1.5px_rgba(55,45,39,0.06)]">
                        <div className="flex items-center justify-between">
                        <span className="font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark">
                            {review.reviewer.first_name} {review.reviewer.last_name}
                        </span>
                            <PartialFillStars average={review.rating} size={12}/>
                        </div>
                        <p className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark">{review.comments}</p>
                    </div>
                ))}
            </div>

            {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-1"/>}
            {loadingMore && (
                <div className="flex justify-center py-2" aria-hidden="true">
                    <div className="size-4 rounded-full border-2 border-dark/20 border-t-dark animate-spin"/>
                </div>
            )}
        </section>
    );
}

type ContentProps = {
    data: MealDetailApiResponse;
    opts: MealDetailOpts | undefined;
    locale: string;
};

function MealDetailModalContent({data, opts, locale}: ContentProps) {
    const t = useTranslations();
    const {story, product} = data;
    const {content} = story;
    const productImage = resolveStoryblokProductImage(content, 600) ?? shopifyImageUrl(product?.image ?? null, 600) ?? undefined;
    const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(null);

    const {quantity: localQty, onQuantityChange: handleQuantityChange} = useMealDetailQuantity({
        product,
        title: story.name,
        image: productImage,
        opts,
        soldOut: data.soldOut,
    });

    const macroStats = useMemo(() => buildMacroStats([
        { key: "protein", value: content.protein, label: t.shared.modals.mealDetail.protein },
        { key: "fibre", value: content.fibre, label: t.shared.modals.mealDetail.fibre },
        { key: "carbs", value: content.carbs, label: t.shared.modals.mealDetail.carbs },
        { key: "fat", value: content.fat, label: t.shared.modals.mealDetail.fat },
        { key: "kcal", value: content.kcal, label: t.shared.modals.mealDetail.kcal, unit: "" },
    ]), [content, t]);

    const filterLabelLookup = useMemo(() => buildFilterLabelLookup(data.filterDatasources), [data.filterDatasources]);

    const tags = useMemo<string[]>(() => {
        const translate = (raw: string) => filterLabelLookup.get(raw.toLowerCase()) ?? raw;
        return [
            ...(content.nutrition_filter ?? []).map(translate),
            ...(content.spiciness_filter ? [translate(content.spiciness_filter)] : []),
            ...(content.recipe_without_filter ?? []).map((v: string) => `${t.shared.modals.mealDetail.withoutPrefix} ${translate(v)}`),
        ].filter(Boolean);
    }, [content, filterLabelLookup, t]);

    const infoSections = useMemo(() => [
        { key: "ingredients", label: t.shared.modals.mealDetail.ingredients, doc: content.ingredients },
        { key: "nutritionalValues", label: t.shared.modals.mealDetail.nutritionalValues, doc: content.nutritional_values },
        { key: "preparation", label: t.shared.modals.mealDetail.preparation, doc: content.preparation },
        { key: "keyIngredients", label: t.shared.modals.mealDetail.keyIngredients, doc: content.highlights },
    ].filter((s): s is { key: string; label: string; doc: RichTextDoc } => s.doc != null), [content, t]);

    return (
        <div className="flex flex-col gap-4">
            <h2 className="font-book text-[34px] leading-8.5 tracking-[-0.68px] text-dark">{story.name}</h2>

            {product?.id && !opts?.hideQuantityButton && (
                <div className="w-full">
                    <MealQuantityButton soldOut={data.soldOut} onChange={handleQuantityChange} initialQuantity={localQty}/>
                </div>
            )}

            {opts?.descriptionOverride ? (
                <p className={`font-sans text-base leading-5.5 tracking-[-0.32px] ${opts.descriptionClassName ?? "text-dark"}`}>{opts.descriptionOverride}</p>
            ) : content.description != null && (
                <AppRichText doc={content.description as RichTextDoc} className={`font-sans text-base leading-5.5 tracking-[-0.32px] ${opts?.descriptionClassName ?? "text-dark"}`}/>
            )}

            <div className="flex flex-wrap gap-2">
                {macroStats.map((stat) => (
                    <MacroStat key={stat.key} value={stat.value} label={stat.label} unit={stat.unit}/>
                ))}
            </div>

            <Tags tags={tags} variant="muted"/>

            <div className="flex flex-col border-t border-[#eeeae6]">
                {infoSections.map((section, i) => {
                    const isOpen = openSectionIndex === i;
                    return (
                        <div key={section.key} className="border-b border-[#eeeae6]">
                            <button
                                type="button"
                                onClick={() => setOpenSectionIndex(isOpen ? null : i)}
                                aria-expanded={isOpen}
                                className="w-full flex items-center justify-between gap-4 py-2 text-left cursor-pointer"
                            >
                                <span className="font-sans text-xs text-[#574A41] font-medium uppercase">{section.label}</span>
                                <span
                                    aria-hidden="true"
                                    className="shrink-0 py-2 flex items-center justify-center pe-1"
                                >
                                    <ChevronLeftIcon size={8} stroke="#DAD6D2" className={`transition-transform ${isOpen ? "rotate-90" : "-rotate-90"}`}/>
                                </span>
                            </button>
                            {isOpen && (
                                <div className="pb-5">
                                    {section.key === "keyIngredients" ?
                                        <MealRichText content={content.highlights}/>
                                        : <AppRichText doc={section.doc} className="font-sans text-base leading-5.5 tracking-[-0.32px] text-dark"/>}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <ReviewsSection sku={product?.sku} ariaLabel={t.shared.modals.mealDetail.customerReviewsAriaLabel} locale={locale}/>
        </div>
    );
}

type Props = {
    productId: string | null;
    slug: string | null;
    locale: string;
    onClose: () => void;
    opts?: MealDetailOpts;
};

export function MealDetailModal({productId, slug, locale, onClose, opts}: Props) {
    const t = useTranslations();
    const open = slug !== null;

    const [data, setData] = useState<MealDetailApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loadedHandle = useRef<string | null>(null);

    useEffect(() => {
        if (!slug) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setData(null);
            loadedHandle.current = null;
            return;
        }
        // When productId is empty, the slug itself acts as the dedup handle.
        const handle = productId || slug;
        if (loadedHandle.current === handle) return;

        setLoading(true);
        setData(null);

        void (async () => {
            try {
                const params = new URLSearchParams({ slug, locale });
                if (productId) params.set("id", productId);
                const res = await fetch(`/api/product?${params.toString()}`);
                if (!res.ok) {
                    captureError(new Error(`Failed to load meal: ${res.status}`), {
                        extra: {productId, status: res.status},
                        tags: {hook: "MealDetailModal"},
                    });
                    return;
                }
                const json = (await res.json()) as MealDetailApiResponse;
                if (loadedHandle.current === handle || loadedHandle.current === null) {
                    loadedHandle.current = handle;
                    setData(json);
                }
            } catch (e) {
                captureError(e instanceof Error ? e : new Error("Meal detail fetch failed"), {
                    extra: {productId},
                    tags: {hook: "MealDetailModal"},
                });
            } finally {
                setLoading(false);
            }
        })();
    }, [productId, slug, locale]);

    useEffect(() => {
        if (!data) return;
        trackSelectItem({
            sku: data.product?.sku ?? data.product?.id ?? undefined,
            title: data.story.name,
            price: data.product?.price ? parseFloat(data.product.price) : undefined,
            type: data.product?.productType || undefined,
            variantTitle: data.product?.variantTitle ?? undefined,
        });
    }, [data]);

    const productImage = (data ? resolveStoryblokProductImage(data.story.content, 600) : null)
        ?? shopifyImageUrl(data?.product?.image ?? null, 600)
        ?? undefined;
    // The card that opened this already rendered the same photo at the same width, so showing it
    // straight away is a cache hit and removes the 1-2s of skeleton the modal used to sit in while
    // it fetched the story (PRODUCT-815). Once the story lands, productImage takes over - normally
    // the identical URL, so nothing visibly swaps.
    const displayImage = opts?.imageOverride ?? productImage ?? opts?.heroImage;
    const [imgError, setImgError] = useState<boolean>(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setImgError(false);
    }, [productImage]);


    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    const [rendered, setRendered] = useState<boolean>(false);
    const [closing, setClosing] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setClosing(false);
            setRendered(true);
        } else {
            setClosing(true);
            const t = setTimeout(() => {
                setRendered(false);
                setClosing(false);
            }, 300);
            return () => clearTimeout(t);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
                document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
            }
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
            document.documentElement.style.overflow = "";
            document.documentElement.style.removeProperty("--scrollbar-width");
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
            document.documentElement.style.overflow = "";
            document.documentElement.style.removeProperty("--scrollbar-width");
        };
    }, [open]);

    if (!rendered) return null;

    return (
        <div
            // z-[70] clears every overlay this modal can be opened from: the mobile search
            // overlay and the drawers at z-50, the cart sticky footers at z-[51], and the
            // all-meals sticky CTAs at z-[60]. At z-50 it tied with the search overlay, which
            // portals to <body> and so paints later — the modal opened behind it (PRODUCT-669).
            className={`fixed inset-0 z-[70] backdrop-blur-[2px] bg-[rgba(30,30,30,0.55)] transition-opacity duration-300 ${closing ? "opacity-0" : "drawer-backdrop-enter"}`}
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={data?.story.name}
                className={`
          fixed inset-x-0 bottom-0 lg:inset-0 lg:m-auto
          w-full lg:w-140 lg:h-fit
          max-h-[90dvh]
          flex flex-col overflow-hidden
          rounded-t-[28px] lg:rounded-[28px]
          bg-[#fafaf8] outline-none
          ${closing ? "drawer-panel-exit" : "drawer-panel-enter"}
        `}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={t.shared.modals.mealDetail.closeAriaLabel}
                    className="cursor-pointer absolute top-6 right-6 z-10 size-8 rounded-2xl bg-white/85 flex items-center justify-center"
                >
                    <span className="relative size-4 flex items-center justify-center">
                        <CloseFilledIcon size={10}/>
                    </span>
                </button>

                {/* Sizes itself from content (flex-basis auto) rather than flex-1 (flex-basis 0).
                    Under the panel's lg:h-fit, Safari gives a flex-basis-0 child no intrinsic
                    height, collapsing the panel to 0 and leaving only the backdrop on screen. */}
                <div className="min-h-0 overflow-y-auto flex flex-col">
                    <div
                        className={`relative w-full shrink-0 bg-light-grey ${opts?.imageRatio ? "" : "h-55 lg:h-82.5"}`}
                        style={opts?.imageRatio ? { aspectRatio: opts.imageRatio } : undefined}
                    >
                        {/* One image, never a carousel: the design shows a single recipe photo and the
                            extra Storyblok images were only ever reachable by swiping (Luke,
                            PRODUCT-815). heroImage is the picture the opening card was already
                            showing, so it paints on the first frame and the panel opens with its
                            photo rather than a grey pulse while the story loads. */}
                        {displayImage && !imgError ? (
                            <Image
                                src={displayImage}
                                alt={data?.story.name ?? ""}
                                fill
                                unoptimized
                                className="object-cover"
                                sizes="(max-width: 1023px) 100vw, 560px"
                                onError={() => setImgError(true)}
                            />
                        ) : loading || !data ? (
                            <div className="absolute inset-0 animate-pulse bg-gray-200"/>
                        ) : (
                            <ImageFallback/>
                        )}

                        <div className="lg:hidden absolute top-2 inset-x-0 flex justify-center touch-none">
                            <div className="w-10 h-1 rounded-full bg-white/70"/>
                        </div>
                    </div>

                    <div className="bg-white flex flex-col px-6 py-8">
                        {loading ? (
                            <MealDetailModalSkeleton/>
                        ) : data ? (
                            <MealDetailModalContent
                                data={data}
                                opts={opts}
                                locale={locale}
                            />
                        ) : (
                            <p className="text-sm text-light-text text-center mt-10">{t.shared.modals.mealDetail.error}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
