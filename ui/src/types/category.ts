export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  type: 'income' | 'expense';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
  type?: 'income' | 'expense';
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  color?: string;
  type?: 'income' | 'expense';
} 