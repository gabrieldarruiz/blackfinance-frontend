import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/dashboard">
              <span className="logo-text">BF</span>
            </Link>
          </div>
          <nav className="nav">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/events" className="nav-link">Eventos</Link>
            <Link to="/notifications" className="nav-link">Notificações</Link>
          </nav>
          <div className="user-menu">
            <span className="user-name">{user?.name || 'Usuário'}</span>
            <button onClick={logout} className="btn btn-secondary">Sair</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
