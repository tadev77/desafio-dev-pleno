'use client';

import { Balance } from '@/types/transaction';

interface BalanceCardProps {
    balance: Balance;
    isLoading?: boolean;
}

export default function BalanceCard({ balance, isLoading = false }: BalanceCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    if (isLoading) {
        return (
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Saldo Atual
                            </dt>
                            <dd className={`text-lg font-medium ${balance.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(balance.balance)}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Receitas</dt>
                        <dd className="text-sm font-medium text-green-600">
                            {formatCurrency(balance.income)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Despesas</dt>
                        <dd className="text-sm font-medium text-red-600">
                            {formatCurrency(balance.expense)}
                        </dd>
                    </div>
                </div>
            </div>
        </div>
    );
} 