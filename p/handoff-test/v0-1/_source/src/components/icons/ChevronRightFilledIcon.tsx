type Props = {
  size?: number;
  fill?: string;
  className?: string;
};

export function ChevronRightFilledIcon({ size = 10, fill = "#372D27", className }: Props) {
  return (
    <span className={`inline-flex -rotate-90 ${className ?? ""}`} style={{ width: size, height: size * 0.611125 }} aria-hidden>
      <svg width={size} height={size * 0.611125} viewBox="0 0 10.0002 6.11125" fill="none">
        <path d="M5.00005 3.88894L8.88905 0L10.0002 1.11113L5.00005 6.11125L0 1.11113L1.11113 0L5.00005 3.88894Z" fill={fill} />
      </svg>
    </span>
  );
}
