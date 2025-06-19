'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';
import { authApi } from '@/lib/api';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await authApi.getProfile();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/auth/login');
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
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bem-vindo ao Dashboard!
              </h2>
              <p className="text-gray-600 mb-4">
                Aqui você poderá gerenciar suas movimentações financeiras.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Informações da Conta:
                </h3>
                <p className="text-blue-700">
                  <strong>Nome:</strong> {user?.name}
                </p>
                <p className="text-blue-700">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="text-blue-700">
                  <strong>Membro desde:</strong>{' '}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 