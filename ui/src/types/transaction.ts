import { Category } from './category';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  notes?: string;
  userId: string;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  description: string;
  amount: number;
  date: string;
  notes?: string;
  categoryId: string;
}

export interface UpdateTransactionData {
  description?: string;
  amount?: number;
  date?: string;
  notes?: string;
  categoryId?: string;
}

export interface TransactionQuery {
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export interface Balance {
  income: number;
  expense: number;
  balance: number;
}
