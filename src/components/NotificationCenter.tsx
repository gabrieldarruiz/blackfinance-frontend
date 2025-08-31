import React, { useState, useEffect } from 'react';
import { apiService, Notification } from '../services/api';
import { handleApiError } from '../services/api';
import './NotificationCenter.css';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingNotification, setSchedulingNotification] = useState<Notification | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  const [formData, setFormData] = useState<{
    title: string;
    message: string;
    type: 'event' | 'reminder' | 'announcement';
    targetAudience: 'all' | 'specific' | 'event_participants';
  }>({
    title: '',
    message: '',
    type: 'announcement',
    targetAudience: 'all'
  });

  // Carregar notificações da API
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.getNotifications();
      setNotifications(response.data.data || response.data || []);
    } catch (error: any) {
      console.error('Erro ao carregar notificações:', error);
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError(handleApiError(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        target_audience: formData.targetAudience,
        status: 'draft' as const,
        sent_at: new Date().toISOString()
      };

      if (editingNotification) {
        // Atualizar notificação existente
        await apiService.updateNotification(editingNotification.id, notificationData);
      } else {
        // Criar nova notificação
        await apiService.createNotification(notificationData);
      }
      
      // Limpar formulário e recarregar
      setFormData({
        title: '',
        message: '',
        type: 'announcement',
        targetAudience: 'all'
      });
      setShowForm(false);
      setEditingNotification(null);
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao salvar notificação:', error);
      setError(handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'type' 
        ? (value as 'event' | 'reminder' | 'announcement')
        : name === 'targetAudience'
        ? (value as 'all' | 'specific' | 'event_participants')
        : value
    }));
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      targetAudience: notification.target_audience
    });
    setShowForm(true);
  };

  const handleResend = async (notification: Notification) => {
    try {
      await apiService.resendNotification(notification.id);
      alert('Notificação reenviada com sucesso!');
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao reenviar notificação:', error);
      alert('Erro ao reenviar notificação: ' + handleApiError(error));
    }
  };

  const handleSchedule = (notification: Notification) => {
    setSchedulingNotification(notification);
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingNotification || !scheduleDate || !scheduleTime) return;

    try {
      const scheduledDateTime = `${scheduleDate}T${scheduleTime}:00Z`;
      await apiService.scheduleNotification(schedulingNotification.id, scheduledDateTime);
      
      setShowScheduleModal(false);
      setSchedulingNotification(null);
      setScheduleDate('');
      setScheduleTime('');
      fetchNotifications();
      alert('Notificação agendada com sucesso!');
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      alert('Erro ao agendar notificação: ' + handleApiError(error));
    }
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
      case 'failed': return 'Falha no Envio';
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'draft': return { backgroundColor: '#6c757d', color: 'white' };
      case 'sent': return { backgroundColor: '#28a745', color: 'white' };
      case 'scheduled': return { backgroundColor: '#17a2b8', color: 'white' };
      case 'failed': return { 
        backgroundColor: '#dc3545', 
        color: 'white',
        boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)',
        border: '1px solid #c82333'
      };
      default: return { backgroundColor: '#6c757d', color: 'white' };
    }
  };

  if (isLoading) {
    return (
      <div className="notification-center">
        <div className="container">
          <div className="loading">Carregando notificações...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-center">
        <div className="container">
          <div className="error-message">
            <h2>Erro ao carregar notificações</h2>
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
    <div className="notification-center">
      <div className="container">
        <div className="page-header">
          <h1>Centro de Notificações</h1>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingNotification(null);
              setFormData({
                title: '',
                message: '',
                type: 'announcement',
                targetAudience: 'all'
              });
              setShowForm(true);
            }}
          >
            + Nova Notificação
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingNotification ? 'Editar Notificação' : 'Criar Nova Notificação'}</h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingNotification(null);
                    setFormData({
                      title: '',
                      message: '',
                      type: 'announcement',
                      targetAudience: 'all'
                    });
                  }}
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

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingNotification(null);
                      setFormData({
                        title: '',
                        message: '',
                        type: 'announcement',
                        targetAudience: 'all'
                      });
                    }}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (editingNotification ? 'Salvando...' : 'Criando...') : (editingNotification ? 'Salvar Alterações' : 'Criar Notificação')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showScheduleModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Agendar Notificação</h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSchedulingNotification(null);
                    setScheduleDate('');
                    setScheduleTime('');
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleScheduleSubmit} className="notification-form">
                <div className="form-group">
                  <label>Notificação</label>
                  <p className="notification-preview">
                    <strong>{schedulingNotification?.title}</strong>
                  </p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="scheduleDate">Data</label>
                    <input
                      type="date"
                      id="scheduleDate"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="scheduleTime">Hora</label>
                    <input
                      type="time"
                      id="scheduleTime"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowScheduleModal(false);
                      setSchedulingNotification(null);
                      setScheduleDate('');
                      setScheduleTime('');
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Agendar
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
                      {getAudienceLabel(notification.target_audience)}
                    </span>
                    <span 
                      className={`status ${notification.status}`}
                      style={getStatusStyle(notification.status)}
                    >
                      {getStatusLabel(notification.status)}
                    </span>
                  </div>
                </div>
                <div className="notification-date">
                  {new Date(notification.sent_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              <p className="notification-message">{notification.message}</p>
              
              <div className="notification-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleEdit(notification)}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleResend(notification)}
                  disabled={notification.status === 'draft'}
                >
                  Reenviar
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleSchedule(notification)}
                  disabled={notification.status === 'scheduled'}
                >
                  Agendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
