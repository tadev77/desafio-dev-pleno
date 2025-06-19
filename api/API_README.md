# 📚 Documentação da API - Sistema de Movimentações Financeiras

## 🚀 Visão Geral

Esta API foi desenvolvida com NestJS e oferece funcionalidades completas para gerenciamento de movimentações financeiras, incluindo:

- **Autenticação de usuários** com JWT
- **Cadastro e gerenciamento de categorias**
- **Cadastro e gerenciamento de transações**
- **Relatórios de saldo**
- **Filtros avançados**

## 🛠️ Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Class Validator** - Validação de dados
- **PostgreSQL** - Banco de dados

## 📋 Endpoints Disponíveis

### 🔐 Autenticação

#### POST `/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### POST `/auth/login`
Realiza login do usuário.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

### 📂 Categorias

#### POST `/categories`
Cria uma nova categoria.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Alimentação",
  "description": "Gastos com alimentação",
  "color": "#3B82F6",
  "type": "expense"
}
```

#### GET `/categories`
Lista todas as categorias do usuário.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `type` (opcional): `income` ou `expense`

#### GET `/categories/:id`
Busca uma categoria específica.

#### PATCH `/categories/:id`
Atualiza uma categoria.

#### DELETE `/categories/:id`
Remove uma categoria.

### 💰 Transações

#### POST `/transactions`
Cria uma nova transação.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "description": "Compra no supermercado",
  "amount": 150.50,
  "date": "2024-01-15",
  "notes": "Produtos de limpeza",
  "categoryId": "uuid-da-categoria"
}
```

#### GET `/transactions`
Lista todas as transações do usuário.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `categoryId` (opcional): ID da categoria
- `startDate` (opcional): Data inicial (YYYY-MM-DD)
- `endDate` (opcional): Data final (YYYY-MM-DD)

#### GET `/transactions/income`
Lista transações de receita (income).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `categoryId` (opcional): ID da categoria
- `startDate` (opcional): Data inicial (YYYY-MM-DD)
- `endDate` (opcional): Data final (YYYY-MM-DD)

#### GET `/transactions/expense`
Lista transações de despesa (expense).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `categoryId` (opcional): ID da categoria
- `startDate` (opcional): Data inicial (YYYY-MM-DD)
- `endDate` (opcional): Data final (YYYY-MM-DD)

#### GET `/transactions/balance`
Obtém o saldo das transações.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (opcional): Data inicial (YYYY-MM-DD)
- `endDate` (opcional): Data final (YYYY-MM-DD)

**Response:**
```json
{
  "income": 5000.00,
  "expense": 2500.00,
  "balance": 2500.00
}
```

#### GET `/transactions/:id`
Busca uma transação específica.

#### PATCH `/transactions/:id`
Atualiza uma transação.

#### DELETE `/transactions/:id`
Remove uma transação.

## 🗄️ Estrutura do Banco de Dados

### Tabelas

1. **users** - Usuários do sistema
2. **categories** - Categorias de transações (com tipo: income/expense)
3. **transactions** - Transações financeiras (tipo determinado pela categoria)

### Relacionamentos

- Um usuário pode ter múltiplas categorias
- Um usuário pode ter múltiplas transações
- Uma transação pertence a uma categoria
- Uma categoria pertence a um usuário
- **O tipo da transação é determinado pelo tipo da categoria**

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz da API:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=desafio_dev_pleno

# JWT
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRES_IN=24h

# App
PORT=3001
NODE_ENV=development
```

### Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run start:dev

# Executar em produção
npm run build
npm run start:prod
```

## 📖 Documentação Swagger

Após iniciar a API, acesse a documentação Swagger em:

```
http://localhost:3001/api
```

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes com coverage
npm run test:cov
```

## 🔒 Segurança

- Todas as rotas (exceto login/registro) requerem autenticação JWT
- Senhas são criptografadas com bcrypt
- Validação de dados com class-validator
- Relacionamentos protegidos por usuário

## 📊 Funcionalidades Avançadas

### Filtros de Transações

- Por categoria
- Por período (data inicial e final)
- Por tipo (usando endpoints específicos: `/transactions/income` e `/transactions/expense`)

### Validações

- Valores monetários com precisão decimal
- Datas em formato ISO
- UUIDs válidos para relacionamentos
- Tipo da transação determinado automaticamente pela categoria

### Relatórios

- Saldo geral
- Saldo por período
- Filtros combinados

## 🚨 Tratamento de Erros

A API retorna códigos de status HTTP apropriados:

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## 📝 Exemplos de Uso

### Fluxo Completo

1. **Registrar usuário**
2. **Fazer login**
3. **Criar categorias** (com tipo: income/expense)
4. **Criar transações** (tipo determinado pela categoria)
5. **Consultar saldo**

### Exemplo com cURL

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","password":"123456"}'

# 2. Fazer login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'

# 3. Criar categoria de despesa
curl -X POST http://localhost:3001/categories \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alimentação","type":"expense"}'

# 4. Criar categoria de receita
curl -X POST http://localhost:3001/categories \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"name":"Salário","type":"income"}'

# 5. Criar transação (tipo determinado pela categoria)
curl -X POST http://localhost:3001/transactions \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"description":"Supermercado","amount":150.50,"date":"2024-01-15","categoryId":"ID_DA_CATEGORIA_DESPESA"}'

# 6. Listar transações de despesa
curl -X GET http://localhost:3001/transactions/expense \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# 7. Listar transações de receita
curl -X GET http://localhost:3001/transactions/income \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
``` 