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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha Técnica do Atendimento"
      subtitle={`Procedimento realizado em ${formattedDate}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Top summary card */}
        <div className="p-4 rounded-xl bg-[#F4F5F7] border border-[#D1D5DB] shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ClientAvatar
              name={appointment.clientName}
              avatarUrl={client?.avatarUrl}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#111111]">{appointment.clientName}</h4>
                {onViewClient && (
                  <button
                    onClick={() => {
                      onClose();
                      onViewClient(appointment.clientId);
                    }}
                    className="text-[11px] text-[#6B7280] font-medium underline hover:text-[#111111]"
                  >
                    Ver perfil
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-[#6B7280] mt-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Profissional: <strong className="text-[#111111]">{appointment.professional}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ProcedureBadge
              procedure={appointment.procedureType}
              customName={appointment.customProcedureName}
              size="lg"
            />
          </div>
        </div>

        {/* General service description */}
        {appointment.description && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Descrição do Serviço
            </h5>
            <div className="p-3.5 rounded-xl bg-white border border-[#D1D5DB] text-sm text-[#1F2937] leading-relaxed shadow-2xs">
              {appointment.description}
            </div>
          </div>
        )}

        {/* COLOR FORMULA SECTION */}
        {appointment.hasColorInfo && appointment.colorFormula && (
          <div className="p-5 rounded-xl border-2 border-[#111111] bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#111111]" />
                <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wide">
                  Fórmula de Coloração & Mistura Química
                </h4>
              </div>
              {appointment.colorFormula.pauseTime && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#111111] bg-[#F3F4F6] border border-[#D1D5DB] px-2.5 py-1 rounded-md shadow-2xs">
                  <Clock className="w-3.5 h-3.5" />
                  Pausa: {appointment.colorFormula.pauseTime}
                </span>
              )}
            </div>

            {/* List of dyes / color products */}
            <div>
              <p className="text-xs font-bold text-[#4B5563] mb-2 uppercase tracking-wider">
                Tintas & Tonalidades Utilizadas ({appointment.colorFormula.products.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {appointment.colorFormula.products.map((prod, idx) => {
                  const tone = getHairToneColor(prod.shadeNumber);
                  return (
                    <div
                      key={prod.id || idx}
                      className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#D1D5DB] shadow-2xs flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {tone && (
                              <span
                                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs ring-1 ring-black/10"
                                style={{ backgroundColor: tone.bg, border: `1px solid ${tone.border}` }}
                                title={tone.name}
                              />
                            )}
                            <span className="font-mono font-bold text-sm text-[#111111]">
                              {prod.shadeNumber}
                            </span>
                            {prod.shadeName && (
                              <span className="text-xs text-[#1F2937] font-semibold">
                                — {prod.shadeName}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6B7280] mt-1">
                            {prod.brand} {prod.line ? `(${prod.line})` : ''}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-[#D1D5DB] text-[#111111] shadow-2xs">
                          {prod.quantity}
                        </span>
                      </div>

                      {prod.region && (
                        <div className="mt-2.5 pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#6B7280]">
                          <span>Região de aplicação:</span>
                          <strong className="text-[#111111] font-semibold">{prod.region}</strong>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Oxidant / Developer details */}
            {appointment.colorFormula.oxidant?.used && (
              <div className="p-3.5 rounded-xl bg-[#F4F5F7] border border-[#D1D5DB] shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111] mb-2 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5" />
                  Oxidante / Revelador
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#6B7280] block text-[11px] font-medium">Marca:</span>
                    <span className="font-semibold text-[#111111]">
                      {appointment.colorFormula.oxidant.brand || 'Não especificada'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block text-[11px] font-medium">Volume:</span>
                    <span className="font-bold text-[#111111]">
                      {appointment.colorFormula.oxidant.volume || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block text-[11px] font-medium">Proporção / Quantidade:</span>
                    <span className="font-semibold text-[#111111]">
                      {appointment.colorFormula.oxidant.quantityOrRatio || '—'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Technical notes on the formula */}
            {appointment.colorFormula.technicalNotes && (
              <div className="text-xs text-[#1F2937] bg-[#F4F5F7] border border-[#D1D5DB] p-3 rounded-xl leading-relaxed shadow-2xs">
                <strong className="text-[#111111] font-bold block mb-0.5">Observações da Aplicação:</strong>
                {appointment.colorFormula.technicalNotes}
              </div>
            )}
          </div>
        )}

        {/* TECHNICAL ASSESSMENT & RESULTS */}
        {appointment.assessment && Object.values(appointment.assessment).some(Boolean) && (
          <div className="p-4 rounded-xl border border-[#D1D5DB] bg-white shadow-2xs space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#4B5563] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#111111]" />
              Avaliação Técnica & Evolução
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {appointment.assessment.initialCondition && (
                <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] block text-[11px] font-bold mb-1">
                    Condição Inicial do Cabelo:
                  </span>
                  <p className="text-[#1F2937] leading-relaxed">
                    {appointment.assessment.initialCondition}
                  </p>
                </div>
              )}

              {appointment.assessment.finalResult && (
                <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] block text-[11px] font-bold mb-1">
                    Resultado Final:
                  </span>
                  <p className="text-[#111111] leading-relaxed font-bold">
                    {appointment.assessment.finalResult}
                  </p>
                </div>
              )}

              {appointment.assessment.relevantHistory && (
                <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] block text-[11px] font-bold mb-1">
                    Histórico Técnico Relevante:
                  </span>
                  <p className="text-[#1F2937] leading-relaxed">
                    {appointment.assessment.relevantHistory}
                  </p>
                </div>
              )}

              {appointment.assessment.nextRecommendations && (
                <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] block text-[11px] font-bold mb-1">
                    Recomendações para Próximo Atendimento:
                  </span>
                  <p className="text-[#111111] leading-relaxed font-semibold">
                    {appointment.assessment.nextRecommendations}
                  </p>
                </div>
              )}
            </div>

            {appointment.assessment.professionalNotes && (
              <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-xs">
                <span className="text-[#6B7280] block text-[11px] font-bold mb-1">
                  Observações do Profissional:
                </span>
                <p className="text-[#1F2937] leading-relaxed">
                  {appointment.assessment.professionalNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* General notes if any */}
        {appointment.generalNotes && (
          <div className="text-xs text-[#4B5563] p-3 rounded-xl border border-dashed border-[#D1D5DB] bg-[#F8F9FA]">
            <strong className="text-[#111111] block mb-0.5 font-bold">Observações Gerais:</strong>
            {appointment.generalNotes}
          </div>
        )}

        {/* Modal footer actions */}
        <div className="pt-4 mt-6 border-t border-[#E5E7EB] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-[#D1D5DB] bg-white text-xs font-semibold text-[#374151] hover:text-[#111111] hover:bg-neutral-100 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ficha</span>
          </button>

          <div className="flex items-center gap-2.5">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(appointment);
                }}
                className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-semibold transition-all shadow-xs hover:shadow active:scale-[0.99]"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar Atendimento</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-[#D1D5DB] bg-white text-xs font-semibold text-[#374151] hover:text-[#111111] hover:bg-neutral-100 transition-colors shadow-2xs"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
