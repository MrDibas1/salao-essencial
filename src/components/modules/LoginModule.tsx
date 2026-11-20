import React, { useState } from 'react';
import type { User } from '../../types';
import { AuthService } from '../../services/auth';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface LoginModuleProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginModule: React.FC<LoginModuleProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('clarice@salaoessencial.com');
  const [password, setPassword] = useState('essencial2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await AuthService.login(email, password, rememberMe);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Credenciais inválidas. Tente novamente.');
      }
    } catch {
      setErrorMessage('Falha na comunicação com o servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofill = () => {
    setEmail('clarice@salaoessencial.com');
    setPassword('essencial2026');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C87A14]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Card Principal */}
        <div className="bg-white rounded-3xl border border-[#EAE4DE] p-6 sm:p-8 shadow-[0_4px_24px_rgba(31,29,27,0.06)]">
          {/* Logo e Cabeçalho */}
          <div className="text-center mb-6">
            <div className="inline-block py-1 px-2 mb-3">
              <img
                src="/assets/logo-essencial.png"
                alt="Salão Essencial"
                className="h-10 sm:h-12 w-auto mx-auto object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF3E7] text-[#8C530A] border border-[#C87A14]/20 mb-2">
              <Shield className="w-3.5 h-3.5 text-[#C87A14]" />
              <span>Acesso Restrito do Salão</span>
            </div>
            <p className="text-xs text-[#736B65]">
              Gestão de clientes, fórmulas de coloração e portfólio
            </p>
          </div>

          {/* Mensagem de Erro se houver */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-in fade-in">
              <span className="font-bold">✕</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo E-mail */}
            <div>
              <label className="block text-xs font-semibold text-[#1F1D1B] mb-1.5">
                E-mail de Acesso
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu-email@salaoessencial.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#EAE4DE] bg-[#FAF8F6] focus:bg-white text-sm text-[#1F1D1B] placeholder-[#736B65] focus:outline-none focus:border-[#C87A14] shadow-xs transition-colors"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#1F1D1B]">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#C87A14] font-medium hover:underline flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Ocultar' : 'Exibir'}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#EAE4DE] bg-[#FAF8F6] focus:bg-white text-sm text-[#1F1D1B] placeholder-[#736B65] focus:outline-none focus:border-[#C87A14] shadow-xs transition-colors"
                />
              </div>
            </div>

            {/* Opção "Manter Conectado" */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mt-0.5 rounded border-[#EAE4DE] text-[#C87A14] focus:ring-[#C87A14] w-4 h-4 accent-[#C87A14]"
                />
                <div>
                  <span className="text-xs font-semibold text-[#1F1D1B] block">
                    Manter conectado neste aparelho
                  </span>
                  <span className="text-[11px] text-[#736B65] block leading-tight">
                    O aplicativo abrirá direto sem pedir senha no dia a dia.
                  </span>
                </div>
              </label>
            </div>

            {/* Botão de Entrar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white font-semibold text-sm shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Atalho de Demonstração / Preenchimento Rápido */}
          <div className="mt-5 pt-4 border-t border-[#EAE4DE]/70 text-center">
            <button
              type="button"
              onClick={handleAutofill}
              className="text-xs text-[#736B65] hover:text-[#C87A14] transition-colors inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[#FAF8F6] border border-[#EAE4DE]"
              title="Preenche o login padrão da Clarice"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C87A14]" />
              <span>Acesso Padrão: <strong>Clarice</strong> (Preenchimento Rápido)</span>
            </button>
          </div>
        </div>

        {/* Rodapé de Segurança */}
        <div className="text-center mt-4 text-[11px] text-[#736B65] flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" />
          <span>Banco de Dados em Nuvem Cloudflare D1 Ativo</span>
        </div>
      </div>
    </div>
  );
};
