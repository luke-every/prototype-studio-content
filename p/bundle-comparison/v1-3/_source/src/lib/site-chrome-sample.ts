import type { NavItem } from "@/components/website/nav-types";

// TODO(lift): sample data — header nav and footer, from the live global/layout story (Storyblok)
const IMG = "https://a.storyblok.com/f/291086118523370";

export const NAV_ITEMS: NavItem[] = [
  { label: "Bundles", href: "#", items: ["The Immunity Bundle", "The Postpartum Bundle", "The Perfect Portions Plan"].map((label) => ({ label, href: "#" })) },
  { label: "All meals", href: "#" },
  { label: "How it works", href: "#" },
  { label: "About", href: "#" },
];

export const FOOTER = {
  logoSrc: `${IMG}/102x34/449a0273b7/logo.svg`,
  tagline: "Don't be shy, come say hi!",
  nav: [
    { title: "SHOP", links: [{ label: "Curated Bundles", href: "#" }, { label: "Build your box", href: "#" }, { label: "every Gift Cards", href: "#" }] },
    {
      title: "HELP",
      links: [
        { label: "Helpcenter", href: "#" },
        { label: "Track your Parcel", href: "#" },
        { label: "Report Delivery Issue", href: "#" },
        { label: "Subscription Settings", href: "#" },
        { label: "Subscription Cancellation Form", href: "#" },
      ],
    },
    {
      title: "ABOUT EVERY",
      links: [{ label: "Our Story", href: "#" }, { label: "every Magazine", href: "#" }, { label: "Ingredient Lexicon", href: "#" }, { label: "every for offices", href: "#" }],
    },
    {
      title: "COMMUNITY",
      links: [
        { label: "Facebook Community", href: "#" },
        { label: "Career", href: "#" },
        { label: "Reviews", href: "#" },
        { label: "Newsletter", href: "#" },
        { label: "Store Finder", href: "#" },
        { label: "Ambassador", href: "#" },
      ],
    },
  ],
  social: [
    { label: "Instagram", icon: `${IMG}/24x24/9b2217ae6e/instagram.svg`, href: "https://www.instagram.com/every_foods/" },
    { label: "Facebook", icon: `${IMG}/24x24/6d104ded36/facebook.svg`, href: "https://www.facebook.com/everyfoodsofficial/" },
    { label: "YouTube", icon: `${IMG}/24x24/0a1ffd6640/youtube.svg`, href: "https://www.youtube.com/channel/UCm6hIcCmauHXGBl7tTQApIQ" },
    { label: "LinkedIn", icon: `${IMG}/24x24/26e4c3d3ec/linkedin.svg`, href: "https://www.linkedin.com/company/every-foods/" },
    { label: "Tiktok", icon: `${IMG}/24x24/adabd39ee1/tiktok.svg`, href: "https://www.tiktok.com/@every_foods" },
  ],
  legal: [
    { label: "Data protection", href: "#" },
    { label: "Impressum", href: "#" },
    { label: "Cancellation Policy", href: "#" },
    { label: "Terms & conditions", href: "#" },
    { label: "Giveaway T&C", href: "#" },
  ],
  payments: [
    { label: "Mastercard", icon: `${IMG}/38x27/d783d6b130/mastercard.svg` },
    { label: "Maestro", icon: `${IMG}/38x27/a62fb9d100/maestro-update-logo.svg` },
    { label: "Visa", icon: `${IMG}/38x27/48d33038eb/visa-update-logo.svg` },
    { label: "American Express", icon: `${IMG}/38x27/34a6cb4155/americanexpress-update-logo.svg` },
    { label: "PayPal", icon: `${IMG}/38x27/0e900ec6d7/paypal-update-logo.svg` },
  ],
};
