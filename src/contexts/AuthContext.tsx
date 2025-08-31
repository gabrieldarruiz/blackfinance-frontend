import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Verificar se há token salvo e validar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          // A API retorna o usuário diretamente, não dentro de response.data
          setUser(response.data);
        } catch (error: any) {
          console.error('Erro ao verificar autenticação:', error);
          // Token inválido, limpar localStorage mas não redirecionar
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiService.login({ email, password });
      const { access_token, refresh_token, user: userData } = response.data;

      // Salvar tokens
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      // Atualizar estado
      setUser(userData);
      return true;
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Tratar erro de rate limiting
      if (error.response?.status === 429) {
        console.log('Rate limiting detectado. Aguardando...');
        // Aguardar 2 segundos antes de permitir nova tentativa
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiService.register({ name, email, password });
      const { access_token, refresh_token, user: userData } = response.data;

      // Salvar tokens
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      // Atualizar estado
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Chamar logout na API
      await apiService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
