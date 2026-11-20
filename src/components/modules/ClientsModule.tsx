import React, { useState, useMemo } from 'react';
import type { Client, Appointment } from '../../types';
import type { NavigationTab } from '../common/Sidebar';
import { ClientAvatar } from '../common/ClientAvatar';
import { ProcedureBadge } from '../common/ProcedureBadge';
import {
  UserPlus,
  Search,
  Phone,
  MessageSquare,
  Calendar,
  MoreVertical,
  Archive,
  Trash2,
  Edit2,
  UserCheck,
  ChevronRight,
  CalendarPlus,
  Users,
  X,
} from 'lucide-react';

interface ClientsModuleProps {
  clients: Client[];
  appointments: Appointment[];
  onNavigate: (tab: NavigationTab, params?: { clientId?: string; appointmentId?: string }) => void;
  onOpenNewClientModal: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onArchiveClient: (client: Client, archive: boolean) => void;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({
  clients,
  appointments,
  onNavigate,
  onOpenNewClientModal,
  onEditClient,
  onDeleteClient,
  onArchiveClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('active');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Mapear último atendimento de cada cliente
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

  // Contagem de atendimentos por cliente
  const appointmentCountMap = useMemo(() => {
    const map = new Map<string, number>();
    appointments.forEach((apt) => {
      map.set(apt.clientId, (map.get(apt.clientId) || 0) + 1);
    });
    return map;
  }, [appointments]);

  // Filtragem
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (statusFilter === 'active' && client.status === 'archived') return false;
      if (statusFilter === 'archived' && client.status !== 'archived') return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const matchName = client.name.toLowerCase().includes(term);
      const matchPhone = client.phone.toLowerCase().includes(term);
      const matchWhatsapp = client.whatsapp?.toLowerCase().includes(term);
      const matchEmail = client.email?.toLowerCase().includes(term);

      return matchName || matchPhone || matchWhatsapp || matchEmail;
    });
  }, [clients, searchTerm, statusFilter]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300 pb-32 sm:pb-12">
      {/* Barra de Ações & Busca Fixa no Topo */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE4DE] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Campo de Busca Rápida */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-10 py-2.5 rounded-xl border border-[#EAE4DE] text-[16px] text-[#1F1D1B] bg-[#FAF8F6] focus:bg-white focus:outline-none focus:border-[#C87A14] transition-all shadow-xs placeholder:text-[#736B65]/70"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#736B65] hover:text-[#1F1D1B]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtros de Status & Botão de Cadastro */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0">
            <div className="inline-flex p-1 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE] shrink-0">
              <button
                onClick={() => setStatusFilter('active')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'active'
                    ? 'bg-white text-[#8C530A] shadow-xs'
                    : 'text-[#736B65] hover:text-[#1F1D1B]'
                }`}
              >
                Ativas ({clients.filter((c) => c.status !== 'archived').length})
              </button>
              <button
                onClick={() => setStatusFilter('archived')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'archived'
                    ? 'bg-white text-[#8C530A] shadow-xs'
                    : 'text-[#736B65] hover:text-[#1F1D1B]'
                }`}
              >
                Arquivadas ({clients.filter((c) => c.status === 'archived').length})
              </button>
              <button
                onClick={() => setStatusFilter('all')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white text-[#8C530A] shadow-xs'
                    : 'text-[#736B65] hover:text-[#1F1D1B]'
                }`}
              >
                Todas ({clients.length})
              </button>
            </div>

            <button
              onClick={onOpenNewClientModal}
              className="min-h-[44px] inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.98] shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nova Cliente</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Clientes: Cards Empilhados Mobile-First conforme DESIGN.md */}
      {filteredClients.length === 0 ? (
        /* Empty State Amigável */
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-[#EAE4DE] space-y-3 px-4">
          <div className="w-12 h-12 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-[#1F1D1B]">Nenhuma cliente encontrada</h4>
          <p className="text-xs text-[#736B65] max-w-sm mx-auto">
            {searchTerm
              ? `Nenhum resultado corresponde à busca "${searchTerm}".`
              : 'Nenhuma cliente encontrada neste filtro.'}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 min-h-[44px] px-4 py-2 rounded-xl border border-[#EAE4DE] text-xs font-medium text-[#1F1D1B] hover:bg-[#FAF8F6] active:scale-[0.98]"
            >
              Limpar busca
            </button>
          ) : (
            <button
              onClick={onOpenNewClientModal}
              className="mt-2 min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C87A14] text-white text-xs font-semibold active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadastrar primeira cliente</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredClients.map((client) => {
            const lastApt = lastAppointmentMap.get(client.id);
            const totalApts = appointmentCountMap.get(client.id) || 0;

            const lastAptFormatted = lastApt
              ? new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(`${lastApt.date}T00:00:00`))
              : 'Sem atendimentos';

            const formulaSummary = lastApt?.colorFormula?.products?.[0]?.shadeNumber
              ? `${lastApt.colorFormula.products.map((p) => p.shadeNumber).join(' + ')}${
                  lastApt.colorFormula.oxidant?.volume ? ` • OX ${lastApt.colorFormula.oxidant.volume}` : ''
                }`
              : lastApt?.customProcedureName || lastApt?.procedureType;

            return (
              <div
                key={client.id}
                onClick={() => onNavigate('client-detail', { clientId: client.id })}
                className="p-4 rounded-2xl bg-white border border-[#EAE4DE] hover:border-[#C87A14]/60 shadow-xs transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.98] relative"
              >
                <div>
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ClientAvatar
                        name={client.name}
                        avatarUrl={client.avatarUrl}
                        size="md"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-semibold text-[#1F1D1B] group-hover:text-[#C87A14] transition-colors truncate">
                            {client.name}
                          </h4>
                          {client.status === 'archived' && (
                            <span className="text-[10px] bg-[#FAF8F6] text-[#736B65] border border-[#EAE4DE] px-1.5 py-0.2 rounded-full font-medium shrink-0">
                              Arquivada
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#736B65] flex items-center gap-1.5 mt-0.5 tabular-nums">
                          <Phone className="w-3 h-3 text-[#736B65]/70" />
                          <span>{client.phone}</span>
                          {client.instagram && (
                            <>
                              <span className="text-[#EAE4DE]">•</span>
                              <span className="text-[11px] text-[#8C530A] font-medium truncate max-w-[120px]">{client.instagram}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Menu de Ações Secundárias */}
                    <div
                      className="relative shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === client.id ? null : client.id)
                        }
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === client.id && (
                        <div className="absolute right-0 mt-1 w-44 rounded-2xl bg-white shadow-lg border border-[#EAE4DE] py-1.5 z-20 text-left animate-in fade-in zoom-in-95">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditClient(client);
                            }}
                            className="w-full px-3.5 py-2 text-xs font-medium text-[#1F1D1B] hover:bg-[#FAF8F6] flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#736B65]" />
                            <span>Editar cadastro</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onArchiveClient(client, client.status !== 'archived');
                            }}
                            className="w-full px-3.5 py-2 text-xs font-medium text-[#1F1D1B] hover:bg-[#FAF8F6] flex items-center gap-2"
                          >
                            {client.status === 'archived' ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-[#2E7D5B]" />
                                <span>Reativar cliente</span>
                              </>
                            ) : (
                              <>
                                <Archive className="w-3.5 h-3.5 text-[#736B65]" />
                                <span>Arquivar</span>
                              </>
                            )}
                          </button>
                          <div className="border-t border-[#EAE4DE] my-1" />
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteClient(client);
                            }}
                            className="w-full px-3.5 py-2 text-xs font-medium text-[#C94A4A] hover:bg-[#FCECEC] flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informações da Fórmula e Última Visita */}
                  <div className="mt-3 pt-2.5 border-t border-[#EAE4DE]/60 space-y-1.5 text-xs text-[#736B65]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#736B65]">Última visita:</span>
                      <span className="text-xs font-medium text-[#1F1D1B] tabular-nums">
                        {lastAptFormatted}
                      </span>
                    </div>

                    {formulaSummary && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#736B65]">Fórmula:</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF8F6] border border-[#EAE4DE] text-[11px] font-medium text-[#8C530A] truncate max-w-[180px] tabular-nums">
                          {formulaSummary}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rodapé de Ação Rápida */}
                <div className="mt-3 pt-2.5 border-t border-[#EAE4DE]/60 flex items-center justify-between">
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
                    title="Iniciar atendimento para esta cliente"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Atender</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
