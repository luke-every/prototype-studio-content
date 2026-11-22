import type { ExpertReview } from "@/components/website/homepage/GlobalReviewsCarousel";
import { COPY } from "@/lib/copy";

// TODO(lift): sample data — copied from the live protein-bundle-v2 story (Storyblok), section by section.
// Production maps these CMS blocks onto the same components.

export const USP_GRID = {
  headline: COPY.uspGrid.headline,
  items: [
    { icon: COPY.images.uspGrid.items[0].icon, label: COPY.uspGrid.items[0].label },
    { icon: COPY.images.uspGrid.items[1].icon, label: COPY.uspGrid.items[1].label },
    { icon: COPY.images.uspGrid.items[2].icon, label: COPY.uspGrid.items[2].label },
    { icon: COPY.images.uspGrid.items[3].icon, label: COPY.uspGrid.items[3].label },
  ],
};

export const INGREDIENTS = {
  eyebrow: COPY.ingredients.eyebrow,
  headline: COPY.ingredients.headline,
  backgroundColor: "#D7EBC2",
  items: [
    { icon: COPY.images.ingredients.items[0].icon, title: COPY.ingredients.items[0].title, body: COPY.ingredients.items[0].body },
    { icon: COPY.images.ingredients.items[1].icon, title: COPY.ingredients.items[1].title, body: COPY.ingredients.items[1].body },
    { icon: COPY.images.ingredients.items[2].icon, title: COPY.ingredients.items[2].title, body: COPY.ingredients.items[2].body },
  ],
};

export const EXPERTS: { title: string; experts: ExpertReview[] } = {
  title: COPY.experts.title,
  experts: [
    {
      image: COPY.images.experts.experts[0].image,
      name: COPY.experts.experts[0].name,
      credentials: COPY.experts.experts[0].credentials,
      quote:
        COPY.experts.experts[0].quote,
    },
    {
      image: COPY.images.experts.experts[1].image,
      name: COPY.experts.experts[1].name,
      credentials: COPY.experts.experts[1].credentials,
      quote:
        COPY.experts.experts[1].quote,
    },
    {
      image: COPY.images.experts.experts[2].image,
      name: COPY.experts.experts[2].name,
      credentials: COPY.experts.experts[2].credentials,
      quote:
        COPY.experts.experts[2].quote,
    },
  ],
};

export const IMAGE_TEXT = {
  headline: COPY.imageText.headline,
  body: COPY.imageText.body,
  image: COPY.images.imageText.image,
};

export const AFTER_A_FEW_WEEKS = {
  eyebrow: COPY.afterAFewWeeks.eyebrow,
  headline: COPY.afterAFewWeeks.headline,
  backgroundColor: "#D0E9C0",
  items: [
    { icon: COPY.images.afterAFewWeeks.items[0].icon, title: COPY.afterAFewWeeks.items[0].title, body: COPY.afterAFewWeeks.items[0].body },
    { icon: COPY.images.afterAFewWeeks.items[1].icon, title: COPY.afterAFewWeeks.items[1].title, body: COPY.afterAFewWeeks.items[1].body },
    { icon: COPY.images.afterAFewWeeks.items[2].icon, title: COPY.afterAFewWeeks.items[2].title, body: COPY.afterAFewWeeks.items[2].body },
  ],
};

export const FEATURED_BY = {
  headline: COPY.featuredBy.headline,
  logos: [
    { src: COPY.images.featuredBy.logos[0].src, alt: "REWE", width: 48, height: 48 },
    { src: COPY.images.featuredBy.logos[1].src, alt: "Wolt", width: 48, height: 48 },
    { src: COPY.images.featuredBy.logos[2].src, alt: "Picnic", width: 48, height: 48 },
    { src: COPY.images.featuredBy.logos[3].src, alt: "Knuspr", width: 100, height: 45 },
    { src: COPY.images.featuredBy.logos[4].src, alt: "Crisp", width: 100, height: 35 },
  ],
};

export const ROUTINE = {
  eyebrow: COPY.routine.eyebrow,
  headline: COPY.routine.headline,
  image: COPY.images.routine.image,
  backgroundColor: "#D0E9C0",
  pillars: [
    { title: COPY.routine.pillars[0].title, body: COPY.routine.pillars[0].body },
    { title: COPY.routine.pillars[1].title, body: COPY.routine.pillars[1].body },
    { title: COPY.routine.pillars[2].title, body: COPY.routine.pillars[2].body },
    { title: COPY.routine.pillars[3].title, body: COPY.routine.pillars[3].body },
  ],
};

export const FAQ = {
  eyebrow: COPY.faq.eyebrow,
  headline: COPY.faq.headline,
  items: [
    { question: COPY.faq.items[0].question, answer: COPY.faq.items[0].answer },
    { question: COPY.faq.items[1].question, answer: COPY.faq.items[1].answer },
    { question: COPY.faq.items[2].question, answer: COPY.faq.items[2].answer },
    { question: COPY.faq.items[3].question, answer: COPY.faq.items[3].answer },
    { question: COPY.faq.items[4].question, answer: COPY.faq.items[4].answer },
    { question: COPY.faq.items[5].question, answer: COPY.faq.items[5].answer },
  ],
};

export const SUBSCRIBE = {
  strapline: COPY.subscribe.strapline,
  title: COPY.subscribe.title,
  subtitle: COPY.subscribe.subtitle,
  footnote: COPY.subscribe.footnote,
  placeholder: COPY.subscribe.placeholder,
  submitLabel: COPY.subscribe.submitLabel,
  backgroundColor: "#D7EBC2",
};
