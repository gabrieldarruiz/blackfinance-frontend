import React, { useState } from 'react';
import './NotificationCenter.css';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'event' | 'reminder' | 'announcement';
  targetAudience: 'all' | 'specific' | 'event_participants';
  sentAt: string;
  status: 'draft' | 'sent' | 'scheduled';
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Lembrete: Workshop de Análise Fundamentalista',
      message: 'Olá! Lembramos que o workshop de Análise Fundamentalista acontece amanhã às 14h. Não se esqueça de trazer material para anotações.',
      type: 'reminder',
      targetAudience: 'event_participants',
      sentAt: '2025-01-14T10:00:00',
      status: 'sent'
    },
    {
      id: 2,
      title: 'Novo Evento: Mentoria com Executivos',
      message: 'Temos o prazer de anunciar nossa próxima mentoria com executivos do mercado financeiro. Inscrições abertas!',
      type: 'announcement',
      targetAudience: 'all',
      sentAt: '2025-01-13T15:30:00',
      status: 'sent'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'announcement',
    targetAudience: 'all'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotification: Notification = {
      id: notifications.length + 1,
      ...formData,
      sentAt: new Date().toISOString(),
      status: 'draft'
    };
    setNotifications([newNotification, ...notifications]);
    setFormData({
      title: '',
      message: '',
      type: 'announcement',
      targetAudience: 'all'
    });
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Evento';
      case 'reminder': return 'Lembrete';
      case 'announcement': return 'Anúncio';
      default: return type;
    }
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'all': return 'Todos os Alunos';
      case 'specific': return 'Alunos Específicos';
      case 'event_participants': return 'Participantes do Evento';
      default: return audience;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'sent': return 'Enviado';
      case 'scheduled': return 'Agendado';
      default: return status;
    }
  };

  return (
    <div className="notification-center">
      <div className="container">
        <div className="page-header">
          <h1>Centro de Notificações</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Nova Notificação
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Criar Nova Notificação</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="notification-form">
                <div className="form-group">
                  <label htmlFor="title">Título</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite o título da notificação"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensagem</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Digite a mensagem que será enviada"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="type">Tipo de Notificação</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="announcement">Anúncio</option>
                      <option value="reminder">Lembrete</option>
                      <option value="event">Evento</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="targetAudience">Público-Alvo</label>
                    <select
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="all">Todos os Alunos</option>
                      <option value="specific">Alunos Específicos</option>
                      <option value="event_participants">Participantes do Evento</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Criar Notificação
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="notifications-list">
          {notifications.map(notification => (
            <div key={notification.id} className="notification-card">
              <div className="notification-header">
                <div className="notification-info">
                  <h3>{notification.title}</h3>
                  <div className="notification-meta">
                    <span className={`type ${notification.type}`}>
                      {getTypeLabel(notification.type)}
                    </span>
                    <span className="audience">
                      {getAudienceLabel(notification.targetAudience)}
                    </span>
                    <span className={`status ${notification.status}`}>
                      {getStatusLabel(notification.status)}
                    </span>
                  </div>
                </div>
                <div className="notification-date">
                  {new Date(notification.sentAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              <p className="notification-message">{notification.message}</p>
              
              <div className="notification-actions">
                <button className="btn btn-secondary">Editar</button>
                <button className="btn btn-primary">Reenviar</button>
                <button className="btn btn-secondary">Agendar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
