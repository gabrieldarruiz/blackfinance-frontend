import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Declaração de tipo para Vite
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_URL?: string;
    };
  }
}

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Interface para resposta padrão da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Interface para dados de autenticação
export interface AuthData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  success: boolean;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

// Interface para Evento
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_participants: number;
  current_participants: number;
  status: 'active' | 'scheduled' | 'cancelled';
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  creator?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// Interface para Notificação
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'event' | 'reminder' | 'announcement';
  target_audience: 'all' | 'specific' | 'event_participants';
  sent_at: string;
  scheduled_at?: string;
  status: 'draft' | 'sent' | 'scheduled' | 'failed';
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  creator?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  event?: Event;
}

// Interface para Participante de Evento
export interface EventParticipant {
  id: number;
  event_id: number;
  user_id: number;
  status: 'registered' | 'confirmed' | 'cancelled' | 'attended';
  created_at: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// Interface para Estatísticas de Participantes
export interface EventParticipantStats {
  total_participants: number;
  confirmed_participants: number;
  cancelled_participants: number;
  pending_participants: number;
}

// Interface para estatísticas do Dashboard
export interface DashboardStats {
  total_events: number;
  active_events: number;
  total_users: number;
  total_notifications: number;
  next_event?: Event;
}

// Classe principal da API
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratar respostas
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expirado, tentar refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await this.refreshToken(refreshToken);
              if (response.data?.access_token) {
                localStorage.setItem('token', response.data.access_token);
                // Reenviar requisição original
                const originalRequest = error.config;
                if (originalRequest) {
                  originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                  return this.api(originalRequest);
                }
              }
            } catch (refreshError) {
              // Refresh falhou, limpar tokens mas não redirecionar
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
            }
          } else {
            // Sem refresh token, limpar tokens mas não redirecionar
            localStorage.removeItem('token');
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticação
  async login(credentials: AuthData): Promise<AxiosResponse<LoginResponse>> {
    return this.api.post('/auth/login', credentials);
  }

  async register(userData: AuthData & { name: string }): Promise<AxiosResponse<LoginResponse>> {
    return this.api.post('/auth/register', userData);
  }

  async refreshToken(refreshToken: string): Promise<AxiosResponse<{ access_token: string }>> {
    return this.api.post('/auth/refresh', { refresh_token: refreshToken });
  }

  async logout(): Promise<AxiosResponse> {
    return this.api.post('/auth/logout');
  }

  async getCurrentUser(): Promise<AxiosResponse> {
    return this.api.get('/auth/me');
  }

  // Métodos de eventos
  async getEvents(): Promise<AxiosResponse<ApiResponse<Event[]>>> {
    return this.api.get('/events');
  }

  async createEvent(eventData: Omit<Event, 'id' | 'current_participants' | 'created_at' | 'updated_at' | 'created_by' | 'creator'>): Promise<AxiosResponse<Event>> {
    return this.api.post('/events', eventData);
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<AxiosResponse<Event>> {
    return this.api.put(`/events/${id}`, eventData);
  }

  async deleteEvent(id: number): Promise<AxiosResponse> {
    return this.api.delete(`/events/${id}`);
  }

  async getEvent(id: number): Promise<AxiosResponse<Event>> {
    return this.api.get(`/events/${id}`);
  }

  // Métodos de notificações
  async getNotifications(): Promise<AxiosResponse<ApiResponse<Notification[]>>> {
    return this.api.get('/notifications');
  }

  async createNotification(notificationData: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'creator' | 'event'>): Promise<AxiosResponse<Notification>> {
    return this.api.post('/notifications', notificationData);
  }

  async updateNotification(id: number, notificationData: Partial<Notification>): Promise<AxiosResponse<Notification>> {
    return this.api.put(`/notifications/${id}`, notificationData);
  }

  async resendNotification(id: number): Promise<AxiosResponse<ApiResponse<Notification>>> {
    return this.api.post(`/notifications/${id}/send`);
  }

  async deleteNotification(id: number): Promise<AxiosResponse> {
    return this.api.delete(`/notifications/${id}`);
  }

  async sendNotification(id: number): Promise<AxiosResponse> {
    return this.api.post(`/notifications/${id}/send`);
  }

  async scheduleNotification(id: number, scheduledAt: string): Promise<AxiosResponse<ApiResponse<Notification>>> {
    return this.api.post(`/notifications/${id}/schedule`, { scheduled_at: scheduledAt });
  }

  async cancelScheduledNotification(id: number): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.api.post(`/notifications/${id}/cancel`);
  }

  // Métodos do dashboard
  async getDashboardStats(): Promise<AxiosResponse<ApiResponse<DashboardStats>>> {
    return this.api.get('/dashboard/stats');
  }

  async getRecentEvents(): Promise<AxiosResponse<ApiResponse<Event[]>>> {
    return this.api.get('/dashboard/recent-events');
  }

  async getUpcomingEvents(): Promise<AxiosResponse<ApiResponse<Event[]>>> {
    return this.api.get('/dashboard/upcoming-events');
  }

  // Métodos de usuários
  async getUsers(): Promise<AxiosResponse> {
    return this.api.get('/users');
  }

  async getUser(id: number): Promise<AxiosResponse> {
    return this.api.get(`/users/${id}`);
  }

  async updateUser(id: number, userData: any): Promise<AxiosResponse> {
    return this.api.put(`/users/${id}`, userData);
  }

  async deleteUser(id: number): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.api.delete(`/users/${id}`);
  }

  // Event Participants Management
  async getEventParticipants(eventId: number): Promise<AxiosResponse<ApiResponse<EventParticipant[]>>> {
    return this.api.get(`/events/${eventId}/participants`);
  }

  async confirmEventParticipant(eventId: number, userId: number): Promise<AxiosResponse<ApiResponse<EventParticipant>>> {
    return this.api.post(`/events/${eventId}/participants/${userId}/confirm`);
  }

  async cancelEventParticipant(eventId: number, userId: number): Promise<AxiosResponse<ApiResponse<EventParticipant>>> {
    return this.api.post(`/events/${eventId}/participants/${userId}/cancel`);
  }

        async getEventParticipantStats(eventId: number): Promise<AxiosResponse<ApiResponse<EventParticipantStats>>> {
          return this.api.get(`/events/${eventId}/participants/stats`);
        }

        // Register participant in event
        async registerEventParticipant(eventId: number, userId: number): Promise<AxiosResponse<ApiResponse<any>>> {
          return this.api.post(`/events/${eventId}/register`, { user_id: userId });
        }

        // Reactivate cancelled participant
        async reactivateEventParticipant(eventId: number, userId: number): Promise<AxiosResponse<ApiResponse<any>>> {
          return this.api.post(`/events/${eventId}/participants/${userId}/reactivate`);
        }
}

// Instância singleton da API
export const apiService = new ApiService();

// Função helper para tratar erros da API
export const handleApiError = (error: any): string => {
  // Tratar erro de rate limiting
  if (error.response?.status === 429) {
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'Erro desconhecido';
};

export default apiService;
