import React, { useState, useEffect, useCallback } from 'react';
import type { Client, Appointment, Product, SalonSettings, User } from './types';
import { StorageService } from './services/storage';
import { AuthService } from './services/auth';
import { ToastProvider, useToast } from './components/ui/Toast';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { Sidebar, type NavigationTab } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { DashboardModule } from './components/modules/DashboardModule';
import { ClientsModule } from './components/modules/ClientsModule';
import { ClientDetailModule } from './components/modules/ClientDetailModule';
import { ClientModal } from './components/modules/ClientModal';
import { AppointmentFormModule } from './components/modules/AppointmentFormModule';
import { AppointmentDetailModal } from './components/modules/AppointmentDetailModal';
import { GalleryModule } from './components/modules/GalleryModule';
import { HistoryModule } from './components/modules/HistoryModule';
import { ProductsModule } from './components/modules/ProductsModule';
import { SettingsModule } from './components/modules/SettingsModule';
import { LoginModule } from './components/modules/LoginModule';
import { InstallPwaModal } from './components/common/InstallPwaModal';

const MainApp: React.FC = () => {
  const { success, error, info } = useToast();

  // Autenticação e Sessão
  const [currentUser, setCurrentUser] = useState<User | null>(() => AuthService.getCurrentUser());

  // Estados dos Dados Centrais
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SalonSettings>(StorageService.getSettings());

  // Navegação
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);

  // Modais
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Dialog de confirmação
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  // Carregar dados locais na inicialização
  const reloadData = useCallback(() => {
    StorageService.initialize();
    setClients(StorageService.getAllClientsRaw());
    setAppointments(StorageService.getAppointments());
    setProducts(StorageService.getProducts());
    setSettings(StorageService.getSettings());
  }, []);

  // Sincronização inteligente com a nuvem (Cloudflare D1)
  const triggerCloudSync = useCallback(() => {
    setIsSyncingCloud(true);
    StorageService.syncWithCloud()
      .then((res) => {
        setIsCloudSynced(res.success);
        if (res.updated) {
          setClients(StorageService.getAllClientsRaw());
          setAppointments(StorageService.getAppointments());
          setProducts(StorageService.getProducts());
          setSettings(StorageService.getSettings());
        }
      })
      .finally(() => {
        setIsSyncingCloud(false);
      });
  }, []);

  useEffect(() => {
    reloadData();
    triggerCloudSync();

    // 1. Sincroniza imediatamente ao focar na janela / aba (ex: voltou do celular para o PC)
    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        triggerCloudSync();
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    // 2. Heartbeat suave a cada 25 segundos enquanto a página estiver aberta e visível
    const heartbeatId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        triggerCloudSync();
      }
    }, 25000);

    return () => {
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
      clearInterval(heartbeatId);
    };
  }, [reloadData, triggerCloudSync]);

  // Navegação com parâmetros
  const handleNavigate = (
    tab: NavigationTab,
    params?: { clientId?: string; appointmentId?: string }
  ) => {
    if (params?.clientId) {
      setSelectedClientId(params.clientId);
    }
    if (tab === 'appointment-form' && !params?.appointmentId) {
      setAppointmentToEdit(null);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------------------------------------------------------
  // OPERAÇÕES DE CLIENTES
  // -------------------------------------------------------------
  const handleSaveClient = (
    clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    try {
      const onCloudSynced = (ok: boolean) => {
        if (ok) {
          setIsCloudSynced(true);
          info('Nuvem Sincronizada', 'Cadastro confirmado no banco de dados.');
        }
      };

      if (id) {
        const updated = StorageService.updateClient(id, clientData, onCloudSynced);
        success('Cadastro atualizado!', `As alterações em "${updated.name}" foram salvas.`);
      } else {
        const created = StorageService.createClient(clientData, onCloudSynced);
        success('Cliente cadastrada!', `"${created.name}" foi adicionada com sucesso.`);
        // Redireciona para o perfil da nova cliente
        setSelectedClientId(created.id);
        setCurrentTab('client-detail');
      }
      reloadData();
    } catch (err: any) {
      error('Erro ao salvar cliente', err.message);
    }
  };

  const handleOpenEditClient = (client: Client) => {
    setClientToEdit(client);
    setIsClientModalOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Cliente',
      message: `Tem certeza que deseja excluir "${client.name}"? Todos os atendimentos e fichas técnicas desta cliente também serão excluídos permanentemente.`,
      confirmText: 'Sim, Excluir',
      onConfirm: () => {
        StorageService.deleteClient(client.id);
        success('Cliente excluída', `Os dados de "${client.name}" foram removidos.`);
        reloadData();
        if (selectedClientId === client.id) {
          setCurrentTab('clients');
          setSelectedClientId(null);
        }
      },
    });
  };

  const handleArchiveClient = (client: Client, archive: boolean) => {
    StorageService.archiveClient(client.id, archive);
    info(
      archive ? 'Cliente arquivada' : 'Cliente restaurada',
      `"${client.name}" foi ${archive ? 'arquivada' : 'reativada'}.`
    );
    reloadData();
  };

  // -------------------------------------------------------------
  // OPERAÇÕES DE ATENDIMENTOS
  // -------------------------------------------------------------
  const handleSaveAppointment = (
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    try {
      const onCloudSynced = (ok: boolean) => {
        if (ok) {
          setIsCloudSynced(true);
          info('Nuvem Sincronizada', 'Ficha técnica e fotos gravadas na nuvem.');
        }
      };

      if (id) {
        StorageService.updateAppointment(id, appointmentData, onCloudSynced);
        success('Atendimento atualizado!', 'A ficha técnica e fórmulas foram salvas.');
      } else {
        StorageService.createAppointment(appointmentData, onCloudSynced);
        success(
          'Atendimento registrado!',
          `Procedimento salvo para "${appointmentData.clientName}".`
        );
      }
      setAppointmentToEdit(null);
      reloadData();
    } catch (err: any) {
      error('Erro ao salvar atendimento', err.message);
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setAppointmentToEdit(appointment);
    setSelectedClientId(appointment.clientId);
    setCurrentTab('appointment-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAppointment = (appointment: Appointment) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Atendimento',
      message: `Tem certeza que deseja excluir o atendimento de ${appointment.procedureType} de ${appointment.clientName}? Esta ação não pode ser desfeita.`,
      confirmText: 'Sim, Excluir',
      onConfirm: () => {
        StorageService.deleteAppointment(appointment.id);
        success('Atendimento excluído', 'O registro foi removido com sucesso.');
        reloadData();
        if (viewingAppointment?.id === appointment.id) {
          setViewingAppointment(null);
        }
      },
    });
  };

  // -------------------------------------------------------------
  // OPERAÇÕES DE PRODUTOS
  // -------------------------------------------------------------
  const handleSaveProduct = (
    productData: Omit<Product, 'id' | 'createdAt'>,
    id?: string
  ) => {
    try {
      if (id) {
        StorageService.updateProduct(id, productData);
        success('Produto atualizado!', `"${productData.name}" foi atualizado.`);
      } else {
        StorageService.createProduct(productData);
        success('Produto cadastrado!', `"${productData.name}" foi adicionado ao catálogo.`);
      }
      reloadData();
    } catch (err: any) {
      error('Erro ao salvar produto', err.message);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Produto',
      message: `Deseja remover "${product.name}" do catálogo? Procedimentos anteriores que utilizaram este produto manterão suas informações salvas.`,
      confirmText: 'Excluir',
      onConfirm: () => {
        StorageService.deleteProduct(product.id);
        info('Produto removido', `"${product.name}" foi removido do catálogo.`);
        reloadData();
      },
    });
  };

  // -------------------------------------------------------------
  // CONFIGURAÇÕES & BACKUP
  // -------------------------------------------------------------
  const handleUpdateSettings = (updates: Partial<SalonSettings>) => {
    const updated = StorageService.updateSettings(updates);
    setSettings(updated);
    success('Configurações salvas!');
  };

  const handleExportBackup = () => {
    const jsonString = StorageService.exportBackup();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-salao-essencial-${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    success('Backup exportado!', 'Arquivo JSON salvo no seu computador.');
  };

  const handleImportBackup = (jsonString: string): boolean => {
    const ok = StorageService.importBackup(jsonString);
    if (ok) {
      reloadData();
      success('Backup importado com sucesso!');
    }
    return ok;
  };

  const handleLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Sair da Conta',
      message:
        'Deseja desconectar sua conta deste aparelho? Você precisará digitar a senha novamente no próximo acesso.',
      confirmText: 'Sair da Conta',
      onConfirm: () => {
        AuthService.logout();
        setCurrentUser(null);
        info('Sessão encerrada', 'Você saiu da sua conta.');
      },
    });
  };

  // Se o usuário não estiver autenticado, exibe a tela de login
  if (!currentUser) {
    return (
      <LoginModule
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          success(`Bem-vinda, ${user.name}!`, 'Acesso liberado ao Salão Essencial.');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F6] text-[#1F1D1B] flex flex-col antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        totalClientsCount={clients.filter((c) => c.status !== 'archived').length}
        totalAppointmentsCount={appointments.length}
      />

      {/* Main content wrapper */}
      <div className="lg:pl-72 flex flex-col flex-1">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenNewClientModal={() => {
            setClientToEdit(null);
            setIsClientModalOpen(true);
          }}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onNavigate={(tab) => handleNavigate(tab)}
          isCloudSynced={isCloudSynced}
          isSyncing={isSyncingCloud}
        />

        {/* Content view area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {currentTab === 'dashboard' && (
            <DashboardModule
              clients={clients.filter((c) => c.status !== 'archived')}
              appointments={appointments}
              onNavigate={handleNavigate}
              onOpenNewClientModal={() => {
                setClientToEdit(null);
                setIsClientModalOpen(true);
              }}
              onViewAppointmentDetails={(apt) => setViewingAppointment(apt)}
            />
          )}

          {currentTab === 'clients' && (
            <ClientsModule
              clients={clients}
              appointments={appointments}
              onNavigate={handleNavigate}
              onOpenNewClientModal={() => {
                setClientToEdit(null);
                setIsClientModalOpen(true);
              }}
              onEditClient={handleOpenEditClient}
              onDeleteClient={handleDeleteClient}
              onArchiveClient={handleArchiveClient}
            />
          )}

          {currentTab === 'client-detail' && (
            <ClientDetailModule
              clientId={selectedClientId || (clients[0]?.id ?? '')}
              clients={clients}
              appointments={appointments}
              onNavigate={handleNavigate}
              onEditClient={handleOpenEditClient}
              onViewAppointmentDetails={(apt) => setViewingAppointment(apt)}
            />
          )}

          {currentTab === 'appointment-form' && (
            <AppointmentFormModule
              initialClientId={selectedClientId || undefined}
              appointmentToEdit={appointmentToEdit}
              clients={clients.filter((c) => c.status !== 'archived')}
              products={products}
              onSave={handleSaveAppointment}
              onNavigate={handleNavigate}
              onOpenNewClientModal={() => {
                setClientToEdit(null);
                setIsClientModalOpen(true);
              }}
            />
          )}

          {currentTab === 'gallery' && (
            <GalleryModule
              appointments={appointments}
              clients={clients}
              onNavigate={handleNavigate}
              onViewAppointmentDetails={(apt) => setViewingAppointment(apt)}
            />
          )}

          {currentTab === 'history' && (
            <HistoryModule
              appointments={appointments}
              clients={clients}
              onNavigate={handleNavigate}
              onViewAppointmentDetails={(apt) => setViewingAppointment(apt)}
              onEditAppointment={handleEditAppointment}
              onDeleteAppointment={handleDeleteAppointment}
            />
          )}

          {currentTab === 'products' && (
            <ProductsModule
              products={products}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsModule
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
              onOpenInstallModal={() => setIsInstallModalOpen(true)}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveClient}
        clientToEdit={clientToEdit}
      />

      <AppointmentDetailModal
        isOpen={Boolean(viewingAppointment)}
        onClose={() => setViewingAppointment(null)}
        appointment={viewingAppointment}
        client={clients.find((c) => c.id === viewingAppointment?.clientId)}
        onEdit={(apt) => {
          setViewingAppointment(null);
          handleEditAppointment(apt);
        }}
        onViewClient={(clientId) => {
          setViewingAppointment(null);
          handleNavigate('client-detail', { clientId });
        }}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
      />

      {/* Mobile Bottom Navigation (4 Pilares) */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={(tab) => handleNavigate(tab)}
        totalClientsCount={clients.filter((c) => c.status !== 'archived').length}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
};

export default App;
