type Props = {
  label: string;
  variant?: "filled" | "outlined" | "muted";
};

export function Tag({ label, variant = "filled" }: Props) {
  const styles =
    variant === "outlined"
      ? "border border-light-grey text-light-text font-sans text-[14px] leading-[20px] px-3 py-1.5 rounded-full"
      : variant === "muted"
      ? "text-xs bg-dark/6 text-dark px-3 py-1 rounded-full border border-light-grey!"
      : "text-xs bg-light-grey text-dark px-3 py-1 rounded-full";

  return <span className={styles}>{label}</span>;
}
