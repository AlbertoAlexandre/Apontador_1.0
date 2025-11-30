const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const obj = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      // Remover aspas
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Converter tipos
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(value) && value !== '') value = parseFloat(value);
      
      obj[header] = value;
    });
    
    return obj;
  });
}

async function seedFromCSV() {
  try {
    console.log('🌱 Iniciando seed a partir dos arquivos CSV...');
    
    // Seed Profissionais
    console.log('📋 Importando profissionais...');
    const profissionaisCSV = fs.readFileSync(path.join(__dirname, '../seeds/profissionais.csv'), 'utf8');
    const profissionais = parseCSV(profissionaisCSV);
    
    for (const prof of profissionais) {
      await prisma.profissional.upsert({
        where: { nome: prof.nome },
        update: prof,
        create: prof
      });
    }
    console.log(`✅ ${profissionais.length} profissionais importados`);
    
    // Seed Veículos
    console.log('🚛 Importando veículos...');
    const veiculosCSV = fs.readFileSync(path.join(__dirname, '../seeds/veiculos.csv'), 'utf8');
    const veiculos = parseCSV(veiculosCSV);
    
    for (const veiculo of veiculos) {
      await prisma.veiculo.upsert({
        where: { placa: veiculo.placa },
        update: veiculo,
        create: veiculo
      });
    }
    console.log(`✅ ${veiculos.length} veículos importados`);
    
    // Seed Obras
    console.log('🏗️ Importando obras...');
    const obrasCSV = fs.readFileSync(path.join(__dirname, '../seeds/obras.csv'), 'utf8');
    const obras = parseCSV(obrasCSV);
    
    for (const obra of obras) {
      const existing = await prisma.obra.findFirst({
        where: {
          nome_obra: obra.nome_obra,
          servico: obra.servico,
          local: obra.local
        }
      });
      
      if (!existing) {
        await prisma.obra.create({ data: obra });
      }
    }
    console.log(`✅ ${obras.length} obras processadas`);
    
    // Criar usuário admin se não existir
    console.log('👤 Configurando usuário administrador...');
    const adminProf = await prisma.profissional.findFirst({
      where: { nome: "Alberto Alexandre" }
    });
    
    if (adminProf) {
      const adminUser = await prisma.usuario.upsert({
        where: { usuario: "adm" },
        update: {},
        create: {
          usuario: "adm",
          senha: "123",
          profissionalId: adminProf.id
        }
      });
      
      await prisma.permissao.upsert({
        where: { usuarioId: adminUser.id },
        update: {
          adm: true,
          dashboard: true,
          registrar_viagem: true,
          obras: true,
          veiculo: true,
          profissionais: true,
          diaria: true,
          meu_veiculo: true,
          painel_controle: true,
          visualizar_ocorrencias_transportes: true,
          visualizar_clima_tempo: true
        },
        create: {
          usuarioId: adminUser.id,
          adm: true,
          dashboard: true,
          registrar_viagem: true,
          obras: true,
          veiculo: true,
          profissionais: true,
          diaria: true,
          meu_veiculo: true,
          painel_controle: true,
          visualizar_ocorrencias_transportes: true,
          visualizar_clima_tempo: true
        }
      });
      console.log('✅ Usuário administrador configurado');
    }
    
    // Criar configuração da empresa
    console.log('🏢 Configurando dados da empresa...');
    await prisma.empresaConfig.upsert({
      where: { id: BigInt(1) },
      update: {},
      create: {
        nome_empresa: "Apontador Transportes Ltda",
        telefone: "(11) 3000-0000",
        endereco: "Rua das Empresas, 123 - Centro - São Paulo/SP",
        cnpj: "12.345.678/0001-90",
        logomarca: ""
      }
    });
    console.log('✅ Configuração da empresa criada');
    
    console.log('🎉 Seed concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedFromCSV()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedFromCSV };