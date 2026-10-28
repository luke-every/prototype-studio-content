import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  className?: string;
};

export function Select({ value, onChange, options, className }: SelectProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl bg-light-grey px-4 py-3 text-base text-dark cursor-pointer focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
        <ChevronDownIcon />
      </div>
    </div>
  );
}
