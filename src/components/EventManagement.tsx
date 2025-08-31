import React, { useState } from 'react';
import './EventManagement.css';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'ativo' | 'agendado' | 'cancelado';
}

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Workshop de Análise Fundamentalista',
      description: 'Aprenda os fundamentos da análise fundamentalista para investimentos',
      date: '2025-01-15',
      time: '14:00',
      location: 'Sala de Treinamento - São Paulo',
      maxParticipants: 50,
      currentParticipants: 35,
      status: 'ativo'
    },
    {
      id: 2,
      title: 'Mentoria com Executivos',
      description: 'Sessão de mentoria com executivos do mercado financeiro',
      date: '2025-01-20',
      time: '19:00',
      location: 'Auditório Principal',
      maxParticipants: 30,
      currentParticipants: 28,
      status: 'agendado'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: events.length + 1,
      ...formData,
      maxParticipants: parseInt(formData.maxParticipants),
      currentParticipants: 0,
      status: 'agendado'
    };
    setEvents([...events, newEvent]);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: ''
    });
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="event-management">
      <div className="container">
        <div className="page-header">
          <h1>Gestão de Eventos</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Novo Evento
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Criar Novo Evento</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="event-form">
                <div className="form-row">
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
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
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

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Criar Evento
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
                  <span>{event.currentParticipants}/{event.maxParticipants}</span>
                </div>
              </div>

              <div className="event-actions">
                <button className="btn btn-secondary">Editar</button>
                <button className="btn btn-primary">Enviar Notificação</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
