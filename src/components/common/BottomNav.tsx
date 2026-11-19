import React from 'react';
import { LayoutDashboard, Users, CalendarPlus, Package } from 'lucide-react';
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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] px-3 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Início */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isTabActive('dashboard')
              ? 'text-[#111111] font-bold'
              : 'text-[#777777] hover:text-[#111111]'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {isTabActive('dashboard') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#111111]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Início</span>
        </button>

        {/* Clientes */}
        <button
          onClick={() => onNavigate('clients')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            isTabActive('clients')
              ? 'text-[#111111] font-bold'
              : 'text-[#777777] hover:text-[#111111]'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            {totalClientsCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-amber-500 text-white text-[9px] font-bold rounded-full min-w-3.5 h-3.5 flex items-center justify-center ring-1 ring-white">
                {totalClientsCount > 99 ? '99+' : totalClientsCount}
              </span>
            )}
            {isTabActive('clients') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#111111]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Clientes</span>
        </button>

        {/* Botão Central: + Atendimento */}
        <button
          onClick={() => onNavigate('appointment-form')}
          className="flex flex-col items-center justify-center -mt-3 group"
          title="Novo Atendimento"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
              isTabActive('appointment-form')
                ? 'bg-amber-500 text-neutral-950 ring-4 ring-amber-500/20'
                : 'bg-[#111111] text-white hover:bg-neutral-800'
            }`}
          >
            <CalendarPlus className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight font-semibold ${
              isTabActive('appointment-form') ? 'text-amber-600' : 'text-[#292929]'
            }`}
          >
            Atender
          </span>
        </button>

        {/* Produtos */}
        <button
          onClick={() => onNavigate('products')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isTabActive('products')
              ? 'text-[#111111] font-bold'
              : 'text-[#777777] hover:text-[#111111]'
          }`}
        >
          <div className="relative">
            <Package className="w-5 h-5" />
            {isTabActive('products') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#111111]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Produtos</span>
        </button>
      </div>
    </nav>
  );
};
