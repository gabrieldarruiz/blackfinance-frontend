# Black Finance - Gestão de Eventos

Sistema de gestão de eventos e notificações para o Black Finance, focado em transformar carreiras no mercado financeiro através da educação.

## Funcionalidades

- **Login**: Sistema de autenticação para administradores
- **Dashboard**: Visão geral com estatísticas e ações rápidas
- **Gestão de Eventos**: Criação, edição e visualização de eventos
- **Centro de Notificações**: Envio de notificações para alunos

## Tecnologias

- React 18
- TypeScript
- React Router DOM
- CSS3 com variáveis customizadas

## Como Executar

### Desenvolvimento Local

```bash
npm install
npm start
```

### Docker

```bash
docker-compose up -d
```

## Estrutura do Projeto

```
src/
├── components/
│   ├── Header.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── EventManagement.tsx
│   └── NotificationCenter.tsx
├── App.tsx
├── index.tsx
└── index.css
```

## Design System

- **Cores Primárias**: Preto (#1a1a1a) e Amarelo (#ffd700)
- **Fonte**: Inter
- **Estilo**: Clean e moderno, focado na usabilidade

## Próximos Passos

- [ ] Integração com backend
- [ ] Sistema de autenticação real
- [ ] Persistência de dados
- [ ] Notificações push
- [ ] Relatórios e analytics
