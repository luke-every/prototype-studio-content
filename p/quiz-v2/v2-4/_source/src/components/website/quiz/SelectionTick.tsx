type Props = {
  visible: boolean;
  className?: string;
};

/** The tick that marks a chosen option */
export function SelectionTick({ visible, className }: Props) {
  return (
    <span
      aria-hidden
      className={`flex size-[22px] items-center justify-center rounded-full bg-signal-orange text-[11px] leading-none text-white [transition:opacity_300ms_var(--ease-ui),scale_440ms_var(--ease-spring)] ${
        visible ? "scale-100 opacity-100" : "scale-[.55] opacity-0"
      } ${className ?? ""}`}
    >
      ✓
    </span>
  );
}
