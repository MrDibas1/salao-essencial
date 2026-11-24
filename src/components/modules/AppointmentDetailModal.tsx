import React from 'react';
import { Modal } from '../ui/Modal';
import type { Appointment, Client } from '../../types';
import { ClientAvatar } from '../common/ClientAvatar';
import { ProcedureBadge } from '../common/ProcedureBadge';
import { getHairToneColor } from '../../utils/hairColor';
import {
  Calendar,
  User,
  FlaskConical,
  Clock,
  Layers,
  FileText,
  Printer,
  Edit2,
  CheckCircle2,
  Camera,
  Sparkles,
  Maximize2,
  X,
} from 'lucide-react';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  client?: Client | null;
  onEdit?: (appointment: Appointment) => void;
  onViewClient?: (clientId: string) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  isOpen,
  onClose,
  appointment,
  client,
  onEdit,
  onViewClient,
}) => {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${appointment.date}T00:00:00`));

  const [enlargedPhoto, setEnlargedPhoto] = React.useState<{ url: string; title: string } | null>(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha do Atendimento"
      subtitle={`Realizado em ${formattedDate}`}
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Top summary card */}
        <div className="p-4 rounded-2xl bg-[#FAF8F6] border border-[#EAE4DE] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ClientAvatar
              name={appointment.clientName}
              avatarUrl={client?.avatarUrl}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-[#1F1D1B]">{appointment.clientName}</h4>
                {onViewClient && (
                  <button
                    onClick={() => {
                      onClose();
                      onViewClient(appointment.clientId);
                    }}
                    className="text-[11px] text-[#C87A14] font-medium hover:underline"
                  >
                    Ver perfil
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-[#736B65] mt-0.5 tabular-nums">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#C87A14]" />
                  {formattedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#736B65]" />
                  {appointment.professional}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ProcedureBadge
              procedure={appointment.procedureType}
              customName={appointment.customProcedureName}
              size="md"
            />
          </div>
        </div>

        {/* FOTOS DE ANTES E DEPOIS DO ATENDIMENTO */}
        {(appointment.beforePhotoUrl || appointment.afterPhotoUrl) && (
          <div className="p-4 rounded-2xl bg-white border border-[#EAE4DE] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DE]">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#C87A14]" />
                <h4 className="text-sm font-semibold text-[#1F1D1B]">
                  Transformação • Fotos do Atendimento
                </h4>
              </div>
              <span className="text-[11px] text-[#736B65]">Toque na foto para ampliar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* FOTO ANTES */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#736B65] uppercase tracking-wider block">
                  Antes do Procedimento
                </span>
                {appointment.beforePhotoUrl ? (
                  <div
                    onClick={() => setEnlargedPhoto({ url: appointment.beforePhotoUrl!, title: `Antes • ${appointment.clientName}` })}
                    className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/5 border border-[#EAE4DE] cursor-pointer group shadow-xs active:scale-[0.99] transition-transform"
                    title="Clique para ampliar"
                  >
                    <img
                      src={appointment.beforePhotoUrl}
                      alt="Antes"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                      ANTES
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-white/90 text-[#1F1D1B] shadow-md">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-4/3 rounded-xl border border-dashed border-[#EAE4DE] bg-[#FAF8F6] flex flex-col items-center justify-center text-[#736B65] text-xs">
                    <span>Sem foto de Antes</span>
                  </div>
                )}
              </div>

              {/* FOTO DEPOIS */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#8C530A] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C87A14]" />
                  <span>Resultado • Depois</span>
                </span>
                {appointment.afterPhotoUrl ? (
                  <div
                    onClick={() => setEnlargedPhoto({ url: appointment.afterPhotoUrl!, title: `Depois • ${appointment.clientName}` })}
                    className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/5 border border-[#C87A14]/30 cursor-pointer group shadow-xs active:scale-[0.99] transition-transform"
                    title="Clique para ampliar"
                  >
                    <img
                      src={appointment.afterPhotoUrl}
                      alt="Depois"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#C87A14] text-white text-[10px] font-bold shadow-xs">
                      DEPOIS
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-white/90 text-[#C87A14] shadow-md">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-4/3 rounded-xl border border-dashed border-[#EAE4DE] bg-[#FAF8F6] flex flex-col items-center justify-center text-[#736B65] text-xs">
                    <span>Sem foto de Depois</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* General service description */}
        {appointment.description && (
          <div className="p-3.5 rounded-2xl bg-white border border-[#EAE4DE] text-sm text-[#736B65] leading-relaxed shadow-xs">
            <span className="text-xs font-semibold text-[#1F1D1B] block mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#C87A14]" />
              Descrição do Serviço
            </span>
            {appointment.description}
          </div>
        )}

        {/* COLOR FORMULA SECTION */}
        {appointment.hasColorInfo && appointment.colorFormula && (
          <div className="p-4 rounded-2xl border border-[#EAE4DE] bg-[#FAF8F6] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE4DE]">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#C87A14]" />
                <h4 className="text-sm font-semibold text-[#1F1D1B]">
                  Fórmula e Mistura Utilizada
                </h4>
              </div>
              {appointment.colorFormula.pauseTime && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#8C530A] bg-[#FDF3E7] border border-[#EAE4DE] px-2.5 py-0.5 rounded-full tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  Pausa: {appointment.colorFormula.pauseTime}
                </span>
              )}
            </div>

            {/* List of dyes / color products */}
            <div>
              <p className="text-xs font-medium text-[#736B65] mb-2">
                Tintas & Marcas Utilizadas ({appointment.colorFormula.products.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {appointment.colorFormula.products.map((prod, idx) => {
                  const tone = getHairToneColor(prod.shadeNumber);
                  const dyeTitle = prod.brand || prod.shadeNumber;
                  const showShadeName = prod.shadeName && prod.shadeName !== prod.brand && prod.shadeName !== prod.shadeNumber;

                  return (
                    <div
                      key={prod.id || idx}
                      className="p-3 rounded-xl bg-white border border-[#EAE4DE] shadow-xs flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {tone && (
                              <span
                                className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                                style={{ backgroundColor: tone.bg, border: `1px solid ${tone.border}` }}
                                title={tone.name}
                              />
                            )}
                            <span className="font-semibold text-sm text-[#1F1D1B]">
                              {dyeTitle}
                            </span>
                            {showShadeName && (
                              <span className="text-xs text-[#736B65]">
                                — {prod.shadeName}
                              </span>
                            )}
                          </div>
                          {prod.line && (
                            <p className="text-[11px] text-[#736B65] mt-0.5">
                              {prod.line}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#FAF8F6] border border-[#EAE4DE] text-[#1F1D1B] tabular-nums">
                          {prod.quantity}
                        </span>
                      </div>

                      {prod.region && (
                        <div className="mt-2 pt-1.5 border-t border-[#EAE4DE] flex items-center justify-between text-[11px] text-[#736B65]">
                          <span>Região:</span>
                          <span className="text-[#1F1D1B] font-medium">{prod.region}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Oxidant / Developer details */}
            {appointment.colorFormula.oxidant?.used && (
              <div className="p-3 rounded-xl bg-white border border-[#EAE4DE] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F1D1B] mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C87A14]" />
                  Oxidante / Revelador
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[#736B65] block text-[11px]">Marca:</span>
                    <span className="font-medium text-[#1F1D1B]">
                      {appointment.colorFormula.oxidant.brand || 'Não especificada'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#736B65] block text-[11px]">Volume:</span>
                    <span className="font-semibold text-[#1F1D1B] tabular-nums">
                      {appointment.colorFormula.oxidant.volume || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#736B65] block text-[11px]">Proporção / Qtd:</span>
                    <span className="font-semibold text-[#1F1D1B] tabular-nums">
                      {appointment.colorFormula.oxidant.quantityOrRatio || '—'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Technical notes on the formula */}
            {appointment.colorFormula.technicalNotes && (
              <div className="text-xs text-[#736B65] bg-white border border-[#EAE4DE] p-3 rounded-xl leading-relaxed shadow-xs">
                <strong className="text-[#1F1D1B] font-semibold block mb-0.5">Observações da Aplicação:</strong>
                {appointment.colorFormula.technicalNotes}
              </div>
            )}
          </div>
        )}

        {/* TECHNICAL ASSESSMENT & RESULTS */}
        {appointment.assessment && Object.values(appointment.assessment).some(Boolean) && (
          <div className="p-4 rounded-2xl border border-[#EAE4DE] bg-white shadow-xs space-y-2.5">
            <h5 className="text-xs font-semibold text-[#1F1D1B] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" />
              Evolução e Resultados
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {appointment.assessment.finalResult && (
                <div className="p-2.5 rounded-xl bg-[#E8F4EE]/50 border border-[#2E7D5B]/20">
                  <span className="text-[#2E7D5B] block text-[11px] font-medium mb-0.5">
                    Resultado Final:
                  </span>
                  <p className="text-[#1F1D1B] font-semibold leading-relaxed">
                    {appointment.assessment.finalResult}
                  </p>
                </div>
              )}

              {appointment.assessment.initialCondition && (
                <div className="p-2.5 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE]">
                  <span className="text-[#736B65] block text-[11px] font-medium mb-0.5">
                    Condição Inicial:
                  </span>
                  <p className="text-[#736B65] leading-relaxed">
                    {appointment.assessment.initialCondition}
                  </p>
                </div>
              )}

              {appointment.assessment.nextRecommendations && (
                <div className="p-2.5 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE] sm:col-span-2">
                  <span className="text-[#C87A14] block text-[11px] font-medium mb-0.5">
                    Próximo Atendimento:
                  </span>
                  <p className="text-[#1F1D1B] font-medium leading-relaxed">
                    {appointment.assessment.nextRecommendations}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* General notes if any */}
        {appointment.generalNotes && (
          <div className="text-xs text-[#736B65] p-3 rounded-xl border border-[#EAE4DE] bg-[#FAF8F6]">
            <strong className="text-[#1F1D1B] block mb-0.5 font-semibold">Observações Gerais:</strong>
            {appointment.generalNotes}
          </div>
        )}

        {/* Modal footer actions */}
        <div className="pt-3 border-t border-[#EAE4DE] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[44px] inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-[#EAE4DE] bg-white text-xs font-medium text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors active:scale-[0.98]"
          >
            <Printer className="w-3.5 h-3.5 text-[#736B65]" />
            <span>Imprimir</span>
          </button>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(appointment);
                }}
                className="min-h-[44px] inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-xs font-semibold transition-all shadow-xs active:scale-[0.98]"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] py-2 px-4 rounded-xl border border-[#EAE4DE] bg-white text-xs font-medium text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors active:scale-[0.98]"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE AMPLIAÇÃO (LIGHTBOX) */}
      {enlargedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setEnlargedPhoto(null)}
        >
          <div className="w-full max-w-4xl flex items-center justify-between text-white pb-3">
            <span className="text-sm font-semibold">{enlargedPhoto.title}</span>
            <button
              type="button"
              onClick={() => setEnlargedPhoto(null)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div
            className="max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={enlargedPhoto.url}
              alt={enlargedPhoto.title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
