const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require('@supabase/supabase-js');
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = 'https://cbljnvxqadnajothjjay.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty'
});

// Configuração de CORS mais robusta
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error('Erro na API:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
  });
};

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token ausente" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "segredo");
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error.message);
    return res.status(403).json({ error: "Token inválido" });
  }
}

// Middleware de verificação de permissões
function checkPermission(permission) {
  return (req, res, next) => {
    if (!req.user.permissoes) {
      return res.status(403).json({ error: "Permissões não encontradas" });
    }
    if (!req.user.permissoes.adm && !req.user.permissoes[permission]) {
      return res.status(403).json({ error: "Sem permissão para esta ação" });
    }
    next();
  };
}

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      database: "connected",
      version: "1.0.0"
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message
    });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    
    if (!usuario || !senha) {
      return res.status(400).json({ error: "Usuário e senha são obrigatórios" });
    }
    
    const user = await prisma.usuario.findUnique({
      where: { usuario }, 
      include: { 
        Profissional: true,
        Permissao: true
      }
    });
    
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }
    
    if (user.senha !== senha) {
      return res.status(401).json({ error: "Senha incorreta" });
    }
    
    const permissoes = user.Permissao || {};
    const token = jwt.sign(
      { 
        id: user.id, 
        usuario: user.usuario, 
        permissoes 
      }, 
      process.env.JWT_SECRET || "segredo",
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true,
      token, 
      user: { 
        id: user.id, 
        usuario: user.usuario, 
        nome: user.Profissional?.nome || 'Usuário', 
        permissoes 
      } 
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// CRUD Obra
app.get("/api/obras", auth, checkPermission('obras'), async (req, res) => {
  try {
    const obras = await prisma.obra.findMany({
      include: { 
        Viagem: {
          select: { id: true, data_hora: true, quantidade_viagens: true }
        },
        Ocorrencia: {
          select: { id: true, status: true }
        },
        ClimaTempo: {
          select: { id: true, data_ocorrencia: true }
        }
      },
      orderBy: { nome_obra: 'asc' }
    });
    
    // Converter BigInt para string para JSON
    const obrasFormatted = obras.map(obra => ({
      ...obra,
      id: obra.id.toString(),
      Viagem: obra.Viagem.map(v => ({ ...v, id: v.id.toString() })),
      Ocorrencia: obra.Ocorrencia.map(o => ({ ...o, id: o.id.toString() })),
      ClimaTempo: obra.ClimaTempo.map(c => ({ ...c, id: c.id.toString() }))
    }));
    
    res.json(obrasFormatted);
  } catch (error) {
    console.error('Erro ao buscar obras:', error);
    res.status(500).json({ error: "Erro ao buscar obras" });
  }
});

app.post("/api/obras", auth, checkPermission('obras'), async (req, res) => {
  try {
    const { nome_obra, servico, local, ativa = true } = req.body;
    
    if (!nome_obra) {
      return res.status(400).json({ error: "Nome da obra é obrigatório" });
    }
    
    const obra = await prisma.obra.create({ 
      data: { nome_obra, servico, local, ativa }
    });
    
    res.json({ ...obra, id: obra.id.toString(), success: true });
  } catch (error) {
    console.error('Erro ao criar obra:', error);
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/obras/:id", auth, checkPermission('obras'), async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const obra = await prisma.obra.update({
      where: { id },
      data: req.body
    });
    res.json({ ...obra, id: obra.id.toString(), success: true });
  } catch (error) {
    console.error('Erro ao atualizar obra:', error);
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/obras/:id", auth, checkPermission('obras'), async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    await prisma.obra.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir obra:', error);
    res.status(400).json({ error: error.message });
  }
});

// Obras ativas (para seleção em viagens)
app.get("/api/obras-ativas", auth, async (req, res) => {
  try {
    const obras = await prisma.obra.findMany({
      where: { ativa: true },
      select: { nome_obra: true },
      distinct: ['nome_obra'],
      orderBy: { nome_obra: 'asc' }
    });
    res.json(obras.map(o => o.nome_obra));
  } catch (error) {
    console.error('Erro ao buscar obras ativas:', error);
    res.status(500).json({ error: "Erro ao buscar obras ativas" });
  }
});

// CRUD Veiculo
app.get("/api/veiculos", auth, checkPermission('veiculo'), async (req, res) => {
  try {
    const veiculos = await prisma.veiculo.findMany({ 
      include: { 
        Viagem: {
          select: { id: true, data_hora: true, quantidade_viagens: true }
        },
        Ocorrencia: {
          select: { id: true, status: true }
        }
      },
      orderBy: { veiculo: 'asc' }
    });
    
    const veiculosFormatted = veiculos.map(veiculo => ({
      ...veiculo,
      id: veiculo.id.toString(),
      id_veiculo: veiculo.id.toString(), // Compatibilidade com frontend
      Viagem: veiculo.Viagem.map(v => ({ ...v, id: v.id.toString() })),
      Ocorrencia: veiculo.Ocorrencia.map(o => ({ ...o, id: o.id.toString() }))
    }));
    
    res.json(veiculosFormatted);
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    res.status(500).json({ error: "Erro ao buscar veículos" });
  }
});

app.post("/api/veiculos", auth, checkPermission('veiculo'), async (req, res) => {
  try {
    const { veiculo, placa, cubagem_m3, motorista } = req.body;
    
    if (!veiculo || !placa) {
      return res.status(400).json({ error: "Veículo e placa são obrigatórios" });
    }
    
    const novoVeiculo = await prisma.veiculo.create({ 
      data: { 
        veiculo, 
        placa: placa.toUpperCase(), 
        cubagem_m3: parseFloat(cubagem_m3) || 0, 
        motorista 
      }
    });
    
    res.json({ 
      ...novoVeiculo, 
      id: novoVeiculo.id.toString(),
      id_veiculo: novoVeiculo.id.toString(),
      success: true 
    });
  } catch (error) {
    console.error('Erro ao criar veículo:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: "Placa já cadastrada" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

app.put("/api/veiculos/:id", auth, checkPermission('veiculo'), async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const { veiculo, placa, cubagem_m3, motorista } = req.body;
    
    const veiculoAtualizado = await prisma.veiculo.update({
      where: { id },
      data: { 
        veiculo, 
        placa: placa?.toUpperCase(), 
        cubagem_m3: parseFloat(cubagem_m3) || 0, 
        motorista 
      }
    });
    
    res.json({ 
      ...veiculoAtualizado, 
      id: veiculoAtualizado.id.toString(),
      success: true 
    });
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/veiculos/:id", auth, checkPermission('veiculo'), async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    await prisma.veiculo.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir veículo:', error);
    res.status(400).json({ error: error.message });
  }
});

// CRUD Profissional
app.get("/api/profissionais", auth, async (req, res) => {
  res.json(await prisma.profissional.findMany({ include: { Usuario: true } }));
});
app.post("/api/profissionais", auth, async (req, res) => {
  try {
    const p = await prisma.profissional.create({ data: req.body });
    res.json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// CRUD Usuario
app.get("/api/usuarios", auth, async (req, res) => {
  const usuarios = await prisma.usuario.findMany({
    include: { Profissional: true, Permissao: true }
  });
  res.json(usuarios);
});
app.post("/api/usuarios", auth, async (req, res) => {
  try {
    const user = await prisma.usuario.create({ data: req.body });
    res.json(user);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Permissão
app.post("/api/permissoes", auth, async (req, res) => {
  let { id_profissional, usuario, senha, ...perms } = req.body;
  id_profissional = BigInt(id_profissional);
  // Busca/vincula usuário
  let user = await prisma.usuario.findFirst({ where: { profissionalId: id_profissional } });
  if (!user && usuario) {
    user = await prisma.usuario.create({ data: { usuario, senha, profissionalId: id_profissional } });
  }
  if (!user) return res.status(404).json({ error: "Usuário/profissional não encontrado" });
  if (senha) await prisma.usuario.update({ where: { id: user.id }, data: { senha } });
  const result = await prisma.permissao.upsert({
    where: { usuarioId: user.id },
    update: perms,
    create: { usuarioId: user.id, ...perms }
  });
  res.json(result);
});

// CRUD Viagem
app.get("/api/viagens", auth, async (req, res) => {
  const viagens = await prisma.viagem.findMany({
    include: { Obra: true, Veiculo: true, Usuario: true }
  });
  res.json(viagens);
});
app.post("/api/viagens", auth, async (req, res) => {
  let { obraId, veiculoId, usuarioId, ...data } = req.body;
  obraId = BigInt(obraId); veiculoId = BigInt(veiculoId); usuarioId = BigInt(usuarioId);
  try {
    const v = await prisma.viagem.create({ data: { obraId, veiculoId, usuarioId, ...data } });
    res.json(v);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// CRUD Ocorrencia
app.get("/api/ocorrencias-transportes", auth, async (req, res) => {
  const result = await prisma.ocorrencia.findMany({
    include: { Obra: true, Veiculo: true }
  });
  res.json(result);
});
app.post("/api/ocorrencias-transportes", auth, async (req, res) => {
  let { obra_local_id, veiculo_id, ...data } = req.body;
  obra_local_id = BigInt(obra_local_id);
  veiculo_id = veiculo_id ? BigInt(veiculo_id) : undefined;
  try {
    const o = await prisma.ocorrencia.create({ data: { obra_local_id, veiculo_id, ...data } });
    res.json(o);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// CRUD ClimaTempo
app.get("/api/clima-tempo", auth, async (req, res) => {
  res.json(await prisma.climaTempo.findMany({ include: { Obra: true } }));
});
app.post("/api/clima-tempo", auth, async (req, res) => {
  let { obra_local_id, ...data } = req.body;
  obra_local_id = BigInt(obra_local_id);
  try {
    const c = await prisma.climaTempo.create({ data: { obra_local_id, ...data } });
    res.json(c);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// CRUD EmpresaConfig
app.get("/api/empresa-config", auth, async (req, res) => {
  const c = await prisma.empresaConfig.findFirst();
  res.json(c || {});
});
app.post("/api/empresa-config", auth, async (req, res) => {
  const { id, ...data } = req.body;
  let config;
  if (id) config = await prisma.empresaConfig.update({ where: { id: BigInt(id) }, data });
  else config = await prisma.empresaConfig.create({ data });
  res.json(config);
});

// KPIs Dashboard (Exemplo)
app.get("/api/dashboard-kpis", auth, async (req, res) => {
  const ocorrencias_andamento = await prisma.ocorrencia.count({ where: { status: "em andamento" } });
  const chuvas_mes = await prisma.climaTempo.count({ where: {
    data_ocorrencia: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), lte: new Date() }
  }});
  res.json({
    ocorrencias_andamento,
    chuvas_mes,
    disponibilidade_media: 98,
    tempo_parado_medio: 2,
    eficiencia_media: 95,
    total_viagens: await prisma.viagem.count()
  });
});

// Middleware de tratamento de erros (deve vir por último)
app.use(errorHandler);

// Rota raiz
app.get("/", (_, res) => {
  res.json({
    message: "Apontador API rodando!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      login: "/api/login",
      obras: "/api/obras",
      veiculos: "/api/veiculos",
      profissionais: "/api/profissionais",
      usuarios: "/api/usuarios",
      viagens: "/api/viagens"
    }
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: "Endpoint não encontrado",
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Apontador API rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Login: http://localhost:${PORT}/api/login`);
  });
}

// Para Vercel
module.exports = app;