type MacroItem = {
  label: string;
  value: string | null | undefined;
};

type Props = {
  items: MacroItem[];
  variant?: "compact" | "large";
};

export function MacroNutrients({ items, variant = "compact" }: Props) {
  const filtered = items.filter((m) => m.value != null && m.value !== "");
  if (filtered.length === 0) return null;

  if (variant === "large") {
    return (
      <div className="flex gap-12">
        {filtered.map((item) => (
          <div key={item.label} className="flex flex-col gap-2 w-[59px]">
            <span className="font-sans font-medium text-[12px] text-light-text tracking-[1.2px] uppercase leading-[18px]">
              {item.label}
            </span>
            <span className="font-sans text-[20px] text-near-black leading-[30px]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-x-12">
      {filtered.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-0.5">
          <span className="text-xs font-bold text-light-text uppercase tracking-wide">{item.label}</span>
          <span className="text-sm font-medium text-dark">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
