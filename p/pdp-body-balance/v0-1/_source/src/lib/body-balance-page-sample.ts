import type { BundleSwitchItem } from "@/components/website/bundle-v3/types";
import type { ExpertReview } from "@/components/website/homepage/GlobalReviewsCarousel";
import { COPY } from "@/lib/copy";

// TODO(lift): sample data — copied from the live Perfect Portions Plan V2 story (Storyblok, products/perfect-portions-plan-v2), section by section.
// Production maps these CMS blocks onto the same components.
const IMG = "https://a.storyblok.com/f/291086118523370";

// TODO(lift): sample data — replace with the bundle copy from the CMS
export const BODY_BALANCE = {
  name: COPY.productPage.hero.name,
  headline: COPY.productPage.hero.headline,
  mealsKicker: COPY.productPage.hero.mealsKicker,
  mealsHeadline: { lead: COPY.productPage.hero.mealsHeadline.lead, italic: COPY.productPage.hero.mealsHeadline.italic },
  subheadline:
    COPY.productPage.hero.subheadline,
  // TODO(lift): sample data — replace with the live reviews.io rating
  rating: { label: COPY.productPage.hero.rating.label, average: 4.5 },
  backgroundColor: "#F2E5F4",
  bullets: [COPY.productPage.hero.bullets[0], COPY.productPage.hero.bullets[1], COPY.productPage.hero.bullets[2]],
  heroImage: COPY.images.bodyBalance.heroImage,
  heroImageMobile: COPY.images.bodyBalance.heroImageMobile,
  // TODO(lift): fake price — the CMS has {{ppm_from_PPP}}, filled from Shopify
  ctaFootnote: COPY.productPage.hero.ctaFootnote,
  avgProtein: "19",
  avgFibre: "11",
  avgKcal: "450",
  // The CMS leaves the Protein colour blank; it falls back to the Protein page's background.
  switchItems: [
    { id: "a", label: COPY.productPage.bundleSwitcher.items[0].label, color: "#FFC273" },
    { id: "b", label: COPY.productPage.bundleSwitcher.items[1].label, color: "#D7EBC2" },
    { id: "c", label: COPY.productPage.bundleSwitcher.items[2].label, color: "#FFE0C2" },
  ] satisfies BundleSwitchItem[],
};

export const USP_GRID = {
  headline: COPY.productPage.uspGrid.headline,
  items: [
    { icon: COPY.images.uspGrid.items[0].icon, label: COPY.productPage.uspGrid.items[0].label },
    { icon: COPY.images.uspGrid.items[1].icon, label: COPY.productPage.uspGrid.items[1].label },
    { icon: COPY.images.uspGrid.items[2].icon, label: COPY.productPage.uspGrid.items[2].label },
    { icon: COPY.images.uspGrid.items[3].icon, label: COPY.productPage.uspGrid.items[3].label },
  ],
};

export const INGREDIENTS = {
  eyebrow: COPY.productPage.ingredients.eyebrow,
  headline: COPY.productPage.ingredients.headline,
  backgroundColor: "#EFE9F0",
  items: [
    { icon: COPY.images.ingredients.items[0].icon, title: COPY.productPage.ingredients.items[0].title, body: COPY.productPage.ingredients.items[0].body },
    { icon: COPY.images.ingredients.items[1].icon, title: COPY.productPage.ingredients.items[1].title, body: COPY.productPage.ingredients.items[1].body },
    { icon: COPY.images.ingredients.items[2].icon, title: COPY.productPage.ingredients.items[2].title, body: COPY.productPage.ingredients.items[2].body },
  ],
};

// The story's reviews carousel (customer quotes, no credentials in the CMS).
export const EXPERTS: { title: string; experts: ExpertReview[] } = {
  title: COPY.productPage.experts.title,
  experts: [
    {
      image: COPY.images.experts.experts[0].image,
      name: COPY.productPage.experts.experts[0].name,
      credentials: COPY.productPage.experts.experts[0].credentials,
      quote:
        COPY.productPage.experts.experts[0].quote,
    },
    {
      image: COPY.images.experts.experts[1].image,
      name: COPY.productPage.experts.experts[1].name,
      credentials: COPY.productPage.experts.experts[1].credentials,
      quote:
        COPY.productPage.experts.experts[1].quote,
    },
    {
      image: COPY.images.experts.experts[2].image,
      name: COPY.productPage.experts.experts[2].name,
      credentials: COPY.productPage.experts.experts[2].credentials,
      quote:
        COPY.productPage.experts.experts[2].quote,
    },
    {
      image: COPY.images.experts.experts[3].image,
      name: COPY.productPage.experts.experts[3].name,
      credentials: COPY.productPage.experts.experts[3].credentials,
      quote:
        COPY.productPage.experts.experts[3].quote,
    },
  ],
};

export const IMAGE_TEXT = {
  headline: COPY.productPage.imageText.headline,
  body: COPY.productPage.imageText.body,
  image: COPY.images.imageText.image,
};

export const AFTER_A_FEW_WEEKS = {
  eyebrow: COPY.productPage.afterAFewWeeks.eyebrow,
  headline: COPY.productPage.afterAFewWeeks.headline,
  backgroundColor: "#EFE9F0",
  items: [
    { icon: COPY.images.afterAFewWeeks.items[0].icon, title: COPY.productPage.afterAFewWeeks.items[0].title, body: COPY.productPage.afterAFewWeeks.items[0].body },
    { icon: COPY.images.afterAFewWeeks.items[1].icon, title: COPY.productPage.afterAFewWeeks.items[1].title, body: COPY.productPage.afterAFewWeeks.items[1].body },
    { icon: COPY.images.afterAFewWeeks.items[2].icon, title: COPY.productPage.afterAFewWeeks.items[2].title, body: COPY.productPage.afterAFewWeeks.items[2].body },
  ],
};

export const FEATURED_BY = {
  headline: COPY.productPage.featuredBy.headline,
  logos: [
    { src: COPY.images.featuredBy.logos[0].src, alt: "REWE", width: 48, height: 48 },
    { src: COPY.images.featuredBy.logos[1].src, alt: "Wolt", width: 48, height: 48 },
    { src: COPY.images.featuredBy.logos[2].src, alt: "Picnic", width: 48, height: 48 },
    { src: COPY.images.featuredBy.logos[3].src, alt: "Knuspr", width: 100, height: 45 },
    { src: COPY.images.featuredBy.logos[4].src, alt: "Crisp", width: 100, height: 35 },
  ],
};

export const ROUTINE = {
  eyebrow: COPY.productPage.routine.eyebrow,
  headline: COPY.productPage.routine.headline,
  image: COPY.images.routine.image,
  backgroundColor: "#EFE9F0",
  pillars: [
    { title: COPY.productPage.routine.pillars[0].title, body: COPY.productPage.routine.pillars[0].body },
    { title: COPY.productPage.routine.pillars[1].title, body: COPY.productPage.routine.pillars[1].body },
    { title: COPY.productPage.routine.pillars[2].title, body: COPY.productPage.routine.pillars[2].body },
    { title: COPY.productPage.routine.pillars[3].title, body: COPY.productPage.routine.pillars[3].body },
  ],
};

export const FAQ = {
  eyebrow: COPY.productPage.faq.eyebrow,
  headline: COPY.productPage.faq.headline,
  items: [
    { question: COPY.productPage.faq.items[0].question, answer: COPY.productPage.faq.items[0].answer },
    { question: COPY.productPage.faq.items[1].question, answer: COPY.productPage.faq.items[1].answer },
    { question: COPY.productPage.faq.items[2].question, answer: COPY.productPage.faq.items[2].answer },
    { question: COPY.productPage.faq.items[3].question, answer: COPY.productPage.faq.items[3].answer },
    { question: COPY.productPage.faq.items[4].question, answer: COPY.productPage.faq.items[4].answer },
    { question: COPY.productPage.faq.items[5].question, answer: COPY.productPage.faq.items[5].answer },
    { question: COPY.productPage.faq.items[6].question, answer: COPY.productPage.faq.items[6].answer },
  ],
};

export const SUBSCRIBE = {
  strapline: COPY.productPage.subscribe.strapline,
  title: COPY.productPage.subscribe.title,
  subtitle: COPY.productPage.subscribe.subtitle,
  footnote: COPY.productPage.subscribe.footnote,
  placeholder: COPY.productPage.subscribe.placeholder,
  submitLabel: COPY.productPage.subscribe.submitLabel,
  backgroundColor: "#F2E5F4",
};
