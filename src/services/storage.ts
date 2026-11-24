import type { Client, Appointment, Product, SalonSettings } from '../types';
import { DEMO_CLIENTS, DEMO_APPOINTMENTS, DEMO_PRODUCTS, INITIAL_SETTINGS } from './demoData';

const STORAGE_KEYS = {
  CLIENTS: 'essencial_clients_v1',
  APPOINTMENTS: 'essencial_appointments_v1',
  PRODUCTS: 'essencial_products_v1',
  SETTINGS: 'essencial_settings_v1',
  INITIALIZED: 'essencial_initialized_v1',
};

// Helper: safe JSON parsing
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Erro ao carregar chave ${key} do localStorage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Erro ao salvar chave ${key} no localStorage:`, err);
  }
}

// Helper: safe fetch com timeout para sincronização em nuvem
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export const StorageService = {
  // Inicialização oficial de produção
  initialize(): void {
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    const cleanDelivery = localStorage.getItem('essencial_clean_delivery_v1');

    // Limpeza forçada de entrega: garante que clientes e atendimentos residuais de teste sejam zerados
    if (!cleanDelivery) {
      saveToStorage(STORAGE_KEYS.CLIENTS, []);
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, []);
      saveToStorage(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);
      saveToStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
      localStorage.setItem('essencial_clean_delivery_v1', 'true');
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } else if (!initialized) {
      saveToStorage(STORAGE_KEYS.CLIENTS, []);
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, []);
      saveToStorage(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);
      saveToStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } else {
      // Garante que os 7 produtos oficiais estejam sempre carregados
      const products = this.getProducts();
      const hasOldProducts = products.some((p) => p.id === 'prod-1' || p.id === 'prod-2');
      if (hasOldProducts || products.length === 0) {
        saveToStorage(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);
      }
    }
  },

  // -------------------------------------------------------------
  // SINCRONIZAÇÃO EM NUVEM (CLOUDFLARE D1)
  // -------------------------------------------------------------
  async syncWithCloud(): Promise<{ success: boolean; updated: boolean }> {
    try {
      const res = await fetchWithTimeout('/api/sync');
      if (!res.ok) return { success: false, updated: false };
      const json: any = await res.json();
      if (!json.success || !json.data) return { success: false, updated: false };

      const cloudData = json.data;
      let hasUpdate = false;

      // Sincroniza produtos oficiais do D1
      if (Array.isArray(cloudData.products)) {
        if (cloudData.products.length > 0) {
          saveToStorage(STORAGE_KEYS.PRODUCTS, cloudData.products);
          hasUpdate = true;
        } else {
          saveToStorage(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);
          hasUpdate = true;
        }
      }

      // Sincroniza clientes (reflete estado real do D1)
      if (Array.isArray(cloudData.clients)) {
        saveToStorage(STORAGE_KEYS.CLIENTS, cloudData.clients);
        hasUpdate = true;
      }

      // Sincroniza atendimentos (reflete estado real do D1)
      if (Array.isArray(cloudData.appointments)) {
        saveToStorage(STORAGE_KEYS.APPOINTMENTS, cloudData.appointments);
        hasUpdate = true;
      }

      // Sincroniza configurações
      if (cloudData.settings) {
        saveToStorage(STORAGE_KEYS.SETTINGS, cloudData.settings);
        hasUpdate = true;
      }

      return { success: true, updated: hasUpdate };
    } catch (err) {
      console.warn('Sincronização Cloudflare D1 em segundo plano indisponível/offline:', err);
      return { success: false, updated: false };
    }
  },

  async pushLocalToCloud(): Promise<boolean> {
    try {
      const payload = {
        clients: this.getAllClientsRaw(),
        appointments: this.getAppointments(),
        products: this.getProducts(),
        settings: this.getSettings(),
      };
      const res = await fetchWithTimeout('/api/sync/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // -------------------------------------------------------------
  // CLIENTES
  // -------------------------------------------------------------
  getClients(includeArchived = false): Client[] {
    const clients = loadFromStorage<Client[]>(STORAGE_KEYS.CLIENTS, []);
    return includeArchived ? clients : clients.filter((c) => c.status !== 'archived');
  },

  getAllClientsRaw(): Client[] {
    return loadFromStorage<Client[]>(STORAGE_KEYS.CLIENTS, []);
  },

  getClientById(id: string): Client | null {
    const clients = this.getAllClientsRaw();
    return clients.find((c) => c.id === id) || null;
  },

  createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
    const clients = this.getAllClientsRaw();
    const now = new Date().toISOString();
    const newClient: Client = {
      ...data,
      id: `cli-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      status: data.status || 'active',
      isDemo: false,
    };
    clients.unshift(newClient);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);

    // Salva na nuvem Cloudflare D1
    fetchWithTimeout('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient),
    }).catch((err) => console.warn('Erro ao salvar cliente no D1:', err));

    return newClient;
  },

  updateClient(id: string, updates: Partial<Client>): Client {
    const clients = this.getAllClientsRaw();
    const index = clients.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Cliente com ID ${id} não encontrada.`);
    }

    const updated: Client = {
      ...clients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    clients[index] = updated;
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);

    // Se o nome da cliente mudou, atualiza nos atendimentos para manter consistência
    if (updates.name && updates.name !== clients[index].name) {
      const appointments = this.getAppointments();
      let changed = false;
      const updatedAppointments = appointments.map((apt) => {
        if (apt.clientId === id) {
          changed = true;
          return { ...apt, clientName: updates.name! };
        }
        return apt;
      });
      if (changed) {
        saveToStorage(STORAGE_KEYS.APPOINTMENTS, updatedAppointments);
      }
    }

    // Atualiza na nuvem Cloudflare D1
    fetchWithTimeout('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((err) => console.warn('Erro ao atualizar cliente no D1:', err));

    return updated;
  },

  deleteClient(id: string): void {
    const clients = this.getAllClientsRaw().filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);

    // Também remove atendimentos associados a esta cliente
    const appointments = this.getAppointments().filter((apt) => apt.clientId !== id);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);

    // Exclui na nuvem Cloudflare D1
    fetchWithTimeout(`/api/clients/${id}`, { method: 'DELETE' }).catch((err) =>
      console.warn('Erro ao excluir cliente no D1:', err)
    );
  },

  archiveClient(id: string, archive = true): Client {
    return this.updateClient(id, { status: archive ? 'archived' : 'active' });
  },

  // -------------------------------------------------------------
  // ATENDIMENTOS
  // -------------------------------------------------------------
  getAppointments(): Appointment[] {
    const appointments = loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    return appointments.sort((a, b) => {
      const dateA = new Date(`${a.date}T00:00:00Z`).getTime();
      const dateB = new Date(`${b.date}T00:00:00Z`).getTime();
      if (dateA !== dateB) return dateB - dateA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  getAppointmentById(id: string): Appointment | null {
    const appointments = this.getAppointments();
    return appointments.find((a) => a.id === id) || null;
  },

  getAppointmentsByClientId(clientId: string): Appointment[] {
    const appointments = this.getAppointments();
    return appointments.filter((a) => a.clientId === clientId);
  },

  createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment {
    const appointments = this.getAppointments();
    const now = new Date().toISOString();
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      isDemo: false,
    };
    appointments.unshift(newAppointment);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);

    // Salva na nuvem Cloudflare D1
    fetchWithTimeout('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAppointment),
    }).catch((err) => console.warn('Erro ao salvar atendimento no D1:', err));

    // Atualiza updatedAt da cliente
    try {
      this.updateClient(data.clientId, {});
    } catch {
      // Ignora se cliente não encontrada
    }

    return newAppointment;
  },

  updateAppointment(id: string, updates: Partial<Appointment>): Appointment {
    const appointments = this.getAppointments();
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Atendimento com ID ${id} não encontrado.`);
    }

    const updated: Appointment = {
      ...appointments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    appointments[index] = updated;
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);

    // Atualiza na nuvem Cloudflare D1
    fetchWithTimeout('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((err) => console.warn('Erro ao atualizar atendimento no D1:', err));

    return updated;
  },

  deleteAppointment(id: string): void {
    const appointments = this.getAppointments().filter((a) => a.id !== id);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);

    // Exclui na nuvem Cloudflare D1
    fetchWithTimeout(`/api/appointments/${id}`, { method: 'DELETE' }).catch((err) =>
      console.warn('Erro ao excluir atendimento no D1:', err)
    );
  },

  // -------------------------------------------------------------
  // PRODUTOS
  // -------------------------------------------------------------
  getProducts(): Product[] {
    const products = loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    return products.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  },

  getProductById(id: string): Product | null {
    const products = this.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  createProduct(data: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      isDemo: false,
    };
    products.unshift(newProduct);
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);

    // Salva na nuvem Cloudflare D1
    fetchWithTimeout('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    }).catch((err) => console.warn('Erro ao salvar produto no D1:', err));

    return newProduct;
  },

  updateProduct(id: string, updates: Partial<Product>): Product {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Produto com ID ${id} não encontrado.`);
    }

    const updated: Product = {
      ...products[index],
      ...updates,
    };
    products[index] = updated;
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);

    // Atualiza na nuvem Cloudflare D1
    fetchWithTimeout('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((err) => console.warn('Erro ao atualizar produto no D1:', err));

    return updated;
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);

    // Exclui na nuvem Cloudflare D1
    fetchWithTimeout(`/api/products/${id}`, { method: 'DELETE' }).catch((err) =>
      console.warn('Erro ao excluir produto no D1:', err)
    );
  },

  // -------------------------------------------------------------
  // CONFIGURAÇÕES
  // -------------------------------------------------------------
  getSettings(): SalonSettings {
    const settings = loadFromStorage<SalonSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    if (settings.tagline === 'Hair & Beauty Studio') {
      settings.tagline = 'Salão de Beleza e Aluguel de Roupas';
      saveToStorage(STORAGE_KEYS.SETTINGS, settings);
    }
    return settings;
  },

  updateSettings(updates: Partial<SalonSettings>): SalonSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    saveToStorage(STORAGE_KEYS.SETTINGS, updated);

    // Atualiza na nuvem Cloudflare D1
    fetchWithTimeout('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((err) => console.warn('Erro ao salvar configurações no D1:', err));

    return updated;
  },

  // -------------------------------------------------------------
  // DADOS DEMONSTRATIVOS E RESET
  // -------------------------------------------------------------
  restoreDemoData(): void {
    saveToStorage(STORAGE_KEYS.CLIENTS, DEMO_CLIENTS);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, DEMO_APPOINTMENTS);
    saveToStorage(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);
    saveToStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);

    this.pushLocalToCloud().catch((err) => console.warn('Erro ao sincronizar demo com D1:', err));
  },

  clearDemoData(): void {
    const nonDemoClients = this.getAllClientsRaw().filter((c) => !c.isDemo);
    const nonDemoAppointments = this.getAppointments().filter((a) => !a.isDemo);
    const currentProducts = this.getProducts().map((p) => ({ ...p, isDemo: false }));
    const finalProducts = currentProducts.length > 0 ? currentProducts : DEMO_PRODUCTS;

    saveToStorage(STORAGE_KEYS.CLIENTS, nonDemoClients);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, nonDemoAppointments);
    saveToStorage(STORAGE_KEYS.PRODUCTS, finalProducts);

    fetchWithTimeout('/api/demo/clear', { method: 'POST' }).catch((err) =>
      console.warn('Erro ao limpar demo no D1:', err)
    );
    this.pushLocalToCloud().catch((err) =>
      console.warn('Erro ao sincronizar após limpar demo:', err)
    );
  },

  clearAllData(): void {
    saveToStorage(STORAGE_KEYS.CLIENTS, []);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, []);
    saveToStorage(STORAGE_KEYS.PRODUCTS, []);
  },

  exportBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      clients: this.getAllClientsRaw(),
      appointments: this.getAppointments(),
      products: this.getProducts(),
      settings: this.getSettings(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.clients)) {
        saveToStorage(STORAGE_KEYS.CLIENTS, parsed.clients);
      }
      if (Array.isArray(parsed.appointments)) {
        saveToStorage(STORAGE_KEYS.APPOINTMENTS, parsed.appointments);
      }
      if (Array.isArray(parsed.products)) {
        saveToStorage(STORAGE_KEYS.PRODUCTS, parsed.products);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        saveToStorage(STORAGE_KEYS.SETTINGS, parsed.settings);
      }

      this.pushLocalToCloud().catch((err) => console.warn('Erro ao sincronizar backup com D1:', err));
      return true;
    } catch (err) {
      console.error('Falha ao importar backup:', err);
      return false;
    }
  },
};
