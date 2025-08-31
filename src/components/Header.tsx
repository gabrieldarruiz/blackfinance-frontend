import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const isLoggedIn = location.pathname !== '/';

  if (!isLoggedIn) return null;

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
            <span className="user-name">Admin</span>
            <Link to="/" className="btn btn-secondary">Sair</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
