'use client';

import { Category, CreateCategoryData, UpdateCategoryData } from '@/types/category';
import { useState } from 'react';

interface CategoryFormProps {
    category?: Category;
    onSubmit: (data: CreateCategoryData | UpdateCategoryData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function CategoryForm({ category, onSubmit, onCancel, isLoading = false }: CategoryFormProps) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
        color: category?.color || '#3B82F6',
        type: category?.type || 'expense' as 'income' | 'expense',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formData.name ? 'text-gray-900' : 'text-gray-500'}`}
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formData.description ? 'text-gray-900' : 'text-gray-500'}`}
                />
            </div>

            <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                    Cor
                </label>
                <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formData.color ? 'text-gray-900' : 'text-gray-500'}`}
                />
            </div>

            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Tipo *
                </label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formData.type ? 'text-gray-900' : 'text-gray-500'}`}
                >
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isLoading ? 'Salvando...' : category ? 'Atualizar' : 'Criar'}
                </button>
            </div>
        </form>
    );
} 