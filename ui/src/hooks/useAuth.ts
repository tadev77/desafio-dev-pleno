import { useState, useCallback } from 'react';
import { authApi } from '@/lib/api';
import { LoginData, RegisterData, User } from '@/types/auth';

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
    } catch (err: any) {
      let errorMessage = 'Erro desconhecido ao fazer login. Tente novamente.';
      
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se a API está rodando.';
      } else if (err.response?.status === 401) {
        errorMessage = err.response?.data?.message || 'Email ou senha incorretos.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = `Erro: ${err.message}`;
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
    } catch (err: any) {
      let errorMessage = 'Erro desconhecido ao criar conta. Tente novamente.';
      
      if (err.response?.status === 409) {
        errorMessage = err.response?.data?.message || 'Email já está em uso.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = `Erro: ${err.message}`;
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