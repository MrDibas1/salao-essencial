import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { AuthService } from '../../services/auth';
import { Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onSuccess: (message: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentPassword.trim()) {
      setErrorMessage('Digite sua senha atual.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage('A nova senha não pode ser igual à senha atual.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await AuthService.changePassword(userEmail, currentPassword, newPassword);
      if (res.success) {
        handleClose();
        onSuccess(res.message || 'Senha alterada com sucesso!');
      } else {
        setErrorMessage(res.error || 'Erro ao alterar a senha.');
      }
    } catch {
      setErrorMessage('Falha na conexão ao atualizar a senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Alterar Senha de Acesso"
      subtitle="Defina uma nova senha pessoal para entrar no sistema"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* E-mail de referência (desabilitado) */}
        <div>
          <label className="block text-xs font-semibold text-[#736B65] mb-1">
            Conta de Acesso
          </label>
          <input
            type="text"
            value={userEmail}
            disabled
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE4DE] bg-[#FAF8F6] text-xs text-[#736B65] cursor-not-allowed"
          />
        </div>

        {/* Senha Atual */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-[#1F1D1B]">
              Senha Atual
            </label>
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="text-[11px] text-[#C87A14] font-medium hover:underline flex items-center gap-1"
            >
              {showCurrent ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showCurrent ? 'Ocultar' : 'Exibir'}</span>
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE4DE] bg-white text-sm text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] shadow-xs"
              autoComplete="current-password"
            />
          </div>
        </div>

        {/* Nova Senha */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-[#1F1D1B]">
              Nova Senha (mínimo 6 dígitos)
            </label>
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="text-[11px] text-[#C87A14] font-medium hover:underline flex items-center gap-1"
            >
              {showNew ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showNew ? 'Ocultar' : 'Exibir'}</span>
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova senha pessoal"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE4DE] bg-white text-sm text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] shadow-xs"
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* Confirmar Nova Senha */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-[#1F1D1B]">
              Confirmar Nova Senha
            </label>
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-[11px] text-[#C87A14] font-medium hover:underline flex items-center gap-1"
            >
              {showConfirm ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showConfirm ? 'Ocultar' : 'Exibir'}</span>
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite a nova senha novamente"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE4DE] bg-white text-sm text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] shadow-xs"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-[#EAE4DE] text-xs font-semibold text-[#736B65] hover:bg-[#FAF8F6] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="min-h-[40px] px-5 py-2.5 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Salvar Nova Senha</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
