# Frontend - Desafio Técnico Dev Fullstack Pleno

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🚀 Instalação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Executar a aplicação:**
   ```bash
   # Desenvolvimento
   npm run dev

   # Produção
   npm run build
   npm run start
   ```

## 🌐 Acessando a Aplicação

A aplicação estará disponível em: `http://localhost:3000`

## 🔐 Funcionalidades de Autenticação

### Páginas Disponíveis

- **Página Inicial** (`/`) - Landing page com informações sobre o sistema
- **Login/Registro** (`/auth/login`) - Formulário de autenticação e registro
- **Dashboard** (`/dashboard`) - Área protegida para usuários autenticados

### Fluxo de Autenticação

1. **Registro**: O usuário pode criar uma nova conta fornecendo nome, email e senha
2. **Login**: Usuários existentes podem fazer login com email e senha
3. **Proteção**: O dashboard só é acessível para usuários autenticados
4. **Logout**: Usuários podem sair da aplicação, removendo o token de autenticação

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilização
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Axios** - Cliente HTTP

## 📱 Responsividade

A interface é totalmente responsiva e funciona bem em:
- Desktop
- Tablet
- Mobile
