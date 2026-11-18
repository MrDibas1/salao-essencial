// Serviço de gerenciamento PWA — Salão Essencial

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferredPrompt: InstallPromptEvent | null = null;
const listeners = new Set<(canInstall: boolean) => void>();

export const PWAService = {
  // Registra o Service Worker
  register(): void {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registrado com sucesso:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Falha ao registrar Service Worker:', err);
          });
      });
    }

    // Escuta evento de disponibilidade de instalação no Android/Chrome/Edge
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e as InstallPromptEvent;
      listeners.forEach((listener) => listener(true));
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      listeners.forEach((listener) => listener(false));
      console.log('[PWA] Aplicativo instalado com sucesso na tela inicial!');
    });
  },

  // Inscreve componente para saber se o botão de instalar pode ser exibido
  subscribeToInstallable(callback: (canInstall: boolean) => void): () => void {
    listeners.add(callback);
    callback(Boolean(deferredPrompt));
    return () => listeners.delete(callback);
  },

  // Dispara a instalação nativa do Android/Chrome
  async promptInstall(): Promise<boolean> {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        deferredPrompt = null;
        listeners.forEach((listener) => listener(false));
        return true;
      }
    } catch (err) {
      console.warn('[PWA] Erro ao disparar instalação:', err);
    }
    return false;
  },

  // Detecta se já está rodando instalado como App (sem abas do navegador)
  isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://')
    );
  },

  // Detecta se o dispositivo é iOS (iPhone/iPad)
  isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream
    );
  },
};
