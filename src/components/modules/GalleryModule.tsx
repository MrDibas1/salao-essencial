import React, { useState, useMemo } from 'react';
import type { Appointment, Client } from '../../types';
import type { NavigationTab } from '../common/Sidebar';
import { ClientAvatar } from '../common/ClientAvatar';
import { ProcedureBadge } from '../common/ProcedureBadge';
import {
  Images,
  Search,
  Sparkles,
  Camera,
  CalendarPlus,
  Maximize2,
  X,
  ChevronRight,
  FlaskConical,
  Filter,
} from 'lucide-react';

interface GalleryModuleProps {
  appointments: Appointment[];
  clients: Client[];
  onNavigate: (tab: NavigationTab, params?: { clientId?: string; appointmentId?: string }) => void;
  onViewAppointmentDetails: (appointment: Appointment) => void;
}

export const GalleryModule: React.FC<GalleryModuleProps> = ({
  appointments,
  clients,
  onNavigate,
  onViewAppointmentDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState<string>('Todos');
  const [enlargedItem, setEnlargedItem] = useState<{
    appointment: Appointment;
    activeTab: 'both' | 'before' | 'after';
  } | null>(null);

  // Mapa de clientes para foto de avatar rápida
  const clientsMap = useMemo(() => {
    const map = new Map<string, Client>();
    clients.forEach((c) => map.set(c.id, c));
    return map;
  }, [clients]);

  // Apenas atendimentos que possuem pelo menos 1 foto (Antes ou Depois)
  const appointmentsWithPhotos = useMemo(() => {
    return appointments.filter(
      (a) => Boolean(a.beforePhotoUrl || a.afterPhotoUrl || (a.photoUrls && a.photoUrls.length > 0))
    );
  }, [appointments]);

  // Lista única de procedimentos presentes nas fotos
  const availableProcedures = useMemo(() => {
    const set = new Set<string>();
    appointmentsWithPhotos.forEach((a) => {
      if (a.procedureType) {
        a.procedureType.split(/\s*\+\s*/).forEach((p) => {
          if (p.trim()) set.add(p.trim());
        });
      }
    });
    return ['Todos', ...Array.from(set)];
  }, [appointmentsWithPhotos]);

  // Filtragem combinada (busca + tipo de serviço)
  const filteredAppointments = useMemo(() => {
    let result = appointmentsWithPhotos;

    if (selectedProcedure !== 'Todos') {
      result = result.filter((a) => a.procedureType && a.procedureType.includes(selectedProcedure));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.clientName.toLowerCase().includes(q) ||
          a.procedureType.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.colorFormula?.technicalNotes?.toLowerCase().includes(q) ||
          a.colorFormula?.products?.some((p) => p.shadeNumber?.toLowerCase().includes(q) || p.shadeName?.toLowerCase().includes(q))
      );
    }

    // Ordenar por data mais recente
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointmentsWithPhotos, selectedProcedure, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 lg:pb-8">
      {/* CABEÇALHO DO MÓDULO */}
      <div className="bg-white rounded-2xl border border-[#EAE4DE] p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FDF3E7] text-[#C87A14] flex items-center justify-center shrink-0 shadow-xs">
              <Images className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-[#1F1D1B] tracking-tight">
                  Galeria de Transformações
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FDF3E7] text-[#8C530A] border border-[#EAE4DE] tabular-nums">
                  {appointmentsWithPhotos.length} fotos
                </span>
              </div>
              <p className="text-xs text-[#736B65] mt-0.5">
                Portfólio visual com registros de antes e depois dos procedimentos do salão
              </p>
            </div>
          </div>
        </div>

        {/* Botão de Ação Rápida */}
        <button
          onClick={() => onNavigate('appointment-form')}
          className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all"
        >
          <Camera className="w-4 h-4" />
          <span>+ Atendimento com Foto</span>
        </button>
      </div>

      {/* BARRA DE FILTROS & BUSCA */}
      <div className="bg-white rounded-2xl border border-[#EAE4DE] p-3 sm:p-4 shadow-xs space-y-3">
        {/* Campo de Pesquisa */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente, procedimento ou fórmula de cor..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#EAE4DE] bg-[#FAF8F6] focus:bg-white text-sm text-[#1F1D1B] placeholder-[#736B65] focus:outline-none focus:border-[#C87A14] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B65] hover:text-[#1F1D1B] text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Pílulas de Filtro por Procedimento */}
        {availableProcedures.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
            <span className="text-[11px] font-semibold text-[#736B65] uppercase tracking-wider pr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-[#C87A14]" />
              Filtro:
            </span>
            {availableProcedures.map((proc) => {
              const active = selectedProcedure === proc;
              return (
                <button
                  key={proc}
                  type="button"
                  onClick={() => setSelectedProcedure(proc)}
                  className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all active:scale-[0.98] shrink-0 ${
                    active
                      ? 'bg-[#C87A14] text-white shadow-xs font-semibold'
                      : 'bg-[#FAF8F6] text-[#736B65] hover:text-[#1F1D1B] border border-[#EAE4DE]'
                  }`}
                >
                  {proc}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* GRID DE TRANSFORMAÇÕES */}
      {filteredAppointments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#EAE4DE] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FDF3E7] text-[#C87A14] flex items-center justify-center mx-auto shadow-xs">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#1F1D1B]">
            {searchQuery || selectedProcedure !== 'Todos'
              ? 'Nenhuma transformação encontrada com esses filtros'
              : 'Nenhuma foto na galeria ainda'}
          </h3>
          <p className="text-xs text-[#736B65] max-w-md mx-auto leading-relaxed">
            {searchQuery || selectedProcedure !== 'Todos'
              ? 'Tente alterar os termos de busca ou selecionar outro procedimento para ver mais fotos.'
              : 'Registre fotos de Antes e Depois durante os atendimentos para criar o catálogo visual exclusivo do Salão Essencial.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('appointment-form')}
              className="min-h-[44px] inline-flex items-center gap-2 py-2 px-5 rounded-xl bg-[#C87A14] text-white text-xs font-semibold active:scale-[0.98] shadow-xs"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Cadastrar atendimento com fotos</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredAppointments.map((apt) => {
            const client = clientsMap.get(apt.clientId);
            const formattedDate = new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).format(new Date(`${apt.date}T00:00:00`));

            const hasBoth = Boolean(apt.beforePhotoUrl && apt.afterPhotoUrl);

            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-[#EAE4DE] overflow-hidden shadow-xs hover:border-[#C87A14]/50 transition-all flex flex-col justify-between group"
              >
                {/* TOPO DO CARD: CLIENTE & PROCEDIMENTO */}
                <div className="p-4 border-b border-[#EAE4DE]/70 flex items-center justify-between gap-3 bg-[#FAF8F6]/60">
                  <div
                    onClick={() => onNavigate('client-detail', { clientId: apt.clientId })}
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                    title={`Abrir perfil de ${apt.clientName}`}
                  >
                    <ClientAvatar
                      name={apt.clientName}
                      avatarUrl={client?.avatarUrl}
                      size="sm"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1F1D1B] leading-tight flex items-center gap-1">
                        <span>{apt.clientName}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#736B65] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <span className="text-[11px] text-[#736B65] tabular-nums">{formattedDate}</span>
                    </div>
                  </div>

                  <ProcedureBadge
                    procedure={apt.procedureType}
                    customName={apt.customProcedureName}
                    size="sm"
                  />
                </div>

                {/* CORPO DO CARD: FOTOS ANTES E DEPOIS */}
                <div className="p-4 space-y-3">
                  <div
                    className={`grid gap-2.5 cursor-pointer ${
                      hasBoth ? 'grid-cols-2' : 'grid-cols-1'
                    }`}
                    onClick={() => setEnlargedItem({ appointment: apt, activeTab: 'both' })}
                  >
                    {/* FOTO ANTES */}
                    {apt.beforePhotoUrl && (
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/5 border border-[#EAE4DE] group/img">
                        <img
                          src={apt.beforePhotoUrl}
                          alt={`Antes - ${apt.clientName}`}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                          ANTES
                        </span>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="p-1.5 rounded-full bg-white/90 text-[#1F1D1B] shadow-md">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    )}

                    {/* FOTO DEPOIS */}
                    {apt.afterPhotoUrl && (
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/5 border border-[#C87A14]/30 group/img">
                        <img
                          src={apt.afterPhotoUrl}
                          alt={`Depois - ${apt.clientName}`}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#C87A14] text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>DEPOIS</span>
                        </span>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="p-1.5 rounded-full bg-white/90 text-[#C87A14] shadow-md">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FÓRMULA OU RESUMO TÉCNICO */}
                  {apt.hasColorInfo && apt.colorFormula && apt.colorFormula.products.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE] text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#8C530A] font-semibold text-[11px]">
                        <FlaskConical className="w-3.5 h-3.5 text-[#C87A14] shrink-0" />
                        <span>Fórmula:</span>
                        <span className="text-[#1F1D1B] font-mono tabular-nums">
                          {apt.colorFormula.products.map((p) => p.shadeNumber).filter(Boolean).join(' + ')}
                          {apt.colorFormula.oxidant?.volume && ` • OX ${apt.colorFormula.oxidant.volume}`}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#736B65]">
                        {apt.colorFormula.pauseTime || 'Retoque'}
                      </span>
                    </div>
                  )}

                  {/* DESCRIÇÃO CURTA SE HOUVER */}
                  {apt.description && !apt.hasColorInfo && (
                    <p className="text-xs text-[#736B65] line-clamp-2 leading-relaxed">
                      {apt.description}
                    </p>
                  )}
                </div>

                {/* RODAPÉ DO CARD */}
                <div className="px-4 py-3 bg-[#FAF8F6] border-t border-[#EAE4DE] flex items-center justify-between text-xs">
                  <span className="text-[#736B65]">
                    Profissional: <strong className="text-[#1F1D1B] font-medium">{apt.professional}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => onViewAppointmentDetails(apt)}
                    className="min-h-[36px] text-xs font-semibold text-[#C87A14] hover:text-[#A8630A] inline-flex items-center gap-1 transition-colors active:scale-95"
                  >
                    <span>Ver ficha técnica</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL LIGHTBOX DE AMPLIAÇÃO & COMPARAÇÃO EM TELA CHEIA                    */}
      {/* ========================================================================= */}
      {enlargedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setEnlargedItem(null)}
        >
          {/* Header do Lightbox */}
          <div
            className="flex items-center justify-between text-white max-w-5xl w-full mx-auto pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold">
                  {enlargedItem.appointment.clientName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#C87A14] text-white">
                  {enlargedItem.appointment.procedureType}
                </span>
              </div>
              <p className="text-xs text-white/70">
                Atendimento em {enlargedItem.appointment.date} • {enlargedItem.appointment.professional}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const apt = enlargedItem.appointment;
                  setEnlargedItem(null);
                  onViewAppointmentDetails(apt);
                }}
                className="hidden sm:inline-flex min-h-[38px] items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
              >
                <span>Ficha Técnica</span>
              </button>
              <button
                type="button"
                onClick={() => setEnlargedItem(null)}
                className="min-h-[44px] min-w-[44px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Área Central de Visualização */}
          <div
            className="flex-1 max-w-5xl w-full mx-auto flex items-center justify-center my-auto py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-h-[75vh]">
              {/* Imagem Antes */}
              {enlargedItem.appointment.beforePhotoUrl && (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Antes do Procedimento
                  </span>
                  <div className="rounded-xl overflow-hidden bg-black/40 border border-white/20 max-h-[65vh] flex items-center justify-center">
                    <img
                      src={enlargedItem.appointment.beforePhotoUrl}
                      alt="Antes"
                      className="max-w-full max-h-[65vh] object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Imagem Depois */}
              {enlargedItem.appointment.afterPhotoUrl && (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-[#FDF3E7] uppercase tracking-wider mb-1.5 flex items-center gap-1 text-[#C87A14]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Resultado • Depois</span>
                  </span>
                  <div className="rounded-xl overflow-hidden bg-black/40 border border-[#C87A14]/60 max-h-[65vh] flex items-center justify-center shadow-2xl">
                    <img
                      src={enlargedItem.appointment.afterPhotoUrl}
                      alt="Depois"
                      className="max-w-full max-h-[65vh] object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rodapé com atalho para a Ficha */}
          <div
            className="text-center text-xs text-white/60 pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Toque fora da imagem ou no X para fechar</span>
          </div>
        </div>
      )}
    </div>
  );
};
