type Props = {
  ref?: React.Ref<HTMLParagraphElement>;
  text: string;
  emoji?: string;
  /** Top and bottom padding */
  paddingClassName?: string;
  /** Replaces the tint of the hero's colour */
  backgroundClassName?: string;
};

/** The dark band at the top: the hero's colour (--bundle) with 80% black over it. */
export function PromoBar({ ref, text, emoji = "🏷️", paddingClassName = "pt-2.5 pb-0", backgroundClassName = "bg-[color-mix(in_srgb,black_80%,var(--bundle))]" }: Props) {
  return (
    <p
      ref={ref}
      className={`m-0 ${backgroundClassName} px-6 ${paddingClassName} text-center text-xs leading-4 text-white`}
    >
      {emoji} {text}
    </p>
  );
}
