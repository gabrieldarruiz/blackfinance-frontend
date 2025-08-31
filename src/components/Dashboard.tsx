import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Eventos Ativos', value: '12', color: 'var(--secondary-color)' },
    { title: 'Alunos Cadastrados', value: '1,247', color: 'var(--primary-color)' },
    { title: 'Notificações Enviadas', value: '89', color: '#4CAF50' },
    { title: 'Próximo Evento', value: '3 dias', color: '#FF9800' }
  ];

  const recentEvents = [
    { id: 1, title: 'Workshop de Análise Fundamentalista', date: '15/01/2025', status: 'Ativo' },
    { id: 2, title: 'Mentoria com Executivos', date: '20/01/2025', status: 'Agendado' },
    { id: 3, title: 'Networking Financeiro', date: '25/01/2025', status: 'Agendado' }
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Bem-vindo ao painel de gestão do Black Finance</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Próximos Eventos</h2>
              <Link to="/events" className="btn btn-primary">Ver Todos</Link>
            </div>
            <div className="events-list">
              {recentEvents.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <p>{event.date}</p>
                  </div>
                  <span className={`status ${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Ações Rápidas</h2>
            </div>
            <div className="quick-actions">
              <Link to="/events" className="action-card">
                <div className="action-icon">📅</div>
                <h4>Criar Evento</h4>
                <p>Agende um novo evento ou workshop</p>
              </Link>
              <Link to="/notifications" className="action-card">
                <div className="action-icon">📢</div>
                <h4>Enviar Notificação</h4>
                <p>Comunique-se com os alunos</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
