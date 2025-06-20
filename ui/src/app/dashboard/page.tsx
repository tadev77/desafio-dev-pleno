'use client';

import BalanceCard from '@/components/BalanceCard';
import CategoryForm from '@/components/CategoryForm';
import TransactionForm from '@/components/TransactionForm';
import { authApi, categoriesApi, transactionsApi } from '@/lib/api';
import { User } from '@/types/auth';
import { Category } from '@/types/category';
import { Balance, Transaction } from '@/types/transaction';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type TabType = 'overview' | 'transactions' | 'categories';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({ income: 0, expense: 0, balance: 0 });
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setError(null);
      const [userData, categoriesData, transactionsData, balanceData] = await Promise.all([
        authApi.getProfile(),
        categoriesApi.getAll(),
        transactionsApi.getAll(),
        transactionsApi.getBalance(),
      ]);

      setUser(userData);
      setCategories(categoriesData);
      setTransactions(transactionsData);
      setBalance(balanceData);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Tente novamente.');
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const handleCategorySubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, data);
      } else {
        await categoriesApi.create(data);
      }
      await fetchData();
      setShowCategoryForm(false);
      setEditingCategory(null);
    } catch (error: any) {
      console.error('Erro ao salvar categoria:', error);
      setError('Erro ao salvar categoria. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransactionSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingTransaction) {
        await transactionsApi.update(editingTransaction.id, data);
      } else {
        await transactionsApi.create(data);
      }
      await fetchData();
      setShowTransactionForm(false);
      setEditingTransaction(null);
    } catch (error: any) {
      console.error('Erro ao salvar transação:', error);
      setError('Erro ao salvar transação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        setError(null);
        await categoriesApi.delete(id);
        await fetchData();
      } catch (error: any) {
        console.error('Erro ao excluir categoria:', error);
        setError('Erro ao excluir categoria. Tente novamente.');
      }
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        setError(null);
        await transactionsApi.delete(id);
        await fetchData();
      } catch (error: any) {
        console.error('Erro ao excluir transação:', error);
        setError('Erro ao excluir transação. Tente novamente.');
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard - Movimentações Financeiras
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Olá, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Visão Geral' },
                { id: 'transactions', name: 'Transações' },
                { id: 'categories', name: 'Categorias' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <BalanceCard balance={balance} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Últimas Transações</h3>
                    <button
                      onClick={() => setShowTransactionForm(true)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Ver todas
                    </button>
                  </div>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.category.name}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${transaction.category.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                    ))}
                    {transactions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">Nenhuma transação encontrada</p>
                    )}
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Categorias</h3>
                    <button
                      onClick={() => setShowCategoryForm(true)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Ver todas
                    </button>
                  </div>
                  <div className="space-y-3">
                    {categories.slice(0, 5).map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <div>
                            <p className="font-medium text-gray-900">{category.name}</p>
                            <p className="text-sm text-gray-500">{category.type === 'income' ? 'Receita' : 'Despesa'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <p className="text-gray-500 text-center py-4">Nenhuma categoria encontrada</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Transações</h2>
                <button
                  onClick={() => setShowTransactionForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Nova Transação
                </button>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {transactions.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <li key={transaction.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: transaction.category.color }}
                            ></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-500">{transaction.category.name} • {formatDate(transaction.date)}</p>
                              {transaction.notes && (
                                <p className="text-sm text-gray-400">{transaction.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${transaction.category.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(transaction.amount)}
                            </span>
                            <button
                              onClick={() => {
                                setEditingTransaction(transaction);
                                setShowTransactionForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma transação encontrada</p>
                    <button
                      onClick={() => setShowTransactionForm(true)}
                      className="mt-2 text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Criar primeira transação
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Nova Categoria
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setShowCategoryForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {category.type === 'income' ? 'Receita' : 'Despesa'}
                    </p>
                    {category.description && (
                      <p className="text-sm text-gray-600">{category.description}</p>
                    )}
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">Nenhuma categoria encontrada</p>
                    <button
                      onClick={() => setShowCategoryForm(true)}
                      className="mt-2 text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Criar primeira categoria
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modals */}
          {showCategoryForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                  </h3>
                  <CategoryForm
                    category={editingCategory || undefined}
                    onSubmit={handleCategorySubmit}
                    onCancel={() => {
                      setShowCategoryForm(false);
                      setEditingCategory(null);
                    }}
                    isLoading={isSubmitting}
                  />
                </div>
              </div>
            </div>
          )}

          {showTransactionForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
                  </h3>
                  <TransactionForm
                    transaction={editingTransaction || undefined}
                    categories={categories}
                    onSubmit={handleTransactionSubmit}
                    onCancel={() => {
                      setShowTransactionForm(false);
                      setEditingTransaction(null);
                    }}
                    isLoading={isSubmitting}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 