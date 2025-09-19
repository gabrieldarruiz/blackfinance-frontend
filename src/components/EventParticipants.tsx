import React, { useState, useEffect } from 'react';
import { apiService, EventParticipant, EventParticipantStats, handleApiError } from '../services/api';
import { useModal } from '../hooks/useModal';
import ErrorModal from './ErrorModal';
import './EventParticipants.css';

interface EventParticipantsProps {
  eventId: number;
  eventTitle: string;
  onClose: () => void;
}

const EventParticipants: React.FC<EventParticipantsProps> = ({ eventId, eventTitle, onClose }) => {
  const { modal, showSuccess, showError, showWarning, hideModal } = useModal();
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [stats, setStats] = useState<EventParticipantStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    fetchParticipants();
    fetchStats();
  }, [eventId]);

  const fetchAvailableUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await apiService.getUsers();
      setAvailableUsers(response.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar usuários: ' + handleApiError(error));
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.getEventParticipants(eventId);
      setParticipants(response.data.data || []);
    } catch (error: any) {
      console.error('Erro ao carregar participantes:', error);
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError(handleApiError(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getEventParticipantStats(eventId);
      setStats(response.data.data || null);
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleConfirmParticipant = async (participant: EventParticipant) => {
    try {
      await apiService.confirmEventParticipant(eventId, participant.user_id);
      showSuccess('Sucesso', 'Participante confirmado com sucesso!');
      fetchParticipants();
      fetchStats();
    } catch (error) {
      console.error('Erro ao confirmar participante:', error);
      showError('Erro', 'Erro ao confirmar participante: ' + handleApiError(error));
    }
  };

  const handleCancelParticipant = async (participant: EventParticipant) => {
    try {
      await apiService.cancelEventParticipant(eventId, participant.user_id);
      showSuccess('Sucesso', 'Participação cancelada com sucesso!');
      fetchParticipants();
      fetchStats();
    } catch (error) {
      console.error('Erro ao cancelar participação:', error);
      showError('Erro', 'Erro ao cancelar participação: ' + handleApiError(error));
    }
  };

  const handleReactivateParticipant = async (participant: EventParticipant) => {
    try {
      await apiService.reactivateEventParticipant(eventId, participant.user_id);
      showSuccess('Sucesso', 'Participante reativado com sucesso!');
      fetchParticipants();
      fetchStats();
    } catch (error) {
      console.error('Erro ao reativar participante:', error);
      showError('Erro', 'Erro ao reativar participante: ' + handleApiError(error));
    }
  };

  const handleAddSelectedUsers = async () => {
    if (selectedUsers.length === 0) {
      showWarning('Atenção', 'Selecione pelo menos um usuário!');
      return;
    }

    setIsAddingParticipant(true);
    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Verificar cada usuário selecionado
      for (const userId of selectedUsers) {
        try {
          // Verificar se já é participante
          const existingParticipant = participants.find(p => p.user_id === userId);
          
          if (existingParticipant) {
            if (existingParticipant.status === 'cancelled') {
              // Reativar participante cancelado
              await apiService.reactivateEventParticipant(eventId, userId);
              successCount++;
            } else {
              // Já está participando
              errors.push(`Usuário ${availableUsers.find(u => u.id === userId)?.name} já está participando`);
              errorCount++;
            }
          } else {
            // Registrar novo participante
            await apiService.registerEventParticipant(eventId, userId);
            successCount++;
          }
        } catch (error: any) {
          errorCount++;
          const userName = availableUsers.find(u => u.id === userId)?.name || 'Usuário';
          errors.push(`${userName}: ${handleApiError(error)}`);
        }
      }

      // Mostrar resultado
      if (successCount > 0) {
        showSuccess('Sucesso', `${successCount} participante(s) processado(s) com sucesso!`);
      }
      
      if (errorCount > 0) {
        showError('Erros Encontrados', `Erros encontrados:\n${errors.join('\n')}`);
      }

      // Limpar seleção e fechar modal
      setSelectedUsers([]);
      setShowAddForm(false);
      
      // Recarregar dados reais
      fetchParticipants();
      fetchStats();
    } catch (error) {
      console.error('Erro ao adicionar participantes:', error);
      showError('Erro', 'Erro ao registrar participantes: ' + handleApiError(error));
    } finally {
      setIsAddingParticipant(false);
    }
  };

  const handleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const studentUsers = availableUsers.filter(user => user.role === 'student');
    if (selectedUsers.length === studentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(studentUsers.map(user => user.id));
    }
  };

  const filteredUsers = availableUsers.filter(user => 
    user.role === 'student' && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'registered':
        return 'Registrado';
      case 'confirmed':
        return 'Confirmado';
      case 'cancelled':
        return 'Cancelado';
      case 'attended':
        return 'Compareceu';
      default:
        return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'registered':
        return 'status-registered';
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'attended':
        return 'status-attended';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="event-participants-overlay">
        <div className="event-participants-modal">
          <div className="loading">Carregando participantes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-participants-overlay">
      <div className="event-participants-modal">
        <div className="modal-header">
          <h2>Participantes do Evento: {eventTitle}</h2>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => {
                setShowAddForm(true);
                fetchAvailableUsers();
              }}
            >
              + Adicionar Participantes
            </button>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {stats && (
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">{stats.total_participants}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number confirmed">{stats.confirmed_participants}</span>
              <span className="stat-label">Confirmados</span>
            </div>
            <div className="stat-item">
              <span className="stat-number pending">{stats.pending_participants}</span>
              <span className="stat-label">Pendentes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number cancelled">{stats.cancelled_participants}</span>
              <span className="stat-label">Cancelados</span>
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="add-participant-form">
            <h4>Selecionar Participantes</h4>
            
            <div className="search-section">
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="select-all-section">
              <label className="select-all-checkbox">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === availableUsers.filter(u => u.role === 'student').length && selectedUsers.length > 0}
                  onChange={handleSelectAll}
                />
                <span>Selecionar Todos os Alunos</span>
              </label>
            </div>

            {isLoadingUsers ? (
              <div className="loading-users">Carregando usuários...</div>
            ) : (
              <div className="users-list">
                {filteredUsers.length === 0 ? (
                  <div className="no-users">Nenhum usuário encontrado.</div>
                ) : (
                  filteredUsers.map(user => (
                    <div key={user.id} className="user-item">
                      <label className="user-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelection(user.id)}
                        />
                        <div className="user-info">
                          <span className="user-name">{user.name}</span>
                          <span className="user-email">{user.email}</span>
                          {user.phone && <span className="user-phone">{user.phone}</span>}
                        </div>
                      </label>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedUsers([]);
                  setSearchTerm('');
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddSelectedUsers}
                disabled={isAddingParticipant || selectedUsers.length === 0}
              >
                {isAddingParticipant ? 'Adicionando...' : `Adicionar ${selectedUsers.length} Participante(s)`}
              </button>
            </div>
          </div>
        )}

        <div className="participants-list">
          <h3>Lista de Participantes</h3>
          {participants.length === 0 ? (
            <p className="no-participants">Nenhum participante registrado para este evento.</p>
          ) : (
            <div className="participants-table">
              <div className="table-header">
                <div className="header-cell">Nome</div>
                <div className="header-cell">Email</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Ações</div>
              </div>
              {participants.map((participant) => (
                <div key={participant.id} className="table-row">
                  <div className="table-cell">
                    {participant.user?.name || `Usuário ${participant.user_id}`}
                  </div>
                  <div className="table-cell">
                    {participant.user?.email || 'N/A'}
                  </div>
                  <div className="table-cell">
                    <span className={`status-badge ${getStatusStyle(participant.status)}`}>
                      {getStatusLabel(participant.status)}
                    </span>
                  </div>
                  <div className="table-cell actions">
                    {participant.status === 'registered' && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleConfirmParticipant(participant)}
                        >
                          Confirmar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelParticipant(participant)}
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    {participant.status === 'confirmed' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelParticipant(participant)}
                      >
                        Cancelar
                      </button>
                    )}
                    {participant.status === 'cancelled' && (
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleReactivateParticipant(participant)}
                      >
                        Reativar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>

      <ErrorModal
        isOpen={modal.isOpen}
        onClose={hideModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default EventParticipants;
