FROM node:20

# Instalar mkcert e dependências necessárias
RUN apt-get update && apt-get install -y \
    mkcert \
    libnss3-tools \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Script para configurar SSL se necessário
COPY scripts/setup-ssl.sh ./scripts/setup-ssl.sh
RUN chmod +x ./scripts/setup-ssl.sh

# Copiar arquivo .env se existir
COPY .env* ./

# Build da aplicação
RUN npm run build

# Expor porta padrão
EXPOSE 3001

# Script de inicialização que configura SSL se necessário
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]