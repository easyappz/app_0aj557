import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

import { Home } from './components/Home';
import RegisterPage from './components/Auth/RegisterPage';
import LoginPage from './components/Auth/LoginPage';
import ProfilePage from './components/Profile';
import { fetchCurrentMember, logoutMember } from './api/auth';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  /** Никогда не удаляй этот код */
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      /** Нужно передавать список существующих роутов */
      window.handleRoutes(['/', '/register', '/login', '/profile']);
    }
  }, []);

  useEffect(() => {
    async function initAuth() {
      if (typeof window === 'undefined') {
        return;
      }

      const token = window.localStorage.getItem('authToken');
      if (!token) {
        return;
      }

      try {
        const member = await fetchCurrentMember();
        setCurrentUser(member);
      } catch (error) {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('authToken');
        }
        setCurrentUser(null);
      }
    }

    initAuth();
  }, []);

  const handleAuthSuccess = (member) => {
    setCurrentUser(member);
  };

  const handleLogoutClick = async () => {
    try {
      await logoutMember();
    } catch (error) {
      // Ошибку выхода можно просто залогировать, чтобы не мешать пользователю
      console.error('Logout error:', error);
    }

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authToken');
    }

    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <ErrorBoundary>
      <div className="app-root" data-easytag="id1-react/src/App.jsx">
        <header className="app-header">
          <div className="app-header__title">Групповой чат</div>
          <div className="app-header__right">
            <nav className="app-nav">
              <Link className="app-nav__link" to="/">
                Чат
              </Link>
              <Link className="app-nav__link" to="/profile">
                Профиль
              </Link>
            </nav>
            <div className="app-header__user-area">
              {currentUser ? (
                <>
                  <span className="app-header__user-text">
                    Вы вошли как: <strong>{currentUser.username}</strong>
                  </span>
                  <button
                    type="button"
                    className="app-header__logout-button"
                    onClick={handleLogoutClick}
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link className="app-nav__link" to="/login">
                    Вход
                  </Link>
                  <Link className="app-nav__link" to="/register">
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route
              path="/register"
              element={<RegisterPage onAuthSuccess={handleAuthSuccess} />}
            />
            <Route
              path="/login"
              element={<LoginPage onAuthSuccess={handleAuthSuccess} />}
            />
            <Route
              path="/profile"
              element={<ProfilePage currentUser={currentUser} />}
            />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
