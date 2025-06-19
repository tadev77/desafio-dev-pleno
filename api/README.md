# API - Desafio Técnico Dev Fullstack Pleno

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

## 🚀 Instalação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   # Configurações do Banco de Dados
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=desafio_dev_pleno

   # Configurações JWT
   JWT_SECRET=your-super-secret-jwt-key-change-in-production

   # Configurações da Aplicação
   PORT=3001
   NODE_ENV=development
   ```

3. **Configurar banco de dados:**
   - Crie um banco chamado `desafio_dev_pleno`
   - As tabelas serão criadas automaticamente pelo TypeORM

4. **Executar a aplicação:**
   ```bash
   # Desenvolvimento
   npm run start:dev

   # Produção
   npm run build
   npm run start:prod
   ```

## 📚 Documentação da API

A documentação da API está disponível em: `http://localhost:3001/swagger`

## 🔐 Endpoints de Autenticação

### POST /auth/register
Cadastra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456"
}
```

### POST /auth/login
Faz login do usuário.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "123456"
}
```

### GET /auth/profile
Obtém o perfil do usuário autenticado (requer token JWT).

**Headers:**
```
Authorization: Bearer <token>
```

## 🛠️ Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Passport** - Estratégias de autenticação
- **Swagger** - Documentação da API
- **class-validator** - Validação de dados
- **bcryptjs** - Criptografia de senhas
