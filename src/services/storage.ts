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

export const StorageService = {
  // Inicialização com dados demo se primeira vez
  initialize(): void {
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      this.restoreDemoData();
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } else {
      // Atualiza clientes demo com fotos caso estejam sem avatarUrl
      const clients = this.getAllClientsRaw();
      let updated = false;
      const patchedClients = clients.map((c) => {
        if (c.isDemo && !c.avatarUrl) {
          const demoMatch = DEMO_CLIENTS.find((d) => d.id === c.id);
          if (demoMatch?.avatarUrl) {
            updated = true;
            return { ...c, avatarUrl: demoMatch.avatarUrl };
          }
        }
        return c;
      });
      if (updated) {
        saveToStorage(STORAGE_KEYS.CLIENTS, patchedClients);
      }

      // Atualiza produtos demo com fotos caso estejam sem imageUrl
      const products = this.getProducts();
      let updatedProducts = false;
      const patchedProducts = products.map((p) => {
        if (p.isDemo && !p.imageUrl) {
          const demoMatch = DEMO_PRODUCTS.find((d) => d.id === p.id);
          if (demoMatch?.imageUrl) {
            updatedProducts = true;
            return { ...p, imageUrl: demoMatch.imageUrl };
          }
        }
        return p;
      });
      if (updatedProducts) {
        saveToStorage(STORAGE_KEYS.PRODUCTS, patchedProducts);
      }
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

    return updated;
  },

  deleteClient(id: string): void {
    const clients = this.getAllClientsRaw().filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);

    // Também remove atendimentos associados a esta cliente
    const appointments = this.getAppointments().filter((apt) => apt.clientId !== id);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
  },

  archiveClient(id: string, archive = true): Client {
    return this.updateClient(id, { status: archive ? 'archived' : 'active' });
  },

  // -------------------------------------------------------------
  // ATENDIMENTOS
  // -------------------------------------------------------------
  getAppointments(): Appointment[] {
    const appointments = loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    // Ordenar do mais recente para o mais antigo por data e criação
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
    return updated;
  },

  deleteAppointment(id: string): void {
    const appointments = this.getAppointments().filter((a) => a.id !== id);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
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
    return updated;
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
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
  },

  clearDemoData(): void {
    const nonDemoClients = this.getAllClientsRaw().filter((c) => !c.isDemo);
    const nonDemoAppointments = this.getAppointments().filter((a) => !a.isDemo);
    const nonDemoProducts = this.getProducts().filter((p) => !p.isDemo);

    saveToStorage(STORAGE_KEYS.CLIENTS, nonDemoClients);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, nonDemoAppointments);
    saveToStorage(STORAGE_KEYS.PRODUCTS, nonDemoProducts);
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
      return true;
    } catch (err) {
      console.error('Falha ao importar backup:', err);
      return false;
    }
  },
};
