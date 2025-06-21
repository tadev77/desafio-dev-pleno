'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

function AuthContent() {
  const [isLogin, setIsLogin] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);
    }
  }, [searchParams]);

  const toggleMode = useCallback(() => {
    setIsLogin(prev => !prev);
  }, []);

  const formComponent = useMemo(() => {
    return isLogin ? <LoginForm /> : <RegisterForm />;
  }, [isLogin]);

  const title = useMemo(() => {
    return isLogin ? 'Entre na sua conta' : 'Crie sua conta';
  }, [isLogin]);

  const toggleText = useMemo(() => {
    return isLogin ? (
      <>
        Ou{' '}
        <button
          onClick={toggleMode}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          crie uma nova conta
        </button>
      </>
    ) : (
      <>
        Ou{' '}
        <button
          onClick={toggleMode}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          faça login se já tem uma conta
        </button>
      </>
    );
  }, [isLogin, toggleMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {toggleText}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          {formComponent}
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
} 