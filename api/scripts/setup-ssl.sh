#!/bin/bash

# Script para configurar SSL com mkcert
echo "🔐 Configurando SSL com mkcert..."

# Verificar se mkcert está instalado
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert não está instalado."
    echo "📦 Instalando mkcert..."
    
    # Detectar o sistema operacional
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt &> /dev/null; then
            sudo apt update
            sudo apt install -y mkcert libnss3-tools
        elif command -v yum &> /dev/null; then
            sudo yum install -y mkcert nss-tools
        elif command -v dnf &> /dev/null; then
            sudo dnf install -y mkcert nss-tools
        else
            echo "❌ Gerenciador de pacotes não suportado. Instale mkcert manualmente."
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install mkcert
        else
            echo "❌ Homebrew não encontrado. Instale mkcert manualmente."
            exit 1
        fi
    else
        echo "❌ Sistema operacional não suportado. Instale mkcert manualmente."
        exit 1
    fi
fi

# Instalar certificado CA local
echo "📜 Instalando certificado CA local..."
mkcert -install

# Criar diretório para certificados se não existir
mkdir -p certs

# Gerar certificados para localhost
echo "🔑 Gerando certificados para localhost..."
cd certs
mkcert localhost 127.0.0.1 ::1

echo "✅ SSL configurado com sucesso!"
echo "📝 Para habilitar HTTPS, defina USE_SSL=true no seu arquivo .env"
echo "🚀 Execute: npm run start:dev para iniciar a aplicação com HTTPS" 