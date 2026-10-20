export type NavItem = {
  label: string;
  href: string;
  /** When present the item opens a dropdown of these instead of linking. */
  items?: { label: string; href: string }[];
};
