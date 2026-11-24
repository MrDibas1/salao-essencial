import React from 'react';
import { Download, Settings, Cloud } from 'lucide-react';
import type { NavigationTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavigationTab;
  onOpenMobileSidebar: () => void;
  onOpenNewClientModal: () => void;
  onOpenInstallModal?: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  hasDemoData?: boolean;
  isCloudSynced?: boolean | null;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenInstallModal,
  onNavigate,
  isCloudSynced,
  isSyncing,
}) => {
  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Início', desc: 'Atalhos rápidos e clientes ativas' };
      case 'clients':
        return { title: 'Clientes', desc: 'Fichas técnicas e histórico de coloração' };
      case 'client-detail':
        return { title: 'Perfil da Cliente', desc: 'Histórico de fórmulas e atendimentos' };
      case 'appointment-form':
        return { title: 'Novo Atendimento', desc: 'Registro de procedimento e fórmulas técnicas' };
      case 'gallery':
        return { title: 'Galeria de Fotos', desc: 'Transformações de antes e depois dos atendimentos' };
      case 'history':
        return { title: 'Histórico Geral', desc: 'Todos os procedimentos realizados' };
      case 'products':
        return { title: 'Produtos & Tintas', desc: 'Catálogo de tintas e insumos' };
      case 'settings':
        return { title: 'Configurações', desc: 'Preferências e backup do sistema' };
      default:
        return { title: 'Salão Essencial', desc: 'Sistema de Gestão' };
    }
  };

  const { title, desc } = getPageTitle();

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#EAE4DE] px-4 sm:px-8 py-3 sticky top-0 z-30 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between max-w-7xl mx-auto min-h-[44px]">
        {/* Título Limpo à Esquerda */}
        <div>
          <h1 className="text-[20px] sm:text-[24px] font-semibold text-[#1F1D1B] tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs text-[#736B65] hidden sm:block mt-0.5">{desc}</p>
        </div>

        {/* Ação Principal à Direita */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status do Banco Cloudflare D1 */}
          {isCloudSynced !== false && (
            <span
              className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                isSyncing
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-[#E8F4EE] text-[#2E7D5B] border border-[#2E7D5B]/20'
              }`}
              title={
                isSyncing
                  ? 'Sincronizando com a nuvem Cloudflare D1...'
                  : 'Cloudflare D1: Sincronização em nuvem ativa'
              }
            >
              <Cloud
                className={`w-3.5 h-3.5 ${
                  isSyncing ? 'text-amber-600 animate-spin' : 'text-[#2E7D5B]'
                }`}
              />
              <span className="hidden sm:inline">
                {isSyncing ? 'Sincronizando...' : 'Nuvem Ativa'}
              </span>
            </span>
          )}

          {/* Data compacta no desktop */}
          <span className="hidden lg:inline-block text-xs font-medium text-[#736B65] capitalize pr-2 tabular-nums">
            {formattedDate}
          </span>

          {/* Install PWA Button (Desktop / Tablet) */}
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] py-1.5 px-3 rounded-xl border border-[#EAE4DE] bg-[#FAF8F6] hover:bg-[#F5EFEB] text-[#1F1D1B] text-xs font-medium transition-all active:scale-[0.98]"
              title="Instalar aplicativo na tela de início"
            >
              <Download className="w-3.5 h-3.5 text-[#736B65]" />
              <span>Instalar</span>
            </button>
          )}

          {/* Botão de Configurações (acessível no mobile e no desktop) */}
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className={`inline-flex min-h-[38px] min-w-[38px] items-center justify-center p-2 rounded-xl border border-[#EAE4DE] transition-all active:scale-[0.98] ${
                currentTab === 'settings'
                  ? 'bg-[#FDF3E7] text-[#8C530A] border-[#C87A14]'
                  : 'bg-white hover:bg-[#FAF8F6] text-[#736B65]'
              }`}
              title="Configurações do Sistema"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Logotipo Oficial do Salão (substituindo o botão) */}
          <button
            type="button"
            onClick={() => onNavigate?.('dashboard')}
            className="flex items-center justify-center focus:outline-none transition-transform active:scale-95 py-1 px-1"
            title="Salão Essencial"
          >
            <img
              src="/assets/logo-essencial.png"
              alt="Salão Essencial"
              className="h-8 sm:h-9 max-w-[130px] sm:max-w-[160px] object-contain"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
