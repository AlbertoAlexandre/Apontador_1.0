const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com Supabase...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    
    console.log('📊 Verificando tabelas existentes...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('📋 Tabelas encontradas:', tables);
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();