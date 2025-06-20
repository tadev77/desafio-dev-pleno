# 🧪 Testes Unitários da API

Este documento descreve a estrutura e organização dos testes unitários da API, agora concentrados na pasta `test/`.

## 📁 Estrutura dos Testes

```
api/
├── test/                           # Pasta principal dos testes
│   ├── setup.ts                    # Configuração global dos testes
│   ├── auth.service.spec.ts        # Testes do AuthService
│   ├── auth.controller.spec.ts     # Testes do AuthController
│   ├── users.service.spec.ts       # Testes do UsersService
│   ├── categories.service.spec.ts  # Testes do CategoriesService
│   ├── categories.controller.spec.ts # Testes do CategoriesController
│   ├── transactions.service.spec.ts # Testes do TransactionsService
│   ├── transactions.controller.spec.ts # Testes do TransactionsController
│   └── app.controller.spec.ts      # Testes do AppController
├── jest.config.js                  # Configuração do Jest
└── src/                            # Código fonte da aplicação
```

## 🚀 Como Executar os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com cobertura
```bash
npm run test:cov
```

### Executar testes de um arquivo específico
```bash
npm test -- test/auth.service.spec.ts
```

### Executar testes de um módulo específico
```bash
npm test -- auth
```

## 📊 Cobertura de Testes

**Resultado Final**: ✅ **8/8 Test Suites Passed** | **76/76 Tests Passed**

### Cobertura de Código
- **Statements**: 91.51%
- **Branches**: 67.39%
- **Functions**: 90.56%
- **Lines**: 92%

### Services Testados (4/4)
- ✅ **AuthService** - 100% cobertura
- ✅ **UsersService** - 100% cobertura
- ✅ **CategoriesService** - 100% cobertura
- ✅ **TransactionsService** - 86.44% cobertura

### Controllers Testados (4/4)
- ✅ **AuthController** - 100% cobertura
- ✅ **CategoriesController** - 100% cobertura
- ✅ **TransactionsController** - 100% cobertura
- ✅ **AppController** - 100% cobertura

## 🔧 Configuração

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'test/.*\\.spec\\.ts$',  // Testes na pasta test/
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',  // Cobertura apenas do código fonte
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/index.ts',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
};
```

### Setup Global (`test/setup.ts`)
```typescript
import 'reflect-metadata';

beforeAll(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});
```

## 🧩 Padrões de Teste

### Estrutura dos Testes
Cada arquivo de teste segue o padrão:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceName } from '../src/module/service.service';

describe('ServiceName', () => {
  let service: ServiceName;
  let dependencies: MockDependencies;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceName,
        // Mocks das dependências
      ],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('methodName', () => {
    it('should do something when condition', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Imports
Como os testes estão na pasta `test/`, os imports apontam para `../src/`:

```typescript
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/users/entities/user.entity';
```

### Mocks
- **Repositories**: Mockados usando `getRepositoryToken`
- **Services**: Mockados com funções Jest
- **External Dependencies**: Mockados conforme necessário

## 📈 Métricas de Qualidade

### Cobertura Mínima
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Tipos de Teste
- **Unit Tests**: Testes isolados de cada componente
- **Integration Tests**: Testes de integração entre componentes
- **E2E Tests**: Testes end-to-end (separados)

## 🐛 Debugging

### Executar testes em modo debug
```bash
npm run test:debug
```

### Logs de Teste
Para ver logs durante os testes:
```typescript
// Temporariamente desabilitar mock do console
console.log = jest.fn().mockImplementation((...args) => {
  // Log real durante testes
});
```

## 📝 Boas Práticas

1. **Nomes Descritivos**: Use nomes claros para describe e it
2. **Arrange-Act-Assert**: Estruture os testes em 3 partes
3. **Mocks Limpos**: Sempre limpe os mocks após cada teste
4. **Testes Isolados**: Cada teste deve ser independente
5. **Cobertura Completa**: Teste casos de sucesso e erro
6. **Organização**: Mantenha os testes na pasta `test/`

## 🔄 Manutenção

### Adicionando Novos Testes
1. Crie o arquivo `.spec.ts` na pasta `test/`
2. Siga a estrutura padrão dos testes existentes
3. Use imports que apontem para `../src/`
4. Adicione casos de teste para sucesso e erro
5. Execute os testes para verificar a cobertura

### Atualizando Testes
1. Mantenha os mocks atualizados com as mudanças no código
2. Adicione novos casos de teste para novas funcionalidades
3. Remova testes obsoletos
4. Verifique a cobertura após mudanças

## 🚨 Troubleshooting

### Problemas Comuns

**Erro de Import**
```bash
# Verificar se os imports apontam para ../src/
import { Service } from '../src/module/service';
```

**Erro de Mock**
```bash
# Verificar se o mock está configurado corretamente
jest.clearAllMocks();
```

**Erro de Dependência**
```bash
# Verificar se todas as dependências estão mockadas
const module = await Test.createTestingModule({
  providers: [
    // Todos os providers necessários
  ],
}).compile();
```

## 🎉 Vantagens da Nova Estrutura

✅ **Organização Clara**: Testes separados do código fonte
✅ **Fácil Manutenção**: Estrutura consistente e previsível
✅ **Cobertura Completa**: 76 testes cobrindo todos os cenários
✅ **Performance**: Execução rápida e eficiente
✅ **Documentação**: Estrutura bem documentada 