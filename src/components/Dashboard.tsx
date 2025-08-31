import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, DashboardStats, Event } from '../services/api';
import { handleApiError } from '../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  // const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Buscar dados em paralelo
        const [statsResponse, upcomingEventsResponse] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getUpcomingEvents()
        ]);

        setStats(statsResponse.data.data || statsResponse.data);
        setUpcomingEvents(upcomingEventsResponse.data.data || upcomingEventsResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        setError(handleApiError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Dados mockados como fallback
  const fallbackStats = [
    { title: 'Eventos Ativos', value: '0', color: 'var(--secondary-color)' },
    { title: 'Alunos Cadastrados', value: '0', color: 'var(--primary-color)' },
    { title: 'Notificações Enviadas', value: '0', color: '#4CAF50' },
    { title: 'Próximos Eventos', value: '0', color: '#FF9800' }
  ];

  const displayStats = stats ? [
    { title: 'Eventos Ativos', value: (stats.active_events || 0).toString(), color: 'var(--secondary-color)' },
    { title: 'Alunos Cadastrados', value: (stats.total_users || 0).toString(), color: 'var(--primary-color)' },
    { title: 'Notificações Enviadas', value: (stats.total_notifications || 0).toString(), color: '#4CAF50' },
    { title: 'Total de Eventos', value: (stats.total_events || 0).toString(), color: '#FF9800' }
  ] : fallbackStats;

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="loading">Carregando dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="error-message">
            <h2>Erro ao carregar dashboard</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Bem-vindo ao painel de gestão do Black Finance</p>
        </div>

        <div className="stats-grid">
          {displayStats.map((stat, index) => (
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
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <div key={event.id} className="event-item">
                    <div className="event-info">
                      <h4>{event.title}</h4>
                      <p>{new Date(event.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span className={`status ${event.status}`}>
                      {event.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="no-events">Nenhum evento próximo encontrado.</p>
              )}
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
