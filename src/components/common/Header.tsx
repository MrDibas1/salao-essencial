import React from 'react';
import { Menu, UserPlus, Database, Download } from 'lucide-react';
import type { NavigationTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavigationTab;
  onOpenMobileSidebar: () => void;
  onOpenNewClientModal: () => void;
  onOpenInstallModal?: () => void;
  hasDemoData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onOpenNewClientModal,
  onOpenInstallModal,
  hasDemoData,
}) => {
  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Dashboard', desc: 'Visão geral das atividades e procedimentos' };
      case 'clients':
        return { title: 'Gestão de Clientes', desc: 'Listagem e cadastros do salão' };
      case 'client-detail':
        return { title: 'Perfil da Cliente', desc: 'Histórico individual de colorações e atendimentos' };
      case 'appointment-form':
        return { title: 'Registro de Atendimento', desc: 'Ficha técnica, fórmulas de coloração e serviços' };
      case 'history':
        return { title: 'Histórico Geral', desc: 'Todos os procedimentos e fórmulas registradas' };
      case 'products':
        return { title: 'Catálogo de Produtos', desc: 'Tinturas, oxidantes, descolorantes e insumos' };
      case 'settings':
        return { title: 'Configurações', desc: 'Identidade visual, preferências e dados do sistema' };
      default:
        return { title: 'Salão Essencial', desc: 'Sistema de Gestão' };
    }
  };

  const { title, desc } = getPageTitle();

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // Capitalize first letter of date
  const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <header className="h-20 bg-white border-b border-[#D4D4D8]/80 shadow-2xs px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-[#292929] hover:bg-[#F3F3F3] transition-colors"
          title="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#111111] tracking-tight">{title}</h1>
          <p className="text-xs text-[#6B7280] hidden sm:block">{desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Badge de dados demonstrativos se ativo */}
        {hasDemoData && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3F4F6] text-[#1F2937] border border-[#D1D5DB] shadow-2xs">
            <Database className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Dados Demonstrativos</span>
          </span>
        )}

        {/* Data formatada */}
        <div className="hidden xl:flex flex-col text-right pr-2">
          <span className="text-xs font-semibold text-[#111111]">{displayDate}</span>
          <span className="text-[10px] text-[#6B7280] font-medium">Ambiente Seguro Local</span>
        </div>

        {/* Install PWA Button */}
        {onOpenInstallModal && (
          <button
            onClick={onOpenInstallModal}
            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl border border-[#D1D5DB] bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#111111] text-xs font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-[0.98]"
            title="Instalar aplicativo na tela de início"
          >
            <Download className="w-3.5 h-3.5 text-[#111111]" />
            <span className="hidden sm:inline">Instalar App</span>
          </button>
        )}

        {/* Quick New Client Button */}
        <button
          onClick={onOpenNewClientModal}
          className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-[#D1D5DB] bg-white hover:bg-neutral-50 text-[#111111] text-xs font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-[0.98]"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nova Cliente</span>
        </button>
      </div>
    </header>
  );
};
