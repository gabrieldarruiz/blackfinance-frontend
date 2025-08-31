const axios = require('axios');

const API_BASE = 'http://localhost:8080/api';

async function testAPI() {
  try {
    console.log('🧪 Testando API...\n');

    // 1. Testar login
    console.log('1. Testando login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@blackfinance.com',
      password: 'Admin123!'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Login realizado com sucesso');
    console.log(`   Usuário: ${loginResponse.data.user.name}`);
    console.log(`   Token: ${token.substring(0, 20)}...\n`);

    // Configurar headers para requisições autenticadas
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. Testar dashboard stats
    console.log('2. Testando dashboard stats...');
    const statsResponse = await axios.get(`${API_BASE}/dashboard/stats`, { headers });
    console.log('✅ Dashboard stats carregados');
    console.log(`   Eventos ativos: ${statsResponse.data.data.active_events}`);
    console.log(`   Total usuários: ${statsResponse.data.data.total_users}\n`);

    // 3. Testar eventos
    console.log('3. Testando eventos...');
    const eventsResponse = await axios.get(`${API_BASE}/events`, { headers });
    console.log('✅ Eventos carregados');
    console.log(`   Total eventos: ${eventsResponse.data.data.length}\n`);

    // 4. Testar notificações
    console.log('4. Testando notificações...');
    const notificationsResponse = await axios.get(`${API_BASE}/notifications`, { headers });
    console.log('✅ Notificações carregadas');
    console.log(`   Total notificações: ${notificationsResponse.data.data.length}\n`);

    console.log('🎉 Todos os testes passaram! A API está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testAPI();
