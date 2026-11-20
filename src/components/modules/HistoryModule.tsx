import React, { useState, useMemo } from 'react';
import type { Appointment, Client } from '../../types';
import type { NavigationTab } from '../common/Sidebar';
import { ProcedureBadge } from '../common/ProcedureBadge';
import { ClientAvatar } from '../common/ClientAvatar';
import { getHairToneColor } from '../../utils/hairColor';
import {
  Search,
  Filter,
  Calendar,
  Edit2,
  Trash2,
  Eye,
  X,
  Plus,
  ChevronRight,
  User,
} from 'lucide-react';

interface HistoryModuleProps {
  appointments: Appointment[];
  clients?: Client[];
  onNavigate: (tab: NavigationTab, params?: { clientId?: string; appointmentId?: string }) => void;
  onViewAppointmentDetails: (appointment: Appointment) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointment: Appointment) => void;
}

export const HistoryModule: React.FC<HistoryModuleProps> = ({
  appointments,
  clients,
  onNavigate,
  onViewAppointmentDetails,
  onEditAppointment,
  onDeleteAppointment,
}) => {
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState<string>('all');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Lista única de profissionais presentes no histórico para o filtro
  const professionals = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach((a) => {
      if (a.professional) set.add(a.professional);
    });
    return Array.from(set).sort();
  }, [appointments]);

  // Mapa de clientes para fotos
  const clientMap = useMemo(() => {
    const map = new Map<string, Client>();
    if (clients) {
      clients.forEach((c) => map.set(c.id, c));
    }
    return map;
  }, [clients]);

  // Lista única de procedimentos presentes no histórico
  const procedures = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach((a) => {
      const name =
        a.procedureType === 'Outro' && a.customProcedureName
          ? a.customProcedureName
          : a.procedureType;
      set.add(name);
    });
    return Array.from(set).sort();
  }, [appointments]);

  // Filtragem dos atendimentos
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = apt.clientName.toLowerCase().includes(term);
        const matchDesc = apt.description?.toLowerCase().includes(term);
        const matchDye = apt.colorFormula?.products?.some(
          (p) =>
            p.shadeNumber.toLowerCase().includes(term) ||
            p.shadeName?.toLowerCase().includes(term) ||
            p.brand.toLowerCase().includes(term)
        );
        if (!matchName && !matchDesc && !matchDye) return false;
      }

      if (selectedProcedure !== 'all') {
        const procName =
          apt.procedureType === 'Outro' && apt.customProcedureName
            ? apt.customProcedureName
            : apt.procedureType;
        if (procName !== selectedProcedure) return false;
      }

      if (selectedProfessional !== 'all' && apt.professional !== selectedProfessional) {
        return false;
      }

      if (startDate && apt.date < startDate) return false;
      if (endDate && apt.date > endDate) return false;

      return true;
    });
  }, [appointments, searchTerm, selectedProcedure, selectedProfessional, startDate, endDate]);

  const hasActiveFilters =
    searchTerm ||
    selectedProcedure !== 'all' ||
    selectedProfessional !== 'all' ||
    startDate ||
    endDate;

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedProcedure('all');
    setSelectedProfessional('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300 pb-32 sm:pb-12">
      {/* Barra de Filtro e Busca */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE4DE] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, tom (ex: 7.1) ou notas..."
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

          {/* Botões Rápidos */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`min-h-[44px] inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl border text-xs font-semibold transition-all active:scale-[0.98] ${
                showAdvancedFilters || hasActiveFilters
                  ? 'bg-[#FDF3E7] text-[#8C530A] border-[#C87A14]'
                  : 'bg-white text-[#736B65] border-[#EAE4DE] hover:bg-[#FAF8F6]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C87A14] ml-0.5" />
              )}
            </button>

            <button
              onClick={() => onNavigate('appointment-form')}
              className="min-h-[44px] inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Atendimento</span>
            </button>
          </div>
        </div>

        {/* Filtros Avançados Expansíveis */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-[#EAE4DE] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in">
            {/* Procedimento */}
            <div>
              <label className="block text-[11px] font-medium text-[#736B65] mb-1">
                Procedimento
              </label>
              <select
                value={selectedProcedure}
                onChange={(e) => setSelectedProcedure(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14]"
              >
                <option value="all">Todos os procedimentos</option>
                {procedures.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Profissional */}
            <div>
              <label className="block text-[11px] font-medium text-[#736B65] mb-1">
                Profissional
              </label>
              <select
                value={selectedProfessional}
                onChange={(e) => setSelectedProfessional(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14]"
              >
                <option value="all">Todos os profissionais</option>
                {professionals.map((prof) => (
                  <option key={prof} value={prof}>
                    {prof}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Inicial */}
            <div>
              <label className="block text-[11px] font-medium text-[#736B65] mb-1">
                A partir de
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] tabular-nums focus:outline-none focus:border-[#C87A14]"
              />
            </div>

            {/* Data Final */}
            <div>
              <label className="block text-[11px] font-medium text-[#736B65] mb-1">
                Até a data
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] tabular-nums focus:outline-none focus:border-[#C87A14]"
                />
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="min-h-[44px] px-3 rounded-xl border border-[#EAE4DE] text-xs text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6]"
                    title="Limpar filtros"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contador de Resultados */}
      <div className="flex items-center justify-between text-xs text-[#736B65] px-1">
        <span>
          Exibindo <strong className="text-[#1F1D1B] tabular-nums">{filteredAppointments.length}</strong> de{' '}
          <strong className="text-[#1F1D1B] tabular-nums">{appointments.length}</strong> atendimentos
        </span>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-[#C87A14] font-semibold hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredAppointments.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-[#EAE4DE] space-y-2.5 px-4">
          <div className="w-10 h-10 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center mx-auto">
            <Calendar className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-[#1F1D1B]">Nenhum atendimento encontrado</h4>
          <p className="text-xs text-[#736B65] max-w-sm mx-auto">
            Tente redefinir os filtros aplicados ou pesquisar por outro termo.
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="mt-1 min-h-[44px] px-4 py-2 rounded-xl border border-[#EAE4DE] text-xs font-medium text-[#1F1D1B] hover:bg-[#FAF8F6] active:scale-[0.98]"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          {/* VERSÃO MOBILE: Cards Empilhados sem <table> conforme DESIGN.MD */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {filteredAppointments.map((apt) => {
              const formattedDate = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }).format(new Date(`${apt.date}T00:00:00`));

              return (
                <div
                  key={apt.id}
                  onClick={() => onViewAppointmentDetails(apt)}
                  className="p-4 rounded-2xl bg-white border border-[#EAE4DE] shadow-xs space-y-3 cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ClientAvatar
                        name={apt.clientName}
                        avatarUrl={clientMap.get(apt.clientId)?.avatarUrl}
                        size="md"
                      />
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-[#1F1D1B] truncate">
                          {apt.clientName}
                        </h4>
                        <p className="text-xs text-[#736B65] flex items-center gap-1 mt-0.5 tabular-nums">
                          <Calendar className="w-3 h-3 text-[#736B65]/70" />
                          <span>{formattedDate}</span>
                          <span>•</span>
                          <span>{apt.professional}</span>
                        </p>
                      </div>
                    </div>

                    <ProcedureBadge
                      procedure={apt.procedureType}
                      customName={apt.customProcedureName}
                      size="sm"
                    />
                  </div>

                  {/* Resumo da Fórmula */}
                  {apt.hasColorInfo && apt.colorFormula && (
                    <div className="p-2.5 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE] flex flex-wrap items-center gap-1.5 text-xs">
                      {apt.colorFormula.products.map((p, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-white border border-[#EAE4DE] font-mono text-[11px] font-semibold text-[#1F1D1B] tabular-nums"
                        >
                          {p.shadeNumber || p.brand}
                          {p.quantity && <span className="text-[#736B65] font-normal ml-1">({p.quantity})</span>}
                        </span>
                      ))}
                      {apt.colorFormula.oxidant?.used && apt.colorFormula.oxidant.volume && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF8F6] border border-[#EAE4DE] text-[11px] font-medium text-[#736B65] tabular-nums">
                          OX {apt.colorFormula.oxidant.volume}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="pt-2 border-t border-[#EAE4DE]/60 flex items-center justify-between text-xs">
                    <span className="text-xs font-medium text-[#736B65] flex items-center gap-1">
                      <span>Ver ficha técnica</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#736B65]" />
                    </span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onEditAppointment(apt)}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#736B65] hover:text-[#1F1D1B]"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteAppointment(apt)}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#736B65] hover:text-[#C94A4A]"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VERSÃO DESKTOP: Tabela Limpa com Bordas Sutis */}
          <div className="hidden sm:block bg-white rounded-2xl border border-[#EAE4DE] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#EAE4DE] bg-[#FAF8F6] text-[#736B65] text-[11px] font-medium">
                    <th className="py-3 px-5">Data</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Procedimento</th>
                    <th className="py-3 px-4">Profissional</th>
                    <th className="py-3 px-4">Fórmula</th>
                    <th className="py-3 px-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4DE]/60">
                  {filteredAppointments.map((apt) => {
                    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }).format(new Date(`${apt.date}T00:00:00`));

                    return (
                      <tr
                        key={apt.id}
                        className="hover:bg-[#FAF8F6] transition-colors group cursor-pointer"
                        onClick={() => onViewAppointmentDetails(apt)}
                      >
                        {/* Data */}
                        <td className="py-3.5 px-5 font-mono text-[#1F1D1B] whitespace-nowrap font-medium tabular-nums">
                          {formattedDate}
                        </td>

                        {/* Cliente */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('client-detail', { clientId: apt.clientId });
                            }}
                            className="flex items-center gap-2.5 text-left group-hover:underline"
                          >
                            <ClientAvatar
                              name={apt.clientName}
                              avatarUrl={clientMap.get(apt.clientId)?.avatarUrl}
                              size="sm"
                            />
                            <span className="font-semibold text-[#1F1D1B]">{apt.clientName}</span>
                          </button>
                        </td>

                        {/* Procedimento */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <ProcedureBadge
                            procedure={apt.procedureType}
                            customName={apt.customProcedureName}
                            size="sm"
                          />
                        </td>

                        {/* Profissional */}
                        <td className="py-3.5 px-4 text-[#736B65] whitespace-nowrap">
                          {apt.professional}
                        </td>

                        {/* Fórmula */}
                        <td className="py-3.5 px-4 max-w-sm">
                          {apt.hasColorInfo && apt.colorFormula ? (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {apt.colorFormula.products.map((p, i) => {
                                const tone = getHairToneColor(p.shadeNumber);
                                return (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#EAE4DE] font-mono text-[11px] font-semibold text-[#1F1D1B] shadow-xs tabular-nums"
                                  >
                                    {tone && (
                                      <span
                                        className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                                        style={{ backgroundColor: tone.bg, border: `1px solid ${tone.border}` }}
                                      />
                                    )}
                                    <span>{p.shadeNumber || p.brand}</span>
                                    {p.quantity && (
                                      <span className="text-[10px] text-[#736B65] font-normal font-sans">
                                        ({p.quantity})
                                      </span>
                                    )}
                                  </span>
                                );
                              })}
                              {apt.colorFormula.oxidant?.used && apt.colorFormula.oxidant.volume && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8C6239] bg-[#FAF2E8] border border-[#EAE4DE] px-2 py-0.5 rounded-full tabular-nums">
                                  + OX {apt.colorFormula.oxidant.volume}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[#736B65] italic text-[11px]">
                              Sem tintas
                            </span>
                          )}
                        </td>

                        {/* Ações */}
                        <td
                          className="py-3.5 px-5 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onViewAppointmentDetails(apt)}
                              className="p-1.5 rounded-lg text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors"
                              title="Ver ficha"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onEditAppointment(apt)}
                              className="p-1.5 rounded-lg text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteAppointment(apt)}
                              className="p-1.5 rounded-lg text-[#736B65] hover:text-[#C94A4A] hover:bg-[#FCECEC] transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
