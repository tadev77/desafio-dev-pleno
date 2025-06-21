import { AuthResponse, LoginData, RegisterData, User } from '@/types/auth';
import { Category, CreateCategoryData, UpdateCategoryData } from '@/types/category';
import { Balance, CreateTransactionData, Transaction, TransactionQuery, UpdateTransactionData } from '@/types/transaction';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Desabilitar credentials para evitar problemas de CORS
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request:', config.method?.toUpperCase(), config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
    
    if (error.response?.status === 401 && 
        typeof window !== 'undefined' && 
        !window.location.pathname.includes('/auth/login')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const categoriesApi = {
  getAll: async (type?: 'income' | 'expense'): Promise<Category[]> => {
    const params = type ? { type } : {};
    const response = await api.get('/categories', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryData): Promise<Category> => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export const transactionsApi = {
  getAll: async (query?: TransactionQuery): Promise<Transaction[]> => {
    const response = await api.get('/transactions', { params: query });
    return response.data;
  },

  getIncome: async (query?: TransactionQuery): Promise<Transaction[]> => {
    const response = await api.get('/transactions/income', { params: query });
    return response.data;
  },

  getExpense: async (query?: TransactionQuery): Promise<Transaction[]> => {
    const response = await api.get('/transactions/expense', { params: query });
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTransactionData): Promise<Transaction> => {
    const response = await api.patch(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  getBalance: async (startDate?: string, endDate?: string): Promise<Balance> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/transactions/balance', { params });
    return response.data;
  },
};

export default api; 