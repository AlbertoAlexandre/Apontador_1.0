# 🚀 Deploy Vercel - Apontador 1.0

## ✅ Configuração Híbrida (React + Node.js)

### 1. Variáveis de Ambiente no Vercel
Configure no painel Vercel (Settings → Environment Variables):

```
DATABASE_URL=postgresql://postgres:Ab@1Seguro1@db.cbljnvxqadnajothjjay.supabase.co:5432/postgres
JWT_SECRET=Ab@1Seguro1
SUPABASE_URL=https://cbljnvxqadnajothjjay.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibGpudnhxYWRuYWpvdGhqamF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzE5NzQsImV4cCI6MjA1MDU0Nzk3NH0.example_key
NODE_ENV=production
```

### 2. Deploy Automático
1. Commit e push no GitHub
2. Vercel detecta `vercel.json` automaticamente
3. Build: `npx prisma generate && cd app && npm run build`
4. Deploy completo

### 3. Aplicar Migrações no Supabase
Após primeiro deploy:

```bash
# Via Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy

# Ou via painel Supabase SQL Editor
```

### 4. Estrutura de Rotas
- `/api/*` → Backend Node.js
- `/*` → Frontend React (SPA)
- Assets estáticos servidos corretamente

## 🔍 Verificação Pós-Deploy

### Endpoints
- Health: `https://seu-app.vercel.app/api/health`
- Login: `https://seu-app.vercel.app/api/login`
- Frontend: `https://seu-app.vercel.app/`

### Teste de Funcionamento
```bash
curl https://seu-app.vercel.app/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "version": "1.0.0"
}
```