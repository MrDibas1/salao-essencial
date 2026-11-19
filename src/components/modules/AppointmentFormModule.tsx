import React, { useState, useRef, useEffect, useMemo } from 'react';
import type {
  Client,
  Appointment,
  Product,
  ProcedureType,
} from '../../types';
import type { NavigationTab } from '../common/Sidebar';
import { ClientAvatar } from '../common/ClientAvatar';
import {
  ArrowLeft,
  Check,
  Search,
  X,
  Phone,
  Plus,
  Package,
  Sparkles,
  Calendar,
  User,
  FlaskConical,
} from 'lucide-react';

interface AppointmentFormModuleProps {
  initialClientId?: string;
  appointmentToEdit?: Appointment | null;
  clients: Client[];
  products: Product[];
  onSave: (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  onNavigate: (tab: NavigationTab, params?: { clientId?: string; appointmentId?: string }) => void;
  onOpenNewClientModal: () => void;
}

const PROCEDURES: ProcedureType[] = [
  'Coloração',
  'Retoque de raiz',
  'Luzes',
  'Mechas',
  'Tonalização',
  'Hidratação',
  'Reconstrução',
  'Corte',
  'Escova',
  'Progressiva',
  'Outro',
];

const OX_SHORTCUTS = [
  '10 Vol',
  '20 Vol',
  '30 Vol',
  '40 Vol',
  'Proporção 1:1',
  'Proporção 1:1.5',
  'Proporção 1:2',
  '60g',
  '45g',
  '30g',
];

export const AppointmentFormModule: React.FC<AppointmentFormModuleProps> = ({
  initialClientId,
  appointmentToEdit,
  clients,
  products,
  onSave,
  onNavigate,
  onOpenNewClientModal,
}) => {
  // 1. Cliente
  const [selectedClientId, setSelectedClientId] = useState(
    appointmentToEdit?.clientId || initialClientId || ''
  );
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const clientSearchRef = useRef<HTMLDivElement>(null);

  const selectedClient = useMemo(() => {
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const filteredClients = useMemo(() => {
    if (!clientSearchQuery.trim()) return clients.slice(0, 8);
    const q = clientSearchQuery.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.whatsapp?.toLowerCase().includes(q)
    );
  }, [clients, clientSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (clientSearchRef.current && !clientSearchRef.current.contains(e.target as Node)) {
        setIsClientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. Dados do Atendimento
  const todayStr = new Date().toISOString().substring(0, 10);
  const [date, setDate] = useState(appointmentToEdit?.date || todayStr);
  const [professional, setProfessional] = useState(
    appointmentToEdit?.professional || 'Carolina Martins'
  );

  // 3. Serviço
  const [procedureType, setProcedureType] = useState<ProcedureType | string>(
    appointmentToEdit?.procedureType || 'Coloração'
  );
  const [customProcedureName, setCustomProcedureName] = useState(
    appointmentToEdit?.customProcedureName || ''
  );

  // 4. Produto
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    if (appointmentToEdit?.colorFormula?.products?.[0]?.id) {
      return appointmentToEdit.colorFormula.products[0].id;
    }
    return products[0]?.id || '';
  });
  const [customProductName, setCustomProductName] = useState('');

  // 5. Campo Único de Observação (Oxigenação & Quantidades)
  const [formulaNotes, setFormulaNotes] = useState<string>(() => {
    if (appointmentToEdit?.colorFormula?.technicalNotes) {
      return appointmentToEdit.colorFormula.technicalNotes;
    }
    if (appointmentToEdit?.generalNotes) {
      return appointmentToEdit.generalNotes;
    }
    return '';
  });

  const [formError, setFormError] = useState('');

  // Inserir atalho rápido no campo de texto
  const handleAddShortcut = (text: string) => {
    setFormulaNotes((prev) => {
      if (!prev.trim()) return text;
      return `${prev.trim()} + ${text}`;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClientId) {
      setFormError('Por favor, selecione uma cliente para registrar o atendimento.');
      return;
    }

    if (!selectedClient) {
      setFormError('Cliente não encontrada. Selecione novamente.');
      return;
    }

    if (!procedureType) {
      setFormError('Por favor, selecione o tipo de serviço realizado.');
      return;
    }

    setFormError('');

    // Localizar produto escolhido
    const chosenProduct = products.find((p) => p.id === selectedProductId);
    const prodName = chosenProduct ? chosenProduct.name : customProductName.trim();

    // Mapeamento retrocompatível completo
    onSave(
      {
        clientId: selectedClientId,
        clientName: selectedClient.name,
        date,
        professional: professional.trim() || 'Carolina Martins',
        procedureType,
        customProcedureName: procedureType === 'Outro' ? customProcedureName.trim() : undefined,
        description: prodName ? `Produto: ${prodName}` : undefined,
        generalNotes: formulaNotes.trim() || undefined,
        hasColorInfo: Boolean(chosenProduct || formulaNotes.trim()),
        colorFormula: (chosenProduct || formulaNotes.trim())
          ? {
              products: chosenProduct
                ? [
                    {
                      id: chosenProduct.id,
                      brand: chosenProduct.brand,
                      line: chosenProduct.line,
                      shadeNumber: chosenProduct.shadeNumber || '',
                      shadeName: chosenProduct.name,
                      quantity: '60g',
                      unit: chosenProduct.unit || 'g',
                      region: 'Cabelo completo',
                    },
                  ]
                : [],
              oxidant: {
                used: formulaNotes.toLowerCase().includes('vol') || formulaNotes.toLowerCase().includes('ox'),
                volume: formulaNotes.match(/\b(10|20|30|40)\s*vol\b/i)?.[0] || undefined,
                quantityOrRatio: formulaNotes.match(/\b1:[1-2](\.5)?\b/i)?.[0] || undefined,
              },
              technicalNotes: formulaNotes.trim(),
            }
          : undefined,
      },
      appointmentToEdit ? appointmentToEdit.id : undefined
    );

    // Navega para o perfil da cliente para ver o atendimento salvo
    onNavigate('client-detail', { clientId: selectedClientId });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Barra superior de navegação */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (selectedClientId) {
              onNavigate('client-detail', { clientId: selectedClientId });
            } else {
              onNavigate('dashboard');
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <span className="text-xs font-medium text-[#777777]">
          {appointmentToEdit ? 'Editar Atendimento' : 'Novo Registro de Atendimento'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center justify-between">
            <span>{formError}</span>
            <button type="button" onClick={() => setFormError('')}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASSO 1: CLIENTE EM DESTAQUE                                             */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sm:p-7 shadow-2xs space-y-4">
          <div className="border-b border-[#F0F0F0] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                1
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
                  Cliente do Atendimento
                </h3>
                <p className="text-xs text-[#777777]">Identificação da cliente para registro da ficha</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-bold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>Obrigatório</span>
            </span>
          </div>

          {selectedClient ? (
            /* Card da Cliente Selecionada */
            <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50/30 flex items-center justify-between gap-4 transition-all">
              <div className="flex items-center gap-3.5">
                <ClientAvatar
                  name={selectedClient.name}
                  avatarUrl={selectedClient.avatarUrl}
                  size="lg"
                  className="ring-2 ring-white shadow-xs"
                />
                <div>
                  <h4 className="text-base font-bold text-[#111111]">{selectedClient.name}</h4>
                  <p className="text-xs text-[#555555] flex items-center gap-1.5 mt-0.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-[#888888]" />
                    <span>{selectedClient.phone}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedClientId('');
                  setClientSearchQuery('');
                  setIsClientDropdownOpen(true);
                }}
                className="py-1.5 px-3 rounded-lg border border-[#D1D5DB] bg-white hover:bg-neutral-100 text-xs font-semibold text-[#111111] transition-colors shadow-2xs"
              >
                Trocar Cliente
              </button>
            </div>
          ) : (
            /* Campo de Busca Rápida de Cliente */
            <div className="relative" ref={clientSearchRef}>
              <div className="relative">
                <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquise o nome da cliente para selecionar..."
                  value={clientSearchQuery}
                  onFocus={() => setIsClientDropdownOpen(true)}
                  onChange={(e) => {
                    setClientSearchQuery(e.target.value);
                    setIsClientDropdownOpen(true);
                  }}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#D1D5DB] bg-white text-sm focus:outline-none focus:border-[#111111] shadow-2xs"
                />
              </div>

              {isClientDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-xl border border-[#D1D5DB] shadow-lg divide-y divide-[#F0F0F0] max-h-64 overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#777777] space-y-2">
                      <p>Nenhuma cliente encontrada.</p>
                      <button
                        type="button"
                        onClick={onOpenNewClientModal}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 underline"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Cadastrar agora</span>
                      </button>
                    </div>
                  ) : (
                    filteredClients.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedClientId(c.id);
                          setIsClientDropdownOpen(false);
                          setFormError('');
                        }}
                        className="p-3 flex items-center justify-between hover:bg-amber-50/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ClientAvatar name={c.name} avatarUrl={c.avatarUrl} size="sm" />
                          <div>
                            <p className="text-xs font-bold text-[#111111]">{c.name}</p>
                            <p className="text-[11px] text-[#777777]">{c.phone}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-amber-700">Selecionar</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Linha com Data e Profissional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                Data do Atendimento
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] bg-white text-xs font-medium focus:outline-none focus:border-[#111111] shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                Profissional Responsável
              </label>
              <input
                type="text"
                value={professional}
                onChange={(e) => setProfessional(e.target.value)}
                placeholder="Ex: Carolina Martins"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] bg-white text-xs font-medium focus:outline-none focus:border-[#111111] shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PASSO 2: SELEÇÃO SIMPLES DE SERVIÇO & PRODUTO                             */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sm:p-7 shadow-2xs space-y-5">
          <div className="border-b border-[#F0F0F0] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                2
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
                  Serviço & Produto Utilizado
                </h3>
                <p className="text-xs text-[#777777]">Selecione o procedimento e o produto aplicado</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-bold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>Obrigatório</span>
            </span>
          </div>

          {/* Seleção de Serviço por Botões Rápidos (1 Toque) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
              Tipo de Serviço Realizado <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PROCEDURES.map((proc) => {
                const isSelected = procedureType === proc;
                return (
                  <button
                    key={proc}
                    type="button"
                    onClick={() => setProcedureType(proc)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
                      isSelected
                        ? 'bg-[#111111] text-white ring-2 ring-[#111111] shadow-xs'
                        : 'bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#292929] border border-[#D1D5DB]'
                    }`}
                  >
                    {proc}
                  </button>
                );
              })}
            </div>

            {procedureType === 'Outro' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Especifique o procedimento (ex: Botox capilar, Penteado de noiva...)"
                  value={customProcedureName}
                  onChange={(e) => setCustomProcedureName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] bg-white text-xs focus:outline-none focus:border-[#111111] shadow-2xs"
                />
              </div>
            )}
          </div>

          {/* Seleção Simples de Produto do Catálogo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              Produto Principal do Catálogo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-[#D1D5DB] bg-white text-xs font-semibold text-[#111111] focus:outline-none focus:border-[#111111] shadow-2xs"
                >
                  <option value="">Nenhum produto cadastrado selecionado</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand}{p.shadeNumber ? ` • ${p.shadeNumber}` : ''})
                    </option>
                  ))}
                  <option value="custom">Outro produto não listado</option>
                </select>
              </div>

              {selectedProductId === 'custom' ? (
                <input
                  type="text"
                  placeholder="Nome da tinta ou produto usado..."
                  value={customProductName}
                  onChange={(e) => setCustomProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] bg-white text-xs focus:outline-none focus:border-[#111111] shadow-2xs"
                />
              ) : (
                /* Card de resumo do produto selecionado */
                (() => {
                  const prod = products.find((p) => p.id === selectedProductId);
                  if (!prod) return null;
                  return (
                    <div className="p-2.5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-center gap-3">
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-[#D1D5DB] shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-neutral-200 flex items-center justify-center text-neutral-500 shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#111111] truncate">{prod.name}</p>
                        <p className="text-[11px] text-[#777777]">{prod.brand} • {prod.category}</p>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PASSO 3: CAMPO ÚNICO DE OBSERVAÇÃO (QUANTIDADE & OXIGENAÇÃO)               */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border-2 border-amber-400/80 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="border-b border-[#F0F0F0] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                3
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
                  Quantidade & Volume de Oxigenação
                </h3>
                <p className="text-xs text-[#777777]">
                  Campo único de observações da fórmula e proporções da mistura
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <Sparkles className="w-3 h-3" />
              <span>Fórmula</span>
            </span>
          </div>

          {/* Atalhos Rápidos de Clique (1 toque para inserir volume/gramatura) */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block mb-1.5">
              Toque rápido para adicionar à anotação:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {OX_SHORTCUTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAddShortcut(item)}
                  className="py-1 px-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#111111] text-[11px] font-semibold border border-neutral-300 transition-all active:scale-95 shadow-2xs"
                >
                  +{item}
                </button>
              ))}
            </div>
          </div>

          {/* Campo Único de Texto */}
          <div>
            <textarea
              rows={4}
              value={formulaNotes}
              onChange={(e) => setFormulaNotes(e.target.value)}
              placeholder="Ex: 60g de tinta 7.1 + 60ml OX 20 vol (proporção 1:1), tempo de pausa 35 minutos na raiz."
              className="w-full p-4 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] focus:bg-white text-xs sm:text-sm focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] resize-none shadow-2xs leading-relaxed"
            />
            <p className="text-[11px] text-[#777777] mt-1.5">
              Este registro ficará gravado no perfil da cliente para consulta imediata no próximo retorno.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTÃO DE CONCLUSÃO                                                        */}
        {/* ========================================================================= */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-neutral-950 font-bold text-base shadow-lg hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
          >
            <Check className="w-5 h-5 text-neutral-950 group-hover:scale-110 transition-transform" />
            <span>SALVAR ATENDIMENTO</span>
          </button>
        </div>
      </form>
    </div>
  );
};
