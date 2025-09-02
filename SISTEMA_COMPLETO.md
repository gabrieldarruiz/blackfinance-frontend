# 🚀 **SISTEMA BLACK FINANCE - DOCUMENTAÇÃO TÉCNICA COMPLETA**

## 📖 **ÍNDICE**

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Funcionalidades do Frontend](#funcionalidades-do-frontend)
4. [Funcionalidades do Backend](#funcionalidades-do-backend)
5. [APIs e Endpoints](#apis-e-endpoints)
6. [Autenticação e Segurança](#autenticação-e-segurança)
7. [Banco de Dados](#banco-de-dados)
8. [Deploy e Configuração](#deploy-e-configuração)
9. [Funcionalidades Específicas](#funcionalidades-específicas)

---

## 🎯 **VISÃO GERAL**

O **Black Finance** é um sistema completo de gerenciamento de eventos e notificações, desenvolvido com arquitetura moderna e funcionalidades avançadas para controle de participantes, agendamento de eventos e sistema de comunicação.

### **Características Principais:**
- ✅ **Sistema de Autenticação JWT** com refresh tokens
- ✅ **Gerenciamento Completo de Eventos** (CRUD)
- ✅ **Sistema de Notificações** com agendamento
- ✅ **Controle de Participantes** com status tracking
- ✅ **Dashboard com Estatísticas** em tempo real
- ✅ **Interface Responsiva** e moderna
- ✅ **Rate Limiting** para segurança
- ✅ **Sistema de Emails** via SMTP

---

## 🏗️ **ARQUITETURA DO SISTEMA**

### **Frontend (React + TypeScript + Vite)**
```
src/
├── components/          # Componentes React
├── contexts/           # Contextos (Auth, etc.)
├── services/           # Serviços de API
├── App.tsx            # Componente principal
└── index.tsx          # Ponto de entrada
```

### **Backend (Go + Gin + GORM)**
```
internal/
├── handlers/          # Handlers HTTP
├── models/            # Modelos de dados
├── services/          # Lógica de negócio
└── middleware/        # Middlewares (Auth, Rate Limiting)
```

### **Banco de Dados**
- **PostgreSQL** com GORM como ORM
- **Migrações automáticas** de schema
- **Relacionamentos** entre entidades

---

## 🎨 **FUNCIONALIDADES DO FRONTEND**

### **1. Sistema de Autenticação**
- **Login/Logout** com JWT
- **Registro de usuários** novos
- **Refresh automático** de tokens
- **Proteção de rotas** baseada em autenticação
- **Context global** para estado de usuário

### **2. Dashboard Principal**
- **Estatísticas em tempo real:**
  - Total de eventos
  - Eventos ativos
  - Total de usuários
  - Total de notificações
- **Próximo evento** destacado
- **Eventos recentes** e próximos
- **Gráficos visuais** de participação

### **3. Gerenciamento de Eventos**
- **CRUD completo** de eventos
- **Formulário de criação/edição** com validação
- **Campos incluídos:**
  - Título e descrição
  - Data e horário
  - Localização
  - Número máximo de participantes
  - Status (ativo, agendado, cancelado)
- **Botões de ação:**
  - Editar evento
  - Enviar notificação
  - **Ver Participantes** (nova funcionalidade)

### **4. Sistema de Notificações**
- **Criação de notificações** com tipos:
  - Evento
  - Lembrete
  - Anúncio
- **Público-alvo configurável:**
  - Todos os usuários
  - Usuários específicos
  - Participantes de evento específico
- **Funcionalidades avançadas:**
  - **Agendamento** de envio
  - **Reenvio** de notificações
  - **Cancelamento** de agendamentos
  - **Status tracking** (rascunho, enviado, agendado, falha)

### **5. Gerenciamento de Participantes (NOVA FUNCIONALIDADE)**
- **Modal dedicado** para cada evento
- **Lista completa** de participantes
- **Status dos participantes:**
  - `registered` - Registrado
  - `confirmed` - Confirmado
  - `cancelled` - Cancelado
  - `attended` - Compareceu
- **Ações disponíveis:**
  - Confirmar participação
  - Cancelar participação
  - Reativar participação cancelada
- **Estatísticas visuais:**
  - Total de participantes
  - Confirmados vs. Pendentes
  - Cancelados vs. Ativos

### **6. Interface e UX**
- **Design responsivo** para mobile e desktop
- **Modais interativos** para ações
- **Loading states** e feedback visual
- **Tratamento de erros** com mensagens claras
- **Navegação intuitiva** entre seções

---

## ⚙️ **FUNCIONALIDADES DO BACKEND**

### **1. Sistema de Autenticação**
- **JWT tokens** com expiração configurável
- **Refresh tokens** para renovação automática
- **Rate limiting** (5 tentativas por 15 minutos)
- **Validação de credenciais** segura
- **Middleware de autenticação** para rotas protegidas

### **2. Gerenciamento de Eventos**
- **CRUD completo** via API REST
- **Validação de dados** no servidor
- **Relacionamentos** com usuários e participantes
- **Controle de permissões** baseado em roles
- **Auditoria** (created_at, updated_at)

### **3. Sistema de Notificações**
- **Criação e envio** de notificações
- **Agendamento** com sistema de filas
- **Integração SMTP** para envio de emails
- **Status tracking** em tempo real
- **Fallback** para falhas de envio

### **4. Gerenciamento de Participantes**
- **Registro automático** de participantes
- **Mudança de status** (confirmar/cancelar)
- **Estatísticas agregadas** por evento
- **Validação** de capacidade máxima
- **Histórico** de mudanças de status

### **5. Segurança e Performance**
- **Rate limiting** por endpoint
- **Validação de entrada** rigorosa
- **Sanitização** de dados
- **Logs de auditoria** para ações críticas
- **Compressão** de respostas HTTP

---

## 🔌 **APIS E ENDPOINTS**

### **Autenticação**
```
POST   /api/auth/login          # Login de usuário
POST   /api/auth/register       # Registro de usuário
POST   /api/auth/refresh        # Refresh de token
POST   /api/auth/logout         # Logout
GET    /api/auth/me             # Dados do usuário atual
```

### **Eventos**
```
GET    /api/events              # Listar todos os eventos
POST   /api/events              # Criar novo evento
GET    /api/events/:id          # Buscar evento específico
PUT    /api/events/:id          # Atualizar evento
DELETE /api/events/:id          # Deletar evento
```

### **Participantes de Eventos (NOVOS)**
```
GET    /api/events/:id/participants           # Listar participantes
POST   /api/events/:id/participants/:user_id/confirm    # Confirmar participação
POST   /api/events/:id/participants/:user_id/cancel     # Cancelar participação
GET    /api/events/:id/participants/stats     # Estatísticas de participantes
```

### **Notificações**
```
GET    /api/notifications                    # Listar notificações
POST   /api/notifications                    # Criar notificação
PUT    /api/notifications/:id                # Atualizar notificação
DELETE /api/notifications/:id                # Deletar notificação
POST   /api/notifications/:id/send           # Enviar notificação
POST   /api/notifications/:id/schedule       # Agendar notificação
POST   /api/notifications/:id/cancel         # Cancelar agendamento
```

### **Dashboard**
```
GET    /api/dashboard/stats                   # Estatísticas gerais
GET    /api/dashboard/recent-events           # Eventos recentes
GET    /api/dashboard/upcoming-events         # Próximos eventos
```

### **Usuários**
```
GET    /api/users              # Listar usuários
GET    /api/users/:id          # Buscar usuário específico
PUT    /api/users/:id          # Atualizar usuário
DELETE /api/users/:id          # Deletar usuário
```

---

## 🔐 **AUTENTICAÇÃO E SEGURANÇA**

### **JWT Tokens**
- **Access Token**: Validade de 15 minutos
- **Refresh Token**: Validade de 7 dias
- **Renovação automática** via interceptor
- **Blacklist** de tokens invalidados

### **Rate Limiting**
- **Auth endpoints**: 5 tentativas por 15 minutos
- **API endpoints**: 100 requests por minuto
- **IP-based** rate limiting
- **Headers de retry** incluídos

### **Validação de Dados**
- **Sanitização** de entrada
- **Validação de tipos** no servidor
- **Prevenção de SQL injection** via GORM
- **Validação de permissões** por rota

---

## 🗄️ **BANCO DE DADOS**

### **Tabelas Principais**

#### **Users**
```sql
- id (PK)
- name
- email (unique)
- password_hash
- role
- created_at
- updated_at
```

#### **Events**
```sql
- id (PK)
- title
- description
- date
- time
- location
- max_participants
- current_participants
- status
- created_by (FK -> Users)
- created_at
- updated_at
```

#### **EventParticipants**
```sql
- id (PK)
- event_id (FK -> Events)
- user_id (FK -> Users)
- status (registered, confirmed, cancelled, attended)
- created_at
- updated_at
```

#### **Notifications**
```sql
- id (PK)
- title
- message
- type (event, reminder, announcement)
- target_audience (all, specific, event_participants)
- sent_at
- scheduled_at
- status (draft, sent, scheduled, failed)
- created_by (FK -> Users)
- created_at
- updated_at
```

### **Relacionamentos**
- **Users** → **Events** (1:N) - Criação de eventos
- **Users** → **EventParticipants** (1:N) - Participação em eventos
- **Users** → **Notifications** (1:N) - Criação de notificações
- **Events** → **EventParticipants** (1:N) - Participantes do evento
- **Events** → **Notifications** (1:N) - Notificações relacionadas

---

## 🚀 **DEPLOY E CONFIGURAÇÃO**

### **Frontend (Vite)**
```bash
# Instalação
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview
npm run preview
```

### **Backend (Go)**
```bash
# Instalação de dependências
go mod download

# Execução
go run cmd/server/main.go

# Build
go build -o bin/server cmd/server/main.go
```

### **Docker**
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - DB_USER=postgres
      - DB_PASSWORD=password
      - DB_NAME=blackfinance
    depends_on:
      - postgres
  
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=blackfinance
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### **Variáveis de Ambiente**
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8080/api

# Backend
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=blackfinance
DB_PORT=5432
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@blackfinance.com
```

---

## 🎯 **FUNCIONALIDADES ESPECÍFICAS**

### **1. Sistema de Confirmação de Participantes**

#### **Fluxo de Funcionamento:**
1. **Usuário se registra** em um evento
2. **Status inicial**: `registered`
3. **Administrador pode:**
   - Confirmar participação → Status: `confirmed`
   - Cancelar participação → Status: `cancelled`
   - Reativar participação cancelada → Status: `confirmed`
4. **Após evento**: Status pode ser marcado como `attended`

#### **Interface do Usuário:**
- **Modal dedicado** para cada evento
- **Lista organizada** por status
- **Ações contextuais** baseadas no status atual
- **Estatísticas visuais** em tempo real
- **Feedback imediato** para ações

#### **APIs Específicas:**
```typescript
// Buscar participantes de um evento
GET /api/events/{event_id}/participants

// Confirmar participação
POST /api/events/{event_id}/participants/{user_id}/confirm

// Cancelar participação
POST /api/events/{event_id}/participants/{user_id}/cancel

// Estatísticas de participantes
GET /api/events/{event_id}/participants/stats
```

### **2. Sistema de Notificações Avançado**

#### **Tipos de Notificação:**
- **Event**: Relacionada a eventos específicos
- **Reminder**: Lembretes e avisos
- **Announcement**: Anúncios gerais

#### **Público-alvo:**
- **All**: Todos os usuários do sistema
- **Specific**: Usuários selecionados manualmente
- **Event Participants**: Apenas participantes de evento específico

#### **Funcionalidades:**
- **Agendamento**: Envio programado para data/hora específica
- **Reenvio**: Possibilidade de reenviar notificações
- **Cancelamento**: Cancelar agendamentos pendentes
- **Status Tracking**: Monitoramento completo do ciclo de vida

### **3. Dashboard Inteligente**

#### **Métricas em Tempo Real:**
- **Total de eventos** criados
- **Eventos ativos** no momento
- **Total de usuários** registrados
- **Total de notificações** enviadas
- **Próximo evento** programado

#### **Visualizações:**
- **Cards informativos** com números principais
- **Lista de eventos** próximos
- **Gráficos** de participação (se implementado)
- **Alertas** para eventos urgentes

---

## 🔧 **TECNOLOGIAS UTILIZADAS**

### **Frontend**
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilização

### **Backend**
- **Go 1.21+** - Linguagem de programação
- **Gin** - Framework web
- **GORM** - ORM para PostgreSQL
- **JWT-Go** - Autenticação JWT
- **Gomail** - Envio de emails
- **Rate Limiting** - Controle de taxa

### **Banco de Dados**
- **PostgreSQL 13+** - Banco relacional
- **Migrations automáticas** via GORM
- **Índices otimizados** para consultas

### **DevOps**
- **Docker** - Containerização
- **Docker Compose** - Orquestração local
- **Environment Variables** - Configuração

---

## 📱 **RESPONSIVIDADE E UX**

### **Design Mobile-First**
- **Breakpoints** para diferentes tamanhos de tela
- **Grid responsivo** para layouts
- **Touch-friendly** para dispositivos móveis
- **Navegação otimizada** para mobile

### **Componentes Interativos**
- **Modais** para ações importantes
- **Loading states** com spinners
- **Feedback visual** para todas as ações
- **Tratamento de erros** com mensagens claras
- **Validação em tempo real** de formulários

---

## 🚨 **TRATAMENTO DE ERROS**

### **Frontend**
- **Error Boundaries** para captura de erros React
- **Try-catch** em todas as operações assíncronas
- **Mensagens de erro** amigáveis ao usuário
- **Fallbacks** para componentes que falham

### **Backend**
- **HTTP Status Codes** apropriados
- **Mensagens de erro** estruturadas
- **Logs detalhados** para debugging
- **Rate limiting** para proteção contra abuso

---

## 🔮 **ROADMAP E MELHORIAS FUTURAS**

### **Funcionalidades Planejadas:**
- **Sistema de permissões** granular
- **Notificações push** em tempo real
- **Relatórios avançados** com gráficos
- **Integração com calendários** externos
- **Sistema de templates** para notificações
- **API para terceiros** com autenticação OAuth2

### **Melhorias Técnicas:**
- **Cache Redis** para performance
- **WebSockets** para atualizações em tempo real
- **Testes automatizados** (unit e integration)
- **CI/CD pipeline** com GitHub Actions
- **Monitoramento** com Prometheus/Grafana

---

## 📞 **SUPORTE E CONTATO**

### **Documentação**
- **README.md** - Guia de instalação
- **API Documentation** - Swagger/OpenAPI
- **Component Library** - Storybook (futuro)

### **Desenvolvimento**
- **GitHub Issues** - Bug reports
- **Pull Requests** - Contribuições
- **Code Review** - Qualidade de código

---

## ✅ **CONCLUSÃO**

O sistema **Black Finance** representa uma solução completa e moderna para gerenciamento de eventos e notificações, com:

- **Arquitetura robusta** e escalável
- **Funcionalidades avançadas** de participação
- **Interface intuitiva** e responsiva
- **Segurança implementada** em todas as camadas
- **APIs bem documentadas** e consistentes
- **Sistema de notificações** flexível e poderoso

O sistema está pronto para uso em produção e pode ser facilmente estendido com novas funcionalidades conforme necessário.

---

*Documentação gerada automaticamente - Sistema Black Finance v1.0.0*
