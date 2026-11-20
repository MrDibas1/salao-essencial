import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarPlus,
  History,
  Package,
  Settings,
  Images,
  X,
  ChevronRight,
} from 'lucide-react';
import { Logo } from './Logo';

export type NavigationTab =
  | 'dashboard'
  | 'clients'
  | 'client-detail'
  | 'appointment-form'
  | 'gallery'
  | 'history'
  | 'products'
  | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab, params?: { clientId?: string; appointmentId?: string }) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalClientsCount: number;
  totalAppointmentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  totalClientsCount,
  totalAppointmentsCount,
}) => {
  // 4 Pilares Centrais
  const primaryMenuItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Início',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'clients' as NavigationTab,
      label: 'Clientes',
      icon: Users,
      badge: totalClientsCount > 0 ? totalClientsCount : null,
    },
    {
      id: 'appointment-form' as NavigationTab,
      label: 'Novo Atendimento',
      icon: CalendarPlus,
      highlight: true,
      badge: null,
    },
    {
      id: 'gallery' as NavigationTab,
      label: 'Galeria',
      icon: Images,
      badge: null,
    },
    {
      id: 'products' as NavigationTab,
      label: 'Produtos',
      icon: Package,
      badge: null,
    },
  ];

  // Acessos Secundários
  const secondaryMenuItems = [
    {
      id: 'history' as NavigationTab,
      label: 'Histórico Geral',
      icon: History,
      badge: totalAppointmentsCount > 0 ? totalAppointmentsCount : null,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Configurações',
      icon: Settings,
      badge: null,
    },
  ];

  const handleItemClick = (id: NavigationTab) => {
    onNavigate(id);
    onCloseMobile();
  };

  const isCurrentActive = (id: NavigationTab) => {
    if (id === 'clients' && currentTab === 'client-detail') return true;
    return currentTab === id;
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-[#EAE4DE] shadow-xs flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#EAE4DE]">
          <button
            onClick={() => handleItemClick('dashboard')}
            className="text-left focus:outline-none"
          >
            <Logo size="md" />
          </button>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick action button */}
        <div className="p-4 border-b border-[#EAE4DE]">
          <button
            onClick={() => handleItemClick('appointment-form')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-sm font-semibold transition-all shadow-xs active:scale-[0.98] group"
          >
            <CalendarPlus className="w-4 h-4 text-white/95 group-hover:scale-105 transition-transform" />
            <span>+ Novo Atendimento</span>
          </button>
        </div>

        {/* Primary Navigation list */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-[#736B65] uppercase tracking-wider">
            Navegação Principal
          </div>

          {primaryMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group active:scale-[0.98] ${
                  active
                    ? 'bg-[#FDF3E7] text-[#8C530A] font-semibold'
                    : 'text-[#736B65] hover:bg-[#FAF8F6] hover:text-[#1F1D1B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-[#8C530A]' : 'text-[#736B65] group-hover:text-[#1F1D1B]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge !== null && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold tabular-nums ${
                        active
                          ? 'bg-[#8C530A] text-white'
                          : 'bg-[#FDF3E7] text-[#8C530A]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3.5 h-3.5 text-[#8C530A]" />}
                </div>
              </button>
            );
          })}

          {/* Divisor & Acessos Secundários */}
          <div className="pt-6">
            <div className="px-3 pb-2 text-[10px] font-semibold text-[#736B65] uppercase tracking-wider">
              Outras Opções
            </div>
            {secondaryMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrentActive(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all group active:scale-[0.98] ${
                    active
                      ? 'bg-[#FDF3E7] text-[#8C530A] font-semibold'
                      : 'text-[#736B65] hover:bg-[#FAF8F6] hover:text-[#1F1D1B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-3.5 h-3.5 transition-colors ${
                        active ? 'text-[#8C530A]' : 'text-[#736B65] group-hover:text-[#1F1D1B]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold tabular-nums ${
                        active
                          ? 'bg-[#8C530A] text-white'
                          : 'bg-[#FDF3E7] text-[#8C530A]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer info & salon identity */}
        <div className="p-4 border-t border-[#EAE4DE] bg-[#FAF8F6]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FDF3E7] text-[#8C530A] border border-[#EAE4DE] flex items-center justify-center font-serif text-sm shadow-xs font-bold">
              E
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#1F1D1B] truncate">Salão Essencial</p>
                <span className="text-[10px] text-[#8C530A] font-semibold bg-[#FDF3E7] px-1.5 py-0.2 rounded border border-[#EAE4DE] tabular-nums">
                  v1.0.0
                </span>
              </div>
              <p className="text-[10px] text-[#736B65] truncate font-medium">Salão de Beleza e Aluguel de Roupas</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
