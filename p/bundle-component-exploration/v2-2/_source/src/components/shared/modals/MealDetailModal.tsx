"use client";
import Image from "next/image";
import {Fragment, useEffect, useMemo, type CSSProperties, type ReactNode, useRef, useState} from "react";
import {CloseFilledIcon, ChevronLeftIcon} from "@/components/icons";
import {MealQuantityButton} from "@/components/shared/MealQuantityButton";
import {AppRichText, type RichTextDoc} from "@/components/shared/AppRichText";
import {PartialFillStars} from "@/components/shared/PartialFillStars";
import {ImageFallback} from "@/components/shared/ImageFallback";
import {captureError} from "@/lib/error";
import { trackSelectItem } from "@/lib/analytics";
import { interpolate } from "@/lib/translations";
import type { MealDetailOpts } from "@/providers/MealDetailProvider";
import type {MealDetailApiResponse} from "@/lib/meals/meal-detail";
import {curatedTags} from "@/lib/meals/curatedTags";
import {buildFilterLabelLookup} from "@/lib/storyblok/filterLabels";
import {shopifyImageUrl} from "@/lib/shopify/image";
import {resolveStoryblokProductImage} from "@/lib/storyblok/image";
import {MODAL_EXIT_MS, useModalExit} from "@/hooks/useModalExit";
import {useMealDetailQuantity} from "@/hooks/useMealDetailQuantity";
import {useSkuRating} from "@/hooks/useSkuRating";
import {RatingPill} from "@/components/shared/RatingPill";
import {useProductReviews} from "@/hooks/useProductReviews";
import {useTranslations} from "@/providers/TranslationsProvider";
import {ExploreNext, ExploreSideCards, ExploreThumbs, SwipeOverlay, useExploreNav} from "./MealExplore";

// PROTOTYPE DEVIATION: each meal's response is fetched once and kept, so reopening a recipe (or going back and
// forth between recipes) never refetches or shows the loading state. prefetchMealDetail warms it ahead of a tap.
const detailRequests = new Map<string, Promise<MealDetailApiResponse | null>>();
const detailResolved = new Map<string, MealDetailApiResponse>();

function loadMealDetail(slug: string, locale: string, productId?: string, skipStoryPhoto = false): Promise<MealDetailApiResponse | null> {
    const key = `${locale}:${slug}`;
    const existing = detailRequests.get(key);
    if (existing) return existing;
    const params = new URLSearchParams({slug, locale});
    if (productId) params.set("id", productId);
    const request = (async () => {
        try {
            const res = await fetch(`/api/product?${params.toString()}`);
            if (!res.ok) {
                captureError(new Error(`Failed to load meal: ${res.status}`), {
                    extra: {productId, status: res.status},
                    tags: {hook: "MealDetailModal"},
                });
                return null;
            }
            const json = (await res.json()) as MealDetailApiResponse;
            detailResolved.set(key, json);
            // Decode the photo now too, so the recipe opens with its image rather than a grey box.
            const photo = skipStoryPhoto ? undefined : resolveStoryblokProductImage(json.story.content, 600);
            if (photo) new window.Image().src = photo;
            return json;
        } catch (e) {
            captureError(e instanceof Error ? e : new Error("Meal detail fetch failed"), {
                extra: {productId},
                tags: {hook: "MealDetailModal"},
            });
            return null;
        }
    })();
    detailRequests.set(key, request);
    // A failed load isn't kept, so a later tap can retry.
    void request.then((json) => {
        if (!json) detailRequests.delete(key);
    });
    return request;
}

/** `photo` is the picture the modal will show in place of the story's own: it is warmed instead of the story's. */
export function prefetchMealDetail(slug: string, locale: string, photo?: string): void {
    if (photo) new window.Image().src = photo;
    void loadMealDetail(slug, locale, undefined, !!photo);
}

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
};

function ReviewsSection({sku, ariaLabel}: ReviewsSectionProps) {
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

/** All the text of a rich text doc as one string (the paragraphs joined by a space). */
function plainText(doc: unknown): string {
    const walk = (node: {text?: string; content?: unknown[]}): string => node.text ?? (node.content ?? []).map((c) => walk(c as {text?: string; content?: unknown[]})).join("");
    return ((doc as RichTextDoc).content ?? []).map((n) => walk(n as {content?: unknown[]})).join(" ").trim();
}

/** Per-portion grams from the nutrition table's last column ("10,0" -> "10"). */
function tableGrams(doc: unknown, rowName: RegExp): string | undefined {
    const table = ((doc as RichTextDoc | null | undefined)?.content ?? []).find((n) => n.type === "table");
    const cellText = (cell: unknown): string => plainText({content: [cell]});
    const row = (table?.content ?? []).map((r) => (r.content ?? []).map(cellText)).find((cells) => rowName.test(cells[0] ?? ""));
    const n = parseFloat((row?.[row.length - 1] ?? "").replace(",", "."));
    return isNaN(n) ? undefined : (Math.round(n * 10) / 10).toString().replace(".", ",");
}

/** Per-portion kcal from the "Energy (kJ/kcal)" row ("847/202" -> "202"). */
function tableKcal(doc: unknown): string | undefined {
    const table = ((doc as RichTextDoc | null | undefined)?.content ?? []).find((n) => n.type === "table");
    const cellText = (cell: unknown): string => plainText({content: [cell]});
    const row = (table?.content ?? []).map((r) => (r.content ?? []).map(cellText)).find((cells) => /^energy/i.test(cells[0] ?? ""));
    const n = parseFloat(((row?.[row.length - 1] ?? "").split("/").pop() ?? "").replace(",", "."));
    return isNaN(n) ? undefined : String(Math.round(n));
}

// Fixed layout so the columns hold their share: label takes the rest, "Per portion" a little more than "Per 100g". The header's line break after "Per" only shows below lg.
const NUTRITION_COLUMNS = "[&_table]:table-fixed [&_th:nth-child(2)]:w-[22%] [&_th:nth-child(3)]:w-[24%] lg:[&_th_br]:hidden";

type TableNode = {type: string; attrs?: Record<string, unknown>; content?: TableNode[]; text?: string};

/**
 * Reshapes the story's nutrition table: "Energy (kj/kcal)" with "437/104" becomes an "Energy (kJ)" and an "Energy (kcal)" row,
 * and every other "Fat (g)" row drops the unit from its label and shows it beside the values ("2,1 g").
 */
function nutritionTableOf(doc: RichTextDoc): RichTextDoc {
    const NBSP = "\u00a0";
    // The two value columns are right-aligned.
    const cellOf = (cell: TableNode, text: string, i: number): TableNode => {
        // Header "Per 100g" gets a hard break after "Per"; the space before it keeps one line where the break is hidden.
        const inline: TableNode[] = cell.type === "tableHeader" && i > 0 && text.startsWith("Per ")
            ? [{type: "text", text: "Per "}, {type: "hard_break"}, {type: "text", text: text.slice(4)}]
            : [{type: "text", text}];
        return {...cell, content: [{type: "paragraph", attrs: {textAlign: i > 0 ? "right" : null}, content: inline}]};
    };
    const rowOf = (row: TableNode, cells: string[]): TableNode => ({...row, content: (row.content ?? []).map((cell, i) => cellOf(cell, cells[i], i))});
    const mapRow = (row: TableNode): TableNode[] => {
        const cells = row.content ?? [];
        if (cells[0]?.type === "tableHeader") {
            // "100g" -> "Per 100g"; "Portion (450)" -> "Per portion (450g)"
            const [first, ...rest] = cells.map((cell) => plainText({type: "doc", content: [cell]}).replace(/\u00a0/g, " ").trim());
            return [rowOf(row, [first, ...rest.map((h) => h.replace(/^100\s*g$/i, "Per 100g").replace(/^portion\s*\((\d+)\s*g?\)$/i, "Per portion ($1g)"))])];
        }
        if (cells[0]?.type !== "tableCell") return [row];
        const [label, ...values] = cells.map((cell) => plainText({type: "doc", content: [cell]}).replace(/\u00a0/g, " ").trim());
        const match = label.match(/^(.*?)\s*\(([^)]*)\)$/);
        if (!match) return [row];
        const [, name, unit] = match;
        if (/^energy$/i.test(name) && unit.includes("/")) {
            const [kj, kcal] = unit.split("/").map((u) => (u.trim().toLowerCase() === "kj" ? "kJ" : u.trim()));
            const part = (i: number, u: string): string[] => [`${name} (${u})`, ...values.map((v) => (v.split("/")[i]?.trim() ?? "") + (v.split("/")[i] ? NBSP + u : ""))];
            return [rowOf(row, part(0, kj)), rowOf(row, part(1, kcal))];
        }
        return [rowOf(row, [name, ...values.map((v) => (v ? v + NBSP + unit : v))])];
    };
    return {...doc, content: (doc.content ?? []).map((node) => (node.type === "table" ? {...node, content: (node.content ?? []).flatMap(mapRow)} : node))};
}

const sentenceCase = (v: string): string => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();

type KeyIngredient = { name: string; text: string };

/**
 * The story's highlights come in two shapes: a heading (the ingredient) followed by a paragraph (why it matters), repeated;
 * or one paragraph per ingredient, with the name in bold, a line break, then the text.
 */
function keyIngredientsOf(doc: unknown): KeyIngredient[] {
    type Node = {type?: string; text?: string; marks?: {type: string}[]; content?: Node[]};
    const nodes = (doc as {content?: Node[]} | null | undefined)?.content ?? [];
    const textOf = (parts: Node[]): string => parts.map((c) => c.text ?? "").join("").trim();
    return nodes.reduce<KeyIngredient[]>((list, node) => {
        const parts = node.content ?? [];
        const [first, second] = parts;
        if (node.type === "heading") list.push({name: textOf(parts), text: ""});
        else if (node.type === "paragraph" && first?.marks?.some((m) => m.type === "bold") && second?.type === "hard_break") list.push({name: textOf([first]), text: textOf(parts.slice(2))});
        else if (node.type === "paragraph" && list.length > 0) list[list.length - 1].text = `${list[list.length - 1].text} ${textOf(parts)}`.trim();
        return list;
    }, []);
}

// TODO(lift): Tag has no frame-only variant yet; this matches the recipe design (no fill, off-white frame)
function Chip({label}: {label: string}) {
    return <span className="rounded-full border border-off-white px-3 py-1 font-sans text-xs leading-4 tracking-[-0.24px] text-near-black/60 capitalize">{label}</span>;
}

// TODO(lift): fake bio flag — replace with the product's organic attribute
const BIO_SLUGS = ["apple-cinnamon-porridge", "pitaya-smoothie", "vanilla-hazelnut-muesli"];

function BioChip() {
    return (
        <span className="flex items-center gap-1 rounded-full border border-off-white px-3 py-1 font-sans text-xs leading-4 tracking-[-0.24px] text-near-black/60">
            {/* 2x asset, shown at half size */}
            <Image src="img/bio-label.png" alt="" width={56} height={32} unoptimized />
            {/* TODO(lift): replace with translation key */}
            Bio
        </span>
    );
}

function SectionHeader({label, open, onToggle}: {label: string; open: boolean; onToggle: () => void}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
        >
            <span className="font-sans text-base font-medium leading-[22px] tracking-[-0.32px] text-near-black">{label}</span>
            <span aria-hidden="true" className="shrink-0 py-2 flex items-center justify-center pe-1">
                <ChevronLeftIcon size={8} stroke="#DAD6D2" className={`transition-transform ${open ? "rotate-90" : "-rotate-90"}`}/>
            </span>
        </button>
    );
}

/** Always mounted so it can animate: the grid row slides between 0fr and 1fr, and the closed body is inert. */
function AccordionBody({open, children}: {open: boolean; children: ReactNode}) {
    return (
        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`} inert={!open}>
            <div className="min-h-0 overflow-hidden">
                <div className="pt-4">{children}</div>
            </div>
        </div>
    );
}

type ContentProps = {
    data: MealDetailApiResponse;
    opts: MealDetailOpts | undefined;
};

function MealDetailModalContent({data, opts}: ContentProps) {
    const t = useTranslations();
    const {story, product} = data;
    const {content} = story;
    const productImage = resolveStoryblokProductImage(content, 600) ?? shopifyImageUrl(product?.image ?? null, 600) ?? undefined;
    // TODO(lift): the prototype's products carry no sku, so the story slug stands in
    const [openSections, setOpenSections] = useState<string[]>(["ingredients"]);
    const nutritionRef = useRef<HTMLDivElement>(null);
    // Tapping the macro bar opens the nutrition section and scrolls to 40px above its header. The page can't scroll past its own
    // end until the section has grown, so the target is re-measured every frame while the 300ms accordion opens.
    const showNutrition = (): void => {
        setOpenSections((cur) => (cur.includes("nutritionalValues") ? cur : [...cur, "nutritionalValues"]));
        const header = nutritionRef.current;
        const scroller = header?.closest<HTMLElement>(".overflow-y-auto");
        if (!header || !scroller) return;
        const start = scroller.scrollTop;
        const began = performance.now();
        const step = (now: number): void => {
            const t = Math.min((now - began) / 400, 1);
            const target = scroller.scrollTop + header.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 40;
            scroller.scrollTop = t < 1 ? start + (target - start) * (1 - (1 - t) ** 3) : target;
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const toggleSection = (key: string): void => setOpenSections((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]));
    const [fullIngredientsOpen, setFullIngredientsOpen] = useState<boolean>(false);

    const {quantity: localQty, onQuantityChange: handleQuantityChange} = useMealDetailQuantity({
        product,
        title: story.name,
        image: productImage,
        opts,
        soldOut: data.soldOut,
    });

    // Always the same four cells, in this order; a missing value shows a dash rather than dropping the cell.
    const macroStats = useMemo(() => [
        { key: "protein", value: tableGrams(content.nutritional_values, /^protein/i), label: sentenceCase(t.shared.modals.mealDetail.protein), unit: "g" },
        { key: "fibre", value: tableGrams(content.nutritional_values, /^(dietary )?fib(re|er)/i), label: sentenceCase(t.shared.modals.mealDetail.fibre), unit: "g" },
        { key: "carbs", value: tableGrams(content.nutritional_values, /^carbohydrate/i), label: sentenceCase(t.shared.modals.mealDetail.carbs), unit: "g" },
        { key: "kcal", value: tableKcal(content.nutritional_values), label: sentenceCase(t.shared.modals.mealDetail.kcal), unit: "" },
    ].map((stat) => stat.value === undefined || stat.value === "" ? { ...stat, value: "–", unit: "" } : stat), [content, t]);

    const filterLabelLookup = useMemo(() => buildFilterLabelLookup(data.filterDatasources), [data.filterDatasources]);

    const tags = useMemo<string[]>(() => {
        const translate = (raw: string) => filterLabelLookup.get(raw.toLowerCase()) ?? raw;
        if (opts?.curatedTags) {
            return curatedTags({
                nutrition: content.nutrition_filter,
                spiciness: content.spiciness_filter,
                without: content.recipe_without_filter,
                contains: content.recipe_contains,
                label: translate,
            });
        }
        return [
            ...(content.nutrition_filter ?? []).map(translate),
            ...(content.spiciness_filter ? [translate(content.spiciness_filter)] : []),
            ...(content.recipe_without_filter ?? []).map((v: string) => `${t.shared.modals.mealDetail.withoutPrefix} ${translate(v)}`),
        ].filter(Boolean);
    }, [content, filterLabelLookup, opts?.curatedTags, t]);

    const keyIngredients = useMemo(() => keyIngredientsOf(content.highlights), [content.highlights]);
    // Soy and Gluten are already in the tag list above, so they aren't repeated here.
    const withoutTags = useMemo<string[]>(
        () => (content.recipe_without_filter ?? []).map((v: string) => `No ${filterLabelLookup.get(v.toLowerCase()) ?? v}`).filter((label: string) => !tags.includes(label)),
        [content.recipe_without_filter, filterLabelLookup, tags],
    );
    const hasIngredients = content.ingredients != null || keyIngredients.length > 0;
    const infoSections = useMemo(() => [
        { key: "nutritionalValues", label: t.shared.modals.mealDetail.nutritionalValues, doc: content.nutritional_values && nutritionTableOf(content.nutritional_values as RichTextDoc) },
    ].filter((s): s is { key: string; label: string; doc: RichTextDoc } => s.doc != null), [content, t]);

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <h2 className="font-book text-[28px] leading-8 tracking-[-0.56px] text-dark">{story.name}</h2>
                <RatingPill sku={product?.sku ?? story.slug}/>
            </div>

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
            </div>

            {/* One row: a single bar, cells split by white dividers */}
            <button
                type="button"
                onClick={showNutrition}
                disabled={infoSections.length === 0}
                aria-label={t.shared.modals.mealDetail.nutritionalValues}
                className="flex w-full cursor-pointer overflow-hidden rounded-[18px] border border-white bg-off-white disabled:cursor-default lg:max-w-[345px]">
                {macroStats.map((stat, i) => (
                    <div key={stat.key} className={`flex min-w-0 flex-1 flex-col items-center px-3 py-4 ${i > 0 ? "border-l-2 border-white" : ""}`}>
                        <div className="flex items-baseline gap-0.5">
                            <span className="font-book text-2xl leading-[26px] tracking-[-0.48px] text-dark">{stat.value}</span>
                            {stat.unit !== "" && <span className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text">{stat.unit}</span>}
                        </div>
                        <span className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text/60">{stat.label}</span>
                    </div>
                ))}
            </button>

            {(tags.length > 0 || BIO_SLUGS.includes(story.slug)) && (
                <div className="flex flex-wrap items-center gap-2">
                    {BIO_SLUGS.includes(story.slug) && <BioChip/>}
                    {tags.map((tag) => <Chip key={tag} label={tag}/>)}
                </div>
            )}
            </div>

            <div className="flex flex-col gap-6">
                {hasIngredients && (
                    <div className="flex flex-col">
                        <SectionHeader label={t.shared.modals.mealDetail.ingredients} open={openSections.includes("ingredients")} onToggle={() => toggleSection("ingredients")}/>
                        <AccordionBody open={openSections.includes("ingredients")}>
                            <div className="flex flex-col gap-4">
                                {keyIngredients.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        {keyIngredients.map((item) => (
                                            <div key={item.name} className="flex items-start gap-3 rounded-2xl border border-[#eee] p-3">
                                                                                                <div aria-hidden="true" className="relative size-16 shrink-0 overflow-hidden rounded-[14px] bg-light-brown">
                                                    {opts?.ingredientImage?.(item.name) && <Image src={opts.ingredientImage(item.name) as string} alt="" fill unoptimized loading="eager" className="object-cover" sizes="64px"/>}
                                                </div>
                                                {/* At least as tall as the photo: short copy centres beside it, copy taller than the photo grows the box and so starts at the top. */}
                                                <div className="flex min-h-16 min-w-0 flex-1 items-center">
                                                    <p className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark">
                                                        {item.name}.
                                                        <span className="text-dark/60"> {item.text}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {content.ingredients != null && (
                                    <div className="relative pt-2 font-sans text-sm leading-[19px] tracking-[-0.28px]">
                                        {/* Collapsed: two lines tall, with "read more" sitting over the end of the second line */}
                                        <p className={fullIngredientsOpen ? "" : "max-h-[38px] overflow-hidden"}>
                                            <span className="text-near-black">Full ingredients: </span>
                                            <span className="text-dark/60">{plainText(content.ingredients)}</span>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setFullIngredientsOpen(!fullIngredientsOpen)}
                                            aria-expanded={fullIngredientsOpen}
                                            className={`cursor-pointer text-dark underline ${fullIngredientsOpen ? "mt-1 block" : "absolute bottom-0 right-0 bg-white pl-1"}`}
                                        >
                                            {/* TODO(lift): replace with translation key */}
                                            {fullIngredientsOpen ? "read less" : "read more"}
                                        </button>
                                    </div>
                                )}
                                {withoutTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {withoutTags.map((tag) => <Chip key={tag} label={tag}/>)}
                                    </div>
                                )}
                            </div>
                        </AccordionBody>
                    </div>
                )}
                {infoSections.map((section) => (
                    <Fragment key={section.key}>
                    <div className="h-px shrink-0 bg-light-grey"/>
                    <div ref={nutritionRef} className="flex flex-col">
                        <SectionHeader label={section.label} open={openSections.includes(section.key)} onToggle={() => toggleSection(section.key)}/>
                        <AccordionBody open={openSections.includes(section.key)}>
                            <AppRichText doc={section.doc} className={`font-sans text-base leading-5.5 tracking-[-0.32px] text-dark ${section.key === "nutritionalValues" ? NUTRITION_COLUMNS : ""}`}/>
                        </AccordionBody>
                    </div>
                    </Fragment>
                ))}
                <div className="h-px shrink-0 bg-light-grey"/>
                {/* TODO(lift): the prototype has no sku, so the story slug stands in */}
                <ReviewsSection sku={product?.sku ?? story.slug} ariaLabel={t.shared.modals.mealDetail.customerReviewsAriaLabel}/>
            </div>
        </div>
    );
}

type Props = {
    productId: string | null;
    slug: string | null;
    locale: string;
    onClose: () => void;
    opts?: MealDetailOpts;
    /** PROTOTYPE DEVIATION: render as a page inside another modal: no overlay, no scroll lock, and the close button goes back. */
    inline?: boolean;
};

export function MealDetailModal({productId, slug: slugProp, locale, onClose, opts: optsProp, inline = false}: Props) {
    const t = useTranslations();
    const open = slugProp !== null;
    // PROTOTYPE DEVIATION: the provider clears slug and opts the moment it closes, which emptied the panel before its exit
    // animation ran. Keep the last open meal and its options so the panel animates out with its content.
    const [held, setHeld] = useState<{slug: string | null; opts: MealDetailOpts | undefined}>({slug: slugProp, opts: optsProp});
    if (slugProp && (held.slug !== slugProp || held.opts !== optsProp)) setHeld({slug: slugProp, opts: optsProp});
    const slug = slugProp ?? held.slug;
    const opts = slugProp ? optsProp : held.opts;
    const {scrollRef, handlers} = useExploreNav(opts?.explore);

    // Straight from the cache when the meal has been loaded before, so there is no empty first frame.
    const [data, setData] = useState<MealDetailApiResponse | null>(() => (slug ? detailResolved.get(`${locale}:${slug}`) ?? null : null));
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!slug) return;
        const cached = detailResolved.get(`${locale}:${slug}`);
        if (cached) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setData(cached);
            setLoading(false);
            return;
        }
        let stale = false;
        setLoading(true);
        setData(null);
        void loadMealDetail(slug, locale, productId || undefined).then((json) => {
            if (stale) return;
            if (json) setData(json);
            setLoading(false);
        });
        return () => {
            stale = true;
        };
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
        if (!open || inline) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, inline, onClose]);

    const [rendered, setRendered] = useState<boolean>(false);
    const [closing, setClosing] = useState<boolean>(false);
    const backdropRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    useModalExit(closing && !inline, backdropRef, panelRef);

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
            }, MODAL_EXIT_MS);
            return () => clearTimeout(t);
        }
    }, [open]);

    useEffect(() => {
        if (inline) return;
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
    }, [open, inline]);

    if (!rendered) return null;

    return (
        <div
            // z-[70] clears every overlay this modal can be opened from: the mobile search
            // overlay and the drawers at z-50, the cart sticky footers at z-[51], and the
            // all-meals sticky CTAs at z-[60]. At z-50 it tied with the search overlay, which
            // portals to <body> and so paints later — the modal opened behind it (PRODUCT-669).
            ref={backdropRef}
            className={inline ? "contents" : "fixed inset-0 z-[70] backdrop-blur-[2px] bg-[rgba(30,30,30,0.55)] drawer-backdrop-enter"}
            onClick={inline ? undefined : onClose}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={data?.story.name}
                className={inline ? "flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fafaf8] outline-none" : `
          fixed inset-x-0 bottom-0 lg:inset-0 lg:m-auto
          w-full lg:w-[min(1140px,calc(100vw-96px))] lg:h-[min(677px,94dvh)]
          max-h-[94dvh]
          flex flex-col overflow-hidden
          rounded-t-[28px] lg:rounded-[28px]
          bg-[#fafaf8] outline-none
          drawer-panel-enter
        `}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={inline ? "Back to menu" : t.shared.modals.mealDetail.closeAriaLabel}
                    className={`cursor-pointer absolute top-6 lg:top-4 ${inline ? "left-6 lg:left-4" : "right-6 lg:right-4"} z-10 size-8 rounded-2xl bg-white/85 flex items-center justify-center`}
                    // Inline: the page slides in under the menu's own close button, so the back arrow fades in once it has landed.
                    style={inline ? {animation: "drawer-fade-in 250ms ease 200ms both"} : undefined}
                >
                    <span className="relative size-4 flex items-center justify-center">
                        {inline ? <ChevronLeftIcon size={10}/> : <CloseFilledIcon size={10}/>}
                    </span>
                </button>

                {/* Sizes itself from content (flex-basis auto) rather than flex-1 (flex-basis 0).
                    Under the panel's lg:h-fit, Safari gives a flex-basis-0 child no intrinsic
                    height, collapsing the panel to 0 and leaving only the backdrop on screen. */}
                {opts?.explore?.mode === "thumbs" && <ExploreThumbs explore={opts.explore}/>}
                {opts?.explore?.mode === "next" && <ExploreNext explore={opts.explore}/>}

                <div ref={scrollRef} {...handlers} className="min-h-0 overflow-y-auto flex flex-col touch-pan-y bg-white lg:flex-1 lg:flex-row lg:overflow-hidden">
                    <div
                        className={`relative w-full shrink-0 overflow-hidden rounded-b-[28px] bg-light-grey ${opts?.imageRatio ? "aspect-(--ratio)" : "h-55"} lg:aspect-auto lg:h-auto lg:min-w-0 lg:flex-1 lg:rounded-none`}
                        style={opts?.imageRatio ? ({ "--ratio": opts.imageRatio } as CSSProperties) : undefined}
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
                                priority
                                className="object-cover"
                                sizes="(max-width: 1023px) 100vw, 677px"
                                onError={() => setImgError(true)}
                            />
                        ) : loading || !data ? (
                            <div className="absolute inset-0 animate-pulse bg-gray-200"/>
                        ) : (
                            <ImageFallback/>
                        )}

                        {opts?.explore?.mode === "swipe" && <SwipeOverlay explore={opts.explore}/>}
                    </div>

                    <div className="bg-white flex flex-col p-6 lg:w-[463px] lg:shrink-0 lg:overflow-y-auto lg:px-10 lg:pt-14 lg:pb-10">
                        {loading ? (
                            <MealDetailModalSkeleton/>
                        ) : data ? (
                            <MealDetailModalContent
                                data={data}
                                opts={opts}
                            />
                        ) : (
                            <p className="text-sm text-light-text text-center mt-10">{t.shared.modals.mealDetail.error}</p>
                        )}
                    </div>
                    {opts?.explore && opts.explore.mode !== "swipe" && <div className="h-20 shrink-0 bg-white"/>}
                </div>
            </div>
            {!inline && opts?.explore?.mode === "swipe" && <ExploreSideCards explore={opts.explore}/>}
        </div>
    );
}
