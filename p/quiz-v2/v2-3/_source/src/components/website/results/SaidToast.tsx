import { UndoIcon } from "@/components/icons";
import { PRESS } from "@/lib/press-classes";

type Props = {
  action: string;
  meal: string;
  onUndo: () => void;
};

/** A change to the box, said on one line: what happened, the meal it happened to, and an undo */
export function SaidToast({ action, meal, onUndo }: Props) {
  return (
    <div className="flex items-center rounded-[48px] border border-black/8 bg-white/80 shadow-[0_4px_16px] shadow-black/8 backdrop-blur-[8px]">
      <p className="m-0 flex min-w-0 flex-1 items-center gap-2 py-4 pl-6 text-sm tracking-[-0.28px] whitespace-nowrap text-dark">
        <span className="leading-[15px] font-medium">{action}</span>
        <span className="truncate leading-[19px] opacity-60">{meal}</span>
      </p>
      <button
        type="button"
        onClick={onUndo}
        aria-label="Undo"
        className={`flex h-full w-11 shrink-0 cursor-pointer items-center justify-start p-0 pl-px text-signal-orange ${PRESS} active:scale-90`}
      >
        <UndoIcon size={19} />
      </button>
    </div>
  );
}
