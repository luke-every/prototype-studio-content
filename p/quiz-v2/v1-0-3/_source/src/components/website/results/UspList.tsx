// TODO(lift): sample data — replace with the USP content from the CMS
const POINTS: { icon: string; label: string }[] = [
  { icon: "🧊", label: "Delivered frozen to your door" },
  { icon: "⏱️", label: "Ready in under 10 minutes" },
  { icon: "🔄", label: "Skip or cancel anytime" },
];

/** The service's promises as a short stack under the hero's title, so the page says what it is before it shows the box */
export function UspList() {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {/* TODO(lift): replace with translation keys */}
      {POINTS.map((point) => (
        <li key={point.label} className="flex items-center gap-3">
          <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-base leading-none">
            {point.icon}
          </span>
          <span className="text-base leading-[22px] tracking-[-0.32px] text-dark">{point.label}</span>
        </li>
      ))}
    </ul>
  );
}
