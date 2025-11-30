const request = require('supertest');
const app = require('../api/index');

describe('API Endpoints', () => {
  let authToken;
  let testUserId;

  // Teste de health check
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('database');
    });
  });

  // Teste de login
  describe('POST /api/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          usuario: 'adm',
          senha: '123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      
      authToken = response.body.token;
      testUserId = response.body.user.id;
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          usuario: 'invalid',
          senha: 'invalid'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject missing credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  // Teste de autenticação
  describe('Authentication', () => {
    it('should reject requests without token', async () => {
      await request(app)
        .get('/api/obras')
        .expect(401);
    });

    it('should reject requests with invalid token', async () => {
      await request(app)
        .get('/api/obras')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);
    });
  });

  // Testes de CRUD - Obras
  describe('Obras CRUD', () => {
    let obraId;

    it('should create a new obra', async () => {
      const response = await request(app)
        .post('/api/obras')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome_obra: 'Obra Teste',
          servico: 'Transporte de Concreto',
          local: 'Local Teste',
          ativa: true
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('id');
      obraId = response.body.id;
    });

    it('should list obras', async () => {
      const response = await request(app)
        .get('/api/obras')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should update obra', async () => {
      const response = await request(app)
        .put(`/api/obras/${obraId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome_obra: 'Obra Teste Atualizada',
          servico: 'Transporte de Areia',
          local: 'Local Atualizado'
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should delete obra', async () => {
      const response = await request(app)
        .delete(`/api/obras/${obraId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });
  });

  // Testes de CRUD - Veículos
  describe('Veículos CRUD', () => {
    let veiculoId;

    it('should create a new veiculo', async () => {
      const response = await request(app)
        .post('/api/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          veiculo: 'Caminhão Teste',
          placa: 'TST-1234',
          cubagem_m3: 10.5,
          motorista: 'Motorista Teste'
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('id');
      veiculoId = response.body.id;
    });

    it('should list veiculos', async () => {
      const response = await request(app)
        .get('/api/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject duplicate placa', async () => {
      await request(app)
        .post('/api/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          veiculo: 'Outro Caminhão',
          placa: 'TST-1234', // Placa duplicada
          cubagem_m3: 8.0,
          motorista: 'Outro Motorista'
        })
        .expect(400);
    });

    it('should delete veiculo', async () => {
      const response = await request(app)
        .delete(`/api/veiculos/${veiculoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });
  });

  // Testes de CRUD - Profissionais
  describe('Profissionais CRUD', () => {
    let profissionalId;

    it('should create a new profissional', async () => {
      const response = await request(app)
        .post('/api/profissionais')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Profissional Teste',
          funcao: 'Motorista',
          contato: '(11) 99999-9999',
          email: 'teste@email.com',
          terceirizado: false
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      profissionalId = response.body.id;
    });

    it('should list profissionais', async () => {
      const response = await request(app)
        .get('/api/profissionais')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should delete profissional', async () => {
      const response = await request(app)
        .delete(`/api/profissionais/${profissionalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });
  });

  // Teste de KPIs Dashboard
  describe('Dashboard KPIs', () => {
    it('should return dashboard KPIs', async () => {
      const response = await request(app)
        .get('/api/dashboard-kpis')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('ocorrencias_andamento');
      expect(response.body).toHaveProperty('chuvas_mes');
      expect(response.body).toHaveProperty('disponibilidade_media');
      expect(response.body).toHaveProperty('tempo_parado_medio');
      expect(response.body).toHaveProperty('eficiencia_media');
      expect(response.body).toHaveProperty('total_viagens');
    });
  });

  // Teste de permissões
  describe('Permissions', () => {
    it('should respect user permissions', async () => {
      // Este teste assumiria um usuário com permissões limitadas
      // Por enquanto, apenas verifica se o endpoint de permissões funciona
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});

// Testes de integração
describe('Integration Tests', () => {
  let authToken;

  beforeAll(async () => {
    // Login para testes de integração
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        usuario: 'adm',
        senha: '123'
      });
    
    authToken = loginResponse.body.token;
  });

  it('should complete a full workflow', async () => {
    // 1. Criar obra
    const obraResponse = await request(app)
      .post('/api/obras')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome_obra: 'Obra Integração',
        servico: 'Transporte',
        local: 'Local Integração'
      });

    expect(obraResponse.status).toBe(200);
    const obraId = obraResponse.body.id;

    // 2. Criar veículo
    const veiculoResponse = await request(app)
      .post('/api/veiculos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        veiculo: 'Caminhão Integração',
        placa: 'INT-1234',
        cubagem_m3: 12.0,
        motorista: 'Motorista Integração'
      });

    expect(veiculoResponse.status).toBe(200);
    const veiculoId = veiculoResponse.body.id;

    // 3. Verificar se dados foram criados
    const obrasResponse = await request(app)
      .get('/api/obras')
      .set('Authorization', `Bearer ${authToken}`);

    const veiculosResponse = await request(app)
      .get('/api/veiculos')
      .set('Authorization', `Bearer ${authToken}`);

    expect(obrasResponse.body.some(o => o.id === obraId)).toBe(true);
    expect(veiculosResponse.body.some(v => v.id === veiculoId)).toBe(true);

    // 4. Limpar dados de teste
    await request(app)
      .delete(`/api/obras/${obraId}`)
      .set('Authorization', `Bearer ${authToken}`);

    await request(app)
      .delete(`/api/veiculos/${veiculoId}`)
      .set('Authorization', `Bearer ${authToken}`);
  });
});