import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            💼 Sistema de Movimentações Financeiras
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Gerencie suas finanças de forma simples e eficiente. 
            Cadastre movimentações, organize por categorias e mantenha o controle total dos seus gastos e receitas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              🔐 Fazer Login
            </Link>
            <Link
              href="/auth/login?mode=register"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              ✨ Criar Conta
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Controle Total
              </h3>
              <p className="text-gray-600">
                Acompanhe todas as suas movimentações financeiras em um só lugar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🏷️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Categorização
              </h3>
              <p className="text-gray-600">
                Organize suas despesas e receitas por categorias personalizadas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Segurança
              </h3>
              <p className="text-gray-600">
                Seus dados estão protegidos com autenticação segura e criptografia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
