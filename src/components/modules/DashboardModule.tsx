import React from 'react';
import type { Client, Appointment } from '../../types';
import type { NavigationTab } from '../common/Sidebar';
import { ClientAvatar } from '../common/ClientAvatar';
import {
  Users,
  CalendarCheck,
  Calendar,
  FlaskConical,
  ArrowRight,
  UserPlus,
  CalendarPlus,
  Search,
  CheckCircle,
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
  const totalAppointments = appointments.length;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed

  // Atendimentos realizados no mês corrente
  const appointmentsThisMonth = appointments.filter((apt) => {
    const aptDate = new Date(`${apt.date}T00:00:00`);
    return aptDate.getFullYear() === currentYear && aptDate.getMonth() === currentMonth;
  }).length;

  // Clientes cadastradas nos últimos 30 dias
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentClients = clients
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const newClientsCount = clients.filter(
    (c) => new Date(c.createdAt).getTime() >= thirtyDaysAgo.getTime()
  ).length;

  // Procedimentos de coloração total
  const colorAppointmentsCount = appointments.filter((a) => a.hasColorInfo).length;

  // Últimos 5 atendimentos
  const recentAppointments = appointments.slice(0, 6);

  // Atendimentos por mês nos últimos 6 meses para o gráfico dinâmico
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const chartData = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const count = appointments.filter((apt) => {
      const aptDate = new Date(`${apt.date}T00:00:00`);
      return aptDate.getFullYear() === y && aptDate.getMonth() === m;
    }).length;

    chartData.push({
      label: `${monthNames[m]}`,
      count,
    });
  }

  const maxChartCount = Math.max(...chartData.map((c) => c.count), 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner & Quick Shortcuts */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111111] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <span className="text-xs uppercase font-semibold tracking-widest text-[#E5E5E5]/70">
            Painel de Controle
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-light tracking-wide mt-1">
            Salão Essencial
          </h2>
          <p className="text-xs sm:text-sm text-[#E5E5E5]/80 mt-1 max-w-lg leading-relaxed">
            Gestão precisa de fichas técnicas, fórmulas de coloração e acompanhamento personalizado de cada cliente.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('appointment-form')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F3F3F3] text-[#111111] text-xs font-semibold transition-all shadow-xs"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Novo Atendimento</span>
          </button>
          <button
            onClick={onOpenNewClientModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#292929] hover:bg-neutral-800 text-white text-xs font-medium border border-white/10 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Cliente</span>
          </button>
          <button
            onClick={() => onNavigate('clients')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#292929] hover:bg-neutral-800 text-white text-xs font-medium border border-white/10 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Consultar Clientes</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Clientes */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E5] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
              Total de Clientes
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#F3F3F3] flex items-center justify-center text-[#111111]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#111111] font-mono">{totalClients}</span>
            <span className="text-xs text-[#777777]">cadastradas</span>
          </div>
          <p className="text-[11px] text-[#777777] mt-2">
            +{newClientsCount} novas nos últimos 30 dias
          </p>
        </div>

        {/* Total Atendimentos */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E5] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
              Atendimentos Totais
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#F3F3F3] flex items-center justify-center text-[#111111]">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#111111] font-mono">{totalAppointments}</span>
            <span className="text-xs text-[#777777]">procedimentos</span>
          </div>
          <p className="text-[11px] text-[#777777] mt-2">Histórico completo preservado</p>
        </div>

        {/* Atendimentos no Mês */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E5] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
              Realizados no Mês
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#F3F3F3] flex items-center justify-center text-[#111111]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#111111] font-mono">{appointmentsThisMonth}</span>
            <span className="text-xs text-[#777777]">neste mês</span>
          </div>
          <p className="text-[11px] text-[#777777] mt-2">
            {monthNames[currentMonth]} de {currentYear}
          </p>
        </div>

        {/* Fórmulas Técnicas Registradas */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E5] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
              Colorações & Fórmulas
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#F3F3F3] flex items-center justify-center text-[#111111]">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#111111] font-mono">
              {colorAppointmentsCount}
            </span>
            <span className="text-xs text-[#777777]">fichas detalhadas</span>
          </div>
          <p className="text-[11px] text-[#777777] mt-2">Fórmulas e tonalidades salvas</p>
        </div>
      </div>

      {/* GRAPH & RECENT CLIENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Period Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111111]">Atendimentos por Período</h3>
                <p className="text-xs text-[#777777]">Frequência mensal dos últimos 6 meses</p>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs text-[#111111] font-medium flex items-center gap-1 hover:underline"
              >
                <span>Ver histórico</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Custom Minimalist Monochrome Bar Chart */}
            <div className="mt-6 pt-4 border-t border-[#F3F3F3]">
              <div className="h-44 flex items-end justify-between gap-3 px-2">
                {chartData.map((item, idx) => {
                  const heightPercent =
                    maxChartCount > 0 ? Math.max((item.count / maxChartCount) * 100, 8) : 8;
                  const isCurrent = idx === chartData.length - 1;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[11px] font-mono font-semibold text-[#777777] group-hover:text-[#111111]">
                        {item.count}
                      </span>
                      <div className="w-full max-w-[42px] h-32 flex items-end bg-[#F3F3F3] rounded-t-md overflow-hidden">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full transition-all duration-500 rounded-t-md ${
                            isCurrent
                              ? 'bg-[#111111]'
                              : 'bg-[#292929] group-hover:bg-[#111111]'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs ${
                          isCurrent ? 'font-bold text-[#111111]' : 'text-[#777777]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F3F3F3] flex items-center justify-between text-xs text-[#777777]">
            <span>Base de dados ativa</span>
            <span className="flex items-center gap-1.5 font-medium text-[#292929]">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Sincronização local em tempo real
            </span>
          </div>
        </div>

        {/* Recently Registered Clients */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#111111]">Clientes Recentes</h3>
              <p className="text-xs text-[#777777]">Últimos cadastros adicionados</p>
            </div>
            <button
              onClick={() => onNavigate('clients')}
              className="text-xs text-[#111111] font-medium hover:underline"
            >
              Ver todas
            </button>
          </div>

          <div className="flex-1 divide-y divide-[#F3F3F3]">
            {recentClients.length === 0 ? (
              <p className="text-xs text-[#777777] py-8 text-center">Nenhuma cliente cadastrada.</p>
            ) : (
              recentClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => onNavigate('client-detail', { clientId: client.id })}
                  className="py-3 flex items-center justify-between hover:bg-[#FAFAFA] px-2 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <ClientAvatar
                      name={client.name}
                      avatarUrl={client.avatarUrl}
                      size="sm"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#111111] group-hover:underline">
                        {client.name}
                      </p>
                      <p className="text-[11px] text-[#777777]">{client.phone}</p>
                    </div>
                  </div>
                  <ChevronRightIcon />
                </div>
              ))
            )}
          </div>

          <button
            onClick={onOpenNewClientModal}
            className="mt-4 w-full py-2.5 px-3 rounded-lg border border-dashed border-[#E5E5E5] text-xs font-medium text-[#292929] hover:bg-[#F3F3F3] hover:border-[#111111] transition-all flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Cadastrar Nova Cliente</span>
          </button>
        </div>
      </div>

      {/* RECENT APPOINTMENTS TABLE */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#111111]">Últimos Atendimentos Registrados</h3>
            <p className="text-xs text-[#777777]">Procedimentos e fórmulas técnicas recentes</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-[#111111] font-semibold flex items-center gap-1 hover:underline"
          >
            <span>Ver histórico completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="py-12 text-center text-[#777777]">
            <p className="text-sm">Nenhum atendimento registrado até o momento.</p>
            <button
              onClick={() => onNavigate('appointment-form')}
              className="mt-3 inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-[#111111] text-white text-xs font-semibold"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Registrar Primeiro Atendimento</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E5E5] text-[#777777] uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3 font-semibold">Data</th>
                  <th className="py-3 px-3 font-semibold">Cliente</th>
                  <th className="py-3 px-3 font-semibold">Procedimento</th>
                  <th className="py-3 px-3 font-semibold">Profissional</th>
                  <th className="py-3 px-3 font-semibold">Fórmula / Produtos</th>
                  <th className="py-3 px-3 text-right font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F3F3]">
                {recentAppointments.map((apt) => {
                  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }).format(new Date(`${apt.date}T00:00:00`));

                  // Resumo dos produtos
                  const productsSummary =
                    apt.colorFormula?.products?.map((p) => `${p.shadeNumber || p.brand}`).join(' + ') ||
                    (apt.hasColorInfo ? 'Fórmula registrada' : '—');

                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-[#FAFAFA] transition-colors group cursor-pointer"
                      onClick={() => onViewAppointmentDetails(apt)}
                    >
                      <td className="py-3.5 px-3 font-mono text-[#292929] whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[#111111] whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('client-detail', { clientId: apt.clientId });
                          }}
                          className="hover:underline text-left"
                        >
                          {apt.clientName}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5]">
                          {apt.procedureType === 'Outro' && apt.customProcedureName
                            ? apt.customProcedureName
                            : apt.procedureType}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[#777777] whitespace-nowrap">
                        {apt.professional}
                      </td>
                      <td className="py-3.5 px-3 text-[#292929] max-w-xs truncate">
                        {apt.hasColorInfo ? (
                          <span className="inline-flex items-center gap-1 font-mono font-medium text-[#111111]">
                            <FlaskConical className="w-3 h-3 text-[#777777]" />
                            {productsSummary}
                          </span>
                        ) : (
                          <span className="text-[#777777] italic">Sem química</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewAppointmentDetails(apt);
                          }}
                          className="py-1 px-2.5 rounded text-[11px] font-semibold text-[#111111] hover:bg-[#E5E5E5] transition-colors"
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const ChevronRightIcon = () => (
  <svg
    className="w-4 h-4 text-[#777777] group-hover:text-[#111111] transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
