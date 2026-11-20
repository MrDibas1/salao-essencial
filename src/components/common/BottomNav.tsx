import React from 'react';
import { LayoutDashboard, Users, CalendarPlus, Images, Package } from 'lucide-react';
import type { NavigationTab } from './Sidebar';

interface BottomNavProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  totalClientsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  totalClientsCount,
}) => {
  const isTabActive = (tab: NavigationTab) => {
    if (tab === 'clients' && currentTab === 'client-detail') return true;
    return currentTab === tab;
  };

  return (
    <nav
      aria-label="Navegação móvel"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE4DE] px-3 shadow-[0_-2px_10px_rgba(31,29,27,0.04)] h-16 pb-[env(safe-area-inset-bottom)] box-content"
    >
      <div className="flex items-center justify-around max-w-md mx-auto h-full">
        {/* Início */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-[0.98] ${
            isTabActive('dashboard')
              ? 'text-[#C87A14] font-semibold'
              : 'text-[#736B65] hover:text-[#1F1D1B]'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {isTabActive('dashboard') && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C87A14]" />
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Início</span>
        </button>

        {/* Clientes */}
        <button
          onClick={() => onNavigate('clients')}
          className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative active:scale-[0.98] ${
            isTabActive('clients')
              ? 'text-[#C87A14] font-semibold'
              : 'text-[#736B65] hover:text-[#1F1D1B]'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            {totalClientsCount > 0 && (
              <span className="absolute -top-1 -right-2.5 px-1 py-0.2 bg-[#C87A14] text-white text-[9px] font-bold rounded-full min-w-3.5 h-3.5 flex items-center justify-center ring-1 ring-white tabular-nums">
                {totalClientsCount > 99 ? '99+' : totalClientsCount}
              </span>
            )}
            {isTabActive('clients') && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C87A14]" />
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Clientes</span>
        </button>

        {/* Botão Central: + Atendimento */}
        <button
          onClick={() => onNavigate('appointment-form')}
          className="min-h-[44px] flex flex-col items-center justify-center -mt-4 group active:scale-[0.98] transition-transform"
          title="Novo Atendimento"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xs transition-all ${
              isTabActive('appointment-form')
                ? 'bg-[#C87A14] text-white ring-4 ring-[#FDF3E7]'
                : 'bg-[#C87A14] text-white hover:bg-[#A8630A]'
            }`}
          >
            <CalendarPlus className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight font-semibold ${
              isTabActive('appointment-form') ? 'text-[#C87A14]' : 'text-[#736B65]'
            }`}
          >
            Atender
          </span>
        </button>

        {/* Galeria */}
        <button
          onClick={() => onNavigate('gallery')}
          className={`min-h-[44px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all active:scale-[0.98] ${
            isTabActive('gallery')
              ? 'text-[#C87A14] font-semibold'
              : 'text-[#736B65] hover:text-[#1F1D1B]'
          }`}
          title="Galeria de Fotos"
        >
          <div className="relative">
            <Images className="w-5 h-5" />
            {isTabActive('gallery') && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C87A14]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Galeria</span>
        </button>

        {/* Produtos */}
        <button
          onClick={() => onNavigate('products')}
          className={`min-h-[44px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all active:scale-[0.98] ${
            isTabActive('products')
              ? 'text-[#C87A14] font-semibold'
              : 'text-[#736B65] hover:text-[#1F1D1B]'
          }`}
          title="Produtos"
        >
          <div className="relative">
            <Package className="w-5 h-5" />
            {isTabActive('products') && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C87A14]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Produtos</span>
        </button>
      </div>
    </nav>
  );
};
