import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
  /** When present the item opens a dropdown of these instead of linking. */
  items?: { label: string; href: string }[];
  /** Mobile menu only: custom content shown in the dropdown instead of `items`. */
  panel?: ReactNode;
  /** Desktop only: wide hover dropdown content shown under the header instead of `items`. */
  megaPanel?: ReactNode;
  /** Mobile menu only: start with the dropdown open. */
  defaultOpen?: boolean;
};
