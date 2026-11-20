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
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5 border ${
            isDestructive
              ? 'bg-[#FCECEC] text-[#C94A4A] border-[#C94A4A]/20'
              : 'bg-[#FDF3E7] text-[#8C530A] border-[#EAE4DE]'
          }`}
        >
          <AlertTriangle className="w-6 h-6 stroke-[1.75]" />
        </div>

        <p className="text-sm text-[#736B65] mb-2 leading-relaxed px-2 font-normal">{message}</p>

        <div className="pt-4 mt-4 border-t border-[#EAE4DE] flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl border border-[#EAE4DE] bg-white text-xs sm:text-sm font-medium text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors active:scale-[0.98]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-xs active:scale-[0.98] ${
              isDestructive
                ? 'bg-[#C94A4A] hover:bg-[#A83838]'
                : 'bg-[#C87A14] hover:bg-[#A8630A]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
