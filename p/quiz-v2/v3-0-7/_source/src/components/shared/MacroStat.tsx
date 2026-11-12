type Props = {
  value: number | string;
  label: string;
  unit?: string;
};

export function MacroStat({ value, label, unit = "g" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-3 rounded-[14px] bg-dark/6 min-w-20 h-18.25 lg:w-30 lg:h-20.75">
      <div className="flex items-baseline gap-0.5">
        <span className="font-book text-2xl leading-6.5 tracking-[-0.48px] lg:text-[34px] lg:leading-8.5 lg:tracking-[-0.68px] text-dark">{value}</span>
        {unit && <span className="font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark/65">{unit}</span>}
      </div>
      <span className="font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark/60 uppercase">{label}</span>
    </div>
  );
}
