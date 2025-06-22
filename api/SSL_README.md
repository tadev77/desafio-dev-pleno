# Configuração SSL com mkcert

Este projeto suporta HTTPS local usando certificados gerados pelo [mkcert](https://github.com/FiloSottile/mkcert).

## 🚀 Configuração Rápida

### 1. Configurar SSL (uma vez)
```bash
npm run setup:ssl
```

### 2. Habilitar HTTPS
Crie um arquivo `.env` baseado no `.env-example` e defina:
```env
USE_SSL=true
```

### 3. Executar com HTTPS
```bash
# Desenvolvimento
npm run start:https

# Produção
npm run start:https:prod
```

## 📋 Configuração Manual

### 1. Instalar mkcert

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y mkcert libnss3-tools
```

**macOS:**
```bash
brew install mkcert
```

**Windows:**
```bash
choco install mkcert
```

### 2. Instalar certificado CA local
```bash
mkcert -install
```

### 3. Gerar certificados para o projeto
```bash
cd api
mkdir -p certs
cd certs
mkcert localhost 127.0.0.1 ::1
```

### 4. Configurar variáveis de ambiente
No arquivo `.env`:
```env
USE_SSL=true
PORT=3001
```

## 🔧 Como Funciona

- **mkcert**: Gera certificados SSL válidos para desenvolvimento local
- **Certificados**: São gerados para `localhost`, `127.0.0.1` e `::1`
- **Configuração**: A aplicação detecta automaticamente se deve usar HTTP ou HTTPS
- **Fallback**: Se os certificados não forem encontrados, a aplicação roda em HTTP

## 📁 Estrutura de Arquivos

```
api/
├── certs/
│   ├── localhost+2.pem      # Certificado público
│   └── localhost+2-key.pem  # Chave privada
├── scripts/
│   └── setup-ssl.sh         # Script de configuração
├── src/
│   └── config/
│       └── ssl.config.ts    # Configuração SSL
└── SSL_README.md            # Esta documentação
```

## 🌐 URLs de Acesso

Com SSL habilitado:
- **API**: https://localhost:3001
- **Swagger**: https://localhost:3001/swagger

Sem SSL:
- **API**: http://localhost:3001
- **Swagger**: http://localhost:3001/swagger

## 🔒 Segurança

- Os certificados são válidos apenas para desenvolvimento local
- O certificado CA é instalado no sistema para confiar nos certificados gerados
- Em produção, use certificados válidos de uma autoridade certificadora

## 🐛 Solução de Problemas

### Certificado não confiável
```bash
# Reinstalar certificado CA
mkcert -install
```

### Certificados não encontrados
```bash
# Regenerar certificados
cd api/certs
mkcert localhost 127.0.0.1 ::1
```

### Erro de permissão
```bash
# Verificar permissões dos certificados
chmod 600 api/certs/localhost+2-key.pem
chmod 644 api/certs/localhost+2.pem
```

## 📝 Notas

- Os certificados expiram em 825 dias (aproximadamente 2 anos)
- Para renovar, execute novamente o script de configuração
- O mkcert é uma ferramenta de desenvolvimento, não use em produção 