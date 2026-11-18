import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarPlus,
  History,
  Package,
  Settings,
  X,
  ChevronRight,
} from 'lucide-react';
import { Logo } from './Logo';

export type NavigationTab =
  | 'dashboard'
  | 'clients'
  | 'client-detail'
  | 'appointment-form'
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
  const menuItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Dashboard',
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
      id: 'history' as NavigationTab,
      label: 'Histórico',
      icon: History,
      badge: totalAppointmentsCount > 0 ? totalAppointmentsCount : null,
    },
    {
      id: 'products' as NavigationTab,
      label: 'Produtos & Fórmulas',
      icon: Package,
      badge: null,
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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-[#D4D4D8]/80 shadow-2xs flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#E5E7EB]">
          <button
            onClick={() => handleItemClick('dashboard')}
            className="text-left focus:outline-none"
          >
            <Logo size="md" />
          </button>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F3]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick action button */}
        <div className="p-4 border-b border-[#E5E7EB]">
          <button
            onClick={() => handleItemClick('appointment-form')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#111111] hover:bg-[#292929] text-white text-sm font-semibold transition-all shadow-xs hover:shadow active:scale-[0.99] group"
          >
            <CalendarPlus className="w-4 h-4 text-white/90 group-hover:scale-105 transition-transform" />
            <span>Registrar Atendimento</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-[#777777] uppercase tracking-wider">
            Menu Principal
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  active
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#292929] hover:bg-[#F3F3F3] hover:text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-white' : 'text-[#777777] group-hover:text-[#111111]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge !== null && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-[#F3F3F3] text-[#777777] group-hover:bg-[#E5E5E5]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white/60" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info & salon identity */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F4F5F7]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-serif text-sm shadow-xs">
              E
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#111111] truncate">Salão Essencial</p>
              <p className="text-[10px] text-[#6B7280] truncate font-medium">Ambiente de Gestão Interna</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
