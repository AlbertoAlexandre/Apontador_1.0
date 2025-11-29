# Apontador_1.0

Sistema web/mobile para controle de viagens, obras, frotas, clima, diárias, registros e dashboard executivo.

**Como rodar:**
1. Configure o .env (DATABASE_URL do Supabase/PostgreSQL).
2. Rode as migrations Prisma e seed:
   ```
   npm run prisma:migrate
   npm run prisma:generate
   npm run seed
   ```
3. Rode o backend `npm run server` e frontend local (`cd app && npm start`).
4. Push para GitHub e deploy no Vercel.

**Usuário admin inicial:**  
Usuário: adm  
Senha: 123

---