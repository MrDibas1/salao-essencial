import React from 'react';
import { Modal } from '../ui/Modal';
import type { Appointment } from '../../types';
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
  onEdit?: (appointment: Appointment) => void;
  onViewClient?: (clientId: string) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  isOpen,
  onClose,
  appointment,
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
        <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-sm">
              {appointment.clientName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#111111]">{appointment.clientName}</h4>
                {onViewClient && (
                  <button
                    onClick={() => {
                      onClose();
                      onViewClient(appointment.clientId);
                    }}
                    className="text-[11px] text-[#777777] underline hover:text-[#111111]"
                  >
                    Ver perfil
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-[#777777] mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Profissional: <strong className="text-[#292929]">{appointment.professional}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#111111] text-white">
              {appointment.procedureType === 'Outro' && appointment.customProcedureName
                ? appointment.customProcedureName
                : appointment.procedureType}
            </span>
          </div>
        </div>

        {/* General service description */}
        {appointment.description && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Descrição do Serviço
            </h5>
            <div className="p-3.5 rounded-lg bg-white border border-[#E5E5E5] text-sm text-[#292929] leading-relaxed">
              {appointment.description}
            </div>
          </div>
        )}

        {/* COLOR FORMULA SECTION */}
        {appointment.hasColorInfo && appointment.colorFormula && (
          <div className="p-5 rounded-xl border border-[#111111] bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#111111]" />
                <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wide">
                  Fórmula de Coloração & Mistura Química
                </h4>
              </div>
              {appointment.colorFormula.pauseTime && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] bg-[#F3F3F3] px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5" />
                  Pausa: {appointment.colorFormula.pauseTime}
                </span>
              )}
            </div>

            {/* List of dyes / color products */}
            <div>
              <p className="text-xs font-semibold text-[#777777] mb-2 uppercase tracking-wider">
                Tintas & Tonalidades Utilizadas ({appointment.colorFormula.products.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {appointment.colorFormula.products.map((prod, idx) => (
                  <div
                    key={prod.id || idx}
                    className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-sm text-[#111111]">
                            {prod.shadeNumber}
                          </span>
                          {prod.shadeName && (
                            <span className="text-xs text-[#292929] font-medium">
                              — {prod.shadeName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#777777] mt-0.5">
                          {prod.brand} {prod.line ? `(${prod.line})` : ''}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-[#E5E5E5] text-[#111111]">
                        {prod.quantity}
                      </span>
                    </div>

                    {prod.region && (
                      <div className="mt-2 pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#777777]">
                        <span>Região de aplicação:</span>
                        <strong className="text-[#111111]">{prod.region}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Oxidant / Developer details */}
            {appointment.colorFormula.oxidant?.used && (
              <div className="p-3.5 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111] mb-2 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5" />
                  Oxidante / Revelador
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#777777] block text-[11px]">Marca:</span>
                    <span className="font-medium text-[#111111]">
                      {appointment.colorFormula.oxidant.brand || 'Não especificada'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#777777] block text-[11px]">Volume:</span>
                    <span className="font-semibold text-[#111111]">
                      {appointment.colorFormula.oxidant.volume || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#777777] block text-[11px]">Proporção / Quantidade:</span>
                    <span className="font-medium text-[#111111]">
                      {appointment.colorFormula.oxidant.quantityOrRatio || '—'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Technical notes on the formula */}
            {appointment.colorFormula.technicalNotes && (
              <div className="text-xs text-[#292929] bg-[#F3F3F3] p-3 rounded-lg leading-relaxed">
                <strong className="text-[#111111] block mb-0.5">Observações da Aplicação:</strong>
                {appointment.colorFormula.technicalNotes}
              </div>
            )}
          </div>
        )}

        {/* TECHNICAL ASSESSMENT & RESULTS */}
        {appointment.assessment && Object.values(appointment.assessment).some(Boolean) && (
          <div className="p-4 rounded-xl border border-[#E5E5E5] bg-white space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#111111]" />
              Avaliação Técnica & Evolução
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {appointment.assessment.initialCondition && (
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5]">
                  <span className="text-[#777777] block text-[11px] font-semibold mb-1">
                    Condição Inicial do Cabelo:
                  </span>
                  <p className="text-[#292929] leading-relaxed">
                    {appointment.assessment.initialCondition}
                  </p>
                </div>
              )}

              {appointment.assessment.finalResult && (
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5]">
                  <span className="text-[#777777] block text-[11px] font-semibold mb-1">
                    Resultado Final:
                  </span>
                  <p className="text-[#292929] leading-relaxed font-medium">
                    {appointment.assessment.finalResult}
                  </p>
                </div>
              )}

              {appointment.assessment.relevantHistory && (
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5]">
                  <span className="text-[#777777] block text-[11px] font-semibold mb-1">
                    Histórico Técnico Relevante:
                  </span>
                  <p className="text-[#292929] leading-relaxed">
                    {appointment.assessment.relevantHistory}
                  </p>
                </div>
              )}

              {appointment.assessment.nextRecommendations && (
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5]">
                  <span className="text-[#777777] block text-[11px] font-semibold mb-1">
                    Recomendações para Próximo Atendimento:
                  </span>
                  <p className="text-[#292929] leading-relaxed font-medium">
                    {appointment.assessment.nextRecommendations}
                  </p>
                </div>
              )}
            </div>

            {appointment.assessment.professionalNotes && (
              <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-xs">
                <span className="text-[#777777] block text-[11px] font-semibold mb-1">
                  Observações do Profissional:
                </span>
                <p className="text-[#292929] leading-relaxed">
                  {appointment.assessment.professionalNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* General notes if any */}
        {appointment.generalNotes && (
          <div className="text-xs text-[#777777] p-3 rounded-lg border border-dashed border-[#E5E5E5]">
            <strong className="text-[#292929] block mb-0.5">Observações Gerais:</strong>
            {appointment.generalNotes}
          </div>
        )}

        {/* Modal footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg border border-[#E5E5E5] text-xs font-medium text-[#292929] hover:bg-[#F3F3F3] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ficha</span>
          </button>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(appointment);
                }}
                className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-[#111111] hover:bg-black text-white text-xs font-semibold transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar Atendimento</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-lg border border-[#E5E5E5] text-xs font-medium text-[#292929] hover:bg-[#F3F3F3] transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
