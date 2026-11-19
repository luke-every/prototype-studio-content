import type { BundleReview } from "@/components/website/bundle-v3/types";
import type { ExpertReview } from "@/components/website/homepage/GlobalReviewsCarousel";
import { COPY } from "@/lib/copy";

// TODO(lift): sample data — copied from the live Perfect Portions Plan V2 story (Storyblok, products/perfect-portions-plan-v2); replace with the CMS landing page
const IMG = "https://a.storyblok.com/f/291086118523370";
// Logos, pillar icons and the ingredients still are shared across bundles, so they stay local files
const LOCAL = "/img/lp";

export const LP_COLOR = "#F2E5F4";
export const LP_NEWSLETTER_COLOR = "#F2E5F4";
// TODO(lift): sample data — replace with the live reviews.io rating
export const LP_RATING = { label: COPY.landingPage.lpRating.label, average: 4.5 };

export const HERO = {
  image: COPY.images.lp.hero.image,
  desktopImage: COPY.images.lp.hero.desktopImage,
  headlineLine1: COPY.landingPage.hero.headlineLine1,
  headlineTagline: COPY.landingPage.hero.headlineTagline,
  subheadline: COPY.landingPage.hero.subheadline,
  bullets: [COPY.landingPage.hero.bullets[0], COPY.landingPage.hero.bullets[1], COPY.landingPage.hero.bullets[2]],
  ctaLabel: COPY.landingPage.hero.ctaLabel,
  ctaHref: "#bundle",
};

export const FOUNDATION = {
  headline: COPY.landingPage.foundation.headline,
  body: COPY.landingPage.foundation.body,
  image: COPY.images.lp.foundation.image,
};

export const BUNDLE = {
  kicker: COPY.landingPage.bundle.kicker,
  name: COPY.landingPage.bundle.name,
  headline: { lead: COPY.landingPage.bundle.headline.lead, italic: COPY.landingPage.bundle.headline.italic },
  subheadline: COPY.landingPage.bundle.subheadline,
  avgProtein: "19",
  avgFibre: "11",
  avgKcal: "450",
  boxHeadline: { lead: COPY.landingPage.bundle.boxHeadline.lead, italic: COPY.landingPage.bundle.boxHeadline.italic },
  // Starter is 0, Complete 1 (the kit's two make-ups of the 20-meal box)
  defaultVariantId: 1,
};

export const STICKY = { label: COPY.landingPage.sticky.label, footnote: COPY.landingPage.sticky.footnote };

// TODO(lift): sample data — replace with the live reviews.io reviews
export const REVIEWS: { headline: string; reviews: BundleReview[] } = {
  headline: COPY.landingPage.reviews.headline,
  reviews: [
    { name: COPY.landingPage.reviews.reviews[0].name, title: COPY.landingPage.reviews.reviews[0].title, rating: 5, comments: COPY.landingPage.reviews.reviews[0].comments },
    { name: COPY.landingPage.reviews.reviews[1].name, title: COPY.landingPage.reviews.reviews[1].title, rating: 5, comments: COPY.landingPage.reviews.reviews[1].comments },
    { name: COPY.landingPage.reviews.reviews[2].name, title: COPY.landingPage.reviews.reviews[2].title, rating: 5, comments: COPY.landingPage.reviews.reviews[2].comments },
    { name: COPY.landingPage.reviews.reviews[3].name, title: COPY.landingPage.reviews.reviews[3].title, rating: 5, comments: COPY.landingPage.reviews.reviews[3].comments },
  ],
};

export const ROUTINE = {
  slides: [COPY.images.lp.routine.slides[0]],
  eyebrow: COPY.landingPage.routine.eyebrow,
  headline: { lead: COPY.landingPage.routine.headline.lead, italic: COPY.landingPage.routine.headline.italic },
  pillars: [
    { icon: COPY.images.lp.routine.pillars[0].icon, title: COPY.landingPage.routine.pillars[0].title, body: COPY.landingPage.routine.pillars[0].body },
    { icon: COPY.images.lp.routine.pillars[1].icon, title: COPY.landingPage.routine.pillars[1].title, body: COPY.landingPage.routine.pillars[1].body },
    { icon: COPY.images.lp.routine.pillars[2].icon, title: COPY.landingPage.routine.pillars[2].title, body: COPY.landingPage.routine.pillars[2].body },
    { icon: COPY.images.lp.routine.pillars[3].icon, title: COPY.landingPage.routine.pillars[3].title, body: COPY.landingPage.routine.pillars[3].body },
  ],
};

export const INGREDIENTS = {
  eyebrow: COPY.landingPage.ingredients.eyebrow,
  headline: { lead: COPY.landingPage.ingredients.headline.lead, italic: COPY.landingPage.ingredients.headline.italic },
  body: COPY.landingPage.ingredients.body,
  note: COPY.landingPage.ingredients.note,
  // TODO(lift): the design shows a video (ingredients_hp_video.mp4); this is its still frame
  image: COPY.images.lp.ingredients.image,
  // The story's reviews carousel: customer quotes, no credentials in the CMS
  experts: {
    title: COPY.landingPage.ingredients.experts.title,
    experts: [
      { image: COPY.images.lp.ingredients.experts.experts[0].image, name: COPY.landingPage.ingredients.experts.experts[0].name, credentials: COPY.landingPage.ingredients.experts.experts[0].credentials, quote: COPY.landingPage.ingredients.experts.experts[0].quote },
      { image: COPY.images.lp.ingredients.experts.experts[1].image, name: COPY.landingPage.ingredients.experts.experts[1].name, credentials: COPY.landingPage.ingredients.experts.experts[1].credentials, quote: COPY.landingPage.ingredients.experts.experts[1].quote },
      { image: COPY.images.lp.ingredients.experts.experts[2].image, name: COPY.landingPage.ingredients.experts.experts[2].name, credentials: COPY.landingPage.ingredients.experts.experts[2].credentials, quote: COPY.landingPage.ingredients.experts.experts[2].quote },
      { image: COPY.images.lp.ingredients.experts.experts[3].image, name: COPY.landingPage.ingredients.experts.experts[3].name, credentials: COPY.landingPage.ingredients.experts.experts[3].credentials, quote: COPY.landingPage.ingredients.experts.experts[3].quote },
    ] satisfies ExpertReview[],
  },
};

export const RETAILERS = {
  headline: COPY.landingPage.retailers.headline,
  logos: [
    { src: COPY.images.lp.retailers.logos[0].src, alt: "REWE", width: 48, height: 48 },
    { src: COPY.images.lp.retailers.logos[1].src, alt: "Wolt", width: 48, height: 48 },
    { src: COPY.images.lp.retailers.logos[2].src, alt: "Picnic", width: 48, height: 48 },
    { src: COPY.images.lp.retailers.logos[3].src, alt: "Knuspr", width: 100, height: 45 },
    { src: COPY.images.lp.retailers.logos[4].src, alt: "Crisp", width: 100, height: 35 },
  ],
};

export const FAQ = {
  eyebrow: COPY.landingPage.faq.eyebrow,
  headline: { lead: COPY.landingPage.faq.headline.lead, italic: COPY.landingPage.faq.headline.italic },
  items: [
    { question: COPY.landingPage.faq.items[0].question, answer: COPY.landingPage.faq.items[0].answer },
    { question: COPY.landingPage.faq.items[1].question, answer: COPY.landingPage.faq.items[1].answer },
    { question: COPY.landingPage.faq.items[2].question, answer: COPY.landingPage.faq.items[2].answer },
    { question: COPY.landingPage.faq.items[3].question, answer: COPY.landingPage.faq.items[3].answer },
    { question: COPY.landingPage.faq.items[4].question, answer: COPY.landingPage.faq.items[4].answer },
    { question: COPY.landingPage.faq.items[5].question, answer: COPY.landingPage.faq.items[5].answer },
    { question: COPY.landingPage.faq.items[6].question, answer: COPY.landingPage.faq.items[6].answer },
  ],
};

export const NEWSLETTER = {
  strapline: COPY.landingPage.newsletter.strapline,
  headline: { lead: COPY.landingPage.newsletter.headline.lead, italic: COPY.landingPage.newsletter.headline.italic },
  body: COPY.landingPage.newsletter.body,
  placeholder: COPY.landingPage.newsletter.placeholder,
  submitLabel: COPY.landingPage.newsletter.submitLabel,
  footnote: COPY.landingPage.newsletter.footnote,
};
