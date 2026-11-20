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
      title="Instalar Aplicativo"
      subtitle="Adicione à tela de início do seu celular para acesso rápido"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Card de Apresentação do Ícone */}
        <div className="p-4 rounded-2xl bg-[#FAF8F6] border border-[#EAE4DE] flex items-center gap-3.5 shadow-xs">
          <img
            src="/assets/pwa/icon-192.png"
            alt="Ícone do Aplicativo"
            className="w-14 h-14 rounded-2xl border border-[#EAE4DE] shrink-0"
          />
          <div>
            <h4 className="text-sm font-semibold text-[#1F1D1B] tracking-tight">Salão Essencial</h4>
            <p className="text-xs text-[#736B65] mt-0.5">
              Gestão de Clientes e Fórmulas
            </p>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#736B65]">
              <span className="inline-flex items-center gap-1 font-medium text-[#2E7D5B]">
                <CheckCircle className="w-3.5 h-3.5" />
                Offline
              </span>
              <span>•</span>
              <span>Tela cheia</span>
              <span>•</span>
              <span>Rápido</span>
            </div>
          </div>
        </div>

        {/* Cenário: Já instalado */}
        {isStandalone ? (
          <div className="p-4 rounded-xl bg-[#E8F4EE] border border-[#2E7D5B]/30 text-center">
            <CheckCircle className="w-8 h-8 text-[#2E7D5B] mx-auto mb-2" />
            <h5 className="text-sm font-semibold text-[#1F1D1B]">Aplicativo Já Instalado!</h5>
            <p className="text-xs text-[#2E7D5B] mt-1">
              Você já está utilizando a versão instalada do Salão Essencial.
            </p>
          </div>
        ) : installedSuccess ? (
          <div className="p-4 rounded-xl bg-[#E8F4EE] border border-[#2E7D5B]/30 text-center">
            <CheckCircle className="w-8 h-8 text-[#2E7D5B] mx-auto mb-2" />
            <h5 className="text-sm font-semibold text-[#1F1D1B]">Instalação Concluída!</h5>
            <p className="text-xs text-[#2E7D5B] mt-1">
              O ícone já está disponível na sua tela de início.
            </p>
          </div>
        ) : isIOS ? (
          /* Cenário: iPhone / iPad (Safari) */
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#EAE4DE]">
              <Smartphone className="w-4 h-4 text-[#C87A14]" />
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#1F1D1B]">
                Como adicionar no iPhone / iPad:
              </h5>
            </div>

            <ol className="space-y-2.5 text-xs text-[#736B65]">
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE]">
                <div className="w-5 h-5 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </div>
                <div>
                  No Safari, toque no botão <strong className="text-[#1F1D1B]">Compartilhar</strong>{' '}
                  <Share2 className="inline w-3.5 h-3.5 text-[#C87A14] mx-0.5" /> (barra inferior).
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE]">
                <div className="w-5 h-5 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </div>
                <div>
                  Selecione <strong className="text-[#1F1D1B]">"Adicionar à Tela de Início"</strong>{' '}
                  <PlusSquare className="inline w-3.5 h-3.5 text-[#C87A14] mx-0.5" />.
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE]">
                <div className="w-5 h-5 rounded-full bg-[#FDF3E7] text-[#8C530A] flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </div>
                <div>
                  Toque em <strong className="text-[#1F1D1B]">"Adicionar"</strong> no topo direito.
                </div>
              </li>
            </ol>
          </div>
        ) : (
          /* Cenário: Android / Chrome / Edge */
          <div className="space-y-3">
            <p className="text-xs text-[#736B65] leading-relaxed">
              Adicione à sua tela para abrir com 1 toque, usar em tela cheia e consultar fórmulas offline.
            </p>

            {canInstallDirectly ? (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#C87A14] hover:bg-[#A8630A] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Instalar Agora</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#FAF8F6] border border-[#EAE4DE] space-y-1.5 text-xs text-[#736B65]">
                <div className="flex items-center gap-2 font-semibold text-[#1F1D1B]">
                  <Monitor className="w-4 h-4 text-[#C87A14]" />
                  <span>No computador ou Android:</span>
                </div>
                <p className="text-[11px] text-[#736B65]">
                  Clique no ícone de instalação na barra de navegação ou menu do navegador e escolha <strong>"Instalar Aplicativo"</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Rodapé com botão Fechar */}
        <div className="pt-3 border-t border-[#EAE4DE] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] py-2 px-4 rounded-xl border border-[#EAE4DE] bg-white text-xs font-medium text-[#736B65] hover:text-[#1F1D1B] hover:bg-[#FAF8F6] transition-colors active:scale-[0.98]"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};
