import { useState, useCallback } from 'react';
import { authApi } from '@/lib/api';
import { LoginData, RegisterData } from '@/types/auth';

interface ApiError {
  code?: string;
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login(data);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (err: unknown) {
      const error = err as ApiError;
      let errorMessage = 'Erro desconhecido ao fazer login. Tente novamente.';
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se a API está rodando.';
      } else if (error.response?.status === 401) {
        errorMessage = error.response?.data?.message || 'Email ou senha incorretos.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.register(data);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (err: unknown) {
      const error = err as ApiError;
      let errorMessage = 'Erro desconhecido ao criar conta. Tente novamente.';
      
      if (error.response?.status === 409) {
        errorMessage = error.response?.data?.message || 'Email já está em uso.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    isLoading,
    error,
    login,
    register,
    clearError,
  };
}; 