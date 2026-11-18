import { BUNDLES } from "@/components/website/comparison/bundles";
import type { NavItem } from "@/components/website/nav-types";

// TODO(lift): sample data — replace with the Storyblok header nav
export const NAV_ITEMS: NavItem[] = [
  { label: "Bundles", href: "#", items: BUNDLES.map((b) => ({ label: b.title, href: "#" })) },
  { label: "Build your own box", href: "#" },
  { label: "How it works", href: "#" },
  { label: "About us", href: "#", items: [{ label: "Our story", href: "#" }, { label: "Our team", href: "#" }, { label: "Careers", href: "#" }] },
  { label: "Help & FAQ", href: "#" },
];
