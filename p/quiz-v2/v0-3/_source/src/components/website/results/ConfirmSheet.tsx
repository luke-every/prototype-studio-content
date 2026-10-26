"use client";

import { Drawer } from "@/components/shared/Drawer";
import { PRESS } from "@/lib/press-classes";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ACTION = `flex h-12 flex-1 cursor-pointer items-center justify-center rounded-[30px] text-xs leading-4 font-medium tracking-[1.8px] uppercase ${PRESS} active:scale-[.975]`;

/** Asks before something is undone, from the bottom of the screen so both answers sit under the thumb */
export function ConfirmSheet({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: Props) {
  return (
    <Drawer open={open} title={title} onClose={onCancel}>
      <div className="px-6 pt-7 pb-5">
        <h2 className="m-0 font-book text-2xl leading-[26px] tracking-[-0.48px] text-dark">{title}</h2>
        <p className="mt-2 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-light-text">{message}</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} aria-label={cancelLabel} className={`${ACTION} border border-light-grey-3 bg-white text-dark`}>
            {cancelLabel}
          </button>
          {/* TODO(lift): no destructive colour in every-website; chilli-red is the spice badge's red (unconfirmed) */}
          <button type="button" onClick={onConfirm} aria-label={confirmLabel} className={`${ACTION} bg-chilli-red text-white`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Drawer>
  );
}
