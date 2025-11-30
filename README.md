# Apontador 1.0

Sistema web/mobile para controle de viagens, obras, frotas, clima, diárias, registros e dashboard executivo.

## 🚀 Tecnologias

- **Backend**: Node.js + Express + Prisma ORM
- **Frontend**: React.js + Bootstrap 5
- **Banco de Dados**: PostgreSQL (Supabase)
- **Deploy**: Vercel
- **Autenticação**: JWT

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL (ou conta Supabase)
- Git

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd App_Apontador_1
```

### 2. Instale as dependências
```bash
# Dependências do backend
npm install

# Dependências do frontend
cd app
npm install
cd ..
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Banco de dados (Supabase ou PostgreSQL local)
DATABASE_URL="postgresql://usuario:senha@host:porta/database?schema=public"

# JWT Secret (use uma chave forte)
JWT_SECRET="sua_chave_secreta_muito_forte"

# URLs da aplicação
NEXT_PUBLIC_API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"

# Outras configurações opcionais...
```

### 4. Configure o banco de dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Popular com dados iniciais
npm run seed
# ou usar dados CSV
npm run seed:csv
```

### 5. Execute a aplicação

#### Desenvolvimento (backend + frontend)
```bash
npm run dev
```

#### Apenas backend
```bash
npm run server
```

#### Apenas frontend
```bash
cd app
npm start
```

## 🌐 Deploy no Vercel

### 1. Configurar variáveis de ambiente no Vercel

No painel do Vercel, adicione as seguintes variáveis:

- `DATABASE_URL`: URL do seu banco PostgreSQL/Supabase
- `JWT_SECRET`: Chave secreta para JWT
- `NODE_ENV`: `production`

### 2. Deploy automático

O Vercel detectará automaticamente a configuração através do `vercel.json`.

### 3. Executar migrações em produção

Após o primeiro deploy:

```bash
# Via Vercel CLI (se instalado)
vercel env pull .env.production
npx prisma migrate deploy

# Ou configure no script de build do Vercel
```

## 📊 Estrutura do Projeto

```
App_Apontador_1/
├── api/                    # Backend (Express + Prisma)
│   └── index.js           # API principal
├── app/                   # Frontend (React)
│   ├── public/           # Arquivos estáticos
│   ├── src/              # Código fonte React
│   └── package.json      # Dependências frontend
├── prisma/               # Schema e migrações
│   ├── schema.prisma     # Modelo do banco
│   └── seed.js          # Dados iniciais
├── seeds/                # Dados CSV para importação
├── scripts/              # Scripts utilitários
├── .env.example         # Exemplo de variáveis
├── vercel.json          # Configuração Vercel
└── package.json         # Dependências backend
```

## 🔐 Usuário Padrão

- **Usuário**: `adm`
- **Senha**: `123`
- **Permissões**: Administrador completo

## 📱 Funcionalidades

### ✅ Implementadas
- Sistema de login com JWT
- Dashboard executivo
- Cadastro de obras, veículos e profissionais
- Registro de viagens
- Relatórios e diárias
- Controle de permissões
- Ocorrências e manutenções
- Registro de clima/tempo

### 🔄 Em desenvolvimento
- Exportação de relatórios PDF
- Notificações push
- App mobile (React Native)
- Integração com APIs externas

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Backend + Frontend
npm run server          # Apenas backend
cd app && npm start     # Apenas frontend

# Banco de dados
npm run prisma:migrate  # Executar migrações
npm run prisma:generate # Gerar cliente
npm run seed           # Popular dados iniciais
npm run seed:csv       # Popular com dados CSV

# Build e deploy
npm run build          # Build do frontend
npm run vercel-build   # Build para Vercel
```

## 🐛 Troubleshooting

### Erro de conexão com banco
1. Verifique se a `DATABASE_URL` está correta
2. Teste a conexão: `npx prisma db pull`
3. Execute as migrações: `npm run prisma:migrate`

### Erro no build do Vercel
1. Verifique as variáveis de ambiente
2. Confirme se o `vercel.json` está correto
3. Veja os logs no painel do Vercel

### Frontend não carrega
1. Verifique se o backend está rodando
2. Confirme a `NEXT_PUBLIC_API_URL`
3. Verifique o console do navegador

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique os logs da aplicação
2. Acesse `/health` para status do sistema
3. Consulte a documentação da API em `/api`

## 🔄 Atualizações

Para atualizar o sistema:

```bash
git pull origin main
npm install
cd app && npm install && cd ..
npm run prisma:migrate
npm run build
```

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024