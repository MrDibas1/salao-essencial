import React, { useState, useMemo } from 'react';
import type { Appointment } from '../../types';
import type { NavigationTab } from '../common/Sidebar';
import {
  Search,
  Filter,
  Calendar,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  X,
  Plus,
} from 'lucide-react';

interface HistoryModuleProps {
  appointments: Appointment[];
  clients?: any[];
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
      // Busca por nome da cliente ou notas
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

      // Procedimento
      if (selectedProcedure !== 'all') {
        const procName =
          apt.procedureType === 'Outro' && apt.customProcedureName
            ? apt.customProcedureName
            : apt.procedureType;
        if (procName !== selectedProcedure) return false;
      }

      // Profissional
      if (selectedProfessional !== 'all' && apt.professional !== selectedProfessional) {
        return false;
      }

      // Intervalo de datas
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Filter and Actions Box */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Main search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por cliente, tonalidade (ex: 7.1) ou descrição..."
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

          {/* Quick buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl border text-xs font-medium transition-colors ${
                showAdvancedFilters || hasActiveFilters
                  ? 'bg-[#111111] text-white border-black'
                  : 'bg-white text-[#292929] border-[#E5E5E5] hover:bg-[#F3F3F3]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ml-0.5" />
              )}
            </button>

            <button
              onClick={() => onNavigate('appointment-form')}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#111111] hover:bg-[#292929] text-white text-xs font-semibold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Atendimento</span>
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-[#F3F3F3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in">
            {/* Filtro Procedimento */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#777777] mb-1">
                Procedimento
              </label>
              <select
                value={selectedProcedure}
                onChange={(e) => setSelectedProcedure(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs text-[#292929] focus:outline-none focus:border-[#111111]"
              >
                <option value="all">Todos os procedimentos</option>
                {procedures.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro Profissional */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#777777] mb-1">
                Profissional
              </label>
              <select
                value={selectedProfessional}
                onChange={(e) => setSelectedProfessional(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs text-[#292929] focus:outline-none focus:border-[#111111]"
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
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#777777] mb-1">
                A partir de
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs text-[#292929] focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Data Final */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#777777] mb-1">
                Até a data
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs text-[#292929] focus:outline-none focus:border-[#111111]"
                />
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="p-2 rounded-lg border border-[#E5E5E5] text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F3]"
                    title="Limpar todos os filtros"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#777777] px-1">
        <span>
          Exibindo <strong>{filteredAppointments.length}</strong> de{' '}
          <strong>{appointments.length}</strong> atendimentos
        </span>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-[#111111] font-semibold underline hover:opacity-80"
          >
            Limpar filtros aplicados
          </button>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-2xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F3F3F3] text-[#777777] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-[#111111]">
              Nenhum atendimento corresponde aos filtros
            </h4>
            <p className="text-xs text-[#777777] max-w-sm mx-auto">
              Tente redefinir os filtros de data, tipo de procedimento ou pesquisar por outro termo.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-2 px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-medium text-[#111111] hover:bg-[#F3F3F3]"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[#777777] uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-5 font-semibold">Data</th>
                  <th className="py-3.5 px-4 font-semibold">Cliente</th>
                  <th className="py-3.5 px-4 font-semibold">Procedimento</th>
                  <th className="py-3.5 px-4 font-semibold">Profissional</th>
                  <th className="py-3.5 px-4 font-semibold">Fórmula de Tintas</th>
                  <th className="py-3.5 px-5 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F3F3]">
                {filteredAppointments.map((apt) => {
                  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }).format(new Date(`${apt.date}T00:00:00`));

                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-[#FAFAFA] transition-colors group cursor-pointer"
                      onClick={() => onViewAppointmentDetails(apt)}
                    >
                      {/* Data */}
                      <td className="py-4 px-5 font-mono text-[#292929] whitespace-nowrap font-medium">
                        {formattedDate}
                      </td>

                      {/* Cliente */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('client-detail', { clientId: apt.clientId });
                          }}
                          className="font-bold text-[#111111] hover:underline flex items-center gap-1.5"
                        >
                          <span>{apt.clientName}</span>
                          <ExternalLink className="w-3 h-3 text-[#777777] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </td>

                      {/* Procedimento */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5]">
                          {apt.procedureType === 'Outro' && apt.customProcedureName
                            ? apt.customProcedureName
                            : apt.procedureType}
                        </span>
                      </td>

                      {/* Profissional */}
                      <td className="py-4 px-4 text-[#777777] whitespace-nowrap">
                        {apt.professional}
                      </td>

                      {/* Resumo da fórmula de tintas */}
                      <td className="py-4 px-4 max-w-sm">
                        {apt.hasColorInfo && apt.colorFormula ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {apt.colorFormula.products.map((p, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-[#FAFAFA] border border-[#E5E5E5] font-mono text-[11px] font-bold text-[#111111]"
                              >
                                {p.shadeNumber || p.brand} {p.quantity ? `(${p.quantity})` : ''}
                              </span>
                            ))}
                            {apt.colorFormula.oxidant?.used && apt.colorFormula.oxidant.volume && (
                              <span className="text-[10px] text-[#777777] font-medium">
                                + {apt.colorFormula.oxidant.volume}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#777777] italic text-[11px]">
                            Sem dados de coloração
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td
                        className="py-4 px-5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewAppointmentDetails(apt)}
                            className="p-1.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#E5E5E5] transition-colors"
                            title="Ver ficha técnica completa"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onEditAppointment(apt)}
                            className="p-1.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#E5E5E5] transition-colors"
                            title="Editar atendimento"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteAppointment(apt)}
                            className="p-1.5 rounded-lg text-[#777777] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Excluir atendimento"
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
        )}
      </div>
    </div>
  );
};
