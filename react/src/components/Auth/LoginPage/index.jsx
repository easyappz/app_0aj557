import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginMember } from '../../../api/auth';

function LoginPage({ onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setError('Имя пользователя и пароль не должны быть пустыми.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await loginMember({
        username: trimmedUsername,
        password,
      });

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('authToken', data.token);
      }

      if (typeof onAuthSuccess === 'function') {
        onAuthSuccess(data.member);
      }

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Не удалось войти. Проверьте логин и пароль и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-easytag="id1-react/src/components/Auth/LoginPage/index.jsx"
      className="page page--auth"
    >
      <h1 className="page__title">Вход</h1>
      <p className="page__description">
        Введите свои данные для входа в аккаунт.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__field">
          <label className="auth-form__label" htmlFor="login-username">
            Имя пользователя
          </label>
          <input
            id="login-username"
            type="text"
            className="auth-form__input"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Введите имя пользователя"
            disabled={loading}
          />
        </div>

        <div className="auth-form__field">
          <label className="auth-form__label" htmlFor="login-password">
            Пароль
          </label>
          <input
            id="login-password"
            type="password"
            className="auth-form__input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Введите пароль"
            disabled={loading}
          />
        </div>

        {error && <div className="auth-form__error">{error}</div>}

        <button
          type="submit"
          className="auth-form__submit"
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
