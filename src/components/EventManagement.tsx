import React, { useState, useEffect } from 'react';
import { apiService, Event, handleApiError } from '../services/api';
import EventParticipants from './EventParticipants';
import './EventManagement.css';

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState<Event | null>(null);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'event' as 'event' | 'reminder' | 'announcement',
    targetAudience: 'event_participants' as 'all' | 'specific' | 'event_participants'
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: ''
  });

  // Carregar eventos da API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.getEvents();
      setEvents(response.data.data || response.data || []);
    } catch (error: any) {
      console.error('Erro ao carregar eventos:', error);
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
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        max_participants: parseInt(formData.maxParticipants),
        status: 'scheduled' as const
      };

      if (editingEvent) {
        // Atualizar evento existente
        await apiService.updateEvent(editingEvent.id, eventData);
      } else {
        // Criar novo evento
        await apiService.createEvent(eventData);
      }
      
      // Limpar formulário e recarregar
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: ''
      });
      setShowForm(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      setError(handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0], // Extrair apenas a data
      time: event.time,
      location: event.location,
      maxParticipants: event.max_participants.toString()
    });
    setShowForm(true);
  };

  const handleSendNotification = (event: Event) => {
    setSelectedEvent(event);
    setNotificationData({
      title: `Lembrete: ${event.title}`,
      message: `Não esqueça do evento "${event.title}" que acontecerá em ${new Date(event.date).toLocaleDateString('pt-BR')} às ${event.time} no local ${event.location}.`,
      type: 'reminder',
      targetAudience: 'event_participants'
    });
    setShowNotificationModal(true);
  };

  const handleViewParticipants = (event: Event) => {
    setSelectedEventForParticipants(event);
    setShowParticipantsModal(true);
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const notificationDataToSend = {
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        target_audience: notificationData.targetAudience,
        status: 'draft' as const,
        sent_at: new Date().toISOString()
      };

      await apiService.createNotification(notificationDataToSend);
      setShowNotificationModal(false);
      setSelectedEvent(null);
      setNotificationData({
        title: '',
        message: '',
        type: 'event',
        targetAudience: 'event_participants'
      });
      alert('Notificação enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      alert('Erro ao enviar notificação: ' + handleApiError(error));
    }
  };

  const handleNotificationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNotificationData(prev => ({
      ...prev,
      [name]: name === 'type' 
        ? (value as 'event' | 'reminder' | 'announcement')
        : name === 'targetAudience'
        ? (value as 'all' | 'specific' | 'event_participants')
        : value
    }));
  };

  if (isLoading) {
    return (
      <div className="event-management">
        <div className="container">
          <div className="loading">Carregando eventos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-management">
        <div className="container">
          <div className="error-message">
            <h2>Erro ao carregar eventos</h2>
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
    <div className="event-management">
      <div className="container">
        <div className="page-header">
          <h1>Gestão de Eventos</h1>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingEvent(null);
              setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                location: '',
                maxParticipants: ''
              });
              setShowForm(true);
            }}
          >
            + Novo Evento
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}</h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                    setFormData({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      location: '',
                      maxParticipants: ''
                    });
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="event-form">
                <div className="form-group">
                  <label htmlFor="title">Título do Evento</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Data</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Horário</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location">Local</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="maxParticipants">Máximo de Participantes</label>
                    <input
                      type="number"
                      id="maxParticipants"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
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
                      setEditingEvent(null);
                      setFormData({
                        title: '',
                        description: '',
                        date: '',
                        time: '',
                        location: '',
                        maxParticipants: ''
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
                    {isSubmitting ? (editingEvent ? 'Salvando...' : 'Criando...') : (editingEvent ? 'Salvar Alterações' : 'Criar Evento')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showNotificationModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Enviar Notificação</h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowNotificationModal(false);
                    setSelectedEvent(null);
                    setNotificationData({
                      title: '',
                      message: '',
                      type: 'event',
                      targetAudience: 'event_participants'
                    });
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleNotificationSubmit} className="notification-form">
                <div className="form-group">
                  <label>Evento</label>
                  <p className="event-preview">
                    <strong>{selectedEvent?.title}</strong>
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="notificationTitle">Título da Notificação</label>
                  <input
                    type="text"
                    id="notificationTitle"
                    name="title"
                    value={notificationData.title}
                    onChange={handleNotificationInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notificationMessage">Mensagem</label>
                  <textarea
                    id="notificationMessage"
                    name="message"
                    value={notificationData.message}
                    onChange={handleNotificationInputChange}
                    rows={4}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="notificationType">Tipo</label>
                    <select
                      id="notificationType"
                      name="type"
                      value={notificationData.type}
                      onChange={handleNotificationInputChange}
                      required
                    >
                      <option value="reminder">Lembrete</option>
                      <option value="announcement">Anúncio</option>
                      <option value="event">Evento</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notificationAudience">Público-Alvo</label>
                    <select
                      id="notificationAudience"
                      name="targetAudience"
                      value={notificationData.targetAudience}
                      onChange={handleNotificationInputChange}
                      required
                    >
                      <option value="event_participants">Participantes do Evento</option>
                      <option value="all">Todos os Alunos</option>
                      <option value="specific">Alunos Específicos</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowNotificationModal(false);
                      setSelectedEvent(null);
                      setNotificationData({
                        title: '',
                        message: '',
                        type: 'event',
                        targetAudience: 'event_participants'
                      });
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Enviar Notificação
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3>{event.title}</h3>
                <span className={`status ${event.status}`}>
                  {event.status}
                </span>
              </div>
              
              <p className="event-description">{event.description}</p>
              
              <div className="event-details">
                <div className="detail-item">
                  <span className="detail-label">📅 Data:</span>
                  <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🕒 Horário:</span>
                  <span>{event.time}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📍 Local:</span>
                  <span>{event.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👥 Participantes:</span>
                  <span>{event.current_participants}/{event.max_participants}</span>
                </div>
              </div>

                             <div className="event-actions">
                 <button 
                   className="btn btn-secondary"
                   onClick={() => handleEdit(event)}
                 >
                   Editar
                 </button>
                 <button 
                   className="btn btn-primary"
                   onClick={() => handleSendNotification(event)}
                 >
                   Enviar Notificação
                 </button>
                 <button 
                   className="btn btn-info"
                   onClick={() => handleViewParticipants(event)}
                 >
                   Ver Participantes
                 </button>
               </div>
            </div>
          ))}
                 </div>

         {showParticipantsModal && selectedEventForParticipants && (
           <EventParticipants
             eventId={selectedEventForParticipants.id}
             eventTitle={selectedEventForParticipants.title}
             onClose={() => setShowParticipantsModal(false)}
           />
         )}
       </div>
     </div>
   );
 };

export default EventManagement;
