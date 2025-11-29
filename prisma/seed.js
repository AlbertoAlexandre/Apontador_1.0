const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Cria profissional admin
  let adminProf = await prisma.profissional.findFirst({ where: { nome: "Alberto Alexandre" } });
  if (!adminProf) {
    adminProf = await prisma.profissional.create({
      data: { nome: "Alberto Alexandre", funcao: "Administrador" }
    });
  }
  let user = await prisma.usuario.findFirst({ where: { usuario: "adm" } });
  if (!user) {
    user = await prisma.usuario.create({
      data: { usuario: "adm", senha: "123", profissionalId: adminProf.id }
    });
  }
  await prisma.permissao.upsert({
    where: { usuarioId: user.id },
    update: {
      adm: true, dashboard: true, registrar_viagem: true, obras: true, veiculo: true,
      profissionais: true, diaria: true, meu_veiculo: true, painel_controle: true,
      visualizar_ocorrencias_transportes: true, visualizar_clima_tempo: true,
    },
    create: {
      usuarioId: user.id,
      adm: true, dashboard: true, registrar_viagem: true, obras: true, veiculo: true,
      profissionais: true, diaria: true, meu_veiculo: true, painel_controle: true,
      visualizar_ocorrencias_transportes: true, visualizar_clima_tempo: true,
    }
  });
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());