# 📋 Especificação Backend - Sistema de Confirmação de Participantes

## 🎯 Objetivo
Implementar funcionalidade para gerenciar confirmações de participantes em eventos, permitindo visualizar e controlar quantas pessoas confirmaram participação.

## 📁 Arquivos a Modificar

### 1. `internal/handlers/events.go`

Adicionar os seguintes endpoints no final do arquivo:

```go
// ConfirmEventParticipant confirma participação de um usuário em um evento
func ConfirmEventParticipant(c *gin.Context) {
	eventID := c.Param("id")
	userID := c.Param("user_id")

	var participant models.EventParticipant
	if err := db.Where("event_id = ? AND user_id = ?", eventID, userID).First(&participant).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Participação não encontrada",
		})
		return
	}

	participant.Status = "confirmed"
	if err := db.Save(&participant).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Erro ao confirmar participação",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Participação confirmada com sucesso",
		"data":    participant,
	})
}

// CancelEventParticipant cancela participação de um usuário em um evento
func CancelEventParticipant(c *gin.Context) {
	eventID := c.Param("id")
	userID := c.Param("user_id")

	var participant models.EventParticipant
	if err := db.Where("event_id = ? AND user_id = ?", eventID, userID).First(&participant).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Participação não encontrada",
		})
		return
	}

	participant.Status = "cancelled"
	if err := db.Save(&participant).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Erro ao cancelar participação",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Participação cancelada com sucesso",
		"data":    participant,
	})
}

// GetEventParticipantStats retorna estatísticas de participantes de um evento
func GetEventParticipantStats(c *gin.Context) {
	eventID := c.Param("id")

	var totalParticipants int64
	var confirmedParticipants int64
	var cancelledParticipants int64
	var pendingParticipants int64

	db.Model(&models.EventParticipant{}).Where("event_id = ?", eventID).Count(&totalParticipants)
	db.Model(&models.EventParticipant{}).Where("event_id = ? AND status = ?", eventID, "confirmed").Count(&confirmedParticipants)
	db.Model(&models.EventParticipant{}).Where("event_id = ? AND status = ?", eventID, "cancelled").Count(&cancelledParticipants)
	db.Model(&models.EventParticipant{}).Where("event_id = ? AND status = ?", eventID, "registered").Count(&pendingParticipants)

	stats := gin.H{
		"total_participants":     totalParticipants,
		"confirmed_participants": confirmedParticipants,
		"cancelled_participants": cancelledParticipants,
		"pending_participants":   pendingParticipants,
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    stats,
	})
}
```

### 2. `cmd/server/main.go`

Adicionar as seguintes rotas dentro do grupo de eventos protegidos:

```go
// Dentro do grupo de eventos protegidos (events := protected.Group("/events"))
events.POST("/:id/participants/:user_id/confirm", handlers.ConfirmEventParticipant)
events.POST("/:id/participants/:user_id/cancel", handlers.CancelEventParticipant)
events.GET("/:id/participants/stats", handlers.GetEventParticipantStats)
```

## 🔗 Endpoints Criados

### 1. Confirmar Participação
- **Método:** `POST`
- **URL:** `/api/events/{event_id}/participants/{user_id}/confirm`
- **Descrição:** Confirma a participação de um usuário em um evento
- **Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Participação confirmada com sucesso",
  "data": {
    "id": 1,
    "event_id": 1,
    "user_id": 1,
    "status": "confirmed",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Cancelar Participação
- **Método:** `POST`
- **URL:** `/api/events/{event_id}/participants/{user_id}/cancel`
- **Descrição:** Cancela a participação de um usuário em um evento
- **Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Participação cancelada com sucesso",
  "data": {
    "id": 1,
    "event_id": 1,
    "user_id": 1,
    "status": "cancelled",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Estatísticas de Participantes
- **Método:** `GET`
- **URL:** `/api/events/{event_id}/participants/stats`
- **Descrição:** Retorna estatísticas de participantes de um evento
- **Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "total_participants": 15,
    "confirmed_participants": 12,
    "cancelled_participants": 2,
    "pending_participants": 1
  }
}
```

## 📊 Status dos Participantes

O sistema usa os seguintes status para participantes:

- **`registered`** - Registrado (status padrão)
- **`confirmed`** - Confirmado
- **`cancelled`** - Cancelado
- **`attended`** - Compareceu (após evento)

## 🔒 Autenticação

Todos os endpoints requerem autenticação JWT (Bearer Token).

## 🚀 Como Testar

1. **Confirmar Participação:**
```bash
curl -X POST \
  http://localhost:8080/api/events/1/participants/1/confirm \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

2. **Cancelar Participação:**
```bash
curl -X POST \
  http://localhost:8080/api/events/1/participants/1/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

3. **Ver Estatísticas:**
```bash
curl -X GET \
  http://localhost:8080/api/events/1/participants/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📝 Notas Importantes

- Os endpoints verificam se a participação existe antes de modificar
- O status é atualizado no banco de dados
- As estatísticas são calculadas em tempo real
- Todos os endpoints retornam respostas padronizadas com `success` e `message`

