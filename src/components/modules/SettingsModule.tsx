import React, { useState, useRef } from 'react';
import type { SalonSettings } from '../../types';
import { Logo } from '../common/Logo';
import {
  Store,
  Image,
  Database,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  Shield,
  Smartphone,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { useToast } from '../ui/Toast';

interface SettingsModuleProps {
  settings: SalonSettings;
  onUpdateSettings: (updates: Partial<SalonSettings>) => void;
  onRestoreDemo: () => void;
  onClearDemo: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => boolean;
  onOpenInstallModal?: () => void;
  hasDemoData: boolean;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  onUpdateSettings,
  onRestoreDemo,
  onClearDemo,
  onExportBackup,
  onImportBackup,
  onOpenInstallModal,
  hasDemoData,
}) => {
  const { success, error: toastError } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncCloud = async () => {
    setIsSyncing(true);
    try {
      const res = await StorageService.syncWithCloud();
      if (res.success) {
        success('Nuvem Sincronizada!', 'Seus dados estão protegidos no banco Cloudflare D1.');
      } else {
        toastError('Falha na sincronização', 'Verifique sua conexão com a internet.');
      }
    } catch {
      toastError('Erro ao sincronizar', 'Não foi possível conectar ao Cloudflare D1.');
    } finally {
      setIsSyncing(false);
    }
  };

  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address || '');
  const [instagram, setInstagram] = useState(settings.instagram || '');
  const [useTypographicLogo, setUseTypographicLogo] = useState(settings.useTypographicLogo);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      name: name.trim(),
      tagline: tagline.trim(),
      phone: phone.trim(),
      address: address.trim() || undefined,
      instagram: instagram.trim() || undefined,
      useTypographicLogo,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = onImportBackup(content);
        if (ok) {
          alert('Backup importado com sucesso!');
        } else {
          alert('Arquivo de backup inválido.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Informações Básicas do Estabelecimento */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-7 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#F3F3F3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111111]">
                Informações do Estabelecimento
              </h3>
              <p className="text-xs text-[#777777]">
                Dados institucionais apresentados nos cabeçalhos e fichas de atendimento
              </p>
            </div>
          </div>

          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Salvo com sucesso</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                Nome do Salão
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                Slogan / Subtítulo
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                Telefone Oficial
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                Instagram / Rede Social
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                Endereço
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-semibold transition-all shadow-xs"
            >
              Salvar Informações
            </button>
          </div>
        </form>
      </div>

      {/* Identidade Visual & Logomarca */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-7 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#F3F3F3] pb-4">
          <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center">
            <Image className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111111]">
              Identidade Visual & Logomarca
            </h3>
            <p className="text-xs text-[#777777]">
              Ativo oficial da marca Essencial em conformidade com as diretrizes monocromáticas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Logo Preview */}
          <div className="p-6 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
              Prévia Atual da Marca
            </span>
            <div className="p-4 bg-white rounded-xl border border-[#E5E5E5] shadow-2xs w-full flex items-center justify-center min-h-[90px]">
              <Logo size="lg" forceTypographic={useTypographicLogo} />
            </div>
            <p className="text-[11px] text-[#777777]">
              Arquivo padrão: <code className="text-[#111111] font-mono">public/assets/logo-essencial.png</code>
            </p>
          </div>

          {/* Configuration Controls */}
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-[#E5E5E5] space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-[#111111] block">
                    Modo Tipográfico Refinado
                  </span>
                  <span className="text-[11px] text-[#777777]">
                    Utilizar a assinatura tipográfica elegante do Salão Essencial
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={useTypographicLogo}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setUseTypographicLogo(val);
                    onUpdateSettings({ useTypographicLogo: val });
                  }}
                  className="rounded border-[#E5E5E5] text-[#111111] focus:ring-0 w-4 h-4"
                />
              </label>
            </div>

            <p className="text-[11px] text-[#777777] leading-relaxed">
              * A logomarca oficial fornecida está salva no repositório em alta fidelidade. O sistema está preparado para receber arquivos SVG ou novas resoluções a qualquer momento na pasta de ativos sem necessidade de reprogramação.
            </p>
          </div>
        </div>
      </div>

      {/* Aplicativo Móvel & PWA */}
      <div className="bg-white rounded-2xl border border-[#D1D5DB] p-6 sm:p-7 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111111]">
                Aplicativo Móvel & Suporte PWA
              </h3>
              <p className="text-xs text-[#6B7280]">
                Instalação direta no iPhone, Android e Desktop com suporte a funcionamento offline
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PWA Habilitado</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/pwa/icon-192.png"
              alt="Ícone PWA"
              className="w-12 h-12 rounded-xl border border-neutral-800 shadow-2xs shrink-0"
            />
            <div>
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Ícone Nativo na Tela de Início
              </h4>
              <p className="text-[11px] text-[#4B5563] mt-0.5 leading-relaxed">
                Abra o salão em tela cheia como um app nativo, sem barras de navegador.
              </p>
            </div>
          </div>

          {onOpenInstallModal && (
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-semibold transition-all shadow-xs shrink-0 active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Instalar Aplicativo</span>
            </button>
          )}
        </div>
      </div>

      {/* Gerenciamento de Dados Demonstrativos e Backup */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-7 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#F3F3F3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111111]">
                Gerenciamento de Dados & Apresentação
              </h3>
              <p className="text-xs text-[#777777]">
                Controle da base demonstrativa fictícia e exportação de segurança
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              hasDemoData
                ? 'bg-neutral-100 text-[#111111] border border-[#E5E5E5]'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {hasDemoData ? 'Base Demonstrativa Ativa' : 'Base de Produção Limpa'}
          </span>
        </div>

        {/* Banner de Sincronização Cloudflare D1 */}
        <div className="p-4 rounded-2xl border border-[#2E7D5B]/30 bg-[#E8F4EE]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2E7D5B] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1F1D1B]">
                  Banco de Dados em Nuvem (Cloudflare D1)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2E7D5B] text-white">
                  Ativo & Seguro
                </span>
              </div>
              <p className="text-xs text-[#736B65] mt-0.5">
                Todos os cadastros e fórmulas são sincronizados automaticamente na nuvem. Seus dados estão protegidos contra perda de aparelho e acessíveis de qualquer dispositivo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSyncCloud}
            disabled={isSyncing}
            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-white border border-[#2E7D5B]/30 text-xs font-semibold text-[#2E7D5B] hover:bg-[#E8F4EE] transition-all shadow-xs active:scale-[0.98] shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar agora'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Restaurar Demonstração */}
          <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                <RotateCcw className="w-4 h-4 text-[#777777]" />
                <span>Restaurar Base Demonstrativa</span>
              </div>
              <p className="text-[11px] text-[#777777] mt-1 leading-relaxed">
                Recarrega 7 clientes fictícias e 12 atendimentos com fórmulas completas de coloração para apresentação ao salão.
              </p>
            </div>
            <button
              onClick={onRestoreDemo}
              className="w-full py-2 px-3 rounded-lg bg-white border border-[#E5E5E5] hover:bg-[#F3F3F3] text-xs font-semibold text-[#111111] transition-colors"
            >
              Restaurar Dados Demonstrativos
            </button>
          </div>

          {/* Limpar Demonstração */}
          <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                <Trash2 className="w-4 h-4 text-[#777777]" />
                <span>Limpar Dados Demonstrativos</span>
              </div>
              <p className="text-[11px] text-[#777777] mt-1 leading-relaxed">
                Remove com segurança todos os registros identificados como fictícios, preservando os cadastros reais que você tiver inserido.
              </p>
            </div>
            <button
              onClick={onClearDemo}
              className="w-full py-2 px-3 rounded-lg bg-white border border-[#E5E5E5] hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold text-[#777777] transition-colors"
            >
              Limpar Registros Fictícios
            </button>
          </div>

          {/* Backup Export */}
          <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                <Download className="w-4 h-4 text-[#777777]" />
                <span>Exportar Backup (JSON)</span>
              </div>
              <p className="text-[11px] text-[#777777] mt-1 leading-relaxed">
                Baixe uma cópia completa de todas as clientes, fórmulas e atendimentos em formato JSON portátil.
              </p>
            </div>
            <button
              onClick={onExportBackup}
              className="w-full py-2 px-3 rounded-lg bg-[#111111] hover:bg-black text-white text-xs font-semibold transition-colors"
            >
              Baixar Backup do Sistema
            </button>
          </div>

          {/* Backup Import */}
          <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                <Upload className="w-4 h-4 text-[#777777]" />
                <span>Importar Backup</span>
              </div>
              <p className="text-[11px] text-[#777777] mt-1 leading-relaxed">
                Restaure os dados de um arquivo de backup previamente gerado.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-lg bg-white border border-[#E5E5E5] hover:bg-[#F3F3F3] text-xs font-semibold text-[#111111] transition-colors"
              >
                Selecionar Arquivo JSON
              </button>
            </div>
          </div>
        </div>

        {/* Informações da Versão e Segurança */}
        <div className="p-4 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#C87A14] shrink-0 mt-0.5" />
            <div className="text-xs text-[#736B65] leading-relaxed">
              <strong className="text-[#1F1D1B] block mb-0.5">Salão Essencial — Sistema de Gestão</strong>
              <span>Banco de dados em nuvem Cloudflare D1 ativo com sincronização contínua e proteção contra perda de dados.</span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FDF3E7] text-[#8C530A] border border-[#C87A14]/30 tabular-nums">
              Versão 1.0.0
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8F4EE] text-[#2E7D5B] border border-[#2E7D5B]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B]" />
              <span>Produção</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
