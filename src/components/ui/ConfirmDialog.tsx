import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center pt-2">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ring-4 ${
            isDestructive
              ? 'bg-rose-50 text-rose-600 ring-rose-50/50 border border-rose-200'
              : 'bg-neutral-100 text-[#111111] ring-neutral-100/50 border border-neutral-200'
          }`}
        >
          <AlertTriangle className="w-7 h-7 stroke-[1.75]" />
        </div>

        <p className="text-sm text-[#4B5563] mb-4 leading-relaxed px-2 font-medium">{message}</p>

        <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#D1D5DB] bg-white text-xs font-semibold text-[#374151] hover:text-[#111111] hover:bg-neutral-100 transition-colors shadow-2xs"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-all shadow-xs hover:shadow active:scale-[0.99] ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 ring-1 ring-rose-700'
                : 'bg-[#111111] hover:bg-black ring-1 ring-black'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
