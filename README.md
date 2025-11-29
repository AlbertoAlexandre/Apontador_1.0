# Apontador-JS

Sistema web/mobile (PWA/React Native ready) para controle de viagens, transporte, frota, profissionais, clima, ocorrências, diárias e dashboard executivo, idêntico ao Apontador Python/Flask original.

## Instalação

1. Crie o banco no [Supabase](https://supabase.com) ou [PlanetScale](https://planetscale.com) e configure `DATABASE_URL` no `.env`.
2. Instale dependências:
   ```sh
   npm install
   cd app
   npm install
   ```
3. Migre e gere o Prisma:
   ```sh
   npm run prisma:migrate
   npm run prisma:generate
   ```
4. (Opcional) Rode seed inicial:
   ```sh
   npm run seed
   ```
5. Rodar local:
   ```sh
   npm run dev
   ```
6. PUSH para: [https://github.com/AlbertoAlexandre/Apontador_1.0.git](https://github.com/AlbertoAlexandre/Apontador_1.0.git)
7. Deploy no Vercel: [https://vercel.com/import/git](https://vercel.com/import/git)

## Estrutura

- **app/** — React, Bootstrap, PWA/mobile-ready, todos módulos.
- **api/** — Backend Express, rotas REST.
- **prisma/** — Esquema, migração, seed.
- **Dashboards** — profissionais, gráficos, exportação, relatórios.
- **Painel de controle** — Permissões, empresa, usuários.
- **Exportação** — Excel, PDF, imagem direto do dashboard.

## Mobile/PWA

- Instale no celular: Chrome > Opções > "Adicionar à Tela Inicial".
- Layout e botões otimizados para toque.
- Pronto para app mobile com React Native.

## Usuário admin (seed)

Usuário: **adm**  
Senha: **123**

---