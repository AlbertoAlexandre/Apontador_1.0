app.post("/api/permissoes", auth, async (req, res) => {
  const { id_profissional, usuario, senha, ...perms } = req.body;
  let profId = BigInt(id_profissional);
  // Procura/cria usuário vinculado ao profissional
  let user = await prisma.usuario.findFirst({ where: { profissionalId: profId } });
  if (!user && usuario) {
    user = await prisma.usuario.create({
      data: { usuario, senha, profissionalId: profId }
    });
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