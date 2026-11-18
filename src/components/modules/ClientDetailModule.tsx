import React, { useMemo } from 'react';
import type { Client, Appointment } from '../../types';
import type { NavigationTab } from '../common/Sidebar';
import { ClientAvatar } from '../common/ClientAvatar';
import { ProcedureBadge } from '../common/ProcedureBadge';
import { getHairToneColor } from '../../utils/hairColor';
import {
  ArrowLeft,
  CalendarPlus,
  Phone,
  MessageSquare,
  Calendar,
  FlaskConical,
  Edit2,
  Clock,
  Layers,
  CheckCircle2,
  ChevronRight,
  Camera,
} from 'lucide-react';

interface ClientDetailModuleProps {
  clientId: string;
  clients: Client[];
  appointments: Appointment[];
  onNavigate: (tab: NavigationTab, params?: { clientId?: string; appointmentId?: string }) => void;
  onEditClient: (client: Client) => void;
  onViewAppointmentDetails: (appointment: Appointment) => void;
}

export const ClientDetailModule: React.FC<ClientDetailModuleProps> = ({
  clientId,
  clients,
  appointments,
  onNavigate,
  onEditClient,
  onViewAppointmentDetails,
}) => {
  const client = clients.find((c) => c.id === clientId);

  // Atendimentos apenas dessa cliente ordenados cronologicamente do mais recente para o mais antigo
  const clientAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.clientId === clientId)
      .sort((a, b) => {
        const timeA = new Date(`${a.date}T00:00:00`).getTime();
        const timeB = new Date(`${b.date}T00:00:00`).getTime();
        if (timeA !== timeB) return timeB - timeA;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [appointments, clientId]);

  if (!client) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E5E5] space-y-4">
        <h3 className="text-lg font-bold text-[#111111]">Cliente não encontrada</h3>
        <p className="text-xs text-[#777777]">
          O registro solicitado pode ter sido excluído ou não existe.
        </p>
        <button
          onClick={() => onNavigate('clients')}
          className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#111111] text-white text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Clientes</span>
        </button>
      </div>
    );
  }

  // Cálculos do resumo do relacionamento
  const totalAppointments = clientAppointments.length;
  const firstAppointment = clientAppointments[clientAppointments.length - 1];
  const lastAppointment = clientAppointments[0];

  const formattedCreatedAt = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(client.createdAt));

  const formattedBirthDate = client.birthDate
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
      }).format(new Date(`${client.birthDate}T00:00:00`))
    : null;

  // Procedimentos mais frequentes
  const procedureCounts: { [key: string]: number } = {};
  clientAppointments.forEach((apt) => {
    const key =
      apt.procedureType === 'Outro' && apt.customProcedureName
        ? apt.customProcedureName
        : apt.procedureType;
    procedureCounts[key] = (procedureCounts[key] || 0) + 1;
  });

  const topProcedures = Object.entries(procedureCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('clients')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Listagem de Clientes</span>
        </button>

        {/* Highlighted NOVO ATENDIMENTO button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEditClient(client)}
            className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F3F3F3] text-xs font-semibold text-[#292929] transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editar Cadastro</span>
          </button>

          <button
            onClick={() => onNavigate('appointment-form', { clientId: client.id })}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-md group"
          >
            <CalendarPlus className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>NOVO ATENDIMENTO</span>
          </button>
        </div>
      </div>

      {/* CLIENT HEADER & PROFILE OVERVIEW */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-2xs overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#F3F3F3]">
          <div className="flex items-center gap-4">
            <div
              onClick={() => onEditClient(client)}
              className="relative group cursor-pointer"
              title="Clique para alterar a foto de perfil"
            >
              <ClientAvatar
                name={client.name}
                avatarUrl={client.avatarUrl}
                size="xl"
                className="border-2 border-white ring-2 ring-[#E5E5E5] shadow-sm transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                  {client.name}
                </h2>
                {client.status === 'archived' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E5E5E5] text-[#777777]">
                    Arquivada
                  </span>
                )}
              </div>
              <p className="text-xs text-[#777777] mt-1 flex items-center gap-2">
                <span>Cliente desde {formattedCreatedAt}</span>
                {formattedBirthDate && (
                  <>
                    <span>•</span>
                    <span>Aniversário: {formattedBirthDate}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Contact Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <a
              href={`tel:${client.phone.replace(/\D/g, '')}`}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-[#F3F3F3] hover:bg-[#E5E5E5] text-xs font-medium text-[#111111] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#777777]" />
              <span>{client.phone}</span>
            </a>
            {client.whatsapp && (
              <a
                href={`https://wa.me/55${client.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl border border-[#E5E5E5] hover:bg-[#F3F3F3] text-xs font-medium text-[#111111] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Summary Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#E5E5E5] bg-[#FAFAFA] text-xs">
          <div className="p-4 sm:p-5">
            <span className="text-[#777777] block text-[11px] uppercase tracking-wider font-semibold">
              Total de Atendimentos
            </span>
            <span className="text-2xl font-bold font-mono text-[#111111] mt-1 block">
              {totalAppointments}
            </span>
            <span className="text-[10px] text-[#777777]">procedimentos realizados</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[#777777] block text-[11px] uppercase tracking-wider font-semibold">
              Primeiro Atendimento
            </span>
            <span className="text-sm font-semibold text-[#111111] mt-1.5 block">
              {firstAppointment
                ? new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(`${firstAppointment.date}T00:00:00`))
                : '—'}
            </span>
            <span className="text-[10px] text-[#777777]">
              {firstAppointment ? firstAppointment.procedureType : 'Nenhum'}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[#777777] block text-[11px] uppercase tracking-wider font-semibold">
              Último Atendimento
            </span>
            <span className="text-sm font-semibold text-[#111111] mt-1.5 block">
              {lastAppointment
                ? new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(`${lastAppointment.date}T00:00:00`))
                : '—'}
            </span>
            <span className="text-[10px] text-[#777777]">
              {lastAppointment ? lastAppointment.procedureType : 'Nenhum'}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[#777777] block text-[11px] uppercase tracking-wider font-semibold">
              Procedimentos Recentes
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {topProcedures.length > 0 ? (
                topProcedures.map((proc, i) => (
                  <span
                    key={i}
                    className="inline-block px-2 py-0.5 rounded bg-white border border-[#E5E5E5] text-[10px] font-medium text-[#111111]"
                  >
                    {proc}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-[#777777] italic">—</span>
              )}
            </div>
          </div>
        </div>

        {/* General Client Notes */}
        {client.notes && (
          <div className="p-5 sm:p-6 bg-white border-t border-[#E5E5E5] text-xs">
            <span className="text-[#777777] uppercase text-[10px] font-bold tracking-wider block mb-1">
              Observações Gerais & Preferências da Cliente:
            </span>
            <p className="text-[#292929] leading-relaxed bg-[#FAFAFA] p-3.5 rounded-xl border border-[#E5E5E5]">
              {client.notes}
            </p>
          </div>
        )}
      </div>

      {/* TIMELINE OF APPOINTMENTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#111111]">Linha do Tempo de Atendimentos</h3>
            <p className="text-xs text-[#777777]">
              Histórico cronológico detalhado de procedimentos, fórmulas e resultados
            </p>
          </div>
          <button
            onClick={() => onNavigate('appointment-form', { clientId: client.id })}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#111111] text-white text-xs font-semibold hover:bg-[#292929] transition-colors"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Adicionar Atendimento</span>
          </button>
        </div>

        {clientAppointments.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#E5E5E5] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F3F3F3] text-[#777777] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-[#111111]">Nenhum atendimento registrado</h4>
            <p className="text-xs text-[#777777] max-w-sm mx-auto">
              Esta cliente ainda não possui procedimentos registrados. Clique no botão abaixo para
              adicionar o primeiro atendimento com suas fórmulas de coloração.
            </p>
            <button
              onClick={() => onNavigate('appointment-form', { clientId: client.id })}
              className="mt-2 inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#111111] text-white text-xs font-semibold"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Registrar Primeiro Atendimento</span>
            </button>
          </div>
        ) : (
          <div className="relative border-l-2 border-[#E5E5E5] ml-4 sm:ml-6 space-y-6 pt-2 pb-6">
            {clientAppointments.map((apt, index) => {
              const formattedDate = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }).format(new Date(`${apt.date}T00:00:00`));

              const isMostRecent = index === 0;

              return (
                <div key={apt.id} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white transition-all ${
                      isMostRecent
                        ? 'bg-[#111111] ring-4 ring-[#111111]/10'
                        : 'bg-[#777777] group-hover:bg-[#111111]'
                    }`}
                  />

                  {/* Appointment Card */}
                  <div
                    onClick={() => onViewAppointmentDetails(apt)}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs hover:border-[#111111] hover:shadow-xs transition-all cursor-pointer space-y-4"
                  >
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F3F3F3] pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-xs sm:text-sm text-[#111111]">
                          {formattedDate}
                        </span>
                        {isMostRecent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#111111] text-white">
                            Mais recente
                          </span>
                        )}
                        <ProcedureBadge
                          procedure={apt.procedureType}
                          customName={apt.customProcedureName}
                          size="md"
                        />
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#777777]">
                        <span>Profissional: <strong className="text-[#292929]">{apt.professional}</strong></span>
                        <ChevronRight className="w-4 h-4 text-[#777777] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>

                    {/* Service description */}
                    {apt.description && (
                      <p className="text-xs sm:text-sm text-[#292929] leading-relaxed">
                        {apt.description}
                      </p>
                    )}

                    {/* COLOR FORMULA HIGHLIGHT */}
                    {apt.hasColorInfo && apt.colorFormula && (
                      <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                            <FlaskConical className="w-3.5 h-3.5" />
                            Fórmula Utilizada
                          </span>
                          {apt.colorFormula.pauseTime && (
                            <span className="text-[#777777] flex items-center gap-1 text-[11px]">
                              <Clock className="w-3 h-3" />
                              Pausa: <strong className="text-[#111111]">{apt.colorFormula.pauseTime}</strong>
                            </span>
                          )}
                        </div>

                        {/* Tintas */}
                        <div className="flex flex-wrap gap-2">
                          {apt.colorFormula.products.map((prod, pIdx) => {
                            const tone = getHairToneColor(prod.shadeNumber);
                            return (
                              <div
                                key={pIdx}
                                className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E5E5] text-xs flex items-center gap-2 shadow-2xs"
                              >
                                {tone && (
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                                    style={{ backgroundColor: tone.bg, border: `1px solid ${tone.border}` }}
                                    title={`${tone.name} (${prod.shadeNumber})`}
                                  />
                                )}
                                <span className="font-mono font-bold text-[#111111]">
                                  {prod.shadeNumber}
                                </span>
                                {prod.shadeName && (
                                  <span className="text-[#777777]">{prod.shadeName}</span>
                                )}
                                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#F3F3F3] text-[#292929]">
                                  {prod.quantity}
                                </span>
                                {prod.region && (
                                  <span className="text-[10px] text-[#777777] border-l border-[#E5E5E5] pl-1.5">
                                    {prod.region}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Oxidante */}
                        {apt.colorFormula.oxidant?.used && (
                          <div className="text-[11px] text-[#777777] pt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              Oxidante: <strong className="text-[#292929]">{apt.colorFormula.oxidant.volume || '—'}</strong>
                            </span>
                            {apt.colorFormula.oxidant.quantityOrRatio && (
                              <span>Proporção: <strong className="text-[#292929]">{apt.colorFormula.oxidant.quantityOrRatio}</strong></span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Result and notes preview */}
                    {apt.assessment?.finalResult && (
                      <div className="text-xs text-[#292929] flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#111111]">Resultado:</strong> {apt.assessment.finalResult}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
