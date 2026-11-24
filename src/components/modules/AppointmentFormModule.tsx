import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Client, Product, Appointment } from '../../types';
import type { NavigationTab } from '../common/Sidebar';
import { ClientAvatar } from '../common/ClientAvatar';
import {
  ArrowLeft,
  Check,
  Search,
  Plus,
  Phone,
  Package,
  X,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { compressImageFile, estimateDataUrlSizeKb } from '../../utils/imageOptimizer';
import { DateInput } from '../ui/DateInput';

interface AppointmentFormModuleProps {
  clients: Client[];
  products: Product[];
  appointmentToEdit?: Appointment | null;
  initialClientId?: string;
  preselectedClientId?: string;
  onSave?: (
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => void;
  onSaveAppointment?: (
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => void;
  onNavigate: (tab: NavigationTab, params?: { clientId?: string; appointmentId?: string }) => void;
  onOpenNewClientModal: () => void;
}

const PROCEDURES = [
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
  clients,
  products,
  appointmentToEdit,
  initialClientId,
  preselectedClientId,
  onSave,
  onSaveAppointment,
  onNavigate,
  onOpenNewClientModal,
}) => {
  const saveFn = onSave || onSaveAppointment;
  const clientIdInit = preselectedClientId || initialClientId || '';

  // 1. Cliente Selecionada
  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    if (appointmentToEdit) return appointmentToEdit.clientId;
    return clientIdInit;
  });

  // Busca e dropdown de clientes
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const clientSearchRef = useRef<HTMLDivElement>(null);

  // 2. Dados Gerais do Procedimento
  const [date, setDate] = useState<string>(() => {
    if (appointmentToEdit) return appointmentToEdit.date;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [professional, setProfessional] = useState<string>(() => {
    return appointmentToEdit?.professional || 'Clarice Dalla Costa';
  });

  const [procedureType, setProcedureType] = useState<string>(() => {
    return appointmentToEdit?.procedureType || 'Coloração';
  });

  const [customProcedureName, setCustomProcedureName] = useState<string>(() => {
    return appointmentToEdit?.customProcedureName || '';
  });

  // 3. Tintas / Marcas Utilizadas do Catálogo
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(() => {
    if (appointmentToEdit?.colorFormula?.products?.length) {
      const ids: string[] = [];
      for (const item of appointmentToEdit.colorFormula.products) {
        const found = products.find(
          (p) =>
            p.id === item.id ||
            p.name.toLowerCase() === item.brand?.toLowerCase() ||
            p.name.toLowerCase() === item.shadeNumber?.toLowerCase()
        );
        if (found && !ids.includes(found.id)) ids.push(found.id);
      }
      if (ids.length > 0) return ids;
    }
    return [];
  });

  const [customProductName, setCustomProductName] = useState<string>('');

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // 4. Campo Único de Observação (Quantidade, Volumes de OX e Proporções)
  const [formulaNotes, setFormulaNotes] = useState<string>(() => {
    if (appointmentToEdit?.colorFormula) {
      const parts: string[] = [];
      const prod = appointmentToEdit.colorFormula.products?.[0];
      if (prod) {
        parts.push(`${prod.quantity || '60g'} de tinta ${prod.shadeNumber || ''}`);
      }
      if (appointmentToEdit.colorFormula.oxidant?.used) {
        const ox = appointmentToEdit.colorFormula.oxidant;
        parts.push(`OX ${ox.volume || '20 vol'} (${ox.quantityOrRatio || '1:1'})`);
      }
      if (appointmentToEdit.colorFormula.technicalNotes) {
        parts.push(appointmentToEdit.colorFormula.technicalNotes);
      }
      return parts.join(' + ') || appointmentToEdit.generalNotes || '';
    }
    return appointmentToEdit?.generalNotes || '';
  });

  const [formError, setFormError] = useState<string>('');

  // 5. Fotos de Antes e Depois
  const [beforePhotoUrl, setBeforePhotoUrl] = useState<string>(() => appointmentToEdit?.beforePhotoUrl || '');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string>(() => appointmentToEdit?.afterPhotoUrl || '');
  const [isProcessingBefore, setIsProcessingBefore] = useState<boolean>(false);
  const [isProcessingAfter, setIsProcessingAfter] = useState<boolean>(false);

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'before') {
      setIsProcessingBefore(true);
    } else {
      setIsProcessingAfter(true);
    }

    try {
      const compressed = await compressImageFile(file, { maxDimension: 1024, quality: 0.82 });
      if (type === 'before') {
        setBeforePhotoUrl(compressed);
      } else {
        setAfterPhotoUrl(compressed);
      }
    } catch (err) {
      console.error('Erro ao processar foto:', err);
      setFormError('Não foi possível carregar a imagem. Tente novamente.');
    } finally {
      if (type === 'before') {
        setIsProcessingBefore(false);
      } else {
        setIsProcessingAfter(false);
      }
      e.target.value = '';
    }
  };

  // Sincronizar preselectedClientId se alterar
  useEffect(() => {
    if (preselectedClientId) {
      setSelectedClientId(preselectedClientId);
    }
  }, [preselectedClientId]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientSearchRef.current && !clientSearchRef.current.contains(event.target as Node)) {
        setIsClientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedClient = useMemo(() => {
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const filteredClients = useMemo(() => {
    if (!clientSearchQuery.trim()) return clients.slice(0, 8);
    const q = clientSearchQuery.toLowerCase().trim();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.whatsapp?.toLowerCase().includes(q)
    );
  }, [clients, clientSearchQuery]);

  // Atalho de 1 clique para inserir volumes ou medidas no campo
  const handleAddShortcut = (textToAdd: string) => {
    setFormulaNotes((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return textToAdd;
      if (trimmed.endsWith('+') || trimmed.endsWith(',')) {
        return `${trimmed} ${textToAdd}`;
      }
      return `${trimmed} + ${textToAdd}`;
    });
  };

  // Submissão do Formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedClientId) {
      setFormError('Selecione uma cliente para salvar o atendimento.');
      return;
    }
    if (!selectedClient) {
      setFormError('Cliente não encontrada. Selecione novamente.');
      return;
    }
    if (!date) {
      setFormError('Informe a data do atendimento.');
      return;
    }
    if (!procedureType) {
      setFormError('Selecione o tipo de serviço realizado.');
      return;
    }

    // Identificar marcas/tintas selecionadas
    const chosenProducts = products.filter((p) => selectedProductIds.includes(p.id));
    const allDyeNames: string[] = chosenProducts.map((p) => p.name);
    if (selectedProductIds.includes('custom') && customProductName.trim()) {
      allDyeNames.push(customProductName.trim());
    }
    const dyeSummary = allDyeNames.join(' + ');

    const appointmentPayload: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
      clientId: selectedClientId,
      clientName: selectedClient.name,
      date,
      professional: professional.trim() || 'Clarice Dalla Costa',
      procedureType,
      customProcedureName: procedureType === 'Outro' ? customProcedureName.trim() : undefined,
      description: `${procedureType}${dyeSummary ? ` com ${dyeSummary}` : ''}`,
      generalNotes: formulaNotes.trim() || undefined,
      hasColorInfo: Boolean(allDyeNames.length > 0 || formulaNotes.trim()),
      colorFormula: (allDyeNames.length > 0 || formulaNotes.trim())
        ? {
            products: allDyeNames.map((dyeName, idx) => ({
              id: chosenProducts[idx]?.id || `dye-${Date.now()}-${idx}`,
              brand: dyeName,
              line: '',
              shadeNumber: dyeName,
              shadeName: dyeName,
              quantity: formulaNotes.match(/\b\d+g\b/i)?.[0] || '60g',
              unit: 'g',
              region: 'Cabelo completo',
            })),
            oxidant: {
              used: formulaNotes.toLowerCase().includes('vol') || formulaNotes.toLowerCase().includes('ox'),
              volume: formulaNotes.match(/\b(10|20|30|40)\s*vol\b/i)?.[0] || undefined,
              quantityOrRatio: formulaNotes.match(/\b1:[1-2](\.5)?\b/i)?.[0] || undefined,
            },
            technicalNotes: formulaNotes.trim(),
          }
        : undefined,
      beforePhotoUrl: beforePhotoUrl.trim() || undefined,
      afterPhotoUrl: afterPhotoUrl.trim() || undefined,
      photoUrls: [beforePhotoUrl.trim(), afterPhotoUrl.trim()].filter(Boolean),
    };

    if (saveFn) {
      saveFn(appointmentPayload, appointmentToEdit ? appointmentToEdit.id : undefined);
    }
    onNavigate('client-detail', { clientId: selectedClientId });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300 pb-32 sm:pb-12 max-w-3xl mx-auto">
      {/* Barra de Voltar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (selectedClientId) {
              onNavigate('client-detail', { clientId: selectedClientId });
            } else {
              onNavigate('clients');
            }
          }}
          className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-medium text-[#736B65] hover:text-[#1F1D1B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <span className="text-xs font-medium text-[#736B65]">
          {appointmentToEdit ? 'Editar Atendimento' : 'Novo Atendimento'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {formError && (
          <div className="p-3.5 rounded-xl bg-[#FCECEC] border border-[#C94A4A]/30 text-[#C94A4A] text-xs font-medium flex items-center justify-between">
            <span>{formError}</span>
            <button type="button" onClick={() => setFormError('')}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASSO 1: CLIENTE EM DESTAQUE                                             */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#EAE4DE] p-4 sm:p-6 shadow-xs space-y-3.5">
          <div className="border-b border-[#EAE4DE]/60 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center font-semibold text-xs shrink-0">
                1
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#1F1D1B] tracking-tight">
                  Cliente
                </h3>
                <p className="text-xs text-[#736B65]">Identificação para gravação da ficha</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FDF3E7] text-[#8C530A] border border-[#EAE4DE] text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C87A14]" />
              <span>Obrigatório</span>
            </span>
          </div>

          {selectedClient ? (
            /* Card da Cliente Selecionada */
            <div className="p-3.5 rounded-xl border border-[#C87A14]/40 bg-[#FAF8F6] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ClientAvatar
                  name={selectedClient.name}
                  avatarUrl={selectedClient.avatarUrl}
                  size="lg"
                  className="ring-2 ring-white shadow-xs"
                />
                <div>
                  <h4 className="text-base font-semibold text-[#1F1D1B]">{selectedClient.name}</h4>
                  <p className="text-xs text-[#736B65] flex items-center gap-1 mt-0.5 tabular-nums">
                    <Phone className="w-3.5 h-3.5 text-[#736B65]/70" />
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
                className="min-h-[36px] py-1.5 px-3 rounded-xl border border-[#EAE4DE] bg-white hover:bg-[#FAF8F6] text-xs font-medium text-[#1F1D1B] transition-colors shadow-xs active:scale-[0.98]"
              >
                Trocar
              </button>
            </div>
          ) : (
            /* Campo de Busca Rápida de Cliente */
            <div className="relative" ref={clientSearchRef}>
              <div className="relative">
                <Search className="w-4 h-4 text-[#736B65] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquise o nome da cliente para selecionar..."
                  value={clientSearchQuery}
                  onFocus={() => setIsClientDropdownOpen(true)}
                  onChange={(e) => {
                    setClientSearchQuery(e.target.value);
                    setIsClientDropdownOpen(true);
                  }}
                  className="w-full min-h-[44px] pl-10 pr-10 py-2.5 rounded-xl border border-[#EAE4DE] bg-[#FAF8F6] focus:bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] shadow-xs"
                />
              </div>

              {isClientDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-2xl border border-[#EAE4DE] shadow-lg divide-y divide-[#EAE4DE]/60 max-h-60 overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#736B65] space-y-2">
                      <p>Nenhuma cliente encontrada.</p>
                      <button
                        type="button"
                        onClick={onOpenNewClientModal}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#C87A14] hover:underline"
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
                        className="p-3 flex items-center justify-between hover:bg-[#FAF8F6] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <ClientAvatar name={c.name} avatarUrl={c.avatarUrl} size="sm" />
                          <div>
                            <p className="text-xs font-semibold text-[#1F1D1B]">{c.name}</p>
                            <p className="text-[11px] text-[#736B65] tabular-nums">{c.phone}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#C87A14]">Selecionar</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Linha com Data e Profissional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-[#736B65] mb-1">
                Data do Atendimento
              </label>
              <DateInput
                value={date}
                onChange={(newDate) => setDate(newDate)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#736B65] mb-1">
                Profissional Responsável
              </label>
              <input
                type="text"
                value={professional}
                onChange={(e) => setProfessional(e.target.value)}
                placeholder="Ex: Clarice Dalla Costa"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PASSO 2: SELEÇÃO SIMPLES DE SERVIÇO & PRODUTO                             */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#EAE4DE] p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-[#EAE4DE]/60 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center font-semibold text-xs shrink-0">
                2
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#1F1D1B] tracking-tight">
                  Serviço e Produto
                </h3>
                <p className="text-xs text-[#736B65]">Procedimento e tinta aplicada</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FDF3E7] text-[#8C530A] border border-[#EAE4DE] text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C87A14]" />
              <span>Obrigatório</span>
            </span>
          </div>

          {/* Seleção de Serviço por Chips de 1 Toque */}
          <div>
            <label className="block text-xs font-medium text-[#736B65] mb-2">
              Tipo de Procedimento
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PROCEDURES.map((proc) => {
                const isSelected = procedureType === proc;
                return (
                  <button
                    key={proc}
                    type="button"
                    onClick={() => setProcedureType(proc)}
                    className={`min-h-[40px] py-2 px-3.5 rounded-xl text-xs transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#FDF3E7] text-[#8C530A] border border-[#C87A14] font-semibold shadow-xs'
                        : 'bg-white hover:bg-[#FAF8F6] text-[#736B65] border border-[#EAE4DE]'
                    }`}
                  >
                    {proc}
                  </button>
                );
              })}
            </div>

            {procedureType === 'Outro' && (
              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="Nome do procedimento (ex: Botox capilar...)"
                  value={customProcedureName}
                  onChange={(e) => setCustomProcedureName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] shadow-xs"
                />
              </div>
            )}
          </div>

          {/* Seleção de Tintas / Marcas Utilizadas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#1F1D1B]">
                Tintas Utilizadas nesta Cliente
              </label>
              <span className="text-[11px] text-[#736B65]">
                {selectedProductIds.length === 0
                  ? 'Toque para selecionar a(s) marca(s)'
                  : `${selectedProductIds.length} selecionada(s)`}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {products.map((p) => {
                const isSelected = selectedProductIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProduct(p.id)}
                    className={`min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#FDF3E7] text-[#8C530A] border-2 border-[#C87A14] font-semibold shadow-xs'
                        : 'bg-white hover:bg-[#FAF8F6] text-[#1F1D1B] border border-[#EAE4DE]'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 text-[#C87A14]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#EAE4DE]" />
                    )}
                    <span>{p.name}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => toggleProduct('custom')}
                className={`min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2 ${
                  selectedProductIds.includes('custom')
                    ? 'bg-[#FDF3E7] text-[#8C530A] border-2 border-[#C87A14] font-semibold shadow-xs'
                    : 'bg-white hover:bg-[#FAF8F6] text-[#736B65] border border-[#EAE4DE]'
                }`}
              >
                {selectedProductIds.includes('custom') ? (
                  <Check className="w-4 h-4 text-[#C87A14]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-[#736B65]" />
                )}
                <span>Outra marca</span>
              </button>
            </div>

            {selectedProductIds.includes('custom') && (
              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="Nome de outra tinta ou marca..."
                  value={customProductName}
                  onChange={(e) => setCustomProductName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#EAE4DE] bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] shadow-xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PASSO 3: OBSERVAÇÕES GERAIS, FÓRMULAS & OXIGENAÇÃO                        */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#EAE4DE] p-4 sm:p-6 shadow-xs space-y-3.5">
          <div className="border-b border-[#EAE4DE]/60 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center font-semibold text-xs shrink-0">
                3
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#1F1D1B] tracking-tight">
                  Observações Gerais
                </h3>
                <p className="text-xs text-[#736B65]">
                  Fórmula, medidas de oxigenação ou notas do procedimento
                </p>
              </div>
            </div>
          </div>

          {/* Atalhos Rápidos de Clique (1 toque para inserir volume/gramatura) */}
          <div>
            <span className="text-[11px] font-medium text-[#736B65] block mb-1.5">
              Toque rápido para adicionar:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {OX_SHORTCUTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAddShortcut(item)}
                  className="min-h-[36px] py-1.5 px-3 rounded-xl bg-[#FAF8F6] hover:bg-[#F5EFEB] text-[#1F1D1B] text-xs font-medium border border-[#EAE4DE] transition-all active:scale-[0.98] shadow-xs tabular-nums"
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
              className="w-full p-3.5 rounded-xl border border-[#EAE4DE] bg-[#FAF8F6] focus:bg-white text-[16px] text-[#1F1D1B] focus:outline-none focus:border-[#C87A14] resize-none shadow-xs leading-relaxed"
            />
            <p className="text-[11px] text-[#736B65] mt-1.5">
              Ficará registrado na ficha da cliente para consulta imediata no próximo retorno.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PASSO 4: REGISTRO FOTOGRÁFICO (ANTES E DEPOIS)                            */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#EAE4DE] p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-[#EAE4DE]/60 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center font-semibold text-xs shrink-0">
                4
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#1F1D1B] tracking-tight">
                  Fotos do Atendimento (Antes e Depois)
                </h3>
                <p className="text-xs text-[#736B65]">
                  Tire fotos ou selecione da galeria para alimentar a Galeria do salão
                </p>
              </div>
            </div>
            {(beforePhotoUrl || afterPhotoUrl) && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#2E7D5B] bg-[#E8F4EE] px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                <span>Foto anexada</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CARD 1: FOTO DE ANTES */}
            <div className="border border-[#EAE4DE] rounded-xl p-3.5 bg-[#FAF8F6] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#EAE4DE] text-[#4A443F]">
                  Cabelo Inicial • ANTES
                </span>
                {beforePhotoUrl && (
                  <span className="text-[10px] text-[#736B65] tabular-nums">
                    ~{estimateDataUrlSizeKb(beforePhotoUrl)} KB
                  </span>
                )}
              </div>

              {isProcessingBefore ? (
                <div className="h-44 rounded-xl border border-dashed border-[#C87A14] flex flex-col items-center justify-center bg-white gap-2 text-xs text-[#8C530A]">
                  <div className="w-6 h-6 border-2 border-[#C87A14] border-t-transparent rounded-full animate-spin" />
                  <span>Otimizando foto...</span>
                </div>
              ) : beforePhotoUrl ? (
                <div className="relative rounded-xl overflow-hidden bg-black/5 aspect-4/3 group border border-[#EAE4DE]">
                  <img
                    src={beforePhotoUrl}
                    alt="Foto de Antes"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 sm:transition-opacity flex items-center justify-center gap-2 p-2">
                    <label className="cursor-pointer min-h-[38px] px-3 py-1.5 rounded-lg bg-white/95 text-[#1F1D1B] text-xs font-medium hover:bg-white shadow-md flex items-center gap-1.5 active:scale-95 transition-transform">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Trocar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'before')}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setBeforePhotoUrl('')}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 shadow-md flex items-center gap-1.5 active:scale-95 transition-transform"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                  {/* Botões móveis sempre visíveis na parte inferior da foto */}
                  <div className="sm:hidden absolute bottom-1.5 right-1.5 flex gap-1.5">
                    <label className="cursor-pointer min-h-[36px] px-2.5 py-1 rounded-lg bg-white/90 text-[#1F1D1B] text-[11px] font-medium shadow-md flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>Trocar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'before')}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setBeforePhotoUrl('')}
                      className="min-h-[36px] px-2 py-1 rounded-lg bg-red-600/90 text-white text-[11px] font-medium shadow-md flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer h-44 rounded-xl border-2 border-dashed border-[#D6CEC7] hover:border-[#C87A14] bg-white hover:bg-[#FDF3E7]/30 transition-all flex flex-col items-center justify-center p-4 text-center group active:scale-[0.99]">
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F6] group-hover:bg-[#FDF3E7] text-[#736B65] group-hover:text-[#C87A14] flex items-center justify-center mb-2 transition-colors">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-[#1F1D1B] group-hover:text-[#C87A14]">
                    Adicionar Foto de Antes
                  </span>
                  <span className="text-[11px] text-[#736B65] mt-0.5">
                    Toque para abrir a câmera ou galeria
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e, 'before')}
                  />
                </label>
              )}
            </div>

            {/* CARD 2: FOTO DE DEPOIS */}
            <div className="border border-[#C87A14]/30 rounded-xl p-3.5 bg-[#FDF3E7]/20 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#FDF3E7] text-[#8C530A] border border-[#C87A14]/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C87A14]" />
                  <span>Resultado • DEPOIS</span>
                </span>
                {afterPhotoUrl && (
                  <span className="text-[10px] text-[#8C530A] tabular-nums font-medium">
                    ~{estimateDataUrlSizeKb(afterPhotoUrl)} KB
                  </span>
                )}
              </div>

              {isProcessingAfter ? (
                <div className="h-44 rounded-xl border border-dashed border-[#C87A14] flex flex-col items-center justify-center bg-white gap-2 text-xs text-[#8C530A]">
                  <div className="w-6 h-6 border-2 border-[#C87A14] border-t-transparent rounded-full animate-spin" />
                  <span>Otimizando foto...</span>
                </div>
              ) : afterPhotoUrl ? (
                <div className="relative rounded-xl overflow-hidden bg-black/5 aspect-4/3 group border border-[#C87A14]/40">
                  <img
                    src={afterPhotoUrl}
                    alt="Foto de Depois"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 sm:transition-opacity flex items-center justify-center gap-2 p-2">
                    <label className="cursor-pointer min-h-[38px] px-3 py-1.5 rounded-lg bg-white/95 text-[#1F1D1B] text-xs font-medium hover:bg-white shadow-md flex items-center gap-1.5 active:scale-95 transition-transform">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Trocar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'after')}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setAfterPhotoUrl('')}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 shadow-md flex items-center gap-1.5 active:scale-95 transition-transform"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                  {/* Botões móveis sempre visíveis na parte inferior da foto */}
                  <div className="sm:hidden absolute bottom-1.5 right-1.5 flex gap-1.5">
                    <label className="cursor-pointer min-h-[36px] px-2.5 py-1 rounded-lg bg-white/90 text-[#1F1D1B] text-[11px] font-medium shadow-md flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>Trocar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'after')}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setAfterPhotoUrl('')}
                      className="min-h-[36px] px-2 py-1 rounded-lg bg-red-600/90 text-white text-[11px] font-medium shadow-md flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer h-44 rounded-xl border-2 border-dashed border-[#C87A14]/40 hover:border-[#C87A14] bg-white hover:bg-[#FDF3E7]/40 transition-all flex flex-col items-center justify-center p-4 text-center group active:scale-[0.99]">
                  <div className="w-10 h-10 rounded-full bg-[#FDF3E7] text-[#C87A14] flex items-center justify-center mb-2 transition-transform group-hover:scale-105">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-[#1F1D1B] group-hover:text-[#C87A14]">
                    Adicionar Foto de Depois
                  </span>
                  <span className="text-[11px] text-[#736B65] mt-0.5">
                    Toque para registrar o resultado final
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e, 'after')}
                  />
                </label>
              )}
            </div>
          </div>

          <p className="text-[11px] text-[#736B65] flex items-center gap-1.5">
            <span className="text-[#2E7D5B]">✓</span>
            <span>As fotos são comprimidas com qualidade profissional para carregar rápido no celular e sincronizar na nuvem.</span>
          </p>
        </div>

        {/* ========================================================================= */}
        {/* BOTÃO DE CONCLUSÃO COM VERBO CURTO CONFORME DESIGN.MD                      */}
        {/* ========================================================================= */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white font-semibold text-sm sm:text-base shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <Check className="w-5 h-5" />
            <span>Salvar atendimento</span>
          </button>
        </div>
      </form>
    </div>
  );
};
