import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'contain';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.overscrollBehavior = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden overscroll-none touch-none">
      {/* Backdrop suave */}
      <div
        className="fixed inset-0 bg-[#1F1D1B]/40 backdrop-blur-xs transition-opacity animate-in fade-in touch-none"
        onClick={onClose}
      />

      {/* Sheet no Mobile (ancorado na base, fixo e rígido) / Modal no Desktop (centralizado) */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-t-3xl sm:rounded-2xl border border-[#EAE4DE] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[90vh] transform transition-all animate-in slide-in-from-bottom-6 sm:zoom-in-95 pb-[env(safe-area-inset-bottom)] sm:pb-0 overscroll-contain`}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Header Limpo, Fixo e Estável (sem alça de arraste) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-white border-b border-[#EAE4DE] select-none touch-none shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#1F1D1B] tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-[#736B65] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 rounded-xl text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors focus:outline-none active:scale-95 cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content com rolagem interna suave e isolada */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain flex-1 bg-white touch-pan-y">{children}</div>
      </div>
    </div>
  );
};
