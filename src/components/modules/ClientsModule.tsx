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
  ExternalLink,
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
      // Filtro status
      if (statusFilter === 'active' && client.status === 'archived') return false;
      if (statusFilter === 'archived' && client.status !== 'archived') return false;

      // Filtro de texto (nome ou telefone)
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm bg-[#FAFAFA] focus:bg-white focus:outline-none focus:border-[#111111] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#777777] hover:text-[#111111]"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Status Filters and Add Button */}
        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 rounded-xl bg-[#F3F3F3] border border-[#E5E5E5]">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === 'active'
                  ? 'bg-white text-[#111111] shadow-2xs'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Ativas ({clients.filter((c) => c.status !== 'archived').length})
            </button>
            <button
              onClick={() => setStatusFilter('archived')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === 'archived'
                  ? 'bg-white text-[#111111] shadow-2xs'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Arquivadas ({clients.filter((c) => c.status === 'archived').length})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-[#111111] shadow-2xs'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Todas ({clients.length})
            </button>
          </div>

          <button
            onClick={onOpenNewClientModal}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#292929] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nova Cliente</span>
          </button>
        </div>
      </div>

      {/* Clients Table / List */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-2xs overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F3F3F3] text-[#777777] flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-[#111111]">Nenhuma cliente encontrada</h4>
            <p className="text-xs text-[#777777] mt-1 max-w-sm mx-auto">
              {searchTerm
                ? `Nenhum resultado corresponde à busca "${searchTerm}".`
                : 'Você ainda não cadastrou nenhuma cliente neste filtro.'}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-medium text-[#111111] hover:bg-[#F3F3F3]"
              >
                Limpar busca
              </button>
            ) : (
              <button
                onClick={onOpenNewClientModal}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#111111] text-white text-xs font-medium"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Adicionar Primeira Cliente</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[#777777] uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-5 font-semibold">Cliente</th>
                  <th className="py-3.5 px-4 font-semibold">Contato</th>
                  <th className="py-3.5 px-4 font-semibold">Cadastro</th>
                  <th className="py-3.5 px-4 font-semibold">Último Atendimento</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Total Atendimentos</th>
                  <th className="py-3.5 px-5 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F3F3]">
                {filteredClients.map((client) => {
                  const lastApt = lastAppointmentMap.get(client.id);
                  const totalApts = appointmentCountMap.get(client.id) || 0;

                  const formattedCreatedAt = new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }).format(new Date(client.createdAt));

                  const lastAptFormatted = lastApt
                    ? new Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }).format(new Date(`${lastApt.date}T00:00:00`))
                    : 'Sem registros';

                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-[#FAFAFA] transition-colors group cursor-pointer"
                      onClick={() => onNavigate('client-detail', { clientId: client.id })}
                    >
                      {/* Nome e Avatar */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <ClientAvatar
                            name={client.name}
                            avatarUrl={client.avatarUrl}
                            size="md"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#111111] text-xs sm:text-sm group-hover:underline">
                                {client.name}
                              </span>
                              {client.status === 'archived' && (
                                <span className="text-[10px] bg-[#E5E5E5] text-[#777777] px-1.5 py-0.5 rounded font-medium">
                                  Arquivada
                                </span>
                              )}
                            </div>
                            {client.email && (
                              <span className="text-[11px] text-[#777777] block truncate max-w-xs">
                                {client.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contato (Telefone / WhatsApp) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-[#292929] font-medium">
                            <Phone className="w-3.5 h-3.5 text-[#777777]" />
                            <span>{client.phone}</span>
                          </div>
                          {client.whatsapp && client.whatsapp !== client.phone && (
                            <div className="flex items-center gap-1.5 text-[11px] text-[#777777]">
                              <MessageSquare className="w-3 h-3 text-[#777777]" />
                              <span>{client.whatsapp}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Data Cadastro */}
                      <td className="py-4 px-4 whitespace-nowrap text-[#777777] font-mono">
                        {formattedCreatedAt}
                      </td>

                      {/* Último Atendimento */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {lastApt ? (
                          <div>
                            <ProcedureBadge
                              procedure={lastApt.procedureType}
                              customName={lastApt.customProcedureName}
                              size="sm"
                              className="mb-1"
                            />
                            <span className="text-[11px] text-[#777777] flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {lastAptFormatted}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#777777] italic">Nenhum</span>
                        )}
                      </td>

                      {/* Total Atendimentos */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F3F3F3] text-xs font-mono font-bold text-[#111111]">
                          {totalApts}
                        </span>
                      </td>

                      {/* Ações */}
                      <td
                        className="py-4 px-5 text-right whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onNavigate('client-detail', { clientId: client.id })}
                            className="p-1.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#E5E5E5] transition-colors"
                            title="Acessar perfil completo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditClient(client)}
                            className="p-1.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#E5E5E5] transition-colors"
                            title="Editar cadastro"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Menu Dropdown simples de ações adicionais */}
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() =>
                                setActiveMenuId(activeMenuId === client.id ? null : client.id)
                              }
                              className="p-1.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#E5E5E5] transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {activeMenuId === client.id && (
                              <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white shadow-xl border border-[#E5E5E5] py-1 z-20 text-left animate-in fade-in zoom-in-95">
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onNavigate('appointment-form', { clientId: client.id });
                                  }}
                                  className="w-full px-3.5 py-2 text-xs font-medium text-[#111111] hover:bg-[#F3F3F3] flex items-center gap-2"
                                >
                                  <Calendar className="w-3.5 h-3.5 text-[#777777]" />
                                  <span>Novo Atendimento</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onArchiveClient(client, client.status !== 'archived');
                                  }}
                                  className="w-full px-3.5 py-2 text-xs font-medium text-[#292929] hover:bg-[#F3F3F3] flex items-center gap-2"
                                >
                                  {client.status === 'archived' ? (
                                    <>
                                      <UserCheck className="w-3.5 h-3.5 text-[#777777]" />
                                      <span>Desarquivar</span>
                                    </>
                                  ) : (
                                    <>
                                      <Archive className="w-3.5 h-3.5 text-[#777777]" />
                                      <span>Arquivar Cliente</span>
                                    </>
                                  )}
                                </button>
                                <div className="border-t border-[#F3F3F3] my-1" />
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onDeleteClient(client);
                                  }}
                                  className="w-full px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Excluir Cliente</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
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
