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

  // Atendimentos apenas dessa cliente ordenados cronologicamente
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
      <div className="p-10 text-center bg-white rounded-2xl border border-[#EAE4DE] space-y-3">
        <h3 className="text-base font-semibold text-[#1F1D1B]">Cliente não encontrada</h3>
        <p className="text-xs text-[#736B65]">
          O registro solicitado pode ter sido excluído ou não existe.
        </p>
        <button
          onClick={() => onNavigate('clients')}
          className="min-h-[44px] inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#C87A14] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Clientes</span>
        </button>
      </div>
    );
  }

  // Cálculos do relacionamento
  const totalAppointments = clientAppointments.length;
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
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300 pb-32 sm:pb-12">
      {/* Navegação Superior */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('clients')}
          className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-medium text-[#736B65] hover:text-[#1F1D1B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Clientes</span>
        </button>

        <button
          onClick={() => onEditClient(client)}
          className="min-h-[44px] inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-[#EAE4DE] bg-white hover:bg-[#FAF8F6] text-xs font-medium text-[#1F1D1B] transition-all shadow-xs active:scale-[0.98]"
        >
          <Edit2 className="w-3.5 h-3.5 text-[#736B65]" />
          <span>Editar Cadastro</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* BANNER CTA: INICIAR NOVO ATENDIMENTO (Terracota Editorial)               */}
      {/* ========================================================================= */}
      <div className="bg-[#C87A14] rounded-2xl p-4 sm:p-6 text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold tracking-wide uppercase text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>Ficha Ativa</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
            Atendimento para {client.name}
          </h3>
          <p className="text-xs text-white/90">
            {lastAppointment
              ? `Último procedimento: ${lastAppointment.customProcedureName || lastAppointment.procedureType}`
              : 'Clique para registrar o primeiro atendimento desta cliente'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('appointment-form', { clientId: client.id })}
          className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white hover:bg-[#FAF8F6] text-[#8C530A] text-xs sm:text-sm font-semibold shadow-xs active:scale-[0.98] transition-all shrink-0"
        >
          <CalendarPlus className="w-4 h-4 text-[#C87A14]" />
          <span>+ Iniciar Atendimento</span>
        </button>
      </div>

      {/* CARTÃO DE IDENTIFICAÇÃO E CONTATO DA CLIENTE */}
      <div className="bg-white rounded-2xl border border-[#EAE4DE] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              onClick={() => onEditClient(client)}
              className="relative group cursor-pointer"
              title="Clique para alterar a foto"
            >
              <ClientAvatar
                name={client.name}
                avatarUrl={client.avatarUrl}
                size="xl"
                className="border-2 border-white ring-2 ring-[#EAE4DE] shadow-xs"
              />
              <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-[22px] font-semibold text-[#1F1D1B] tracking-tight">
                  {client.name}
                </h2>
                {client.status === 'archived' && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF8F6] border border-[#EAE4DE] text-[#736B65]">
                    Arquivada
                  </span>
                )}
              </div>
              <p className="text-xs text-[#736B65] mt-0.5 flex items-center gap-2 tabular-nums">
                <span>Desde {formattedCreatedAt}</span>
                {formattedBirthDate && (
                  <>
                    <span>•</span>
                    <span>Aniversário: {formattedBirthDate}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Ações de Contato Rápido */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <a
              href={`tel:${client.phone.replace(/\D/g, '')}`}
              className="min-h-[44px] flex-1 md:flex-initial inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE] text-xs font-medium text-[#1F1D1B] transition-colors active:scale-[0.98] tabular-nums"
            >
              <Phone className="w-3.5 h-3.5 text-[#736B65]" />
              <span>{client.phone}</span>
            </a>
            {client.whatsapp && (
              <a
                href={`https://wa.me/55${client.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex-1 md:flex-initial inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#EAE4DE] bg-white hover:bg-[#FAF8F6] text-xs font-medium text-[#1F1D1B] transition-colors active:scale-[0.98]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#2E7D5B]" />
                <span>WhatsApp</span>
              </a>
            )}
            {client.instagram && (
              <a
                href={`https://instagram.com/${client.instagram.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex-1 md:flex-initial inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#EAE4DE] bg-white hover:bg-[#FAF8F6] text-xs font-medium text-[#1F1D1B] transition-colors active:scale-[0.98]"
                title={`Abrir Instagram de ${client.name}`}
              >
                <svg className="w-3.5 h-3.5 text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>{client.instagram.startsWith('@') ? client.instagram : `@${client.instagram}`}</span>
              </a>
            )}
          </div>
        </div>

        {/* Resumo Rápido em Linha Limpa com Tabular-Nums */}
        <div className="px-4 py-3 sm:px-6 bg-[#FAF8F6] border-t border-[#EAE4DE] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-[#736B65]">Atendimentos:</span>
              <span className="font-semibold text-[#1F1D1B] tabular-nums">{totalAppointments}</span>
            </div>
            {lastAppointment && (
              <div className="flex items-center gap-1.5">
                <span className="text-[#736B65]">Último:</span>
                <span className="font-medium text-[#1F1D1B] tabular-nums">
                  {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(`${lastAppointment.date}T00:00:00`))}
                </span>
                <span className="text-[#736B65]/50">•</span>
                <span className="text-[#736B65]">{lastAppointment.procedureType}</span>
              </div>
            )}
          </div>

          {topProcedures.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-[#736B65]">Frequentes:</span>
              {topProcedures.map((proc, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-white border border-[#EAE4DE] text-[11px] font-medium text-[#8C530A] shadow-xs"
                >
                  {proc}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Nota / Preferências da Cliente */}
        {client.notes && (
          <div className="px-4 py-3 sm:px-6 bg-[#FAF8F6]/60 border-t border-[#EAE4DE] text-xs flex items-start gap-2">
            <span className="font-semibold text-[#8C530A] shrink-0">Nota:</span>
            <p className="text-[#736B65] leading-relaxed">
              {client.notes}
            </p>
          </div>
        )}
      </div>

      {/* LINHA DO TEMPO DE ATENDIMENTOS & FÓRMULAS CONFORME DESIGN.MD */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#1F1D1B]">Histórico de Atendimentos</h3>
            <p className="text-xs text-[#736B65]">
              Procedimentos, fórmulas químicas e resultados
            </p>
          </div>
          <button
            onClick={() => onNavigate('appointment-form', { clientId: client.id })}
            className="min-h-[40px] inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE] text-[#8C530A] text-xs font-semibold hover:bg-[#FDF3E7] transition-colors active:scale-[0.98]"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-[#C87A14]" />
            <span>+ Adicionar</span>
          </button>
        </div>

        {clientAppointments.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-[#EAE4DE] space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center mx-auto">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-[#1F1D1B]">Nenhum atendimento registrado</h4>
            <p className="text-xs text-[#736B65] max-w-sm mx-auto">
              Adicione o primeiro procedimento desta cliente para registrar suas fórmulas técnicas de coloração.
            </p>
            <button
              onClick={() => onNavigate('appointment-form', { clientId: client.id })}
              className="mt-1 min-h-[44px] inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#C87A14] text-white text-xs font-semibold active:scale-[0.98]"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Registrar primeiro atendimento</span>
            </button>
          </div>
        ) : (
          <div className="relative border-l-2 border-[#EAE4DE] ml-4 sm:ml-5 space-y-5 pt-1">
            {clientAppointments.map((apt, index) => {
              const formattedDate = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }).format(new Date(`${apt.date}T00:00:00`));

              const isMostRecent = index === 0;

              return (
                <div key={apt.id} className="relative pl-5 sm:pl-7 group">
                  {/* Ponto da Timeline */}
                  <div
                    className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 border-white transition-all ${
                      isMostRecent
                        ? 'bg-[#C87A14] ring-4 ring-[#FDF3E7]'
                        : 'bg-[#D9D0C7] group-hover:bg-[#C87A14]'
                    }`}
                  />

                  {/* Card do Atendimento */}
                  <div
                    onClick={() => onViewAppointmentDetails(apt)}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE4DE] shadow-xs hover:border-[#C87A14]/60 transition-all cursor-pointer space-y-3 active:scale-[0.99]"
                  >
                    {/* Linha do Cabeçalho */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE4DE]/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-[#1F1D1B] tabular-nums">
                          {formattedDate}
                        </span>
                        {isMostRecent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDF3E7] text-[#8C530A] border border-[#EAE4DE]">
                            Mais recente
                          </span>
                        )}
                        <ProcedureBadge
                          procedure={apt.procedureType}
                          customName={apt.customProcedureName}
                          size="md"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#736B65]">
                        <span>Profissional: <strong className="text-[#1F1D1B] font-medium">{apt.professional}</strong></span>
                        <ChevronRight className="w-4 h-4 text-[#736B65] group-hover:text-[#1F1D1B] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>

                    {/* Descrição do Procedimento */}
                    {apt.description && (
                      <p className="text-xs sm:text-sm text-[#736B65] leading-relaxed">
                        {apt.description}
                      </p>
                    )}

                    {/* FOTOS DE ANTES E DEPOIS DO ATENDIMENTO */}
                    {(apt.beforePhotoUrl || apt.afterPhotoUrl) && (
                      <div className="flex items-center gap-2.5 pt-1">
                        {apt.beforePhotoUrl && (
                          <div className="relative w-16 sm:w-20 h-12 sm:h-14 rounded-lg overflow-hidden border border-[#EAE4DE] shrink-0 bg-black/5 shadow-xs">
                            <img src={apt.beforePhotoUrl} alt="Antes" className="w-full h-full object-cover" />
                            <span className="absolute bottom-0.5 left-0.5 px-1.5 py-0.2 rounded text-[8px] font-bold bg-black/60 text-white leading-tight backdrop-blur-xs">
                              Antes
                            </span>
                          </div>
                        )}
                        {apt.afterPhotoUrl && (
                          <div className="relative w-16 sm:w-20 h-12 sm:h-14 rounded-lg overflow-hidden border border-[#C87A14]/40 shrink-0 bg-black/5 shadow-xs">
                            <img src={apt.afterPhotoUrl} alt="Depois" className="w-full h-full object-cover" />
                            <span className="absolute bottom-0.5 left-0.5 px-1.5 py-0.2 rounded text-[8px] font-bold bg-[#C87A14] text-white leading-tight shadow-xs">
                              Depois
                            </span>
                          </div>
                        )}
                        <span className="text-[11px] text-[#8C530A] font-medium flex items-center gap-1">
                          <span>📸 Fotos do atendimento</span>
                        </span>
                      </div>
                    )}

                    {/* BLOCO DE DESTAQUE VISUAL DA FÓRMULA (Regra do DESIGN.md: bloco #FAF8F6 com borda #EAE4DE) */}
                    {apt.hasColorInfo && apt.colorFormula && (
                      <div className="p-3.5 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE] space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#8C530A] flex items-center gap-1.5 text-[11px]">
                            <FlaskConical className="w-3.5 h-3.5 text-[#C87A14]" />
                            Fórmula Utilizada
                          </span>
                          {apt.colorFormula.pauseTime && (
                            <span className="text-[#736B65] flex items-center gap-1 text-[11px] tabular-nums">
                              <Clock className="w-3 h-3 text-[#736B65]" />
                              Pausa: <strong className="text-[#1F1D1B]">{apt.colorFormula.pauseTime}</strong>
                            </span>
                          )}
                        </div>

                        {/* Tintas e Gramaturas com Tabular-Nums */}
                        <div className="flex flex-wrap gap-1.5">
                          {apt.colorFormula.products.map((prod, pIdx) => {
                            const tone = getHairToneColor(prod.shadeNumber);
                            return (
                              <div
                                key={pIdx}
                                className="px-2.5 py-1 rounded-lg bg-white border border-[#EAE4DE] text-xs flex items-center gap-1.5 shadow-xs"
                              >
                                {tone && (
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                                    style={{ backgroundColor: tone.bg, border: `1px solid ${tone.border}` }}
                                    title={`${tone.name} (${prod.shadeNumber})`}
                                  />
                                )}
                                <span className="font-semibold text-[#1F1D1B]">
                                  {prod.brand || prod.shadeNumber}
                                </span>
                                {prod.shadeName && prod.shadeName !== prod.brand && prod.shadeName !== prod.shadeNumber && (
                                  <span className="text-[#736B65] text-[11px]">{prod.shadeName}</span>
                                )}
                                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#FAF8F6] border border-[#EAE4DE]/60 text-[#1F1D1B] tabular-nums font-semibold">
                                  {prod.quantity}
                                </span>
                                {prod.region && (
                                  <span className="text-[10px] text-[#736B65] border-l border-[#EAE4DE] pl-1.5">
                                    {prod.region}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Oxidante */}
                        {apt.colorFormula.oxidant?.used && (
                          <div className="text-[11px] text-[#736B65] pt-0.5 flex items-center gap-3 tabular-nums">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3 text-[#C87A14]" />
                              Oxidante: <strong className="text-[#1F1D1B] font-semibold">{apt.colorFormula.oxidant.volume || '—'}</strong>
                            </span>
                            {apt.colorFormula.oxidant.quantityOrRatio && (
                              <span>Proporção: <strong className="text-[#1F1D1B] font-semibold">{apt.colorFormula.oxidant.quantityOrRatio}</strong></span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Resultado / Avaliação */}
                    {apt.assessment?.finalResult && (
                      <div className="text-xs text-[#736B65] flex items-start gap-1.5 pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#1F1D1B] font-medium">Resultado:</strong> {apt.assessment.finalResult}
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
