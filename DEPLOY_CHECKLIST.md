# 📋 Checklist de Deploy - Apontador 1.0

## ✅ Pré-Deploy (Desenvolvimento)

### 1. Configuração Local
- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install` na raiz e em `/app`)
- [ ] Arquivo `.env` configurado com todas as variáveis
- [ ] Banco de dados PostgreSQL/Supabase configurado
- [ ] Migrações executadas (`npm run prisma:migrate`)
- [ ] Dados seed carregados (`npm run seed` ou `npm run seed:csv`)
- [ ] Aplicação rodando localmente (`npm run dev`)
- [ ] Login funcionando (usuário: `adm`, senha: `123`)

### 2. Testes Locais
- [ ] API respondendo em `/api/health`
- [ ] Frontend carregando corretamente
- [ ] Autenticação JWT funcionando
- [ ] CRUD de obras, veículos e profissionais
- [ ] Registro de viagens
- [ ] Dashboard carregando dados
- [ ] Permissões de usuário funcionando

## 🚀 Deploy no Vercel

### 1. Preparação do Repositório
- [ ] Código commitado no GitHub
- [ ] Arquivo `vercel.json` configurado
- [ ] `package.json` com script `vercel-build`
- [ ] Frontend com `package.json` próprio em `/app`
- [ ] Prisma schema atualizado

### 2. Configuração no Vercel
- [ ] Projeto conectado ao GitHub
- [ ] Framework detectado como "Other"
- [ ] Build Command: `npm run vercel-build`
- [ ] Output Directory: `app/build`
- [ ] Install Command: `npm install`
- [ ] Node.js version: 18.x

### 3. Variáveis de Ambiente no Vercel
- [ ] `DATABASE_URL` - URL do Supabase/PostgreSQL
- [ ] `JWT_SECRET` - Chave secreta forte
- [ ] `NODE_ENV` - `production`
- [ ] `NEXT_PUBLIC_API_URL` - URL da API (deixar vazio para usar relativo)
- [ ] `FRONTEND_URL` - URL do frontend
- [ ] Outras variáveis conforme necessário

### 4. Configuração do Banco (Supabase)
- [ ] Projeto Supabase criado
- [ ] URL e chaves copiadas
- [ ] RLS (Row Level Security) configurado se necessário
- [ ] Políticas de acesso criadas
- [ ] Backup dos dados locais (se aplicável)

## 🔧 Pós-Deploy

### 1. Verificações Imediatas
- [ ] Site carregando na URL do Vercel
- [ ] API respondendo em `/api/health`
- [ ] Página de login acessível
- [ ] Login funcionando com usuário padrão
- [ ] Dashboard carregando sem erros
- [ ] Dados sendo exibidos corretamente

### 2. Testes Funcionais
- [ ] Criar nova obra
- [ ] Cadastrar veículo
- [ ] Registrar viagem
- [ ] Visualizar relatórios
- [ ] Testar permissões de usuário
- [ ] Verificar responsividade mobile

### 3. Monitoramento
- [ ] Logs do Vercel sem erros críticos
- [ ] Performance da aplicação aceitável
- [ ] Banco de dados respondendo rapidamente
- [ ] Certificado SSL ativo

## 🐛 Troubleshooting Comum

### Erro: "Build failed"
- [ ] Verificar logs de build no Vercel
- [ ] Confirmar se todas as dependências estão no `package.json`
- [ ] Verificar se o script `vercel-build` está correto
- [ ] Testar build localmente: `npm run build`

### Erro: "API not responding"
- [ ] Verificar se `api/index.js` está correto
- [ ] Confirmar variáveis de ambiente no Vercel
- [ ] Verificar se `DATABASE_URL` está acessível
- [ ] Testar conexão com banco: `npx prisma db pull`

### Erro: "Database connection failed"
- [ ] Verificar URL do banco no Supabase
- [ ] Confirmar se IP do Vercel está liberado
- [ ] Executar migrações: `npx prisma migrate deploy`
- [ ] Verificar se schema está atualizado

### Erro: "Frontend not loading"
- [ ] Verificar se build do React foi bem-sucedido
- [ ] Confirmar se `public/index.html` existe
- [ ] Verificar rotas no `vercel.json`
- [ ] Testar build local: `cd app && npm run build`

## 📊 Métricas de Sucesso

### Performance
- [ ] Tempo de carregamento inicial < 3s
- [ ] API respondendo < 500ms
- [ ] Queries do banco < 200ms
- [ ] Score Lighthouse > 80

### Funcionalidade
- [ ] Taxa de erro < 1%
- [ ] Uptime > 99%
- [ ] Todas as funcionalidades operacionais
- [ ] Dados sendo persistidos corretamente

## 🔄 Manutenção Pós-Deploy

### Diário
- [ ] Verificar logs de erro
- [ ] Monitorar performance
- [ ] Backup automático funcionando

### Semanal
- [ ] Revisar métricas de uso
- [ ] Verificar atualizações de dependências
- [ ] Testar funcionalidades críticas

### Mensal
- [ ] Atualizar dependências
- [ ] Revisar políticas de segurança
- [ ] Otimizar queries do banco
- [ ] Planejar novas funcionalidades

## 📞 Contatos de Emergência

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **GitHub Issues**: [Link do repositório]/issues

## 📝 Notas Importantes

1. **Backup**: Sempre fazer backup do banco antes de mudanças grandes
2. **Staging**: Considerar ambiente de staging para testes
3. **Monitoramento**: Configurar alertas para erros críticos
4. **Documentação**: Manter este checklist atualizado

---

**Data da última atualização**: Dezembro 2024  
**Versão do checklist**: 1.0