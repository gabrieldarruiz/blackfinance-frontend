import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - em produção isso seria uma chamada para a API
    if (email && password) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-large">
            <span className="logo-text-large">BF</span>
          </div>
          <h1>BLACK FINANCE</h1>
          <p>Gestão de Eventos e Notificações</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Sua senha"
            />
          </div>
          
          <button type="submit" className="btn btn-primary login-btn">
            Entrar
          </button>
        </form>
        
        <div className="login-footer">
          <p>Nossa missão é levar diversidade ao mercado financeiro através da educação!</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
