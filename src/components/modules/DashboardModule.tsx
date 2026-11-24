import React, { useState, useMemo } from 'react';
import type { Client, Appointment } from '../../types';
import type { NavigationTab } from '../common/Sidebar';
import { ClientAvatar } from '../common/ClientAvatar';
import { ProcedureBadge } from '../common/ProcedureBadge';
import {
  Users,
  CalendarPlus,
  UserPlus,
  Package,
  ArrowRight,
  Phone,
  Calendar,
  Search,
  X,
  ChevronRight,
  Sparkles,
  Images,
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

  const recentAppointments = appointments.slice(0, 4);

  // Total de fotos nos atendimentos
  const totalPhotosCount = useMemo(() => {
    return appointments.reduce((acc, apt) => {
      let count = 0;
      if (apt.beforePhotoUrl) count++;
      if (apt.afterPhotoUrl) count++;
      if (Array.isArray(apt.photoUrls)) {
        const uniqueOthers = apt.photoUrls.filter(
          (u) => u && u !== apt.beforePhotoUrl && u !== apt.afterPhotoUrl
        );
        count += uniqueOthers.length;
      }
      return acc + count;
    }, 0);
  }, [appointments]);

  // Clientes com foto para exibição no avatar stack da Hero
  const clientsWithAvatar = clients.filter((c) => Boolean(c.avatarUrl));
  const avatarClients =
    clientsWithAvatar.length >= 3 ? clientsWithAvatar.slice(0, 5) : clients.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300 pb-32 sm:pb-12">
      {/* Welcome Hero Card no estilo escuro refinado solicitado pelo usuário */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1C1A17] via-[#141210] to-[#0D0C0B] border border-white/10 p-5 sm:p-7 text-white shadow-lg">
        {/* Glow decorativo sutil com toque dourado que remete à marca */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#C87A14]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-semibold tracking-wider uppercase text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C87A14]" />
                <span>Painel de Controle • Gestão do Salão</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-wide mt-2 text-white">
                Salão Essencial
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed">
                Gestão precisa de fichas técnicas, fórmulas de coloração e acompanhamento personalizado de cada cliente.
              </p>
            </div>

            {/* Avatar stack e métrica */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2 overflow-hidden py-1">
                {avatarClients.map((c) => (
                  <div key={c.id} className="inline-block ring-2 ring-[#141210] rounded-full">
                    <ClientAvatar
                      name={c.name}
                      avatarUrl={c.avatarUrl}
                      size="sm"
                      className="w-7 h-7 text-[10px]"
                    />
                  </div>
                ))}
                {clients.length > avatarClients.length && (
                  <div className="w-7 h-7 rounded-full bg-white/20 ring-2 ring-[#141210] text-[10px] font-semibold flex items-center justify-center text-white tabular-nums">
                    +{clients.length - avatarClients.length}
                  </div>
                )}
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span className="tabular-nums">{clients.length} clientes ativas</span>
                  <span className="text-[#FBBF24]">★★★★★</span>
                </div>
                <span className="text-[11px] text-neutral-400">
                  Fórmulas e histórico preservados
                </span>
              </div>
            </div>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 min-w-[200px]">
            <button
              onClick={() => onNavigate('appointment-form')}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-[#1F1D1B] text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-[0.98]"
            >
              <CalendarPlus className="w-4 h-4 text-[#1F1D1B]" />
              <span>Novo Atendimento</span>
            </button>
            <button
              onClick={onOpenNewClientModal}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium border border-white/15 transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4 text-white/90" />
              <span>Cadastrar Cliente</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('search-clients-input');
                el?.focus();
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs sm:text-sm font-medium border border-white/10 transition-all active:scale-[0.98]"
            >
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <span>Consultar Clientes</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO PRINCIPAL: CLIENTES DO SALÃO (Mobile-First Absoluto)                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#EAE4DE] p-4 sm:p-6 shadow-xs space-y-4">
        {/* Topo da Seção de Clientes */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#EAE4DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-[#1F1D1B] tracking-tight">
                  Clientes
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#FAF8F6] border border-[#EAE4DE] text-[#736B65] text-[11px] font-medium tabular-nums">
                  {clients.length}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#736B65]">
                Toque para abrir a ficha ou iniciar atendimento
              </p>
            </div>
          </div>

          <button
            onClick={onOpenNewClientModal}
            className="text-xs font-semibold text-[#C87A14] hover:text-[#A8630A] transition-colors"
          >
            + Cadastrar
          </button>
        </div>

        {/* Barra de Pesquisa Fixa / Instantânea conforme DESIGN.md */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-clients-input"
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] pl-10 pr-10 py-2.5 rounded-xl border border-[#EAE4DE] text-[16px] text-[#1F1D1B] bg-[#FAF8F6] focus:bg-white focus:outline-none focus:border-[#C87A14] transition-all shadow-xs placeholder:text-[#736B65]/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#736B65] hover:text-[#1F1D1B]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Grade de Cartões de Clientes Empilhados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredClients.length === 0 ? (
            /* Empty State Amigável conforme DESIGN.md */
            <div className="col-span-full py-10 px-4 text-center bg-[#FAF8F6] rounded-2xl border border-dashed border-[#EAE4DE] space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center mx-auto">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#1F1D1B]">
                {searchQuery ? 'Nenhuma cliente encontrada' : 'Nenhuma cliente cadastrada'}
              </h4>
              <p className="text-xs text-[#736B65] max-w-xs mx-auto">
                {searchQuery
                  ? `Não encontramos registros para "${searchQuery}". Deseja cadastrar agora?`
                  : 'Sua base de clientes está pronta para os cadastros oficiais do salão.'}
              </p>
              <button
                onClick={onOpenNewClientModal}
                className="mt-1 min-h-[44px] inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#C87A14] text-white text-xs font-semibold active:scale-[0.98]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Nova cliente</span>
              </button>
            </div>
          ) : (
            filteredClients.map((client) => {
              const lastApt = lastAppointmentMap.get(client.id);
              const formattedLastDate = lastApt
                ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(
                    new Date(`${lastApt.date}T00:00:00`)
                  )
                : null;

              // Extrair fórmula resumida para badge discreta conforme DESIGN.md
              const formulaSummary = lastApt?.colorFormula?.products?.[0]?.shadeNumber
                ? `${lastApt.colorFormula.products.map((p) => p.shadeNumber).join(' + ')}${
                    lastApt.colorFormula.oxidant?.volume ? ` • OX ${lastApt.colorFormula.oxidant.volume}` : ''
                  }`
                : lastApt?.customProcedureName || lastApt?.procedureType;

              return (
                <div
                  key={client.id}
                  onClick={() => onNavigate('client-detail', { clientId: client.id })}
                  className="p-3.5 rounded-2xl border border-[#EAE4DE] bg-white hover:border-[#C87A14]/60 shadow-xs transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.98]"
                  title="Toque para ver o perfil completo"
                >
                  <div className="flex items-start gap-3">
                    <ClientAvatar
                      name={client.name}
                      avatarUrl={client.avatarUrl}
                      size="md"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-base font-semibold text-[#1F1D1B] group-hover:text-[#C87A14] transition-colors truncate">
                          {client.name}
                        </h4>
                        {formattedLastDate && (
                          <span className="text-[11px] text-[#736B65] shrink-0 tabular-nums">
                            {formattedLastDate}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#736B65] flex items-center gap-1 mt-0.5 tabular-nums">
                        <Phone className="w-3 h-3 text-[#736B65]/70" />
                        <span>{client.phone}</span>
                        {client.instagram && (
                          <>
                            <span className="text-[#EAE4DE]">•</span>
                            <span className="text-[11px] text-[#8C530A] font-medium truncate max-w-[120px]">{client.instagram}</span>
                          </>
                        )}
                      </p>

                      {/* Pill/Badge discreta com última tinta usada conforme DESIGN.md */}
                      {formulaSummary && (
                        <div className="mt-2">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#FAF8F6] border border-[#EAE4DE] text-[11px] font-medium text-[#736B65] truncate max-w-full tabular-nums">
                            {formulaSummary}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rodapé com Ação Direta */}
                  <div className="mt-3 pt-2 border-t border-[#EAE4DE]/60 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#736B65] group-hover:text-[#1F1D1B] flex items-center gap-1">
                      <span>Ver ficha</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#736B65]" />
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('appointment-form', { clientId: client.id });
                      }}
                      className="min-h-[36px] inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#FDF3E7] hover:bg-[#ebd9d5] text-[#8C530A] text-xs font-semibold transition-all active:scale-[0.98]"
                      title="Iniciar atendimento direto"
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
      {/* SEÇÃO SECUNDÁRIA: ATENDIMENTOS RECENTES                                   */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE4DE] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE4DE]">
          <div>
            <h3 className="text-base font-semibold text-[#1F1D1B]">Atendimentos Recentes</h3>
            <p className="text-xs text-[#736B65]">Últimos procedimentos registrados</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-[#C87A14] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#EAE4DE]/60">
          {recentAppointments.length === 0 ? (
            <p className="py-5 text-center text-xs text-[#736B65]">Nenhum procedimento registrado ainda.</p>
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
                  className="py-2.5 flex items-center justify-between hover:bg-[#FAF8F6] px-2 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ClientAvatar name={client?.name || apt.clientName} avatarUrl={client?.avatarUrl} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-[#1F1D1B] group-hover:text-[#C87A14] transition-colors truncate">
                        {apt.clientName}
                      </p>
                      <p className="text-[11px] text-[#736B65] flex items-center gap-1 mt-0.5 tabular-nums">
                        <Calendar className="w-3 h-3 text-[#736B65]/70" />
                        <span>{formattedDate}</span>
                        {apt.professional && <span>• {apt.professional}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ProcedureBadge procedure={apt.procedureType} customName={apt.customProcedureName} size="sm" />
                    <ChevronRight className="w-3.5 h-3.5 text-[#736B65] group-hover:text-[#1F1D1B] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO DE ATALHO RÁPIDO: GALERIA DE FOTOS                                  */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE4DE] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE4DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center font-bold">
              <Images className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1F1D1B]">Galeria de Fotos</h3>
              <p className="text-xs text-[#736B65]">Transformações e registros visuais</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-xs text-[#C87A14] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver galeria</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card de Atalho Interativo */}
        <div
          onClick={() => onNavigate('gallery')}
          className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F6] hover:bg-[#F5EFEB] border border-[#EAE4DE] transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-2xs active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#C87A14]/10 text-[#C87A14] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-semibold text-[#1F1D1B] group-hover:text-[#C87A14] transition-colors truncate">
                Portfólio & Fotos de Antes e Depois
              </h4>
              <p className="text-[11px] text-[#736B65] mt-0.5 line-clamp-1">
                {totalPhotosCount > 0
                  ? `${totalPhotosCount} fotos de transformações salvas no histórico.`
                  : 'Acompanhe fotos de antes e depois registradas em cada atendimento.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden sm:inline-block text-xs font-semibold text-[#C87A14]">Acessar</span>
            <div className="w-7 h-7 rounded-lg bg-white border border-[#EAE4DE] flex items-center justify-center text-[#736B65] group-hover:text-[#C87A14] group-hover:border-[#C87A14]/30 group-hover:translate-x-0.5 transition-all shadow-2xs">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
