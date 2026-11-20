import type { User } from '../types';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'essencial_auth_token_v1',
  AUTH_USER: 'essencial_auth_user_v1',
};

// Usuário padrão de fallback offline (para nunca travar se estiver sem internet)
const DEFAULT_OFFLINE_USER: User = {
  id: 'usr-clarice-admin',
  name: 'Clarice',
  email: 'clarice@salaoessencial.com',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  createdAt: '2026-11-19T00:00:00Z',
};

export const AuthService = {
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken() && this.getCurrentUser());
  },

  async login(
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const json = await res.json() as any;

      if (!res.ok || !json.success) {
        return {
          success: false,
          error: json.error || 'E-mail ou senha incorretos.',
        };
      }

      const user: User = json.user;
      const token: string = json.token || `ses_${Date.now()}`;

      // Salva no storage local (permanente)
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      } else {
        sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        sessionStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      }

      return { success: true, user };
    } catch (err) {
      console.warn('Falha na conexão com a nuvem, tentando autenticação local offline:', err);

      // Fallback offline seguro para a credencial padrão
      if (
        cleanEmail === 'clarice@salaoessencial.com' &&
        (cleanPassword === 'essencial2026' || cleanPassword === 'clarice123')
      ) {
        const token = `offline_ses_${Date.now()}`;
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(DEFAULT_OFFLINE_USER));
        return { success: true, user: DEFAULT_OFFLINE_USER };
      }

      return {
        success: false,
        error: 'Erro de conexão ou credenciais inválidas. Verifique seu e-mail e senha.',
      };
    }
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },
};
