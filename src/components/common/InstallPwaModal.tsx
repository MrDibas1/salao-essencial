import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { PWAService } from '../../services/pwa';
import { Download, Share2, PlusSquare, CheckCircle, Smartphone, Monitor } from 'lucide-react';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({ isOpen, onClose }) => {
  const [canInstallDirectly, setCanInstallDirectly] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    setIsStandalone(PWAService.isStandalone());
    setIsIOS(PWAService.isIOS());

    const unsubscribe = PWAService.subscribeToInstallable((canInstall) => {
      setCanInstallDirectly(canInstall);
    });

    return unsubscribe;
  }, [isOpen]);

  const handleInstallClick = async () => {
    const success = await PWAService.promptInstall();
    if (success) {
      setInstalledSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Instalar Aplicativo ESSENCIAL"
      subtitle="Tenha o sistema com ícone na tela de início do seu celular ou PC"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Card de Apresentação do Ícone */}
        <div className="p-4 rounded-2xl bg-[#F4F5F7] border border-[#D1D5DB] flex items-center gap-4 shadow-2xs">
          <img
            src="/assets/pwa/icon-192.png"
            alt="Ícone do Aplicativo"
            className="w-16 h-16 rounded-2xl shadow-sm border border-neutral-800 shrink-0"
          />
          <div>
            <h4 className="text-sm font-bold text-[#111111] tracking-tight">ESSENCIAL</h4>
            <p className="text-xs text-[#4B5563] mt-0.5 font-medium">
              Hair & Beauty Studio — Gestão Interna
            </p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-[#6B7280]">
              <span className="inline-flex items-center gap-1 font-semibold text-[#111111]">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Offline-First
              </span>
              <span>•</span>
              <span>Tela Cheia</span>
              <span>•</span>
              <span>Sem App Store</span>
            </div>
          </div>
        </div>

        {/* Cenário: Já instalado */}
        {isStandalone ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h5 className="text-sm font-bold text-emerald-950">Aplicativo Já Instalado!</h5>
            <p className="text-xs text-emerald-700 mt-1">
              Você já está aproveitando a experiência completa em tela cheia do Salão Essencial.
            </p>
          </div>
        ) : installedSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h5 className="text-sm font-bold text-emerald-950">Instalação Concluída!</h5>
            <p className="text-xs text-emerald-700 mt-1">
              O ícone já está disponível na sua tela de início.
            </p>
          </div>
        ) : isIOS ? (
          /* Cenário: iPhone / iPad (Safari) */
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
              <Smartphone className="w-4 h-4 text-[#111111]" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Como instalar no iPhone ou iPad:
              </h5>
            </div>

            <ol className="space-y-3 text-xs text-[#374151]">
              <li className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </div>
                <div>
                  No Safari, toque no botão de <strong className="text-[#111111]">Compartilhar</strong>{' '}
                  <Share2 className="inline w-3.5 h-3.5 text-[#111111] mx-0.5" /> (quadrado com a seta para cima na barra inferior).
                </div>
              </li>

              <li className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </div>
                <div>
                  Role as opções para cima e selecione{' '}
                  <strong className="text-[#111111]">"Adicionar à Tela de Início"</strong>{' '}
                  <PlusSquare className="inline w-3.5 h-3.5 text-[#111111] mx-0.5" />.
                </div>
              </li>

              <li className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </div>
                <div>
                  Toque em <strong className="text-[#111111]">"Adicionar"</strong> no canto superior direito para confirmar.
                </div>
              </li>
            </ol>
          </div>
        ) : (
          /* Cenário: Android / Chrome / Edge */
          <div className="space-y-4">
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Instale o sistema para acessar instantaneamente sem precisar digitar o link, navegar em tela cheia e consultar fórmulas mesmo sem internet.
            </p>

            {canInstallDirectly ? (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold transition-all shadow-md active:scale-[0.99]"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Instalar Aplicativo Agora</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#D1D5DB] space-y-2 text-xs text-[#374151]">
                <div className="flex items-center gap-2 font-bold text-[#111111]">
                  <Monitor className="w-4 h-4" />
                  <span>No computador ou Android:</span>
                </div>
                <p className="text-[11px] text-[#4B5563]">
                  Clique no ícone de <strong>instalação</strong> (um computador com seta para baixo) na barra de endereços do navegador ou abra o menu do navegador (3 pontinhos) e escolha <strong>"Instalar ESSENCIAL..."</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Rodapé com botão Fechar */}
        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-[#D1D5DB] bg-white text-xs font-semibold text-[#374151] hover:text-[#111111] hover:bg-neutral-100 transition-colors shadow-2xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};
