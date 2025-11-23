import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

import { Home } from './components/Home';
import RegisterPage from './components/Auth/RegisterPage';
import LoginPage from './components/Auth/LoginPage';
import ProfilePage from './components/Profile';

function App() {
  /** Никогда не удаляй этот код */
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      /** Нужно передавать список существующих роутов */
      window.handleRoutes(['/', '/register', '/login', '/profile']);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="app-root" data-easytag="id1-react/src/App.jsx">
        <header className="app-header">
          <div className="app-header__title">Групповой чат</div>
          <nav className="app-nav">
            <Link className="app-nav__link" to="/">
              Чат
            </Link>
            <Link className="app-nav__link" to="/register">
              Регистрация
            </Link>
            <Link className="app-nav__link" to="/login">
              Вход
            </Link>
            <Link className="app-nav__link" to="/profile">
              Профиль
            </Link>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
