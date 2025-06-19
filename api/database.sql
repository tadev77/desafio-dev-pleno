-- Script para criação do banco de dados
-- Execute este script no PostgreSQL para criar o banco de dados

-- Criar banco de dados
CREATE DATABASE desafio_dev_pleno;

-- Conectar ao banco criado
\c desafio_dev_pleno;

-- As tabelas serão criadas automaticamente pelo TypeORM
-- Este script apenas cria o banco de dados

-- Para verificar se tudo está funcionando, você pode executar:
-- \dt (lista as tabelas)
-- \d users (mostra a estrutura da tabela users) 