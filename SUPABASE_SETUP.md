# 🚀 Configuração Supabase - Apontador 1.0

## ✅ Configurações Realizadas

### 1. Banco de Dados
- **DATABASE_URL**: Configurado para Supabase remoto
- **Formato**: `postgresql://postgres.cbljnvxqadnajothjjay:Ab@1Seguro1@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public`

### 2. Variáveis de Ambiente (.env)
```env
DATABASE_URL="postgresql://postgres.cbljnvxqadnajothjjay:Ab@1Seguro1@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public"
JWT_SECRET=Ab@1Seguro1
SUPABASE_URL=https://cbljnvxqadnajothjjay.supabase.co
SUPABASE_KEY=process.env.SUPABASE_KEY
```

### 3. Dependências Adicionadas
- `@supabase/supabase-js`: Cliente JavaScript do Supabase

## 🔧 Comandos para Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Testar Conexão
```bash
npm run test:connection
```

### 3. Gerar Cliente Prisma
```bash
npm run prisma:generate
```

### 4. Aplicar Migrações (Primeira vez)
```bash
npx prisma migrate deploy
```

### 5. Validar Conexão com Banco
```bash
npm run prisma:pull
```

### 6. Popular Dados Iniciais
```bash
npm run seed
```

### 7. Executar Aplicação
```bash
npm run dev
```

## 🌐 Deploy no Vercel

### 1. Configurar Variáveis no Vercel
No painel do Vercel (Settings → Environment Variables):

- `DATABASE_URL`: `postgresql://postgres.cbljnvxqadnajothjjay:Ab@1Seguro1@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public`
- `JWT_SECRET`: `Ab@1Seguro1`
- `SUPABASE_URL`: `https://cbljnvxqadnajothjjay.supabase.co`
- `SUPABASE_KEY`: `[SUA_CHAVE_SUPABASE_REAL]`
- `NODE_ENV`: `production`

### 2. Deploy Automático
O Vercel detectará automaticamente via `vercel.json`.

### 3. Executar Migrações em Produção
Após primeiro deploy:
```bash
# Via Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

## 🔍 Verificações

### Health Check
- Local: `http://localhost:3000/api/health`
- Produção: `https://seu-app.vercel.app/api/health`

### Endpoints Principais
- Login: `/api/login`
- Obras: `/api/obras`
- Veículos: `/api/veiculos`
- Dashboard: `/api/dashboard-kpis`

## 🐛 Troubleshooting

### Erro de Conexão
1. Verificar `DATABASE_URL` no `.env`
2. Testar: `npm run test:connection`
3. Validar: `npm run prisma:pull`

### Erro no Vercel
1. Verificar variáveis de ambiente no painel
2. Conferir logs de build
3. Executar migrações: `npx prisma migrate deploy`

## 📋 Checklist Final

- [ ] `.env` configurado com Supabase
- [ ] Dependências instaladas (`npm install`)
- [ ] Conexão testada (`npm run test:connection`)
- [ ] Migrações aplicadas (`npx prisma migrate deploy`)
- [ ] Dados populados (`npm run seed`)
- [ ] App funcionando localmente (`npm run dev`)
- [ ] Variáveis configuradas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] Health check funcionando em produção