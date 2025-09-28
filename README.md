# Project Frontend IA

![Tela de login](src/assets/images/image-readme.png)

Aplicação SPA para autenticação via JWT e gestão de produtos (cadastro, listagem e exclusão) construída com React, Vite, TypeScript e Tailwind. Este repositório contempla apenas o front-end; o back-end em Spring Boot com PostgreSQL está disponível em projeto separado.

## Tecnologias
- React 18 com Vite e TypeScript
- Tailwind CSS para estilização
- Axios para comunicação com a API
- Context API + React Router para controle de sessão e rotas protegidas

## Pré-requisitos
- Docker e Docker Compose
- Opcional: Node.js 18+ caso queira rodar os scripts diretamente

## Configuração de ambiente
- O arquivo `.env` já está preenchido para o cenário do teste. Ajuste `VITE_API_URL` apenas se desejar apontar para outro backend.
- Para sobrescrever a URL em tempo de execução, exporte `VITE_API_URL` antes de subir os containers ou utilize `--env` com `docker compose`.

## Executando com Docker
```bash
docker compose up --build frontend
# aplicação disponível em http://localhost:4173
```
- Finalize a execução com `docker compose down`.
- Caso altere dependências, rode `docker compose build --no-cache frontend` para reconstruir a imagem.

## Scripts npm (opcional)
- `npm run dev` - modo desenvolvimento local
- `npm run build` - gera o bundle de produção (`dist/`)
- `npm run preview` - visualiza o bundle localmente

## Estrutura principal
- `src/services/api.ts` - cliente Axios configurado com interceptadores de token
- `src/context/AuthContext.tsx` - gerenciamento de sessão e persistência do JWT
- `src/components/ProtectedRoute.tsx` - proteção de rotas autenticadas
- `src/pages/Login.tsx` - tela de login que consome a API de autenticação
- `src/pages/Dashboard.tsx` - formulário e listagem de produtos integrados à API
