import React, { useState, useMemo } from 'react';
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
  Search,
  X,
  ChevronRight,
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
  const [searchQuery, setSearchQuery] = useState('');

  // Mapear último atendimento por cliente
  const lastAppointmentMap = useMemo(() => {
    const map = new Map<string, Appointment>();
    appointments.forEach((apt) => {
      const existing = map.get(apt.clientId);
      if (!existing) {
        map.set(apt.clientId, apt);
      } else {
        const timeExisting = new Date(`${existing.date}T00:00:00`).getTime();
        const timeCurrent = new Date(`${apt.date}T00:00:00`).getTime();
        if (timeCurrent > timeExisting) {
          map.set(apt.clientId, apt);
        }
      }
    });
    return map;
  }, [appointments]);

  // Filtragem de clientes com busca instantânea
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase().trim();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.whatsapp?.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  // Últimos 4 atendimentos para o rodapé operacional
  const recentAppointments = appointments.slice(0, 4);

  // Clientes com foto para exibição no avatar stack
  const clientsWithAvatar = clients.filter((c) => Boolean(c.avatarUrl));
  const avatarClients =
    clientsWithAvatar.length >= 3 ? clientsWithAvatar.slice(0, 5) : clients.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner da Marca */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#181818] via-[#111111] to-[#0D0D0D] border border-white/10 p-5 sm:p-7 text-white shadow-xl">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-semibold tracking-wider uppercase text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Salão Essencial • Início</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-light tracking-wide text-white">
              Painel de Atendimento
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-md">
              Selecione a cliente abaixo para abrir a ficha técnica ou registrar o procedimento de hoje.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNewClientModal}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Nova Cliente</span>
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-sm active:scale-[0.98]"
            >
              <Package className="w-4 h-4" />
              <span>Produtos</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO PRINCIPAL: VITRINE & SELEÇÃO DE CLIENTES (Ênfase Total Solicitada) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border-2 border-[#111111]/80 p-5 sm:p-7 shadow-xs space-y-5">
        {/* Topo da Seção de Clientes */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111111] tracking-tight">
                  Clientes do Salão
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[#111111] text-[11px] font-bold">
                  {clients.length} cadastradas
                </span>
              </div>
              <p className="text-xs text-[#777777]">
                Selecione uma cliente para abrir seu perfil ou iniciar o atendimento direto
              </p>
            </div>
          </div>

          <button
            onClick={onOpenNewClientModal}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Cadastrar outra cliente</span>
          </button>
        </div>

        {/* Barra de Pesquisa de Cliente com Lupa em Destaque */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#888888] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar cliente por nome ou WhatsApp para atender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-[#D1D5DB] text-sm bg-[#FAFAFA] focus:bg-white focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-all shadow-2xs font-medium placeholder:text-[#999999]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#888888] hover:text-[#111111]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Grade de Cartões de Clientes Fáceis de Selecionar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredClients.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-[#FAFAFA] rounded-xl border border-dashed border-[#D1D5DB] space-y-3">
              <Users className="w-8 h-8 text-[#999999] mx-auto" />
              <p className="text-xs text-[#777777]">
                Nenhuma cliente encontrada para <strong>"{searchQuery}"</strong>.
              </p>
              <button
                onClick={onOpenNewClientModal}
                className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#111111] text-white text-xs font-semibold"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Cadastrar com este nome</span>
              </button>
            </div>
          ) : (
            filteredClients.map((client) => {
              const lastApt = lastAppointmentMap.get(client.id);

              return (
                <div
                  key={client.id}
                  onClick={() => onNavigate('client-detail', { clientId: client.id })}
                  className="p-3.5 sm:p-4 rounded-xl border border-[#E5E5E5] bg-white hover:border-[#111111] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
                  title="Clique para abrir o perfil da cliente"
                >
                  <div className="flex items-start gap-3">
                    <ClientAvatar
                      name={client.name}
                      avatarUrl={client.avatarUrl}
                      size="md"
                      className="ring-2 ring-transparent group-hover:ring-amber-400 transition-all"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-[#111111] group-hover:text-amber-800 transition-colors truncate">
                        {client.name}
                      </h4>

                      <p className="text-xs text-[#777777] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#999999]" />
                        <span>{client.phone}</span>
                      </p>

                      {lastApt && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#666666]">
                          <span className="truncate">
                            Último:{' '}
                            <strong className="text-[#222222]">
                              {lastApt.customProcedureName || lastApt.procedureType}
                            </strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rodapé do Card com CTA direto para Atendimento */}
                  <div className="mt-3 pt-2.5 border-t border-[#F0F0F0] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-neutral-500 group-hover:text-[#111111] flex items-center gap-1">
                      <span>Ver perfil</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('appointment-form', { clientId: client.id });
                      }}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-2xs hover:shadow active:scale-95"
                      title="Iniciar atendimento direto para esta cliente"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      <span>Atender</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO SECUNDÁRIA: ÚLTIMOS ATENDIMENTOS REALIZADOS                        */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
          <div>
            <h3 className="text-base font-bold text-[#111111]">Últimos Atendimentos Realizados</h3>
            <p className="text-xs text-[#777777]">Histórico dos procedimentos recentes no salão</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-[#111111] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Ver histórico completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#F3F3F3]">
          {recentAppointments.length === 0 ? (
            <p className="py-6 text-center text-xs text-[#777777]">Nenhum atendimento realizado ainda.</p>
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
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ClientAvatar name={client?.name || apt.clientName} avatarUrl={client?.avatarUrl} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#111111] group-hover:text-amber-800 transition-colors truncate">
                        {apt.clientName}
                      </p>
                      <p className="text-[11px] text-[#777777] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-[#999999]" />
                        <span>{formattedDate}</span>
                        {apt.professional && <span>• {apt.professional}</span>}
                      </p>
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
    </div>
  );
};
