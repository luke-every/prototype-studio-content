import React from "react";
import Link from "next/link";

export type ButtonVariant = "dark" | "white" | "grey" | "nearBlack" | "primary";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: ButtonVariant;
  href?: string;
  target?: string;
  className?: string;
  /** Overrides the default px-4 py-2 padding. */
  sizeClassName?: string;
};

const BASE = "inline-flex items-center gap-2 rounded-full cursor-pointer";
const DEFAULT_SIZE = "px-4 py-2";

/** Shared grey treatment — reused by SbButton's "grey" color so the two button components can't drift apart. */
export const GREY_BUTTON_CLASS = "bg-light-grey text-dark";

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  dark: "bg-dark text-white",
  white: "bg-white text-dark",
  grey: GREY_BUTTON_CLASS,
  nearBlack: "bg-near-black text-white",
  primary: "bg-signal-orange"
};

export function Button({
  children,
  icon,
  iconPosition = "right",
  variant,
  href,
  target,
  className,
  sizeClassName = DEFAULT_SIZE,
  ...rest
}: ButtonProps) {
  const classes = [BASE, sizeClassName, variant ? VARIANTS[variant] : "", "disabled:opacity-50", className].filter(Boolean).join(" ");

  const content = (
    <>
      {iconPosition === "left" && icon}
      {children}
      {iconPosition === "right" && icon}
    </>
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} className={classes} aria-label={rest["aria-label"]}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
