# 💼 Desafio Técnico Dev Fullstack Pleno
Este é um desafio técnico para a vaga de Desenvolvedor Pleno. Seu objetivo é desenvolver uma aplicação movimentações financeiras, com autenticação de usuário, associação de categorias e persistência em banco de dados.

## 🧰 Requisitos Técnicos
- Usar a estrutura inicial deste repositório (API utilizando NestJS e UI utilizando NextJS+Tailwind).
- Login de usuário.
- Cadastro de Usuários.
- Cadastro de Movimentações.
- Cadastro de Categorias
- As movimentações devem ser associadas ao usuário autenticado.

## ✅ O que será avaliado?

- **📁 Organização do Código**  
  Estrutura clara de pastas e arquivos, padronização e uso adequado de convenções do framework.

- **🧹 Legibilidade e Clareza**  
  Código limpo, bem nomeado e fácil de entender. Comentários úteis (quando necessário) e ausência de complexidade desnecessária.

- **🛠️ Boas Práticas de Desenvolvimento**  
  Uso de princípios como DRY (Don't Repeat Yourself), SOLID, controle de erros, validações e segurança básica.

- **💾 Persistência de Dados**  
  Implementação correta de banco de dados, com relacionamentos adequados entre usuários, categorias e movimentações.  
  **Dica:** Use um ORM 👀

- **📝 Documentação**  
  README com orientações completas sobre instalação*, execução e stack utilizada.  
  A API deve estar documentada com **Swagger**.

> ⚠️ **Importante:** Projetos que **não rodarem seguindo as instruções do README** poderão **ser desconsiderados** na avaliação.


## 🌟 Diferenciais
Não são obrigatórios, mas serão considerados um **bônus** na sua avaliação:

- 🧪 **Testes Automatizados**  
  Cobertura de testes (unitários e/ou de integração).

- 📱 **Responsividade no Frontend**  
  Interface adaptada para diferentes tamanhos de tela.

- 🚀 **Deploy do Projeto**  
  Aplicação hospedada (ex: Vercel, Netlify, Render, Railway, etc), com link acessível no README.

- 🛡️ **Tratamento de Erros e Validações**  
  Respostas consistentes e mensagens claras de erro na API.

- 🧩 **Arquitetura Escalável**  
  Separação por camadas (ex: controllers, services, repositories), facilitando manutenção e evolução do projeto.

- 🗂️ **Documentação Extra**  
  Diagramas, fluxos ou qualquer outro material que ajude a entender a arquitetura ou decisões técnicas.

## 📁 Estrutura do Projeto

O projeto está dividido em duas aplicações separadas:
```text
📦 projeto-raiz/
├── 📁 api/                      # Backend (NestJS)
│   ├── 📁 node_modules/
│   ├── 📁 src/                  # Código-fonte da API
│   ├── 📁 test/                 # Testes automatizados
│   ├── ...
│
├── 📁 ui/                       # Frontend (Next.js)
│   ├── 📁 node_modules/
│   ├── 📁 public/               # Arquivos estáticos
│   ├── 📁 src/
│   │   └── 📁 app/              # Código-fonte do frontend
│   ├── ...
```

## 🗄️ Banco de Dados
Se sua aplicação utilizar **banco de dados relacional** (como PostgreSQL, MySQL, etc), é **obrigatório** fornecer um dos seguintes:

- Script SQL para criação das tabelas e estruturas necessárias  
  **ou**
- Migrations configuradas e executáveis via ORM.

> ⚠️ **Importante:** Sem essas informações, **não será possível rodar a aplicação**, e ela poderá ser **desconsiderada** na avaliação.

## ⏱️ Prazo de entrega sugerido:
3 a 5 dias corridos. Qualidade importa mais do que velocidade.

## 🚀 Como Enviar sua Solução
- 🔀 Faça um Fork deste repositório para a sua conta no GitHub.
- 🧑🏽‍💻 Implemente a sua solução no repositório forkado.
- 🌐 Certifique-se de que o repositório esteja público.
- 📩 Envie o link do seu repositório para o e-mail:
  - ti@profissionaissa.com
  - Com cópia para: jonata.martins@profissionaissa.com
