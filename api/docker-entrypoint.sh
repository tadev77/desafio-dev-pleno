#!/bin/bash

# Script de entrada do Docker para configurar SSL se necessário

echo "🚀 Iniciando aplicação..."

# Verificar se SSL está habilitado
if [ "$USE_SSL" = "true" ]; then
    echo "🔐 SSL habilitado. Configurando certificados..."
    
    # Instalar certificado CA local
    mkcert -install
    
    # Criar diretório para certificados se não existir
    mkdir -p certs
    
    # Gerar certificados para localhost
    cd certs
    mkcert localhost 127.0.0.1 ::1
    cd ..
    
    echo "✅ Certificados SSL configurados!"
    echo "🌐 Aplicação rodando com HTTPS"
else
    echo "🌐 SSL desabilitado. Rodando com HTTP"
fi

# Verificar se arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando baseado no .env-example..."
    cp .env-example .env
fi

# Executar a aplicação
echo "🚀 Iniciando aplicação NestJS..."
exec npm run start:prod 