import React from 'react';
import type { Client, Appointment } from '../../types';
import type { NavigationTab } from '../common/Sidebar';
import { ClientAvatar } from '../common/ClientAvatar';
import { ProcedureBadge } from '../common/ProcedureBadge';
import {
  Users,
  CalendarCheck,
  CalendarPlus,
  UserPlus,
  Package,
  ArrowRight,
  Sparkles,
  Phone,
  Calendar,
} from 'lucide-react';

interface DashboardModuleProps {
  clients: Client[];
  appointments: Appointment[];
  onNavigate: (tab: NavigationTab, params?: { clientId?: string; appointmentId?: string }) => void;
  onOpenNewClientModal: () => void;
  onViewAppointmentDetails: (appointment: Appointment) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  clients,
  appointments,
  onNavigate,
  onOpenNewClientModal,
  onViewAppointmentDetails,
}) => {
  // Cálculos dinâmicos em tempo real
  const totalClients = clients.length;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Atendimentos realizados no mês corrente
  const appointmentsThisMonth = appointments.filter((apt) => {
    const aptDate = new Date(`${apt.date}T00:00:00`);
    return aptDate.getFullYear() === currentYear && aptDate.getMonth() === currentMonth;
  }).length;

  const recentClients = clients
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Últimos 6 atendimentos
  const recentAppointments = appointments.slice(0, 6);

  // Clientes com foto para exibição no avatar stack da Hero
  const clientsWithAvatar = clients.filter((c) => Boolean(c.avatarUrl));
  const avatarClients =
    clientsWithAvatar.length >= 3 ? clientsWithAvatar.slice(0, 5) : clients.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner & Quick Shortcuts */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#181818] via-[#111111] to-[#0D0D0D] border border-white/10 p-6 sm:p-8 text-white shadow-xl">
        {/* Glow decorativo suave */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-semibold tracking-wider uppercase text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Salão Essencial • Gestão Direta</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-light tracking-wide mt-2 text-white">
                Bem-vindo ao Essencial
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed">
                Acesse fichas de clientes, registre novos atendimentos e consulte o catálogo de produtos com fotos em poucos toques.
              </p>
            </div>

            {/* Avatar Stack de Clientes (Círculos sobrepostos) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex -space-x-2.5 overflow-hidden p-0.5">
                {avatarClients.map((c, index) => (
                  <div
                    key={c.id || index}
                    className="inline-block h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-[#111111] overflow-hidden bg-neutral-800 shrink-0 shadow-md transition-transform hover:scale-110 hover:z-20 cursor-pointer"
                    title={c.name}
                    onClick={() => onNavigate('client-detail', { clientId: c.id })}
                  >
                    {c.avatarUrl ? (
                      <img src={c.avatarUrl} alt={c.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs font-bold text-white bg-neutral-700">
                        {c.name.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
                {clients.length > avatarClients.length && (
                  <div
                    onClick={() => onNavigate('clients')}
                    className="inline-flex h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-[#111111] bg-neutral-800 hover:bg-neutral-700 text-white items-center justify-center text-[11px] font-bold shrink-0 shadow-md cursor-pointer transition-colors"
                    title="Ver todas as clientes"
                  >
                    +{clients.length - avatarClients.length}
                  </div>
                )}
              </div>

              <div className="text-xs">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span>{clients.length} clientes ativas</span>
                  <span className="text-amber-400 text-xs">★★★★★</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Fichas e fórmulas organizadas
                </p>
              </div>
            </div>
          </div>

          {/* 3 Ações Principais do Salão */}
          <div className="relative z-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 pt-2 lg:pt-0">
            <button
              onClick={() => onNavigate('appointment-form')}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-[0.98]"
            >
              <CalendarPlus className="w-4 h-4 text-neutral-950" />
              <span>+ Novo Atendimento</span>
            </button>
            <button
              onClick={onOpenNewClientModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-sm active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadastrar Cliente</span>
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-sm active:scale-[0.98]"
            >
              <Package className="w-4 h-4" />
              <span>Ver Produtos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visão Rápida dos 3 Pilares em Cartões Limpos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Clientes Ativas */}
        <div
          onClick={() => onNavigate('clients')}
          className="p-5 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs hover:border-[#111111] hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
              Clientes Ativas
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#F3F3F3] group-hover:bg-[#111111] group-hover:text-white transition-colors flex items-center justify-center text-[#111111]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#111111] font-mono">{totalClients}</span>
            <span className="text-xs text-[#777777]">cadastradas</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Acessar cadastro de clientes</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Atendimentos do Mês */}
        <div
          onClick={() => onNavigate('history')}
          className="p-5 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs hover:border-[#111111] hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
              Atendimentos no Mês
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#F3F3F3] group-hover:bg-[#111111] group-hover:text-white transition-colors flex items-center justify-center text-[#111111]">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#111111] font-mono">{appointmentsThisMonth}</span>
            <span className="text-xs text-[#777777]">procedimentos</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Ver histórico completo</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Catálogo de Produtos com Foto */}
        <div
          onClick={() => onNavigate('products')}
          className="p-5 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs hover:border-[#111111] hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
              Catálogo de Produtos
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#F3F3F3] group-hover:bg-[#111111] group-hover:text-white transition-colors flex items-center justify-center text-[#111111]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#111111] font-mono">10+</span>
            <span className="text-xs text-[#777777]">itens com foto</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Explorar produtos & fórmulas</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Operação Diária: 2 Colunas Diretas (Últimos Atendimentos & Clientes) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna 1: Últimos Atendimentos Realizados */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111111]">Últimos Atendimentos</h3>
                <p className="text-xs text-[#777777]">Procedimentos e fichas recentes</p>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs text-[#111111] font-medium flex items-center gap-1 hover:underline"
              >
                <span>Ver todos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#F3F3F3]">
              {recentAppointments.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#777777]">
                  Nenhum atendimento registrado ainda.
                </div>
              ) : (
                recentAppointments.map((apt) => {
                  const client = clients.find((c) => c.id === apt.clientId);
                  const formattedDate = new Date(`${apt.date}T00:00:00`).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  });

                  return (
                    <div
                      key={apt.id}
                      onClick={() => onViewAppointmentDetails(apt)}
                      className="py-3 flex items-center justify-between hover:bg-[#FAFAFA] px-2 rounded-xl cursor-pointer transition-colors group"
                      title="Clique para ver os detalhes da ficha técnica"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ClientAvatar name={client?.name || apt.clientName} avatarUrl={client?.avatarUrl} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#111111] group-hover:text-amber-700 transition-colors truncate">
                            {apt.clientName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-[#777777] flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#999999]" />
                              {formattedDate}
                            </span>
                            {apt.professional && (
                              <span className="text-[11px] text-[#777777] hidden sm:inline">
                                • {apt.professional}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <ProcedureBadge procedure={apt.procedureType} customName={apt.customProcedureName} size="sm" />
                        <ArrowRight className="w-3.5 h-3.5 text-[#CCCCCC] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F3F3F3]">
            <button
              onClick={() => onNavigate('appointment-form')}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#D1D5DB] hover:border-[#111111] hover:bg-[#FAFAFA] text-xs font-semibold text-[#111111] transition-all flex items-center justify-center gap-1.5"
            >
              <CalendarPlus className="w-4 h-4 text-amber-600" />
              <span>+ Registrar Novo Atendimento</span>
            </button>
          </div>
        </div>

        {/* Coluna 2: Clientes Recentes */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111111]">Clientes Recentes</h3>
                <p className="text-xs text-[#777777]">Cadastros ativos no salão</p>
              </div>
              <button
                onClick={() => onNavigate('clients')}
                className="text-xs text-[#111111] font-medium hover:underline flex items-center gap-1"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#F3F3F3]">
              {recentClients.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#777777]">
                  Nenhuma cliente cadastrada.
                </div>
              ) : (
                recentClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => onNavigate('client-detail', { clientId: client.id })}
                    className="py-3 flex items-center justify-between hover:bg-[#FAFAFA] px-2 rounded-xl cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ClientAvatar name={client.name} avatarUrl={client.avatarUrl} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#111111] group-hover:text-amber-700 transition-colors truncate">
                          {client.name}
                        </p>
                        <p className="text-[11px] text-[#777777] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#999999]" />
                          <span>{client.phone}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('appointment-form', { clientId: client.id });
                      }}
                      className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-[#F5F5F5] hover:bg-[#111111] text-[#292929] hover:text-white text-[11px] font-semibold transition-all shadow-2xs"
                      title="Novo atendimento para esta cliente"
                    >
                      <CalendarPlus className="w-3 h-3" />
                      <span className="hidden sm:inline">Atender</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F3F3F3]">
            <button
              onClick={onOpenNewClientModal}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#D1D5DB] hover:border-[#111111] hover:bg-[#FAFAFA] text-xs font-semibold text-[#111111] transition-all flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-4 h-4 text-[#111111]" />
              <span>+ Cadastrar Nova Cliente</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
