"use client";
import { Modal } from "./Modal";
import {Button} from "@/components/shared/Button";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  content?: React.ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  confirming?: boolean;
  hideCancel?: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  content,
  confirmLabel,
  cancelLabel,
  confirming = false,
  hideCancel = false,
  onClose,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal open={open} title={title} onClose={onClose ?? onCancel} closeLabel={cancelLabel}>
      <div className="space-y-3 flex flex-col items-center">
        {content && <div className="text-sm text-dark/70 text-center">{content}</div>}
        <Button
            onClick={onConfirm}
            disabled={confirming}
            aria-label={confirmLabel}
            className="text-sm"
            variant="dark"
        >
          {confirmLabel}
        </Button>
        {!hideCancel && (
          <Button
            onClick={onCancel}
            disabled={confirming}
            aria-label={cancelLabel}
            className="rounded-full border-dark/10 border text-sm"
          >
            {cancelLabel}
          </Button>
        )}
      </div>
    </Modal>
  );
}
