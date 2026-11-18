import React, { useState, useRef, useEffect, useMemo } from 'react';
import type {
  Client,
  Appointment,
  Product,
  ProcedureType,
  ApplicationRegion,
  ColorProductItem,
} from '../../types';
import type { NavigationTab } from '../common/Sidebar';
import { ClientAvatar } from '../common/ClientAvatar';
import {
  FlaskConical,
  Plus,
  Trash2,
  ArrowLeft,
  Check,
  Layers,
  Clock,
  Search,
  X,
  Phone,
  User,
  ExternalLink,
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

const DEFAULT_PROCEDURES: ProcedureType[] = [
  'Coloração',
  'Retoque de raiz',
  'Luzes',
  'Mechas',
  'Descoloração',
  'Tonalização',
  'Hidratação',
  'Reconstrução',
  'Corte',
  'Escova',
  'Progressiva',
  'Outro',
];

const APPLICATION_REGIONS: ApplicationRegion[] = [
  'Raiz',
  'Comprimento',
  'Pontas',
  'Cabelo completo',
  'Raiz e comprimento',
  'Outra região',
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
  // SEÇÃO 1: INFORMAÇÕES BÁSICAS
  const [selectedClientId, setSelectedClientId] = useState(
    appointmentToEdit?.clientId || initialClientId || ''
  );

  // Estados de busca da cliente com lupa e autocomplete
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const clientSearchRef = useRef<HTMLDivElement>(null);

  const selectedClient = useMemo(() => {
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const filteredClients = useMemo(() => {
    if (!clientSearchQuery.trim()) {
      return clients.slice(0, 8);
    }
    const query = clientSearchQuery.toLowerCase();
    return clients.filter((c) => {
      const matchName = c.name.toLowerCase().includes(query);
      const matchPhone = c.phone.toLowerCase().includes(query);
      const matchWhatsapp = c.whatsapp?.toLowerCase().includes(query);
      const matchEmail = c.email?.toLowerCase().includes(query);
      return matchName || matchPhone || matchWhatsapp || matchEmail;
    });
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
  const [date, setDate] = useState(
    appointmentToEdit?.date || new Date().toISOString().substring(0, 10)
  );
  const [professional, setProfessional] = useState(
    appointmentToEdit?.professional || 'Carolina Martins'
  );
  const [procedureType, setProcedureType] = useState<ProcedureType | string>(
    appointmentToEdit?.procedureType || 'Coloração'
  );
  const [customProcedureName, setCustomProcedureName] = useState(
    appointmentToEdit?.customProcedureName || ''
  );
  const [description, setDescription] = useState(appointmentToEdit?.description || '');
  const [generalNotes, setGeneralNotes] = useState(appointmentToEdit?.generalNotes || '');

  // SEÇÃO 2: INFORMAÇÕES DE COLORAÇÃO
  const isColorProcedureDefault = [
    'Coloração',
    'Retoque de raiz',
    'Luzes',
    'Mechas',
    'Descoloração',
    'Tonalização',
  ].includes(procedureType);

  const [hasColorInfo, setHasColorInfo] = useState(
    appointmentToEdit ? appointmentToEdit.hasColorInfo : isColorProcedureDefault
  );

  // Múltiplos produtos de coloração (+ ADICIONAR OUTRA TINTA)
  const [colorProducts, setColorProducts] = useState<ColorProductItem[]>(
    appointmentToEdit?.colorFormula?.products?.length
      ? appointmentToEdit.colorFormula.products
      : [
          {
            id: `p-${Date.now()}-1`,
            brand: '',
            line: '',
            shadeNumber: '',
            shadeName: '',
            quantity: '',
            unit: 'g',
            region: 'Cabelo completo',
          },
        ]
  );

  // Oxidante
  const [oxidantUsed, setOxidantUsed] = useState(
    appointmentToEdit?.colorFormula?.oxidant?.used ?? true
  );
  const [oxidantBrand, setOxidantBrand] = useState(
    appointmentToEdit?.colorFormula?.oxidant?.brand || ''
  );
  const [oxidantVolume, setOxidantVolume] = useState(
    appointmentToEdit?.colorFormula?.oxidant?.volume || '20 vol (6%)'
  );
  const [oxidantQuantityOrRatio, setOxidantQuantityOrRatio] = useState(
    appointmentToEdit?.colorFormula?.oxidant?.quantityOrRatio || '1:1.5'
  );
  const [pauseTime, setPauseTime] = useState(
    appointmentToEdit?.colorFormula?.pauseTime || '35 minutos'
  );
  const [technicalNotes, setTechnicalNotes] = useState(
    appointmentToEdit?.colorFormula?.technicalNotes || ''
  );

  // SEÇÃO 3: OBSERVAÇÕES E RESULTADOS TÉCNICOS
  const [initialCondition, setInitialCondition] = useState(
    appointmentToEdit?.assessment?.initialCondition || ''
  );
  const [relevantHistory, setRelevantHistory] = useState(
    appointmentToEdit?.assessment?.relevantHistory || ''
  );
  const [finalResult, setFinalResult] = useState(
    appointmentToEdit?.assessment?.finalResult || ''
  );
  const [professionalNotes, setProfessionalNotes] = useState(
    appointmentToEdit?.assessment?.professionalNotes || ''
  );
  const [nextRecommendations, setNextRecommendations] = useState(
    appointmentToEdit?.assessment?.nextRecommendations || ''
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Atualiza toggle de coloração caso mude o tipo de procedimento e o usuário não tenha editado manualmente
  const handleProcedureTypeChange = (type: string) => {
    setProcedureType(type);
    const shouldHaveColor = [
      'Coloração',
      'Retoque de raiz',
      'Luzes',
      'Mechas',
      'Descoloração',
      'Tonalização',
    ].includes(type);
    setHasColorInfo(shouldHaveColor);
  };

  // Gerenciamento de múltiplas tintas
  const handleAddProduct = () => {
    const newItem: ColorProductItem = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      brand: colorProducts[colorProducts.length - 1]?.brand || '',
      line: '',
      shadeNumber: '',
      shadeName: '',
      quantity: '',
      unit: 'g',
      region: 'Cabelo completo',
    };
    setColorProducts([...colorProducts, newItem]);
  };

  const handleRemoveProduct = (indexToRemove: number) => {
    if (colorProducts.length <= 1) {
      // Se tiver só um, apenas limpa os campos para conveniência
      setColorProducts([
        {
          id: `p-${Date.now()}-reset`,
          brand: '',
          line: '',
          shadeNumber: '',
          shadeName: '',
          quantity: '',
          unit: 'g',
          region: 'Cabelo completo',
        },
      ]);
      return;
    }
    setColorProducts(colorProducts.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpdateProduct = (index: number, updates: Partial<ColorProductItem>) => {
    const updated = [...colorProducts];
    updated[index] = { ...updated[index], ...updates };
    setColorProducts(updated);
  };

  // Preenchimento rápido a partir do catálogo de produtos
  const handleSelectFromCatalog = (productIndex: number, productId: string) => {
    const found = products.find((p) => p.id === productId);
    if (!found) return;

    handleUpdateProduct(productIndex, {
      brand: found.brand,
      line: found.line || '',
      shadeNumber: found.shadeNumber || '',
      shadeName: found.name,
      unit: found.unit.includes('ml') ? 'ml' : 'g',
    });
  };

  // Validação e Salvamento
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!selectedClientId) {
      newErrors.client = 'Selecione uma cliente para o atendimento.';
    }
    if (!date) {
      newErrors.date = 'Data do atendimento é obrigatória.';
    }
    if (!professional.trim()) {
      newErrors.professional = 'Informe o profissional responsável.';
    }
    if (procedureType === 'Outro' && !customProcedureName.trim()) {
      newErrors.customProcedureName = 'Especifique o nome do procedimento.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const selectedClient = clients.find((c) => c.id === selectedClientId);
    const clientName = selectedClient ? selectedClient.name : 'Cliente';

    // Limpar produtos vazios se houver
    const validProducts = colorProducts.filter(
      (p) => p.brand.trim() || p.shadeNumber.trim() || p.shadeName?.trim() || p.quantity.trim()
    );

    const appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
      clientId: selectedClientId,
      clientName,
      date,
      professional: professional.trim(),
      procedureType: procedureType as ProcedureType,
      customProcedureName:
        procedureType === 'Outro' ? customProcedureName.trim() : undefined,
      description: description.trim() || undefined,
      generalNotes: generalNotes.trim() || undefined,
      hasColorInfo,
      colorFormula: hasColorInfo
        ? {
            products: validProducts,
            oxidant: {
              used: oxidantUsed,
              brand: oxidantBrand.trim() || undefined,
              volume: oxidantVolume.trim() || undefined,
              quantityOrRatio: oxidantQuantityOrRatio.trim() || undefined,
            },
            pauseTime: pauseTime.trim() || undefined,
            technicalNotes: technicalNotes.trim() || undefined,
          }
        : undefined,
      assessment: {
        initialCondition: initialCondition.trim() || undefined,
        relevantHistory: relevantHistory.trim() || undefined,
        finalResult: finalResult.trim() || undefined,
        professionalNotes: professionalNotes.trim() || undefined,
        nextRecommendations: nextRecommendations.trim() || undefined,
      },
    };

    onSave(appointmentData, appointmentToEdit ? appointmentToEdit.id : undefined);

    // Navegar para o perfil da cliente com o novo histórico
    onNavigate('client-detail', { clientId: selectedClientId });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Navigation bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (initialClientId) {
              onNavigate('client-detail', { clientId: initialClientId });
            } else {
              onNavigate('history');
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <span className="text-xs text-[#777777]">
          {appointmentToEdit ? 'Modo de Edição' : 'Novo Registro de Procedimento'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============================================================== */}
        {/* SEÇÃO 1: INFORMAÇÕES DO ATENDIMENTO                           */}
        {/* ============================================================== */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-7 shadow-2xs space-y-5">
          <div className="border-b border-[#F3F3F3] pb-3.5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111111]">
                1. Informações do Atendimento
              </h3>
              <p className="text-xs text-[#777777]">
                Identificação da cliente, data, profissional e procedimento principal
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-[#F3F3F3] text-[11px] font-semibold text-[#111111]">
              Obrigatório
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cliente (Pesquisa com Lupa e Autocomplete) */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Cliente <span className="text-rose-500">*</span>
                </label>
                {!selectedClient && (
                  <button
                    type="button"
                    onClick={onOpenNewClientModal}
                    className="text-xs text-[#111111] font-medium hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cadastrar nova cliente</span>
                  </button>
                )}
              </div>

              {selectedClient ? (
                /* Card da Cliente Selecionada */
                <div className="p-3.5 sm:p-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3">
                    <ClientAvatar
                      name={selectedClient.name}
                      avatarUrl={selectedClient.avatarUrl}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#111111]">{selectedClient.name}</h4>
                        {selectedClient.status === 'archived' && (
                          <span className="text-[10px] bg-[#E5E5E5] text-[#777777] px-1.5 py-0.5 rounded font-medium">
                            Arquivada
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#777777] mt-0.5">
                        <span className="flex items-center gap-1 text-[#292929] font-medium">
                          <Phone className="w-3 h-3 text-[#777777]" />
                          {selectedClient.phone}
                        </span>
                        {selectedClient.email && (
                          <span className="hidden sm:inline text-[#777777]">• {selectedClient.email}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('client-detail', { clientId: selectedClient.id })}
                      className="hidden sm:inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg border border-[#E5E5E5] bg-white hover:bg-[#F3F3F3] text-[11px] font-medium text-[#292929] transition-colors"
                      title="Ver histórico desta cliente"
                    >
                      <ExternalLink className="w-3 h-3 text-[#777777]" />
                      <span>Ver Perfil</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClientId('');
                        setClientSearchQuery('');
                        setIsClientDropdownOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#E5E5E5] bg-white hover:bg-[#F3F3F3] text-xs font-semibold text-[#111111] transition-colors shadow-2xs"
                    >
                      <Search className="w-3.5 h-3.5 text-[#777777]" />
                      <span>Trocar Cliente</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Campo de Busca com Lupa e Autocomplete */
                <div ref={clientSearchRef} className="relative">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Pesquisar por nome ou telefone da cliente (ex: Mariana, 99123)..."
                      value={clientSearchQuery}
                      onChange={(e) => {
                        setClientSearchQuery(e.target.value);
                        setIsClientDropdownOpen(true);
                        if (errors.client) setErrors({ ...errors, client: '' });
                      }}
                      onFocus={() => setIsClientDropdownOpen(true)}
                      className={`w-full pl-10 pr-10 py-3 rounded-xl border text-xs sm:text-sm bg-white focus:outline-none transition-all ${
                        errors.client
                          ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                          : 'border-[#E5E5E5] focus:border-[#111111] shadow-2xs'
                      }`}
                    />
                    {clientSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setClientSearchQuery('');
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111] p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown com os resultados da pesquisa */}
                  {isClientDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-[#E5E5E5] shadow-xl z-30 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95">
                      <div className="p-2 border-b border-[#F3F3F3] flex items-center justify-between text-[11px] text-[#777777] bg-[#FAFAFA] px-3">
                        <span>
                          {filteredClients.length > 0
                            ? `${filteredClients.length} cliente${filteredClients.length > 1 ? 's' : ''} encontrada${filteredClients.length > 1 ? 's' : ''}`
                            : 'Nenhum resultado'}
                        </span>
                        <span className="text-[10px]">Clique para selecionar</span>
                      </div>

                      {filteredClients.length === 0 ? (
                        <div className="p-5 text-center space-y-2">
                          <p className="text-xs text-[#777777]">
                            Nenhuma cliente encontrada com o termo "{clientSearchQuery}".
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsClientDropdownOpen(false);
                              onOpenNewClientModal();
                            }}
                            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#111111] text-white text-xs font-semibold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Cadastrar nova cliente</span>
                          </button>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#F3F3F3]">
                          {filteredClients.map((client) => (
                            <button
                              key={client.id}
                              type="button"
                              onClick={() => {
                                setSelectedClientId(client.id);
                                setIsClientDropdownOpen(false);
                                setClientSearchQuery('');
                                if (errors.client) setErrors({ ...errors, client: '' });
                              }}
                              className="w-full p-3 flex items-center justify-between text-left hover:bg-[#FAFAFA] transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <ClientAvatar
                                  name={client.name}
                                  avatarUrl={client.avatarUrl}
                                  size="sm"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#111111] group-hover:underline">
                                      {client.name}
                                    </span>
                                    {client.status === 'archived' && (
                                      <span className="text-[9px] bg-[#E5E5E5] text-[#777777] px-1 rounded">
                                        Arquivada
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-[#777777] flex items-center gap-1 mt-0.5">
                                    <Phone className="w-3 h-3" />
                                    {client.phone}
                                    {client.email && <span className="ml-1 text-[10px]">• {client.email}</span>}
                                  </span>
                                </div>
                              </div>

                              <span className="text-[11px] font-semibold text-[#111111] opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-[#E5E5E5] px-2 py-0.5 rounded">
                                Selecionar
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Dropdown footer shortcut */}
                      <div className="p-2 border-t border-[#F3F3F3] bg-[#FAFAFA] text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setIsClientDropdownOpen(false);
                            onOpenNewClientModal();
                          }}
                          className="w-full py-1.5 px-3 rounded-lg border border-dashed border-[#E5E5E5] hover:border-[#111111] hover:bg-white text-[11px] font-semibold text-[#111111] transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Cadastrar outra cliente</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {errors.client && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.client}</p>
              )}
            </div>

            {/* Data */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                Data do Atendimento <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors({ ...errors, date: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all text-[#292929] ${
                  errors.date
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-[#E5E5E5] bg-white focus:border-[#111111]'
                }`}
              />
              {errors.date && <p className="text-[11px] text-rose-500 mt-1">{errors.date}</p>}
            </div>

            {/* Profissional Responsável */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                Profissional Responsável <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Carolina Martins"
                value={professional}
                onChange={(e) => {
                  setProfessional(e.target.value);
                  if (errors.professional) setErrors({ ...errors, professional: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.professional
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-[#E5E5E5] bg-white focus:border-[#111111]'
                }`}
              />
              {errors.professional && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.professional}</p>
              )}
            </div>

            {/* Tipo de Procedimento */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                Tipo de Procedimento <span className="text-rose-500">*</span>
              </label>
              <select
                value={procedureType}
                onChange={(e) => handleProcedureTypeChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:border-[#111111] transition-all"
              >
                {DEFAULT_PROCEDURES.map((proc) => (
                  <option key={proc} value={proc}>
                    {proc}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo caso seja "Outro" procedimento */}
            {procedureType === 'Outro' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                  Especificar Procedimento <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cronograma Personalizado, Spa dos Fios..."
                  value={customProcedureName}
                  onChange={(e) => {
                    setCustomProcedureName(e.target.value);
                    if (errors.customProcedureName)
                      setErrors({ ...errors, customProcedureName: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.customProcedureName
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-[#E5E5E5] bg-white focus:border-[#111111]'
                  }`}
                />
                {errors.customProcedureName && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.customProcedureName}</p>
                )}
              </div>
            )}

            {/* Descrição do Serviço */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">
                Descrição do Serviço Realizado
              </label>
              <input
                type="text"
                placeholder="Ex: Coloração global com nuance fria personalizada, neutralização de fundo e escova."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:border-[#111111] transition-all"
              />
            </div>

            {/* Observações Gerais */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">
                Observações Gerais do Atendimento
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Tempo de lavatório, comportamento dos fios ou observações de atendimento."
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:border-[#111111] transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SEÇÃO 2: INFORMAÇÕES DA COLORAÇÃO & MÚLTIPLAS TINTAS           */}
        {/* ============================================================== */}
        <div className="bg-white rounded-2xl border border-[#111111] p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111111]">
                  2. Fórmulas de Coloração & Misturas Químicas
                </h3>
                <p className="text-xs text-[#777777]">
                  Ficha técnica com suporte a múltiplas tintas, proporções e regiões
                </p>
              </div>
            </div>

            {/* Toggle switch para habilitar/desabilitar seção de coloração */}
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasColorInfo}
                onChange={(e) => setHasColorInfo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#111111]"></div>
              <span className="text-xs font-semibold text-[#111111]">
                {hasColorInfo ? 'Fórmula Ativa' : 'Sem Química / Coloração'}
              </span>
            </label>
          </div>

          {hasColorInfo ? (
            <div className="space-y-6">
              {/* Dynamic Multiple Dyes Container */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                      Tintas e Tonalidades Utilizadas
                    </h4>
                    <p className="text-[11px] text-[#777777]">
                      Adicione quantas tintas foram misturadas neste procedimento
                    </p>
                  </div>

                  {/* + ADICIONAR OUTRA TINTA BUTTON */}
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#111111] hover:bg-[#292929] text-white text-xs font-semibold transition-all shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ ADICIONAR OUTRA TINTA</span>
                  </button>
                </div>

                {/* Items list */}
                <div className="space-y-4">
                  {colorProducts.map((product, index) => (
                    <div
                      key={product.id || index}
                      className="p-4 sm:p-5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] relative space-y-4 group transition-all"
                    >
                      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#111111] text-white font-mono font-bold text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                            Produto {index + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Shortcut to select from existing catalog */}
                          {products.length > 0 && (
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleSelectFromCatalog(index, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="text-[11px] py-1 px-2.5 rounded border border-[#E5E5E5] bg-white text-[#777777] focus:outline-none focus:border-[#111111]"
                            >
                              <option value="">Carregar do catálogo...</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.shadeNumber ? `[${p.shadeNumber}] ` : ''}
                                  {p.name} ({p.brand})
                                </option>
                              ))}
                            </select>
                          )}

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(index)}
                            className="p-1 rounded text-[#777777] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remover esta tinta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Product Form Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Numeração da tinta */}
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#111111] mb-1">
                            Numeração / Tom
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: 7.1, 8.0, 9.89..."
                            value={product.shadeNumber}
                            onChange={(e) =>
                              handleUpdateProduct(index, { shadeNumber: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs font-mono font-bold focus:outline-none focus:border-[#111111]"
                          />
                        </div>

                        {/* Nome da tonalidade */}
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#777777] mb-1">
                            Nome da Tonalidade
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Louro Médio Cinza..."
                            value={product.shadeName || ''}
                            onChange={(e) =>
                              handleUpdateProduct(index, { shadeName: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111]"
                          />
                        </div>

                        {/* Marca */}
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#777777] mb-1">
                            Marca da Tinta
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Wella, Igora, Inoa..."
                            value={product.brand}
                            onChange={(e) => handleUpdateProduct(index, { brand: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111]"
                          />
                        </div>

                        {/* Linha / Produto */}
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#777777] mb-1">
                            Linha / Produto
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Koleston Pro, Color Touch..."
                            value={product.line || ''}
                            onChange={(e) => handleUpdateProduct(index, { line: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111]"
                          />
                        </div>

                        {/* Quantidade */}
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#111111] mb-1">
                            Quantidade Utilizada
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              placeholder="Ex: 30, 45, 1/2..."
                              value={product.quantity}
                              onChange={(e) =>
                                handleUpdateProduct(index, { quantity: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs font-mono font-medium focus:outline-none focus:border-[#111111]"
                            />
                            <select
                              value={product.unit}
                              onChange={(e) =>
                                handleUpdateProduct(index, { unit: e.target.value })
                              }
                              className="px-2 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111]"
                            >
                              <option value="g">g</option>
                              <option value="ml">ml</option>
                              <option value="tubo">tubo</option>
                              <option value="medida">medida</option>
                            </select>
                          </div>
                        </div>

                        {/* Região de Aplicação */}
                        <div className="sm:col-span-2 md:col-span-3">
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#777777] mb-1">
                            Região de Aplicação
                          </label>
                          <select
                            value={product.region}
                            onChange={(e) =>
                              handleUpdateProduct(index, { region: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111]"
                          >
                            {APPLICATION_REGIONS.map((reg) => (
                              <option key={reg} value={reg}>
                                {reg}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* OXIDANTE & TEMPO DE PAUSA */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#111111]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                      Oxidante / Revelador & Proporção
                    </h4>
                  </div>

                  <label className="inline-flex items-center gap-2 text-xs text-[#292929] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={oxidantUsed}
                      onChange={(e) => setOxidantUsed(e.target.checked)}
                      className="rounded border-[#E5E5E5] text-[#111111] focus:ring-0"
                    />
                    <span>Utilizou oxidante</span>
                  </label>
                </div>

                {oxidantUsed && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Volume */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#111111] mb-1">
                        Volume do Oxidante
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 20 vol, 30 vol..."
                        value={oxidantVolume}
                        onChange={(e) => setOxidantVolume(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs font-medium focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    {/* Proporção / Quantidade */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#111111] mb-1">
                        Proporção da Mistura / Quantidade
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 1:1, 1:1.5, 60ml..."
                        value={oxidantQuantityOrRatio}
                        onChange={(e) => setOxidantQuantityOrRatio(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs font-medium focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    {/* Marca do Oxidante */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#777777] mb-1">
                        Marca do Oxidante
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Linha Oxy Pro, Wella Welloxon..."
                        value={oxidantBrand}
                        onChange={(e) => setOxidantBrand(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                  </div>
                )}

                {/* Tempo de Pausa & Observações da mistura */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#111111] mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Tempo de Pausa
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 35 minutos, 40 min..."
                      value={pauseTime}
                      onChange={(e) => setPauseTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs font-medium focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#777777] mb-1">
                      Observações Técnicas da Aplicação
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Raiz com 20 vol por 25 min, comprimento emulcionado nos últimos 10 min..."
                      value={technicalNotes}
                      onChange={(e) => setTechnicalNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center bg-[#FAFAFA] rounded-xl border border-dashed border-[#E5E5E5] space-y-2">
              <p className="text-xs text-[#777777]">
                Este atendimento está configurado como serviço sem dados químicos (ex: corte, escova ou hidratação simples).
              </p>
              <button
                type="button"
                onClick={() => setHasColorInfo(true)}
                className="text-xs font-semibold text-[#111111] underline hover:opacity-80"
              >
                Ativar campos de coloração e tintas
              </button>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SEÇÃO 3: OBSERVAÇÕES E RESULTADOS TÉCNICOS                     */}
        {/* ============================================================== */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-7 shadow-2xs space-y-5">
          <div className="border-b border-[#F3F3F3] pb-3.5">
            <h3 className="text-base font-bold text-[#111111]">
              3. Avaliação Técnica & Recomendações
            </h3>
            <p className="text-xs text-[#777777]">
              Campos complementares para acompanhamento da saúde dos fios e planejamento do retorno (opcionais)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Condição inicial do cabelo */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">
                Condição Inicial do Cabelo
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Fios ressecados nas pontas, fundo de clareamento 8, sensibilidade moderada..."
                value={initialCondition}
                onChange={(e) => setInitialCondition(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111] resize-none"
              />
            </div>

            {/* Resultado Final */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">
                Resultado Final Obtido
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Tom uniforme, cobertura 100% de brancos, reflexo cinza neutro e brilho intenso..."
                value={finalResult}
                onChange={(e) => setFinalResult(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111] resize-none"
              />
            </div>

            {/* Histórico Técnico Relevante */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">
                Histórico Técnico Relevante
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Química anterior em outro salão, mechas antigas há 6 meses..."
                value={relevantHistory}
                onChange={(e) => setRelevantHistory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111] resize-none"
              />
            </div>

            {/* Recomendações para o próximo atendimento */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">
                Recomendações para Próximo Retorno
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Agendar nutrição em 20 dias; retoque de raiz em 45 dias com a mesma fórmula 7.1 + 8.0..."
                value={nextRecommendations}
                onChange={(e) => setNextRecommendations(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111] resize-none"
              />
            </div>

            {/* Observações do profissional */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">
                Observações Adicionais do Profissional
              </label>
              <input
                type="text"
                placeholder="Ex: Cabelo reagiu muito rápido ao clareamento. Atenção para não ultrapassar 30 min na próxima vez."
                value={professionalNotes}
                onChange={(e) => setProfessionalNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E5E5] shadow-xs">
          <button
            type="button"
            onClick={() => {
              if (initialClientId) {
                onNavigate('client-detail', { clientId: initialClientId });
              } else {
                onNavigate('history');
              }
            }}
            className="py-2.5 px-4 rounded-xl border border-[#E5E5E5] text-xs font-semibold text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F3] transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-md group"
          >
            <Check className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>{appointmentToEdit ? 'Salvar Alterações' : 'Salvar Atendimento'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
