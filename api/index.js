const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token ausente" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "segredo");
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido" });
  }
}

// Login
app.post("/api/login", async (req, res) => {
  const { usuario, senha } = req.body;
  const user = await prisma.usuario.findUnique({
    where: { usuario }, include: { Profissional: true }
  });
  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });
  if (user.senha !== senha) return res.status(401).json({ error: "Senha incorreta" });
  const permissoes = await prisma.permissao.findUnique({ where: { usuarioId: user.id } });
  const token = jwt.sign({ id: user.id, usuario, permissoes }, process.env.JWT_SECRET || "segredo");
  res.json({ token, user: { id: user.id, usuario: user.usuario, nome: user.Profissional?.nome, permissoes } });
});

// CRUD Obra
app.get("/api/obras", auth, async (req, res) => {
  const obras = await prisma.obra.findMany({
    include: { Viagem: true, Ocorrencia: true, ClimaTempo: true }
  });
  res.json(obras);
});
app.post("/api/obras", auth, async (req, res) => {
  try {
    const obra = await prisma.obra.create({ data: req.body });
    res.json(obra);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// CRUD Veiculo
app.get("/api/veiculos", auth, async (req, res) => {
  res.json(await prisma.veiculo.findMany({ include: { Viagem: true, Ocorrencia: true } }));
});
app.post("/api/veiculos", auth, async (req, res) => {
  try {
    const v = await prisma.veiculo.create({ data: req.body });
    res.json(v);
  } catch (err) { res.status(400).json({ error: err.message }); }
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

app.get("/", (_, res) => res.send("Apontador API rodando!"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));