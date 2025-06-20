'use client';

import { Category } from '@/types/category';
import { CreateTransactionData, Transaction, UpdateTransactionData } from '@/types/transaction';
import { useState } from 'react';

interface TransactionFormProps {
    transaction?: Transaction;
    categories: Category[];
    onSubmit: (data: CreateTransactionData | UpdateTransactionData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function TransactionForm({ transaction, categories, onSubmit, onCancel, isLoading = false }: TransactionFormProps) {
    const [formData, setFormData] = useState({
        description: transaction?.description || '',
        amount: transaction?.amount || 0,
        date: transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
        notes: transaction?.notes || '',
        categoryId: transaction?.categoryId || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const formatCurrency = (value: string) => {
        const rawString = value.replace(',', '');
        return (Number(rawString) / 100).toFixed(2);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formattedValue = formatCurrency(value);
        setFormData(prev => ({ ...prev, amount: parseFloat(formattedValue) || 0 }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição *
                </label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formData.description ? 'text-gray-900' : 'text-gray-500'}`}
                />
            </div>

            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Valor *
                </label>
                <input
                    type="text"
                    id="amount"
                    name="amount"
                    value={formData.amount ? formData.amount.toFixed(2).replace('.', ',') : ''}
                    onChange={handleAmountChange}
                    required
                    placeholder="0,00"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formData.amount ? 'text-gray-900' : 'text-gray-500'}`}
                />
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Data *
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formData.date ? 'text-gray-900' : 'text-gray-500'}`}
                />
            </div>

            <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                    Categoria *
                </label>
                <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formData.categoryId ? 'text-gray-900' : 'text-gray-500'}`}
                >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name} ({category.type === 'income' ? 'Receita' : 'Despesa'})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Observações
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formData.notes ? 'text-gray-900' : 'text-gray-500'}`}
                />
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
                    {isLoading ? 'Salvando...' : transaction ? 'Atualizar' : 'Criar'}
                </button>
            </div>
        </form>
    );
} 