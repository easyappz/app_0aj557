import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentMember } from '../../api/auth';

function ProfilePage({ currentUser, onUserUpdate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = window.localStorage.getItem('authToken');

    if (!token || !currentUser) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchCurrentMember();
        setProfile(data);

        if (typeof onUserUpdate === 'function') {
          onUserUpdate(data);
        }
      } catch (err) {
        console.error('Profile load error:', err);
        setError(
          'Не удалось загрузить профиль. Пожалуйста, войдите в систему ещё раз.'
        );

        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('authToken');
        }

        if (typeof onUserUpdate === 'function') {
          onUserUpdate(null);
        }

        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser, navigate, onUserUpdate]);

  const renderDateTime = (isoString) => {
    if (!isoString) {
      return '';
    }

    try {
      const date = new Date(isoString);
      if (Number.isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleString('ru-RU');
    } catch (err) {
      return '';
    }
  };

  return (
    <div
      data-easytag="id1-react/src/components/Profile/index.jsx"
      className="page page--profile"
    >
      <h1 className="page__title">Профиль пользователя</h1>

      {loading && <p className="page__description">Загрузка профиля...</p>}

      {error && <p className="page__description">{error}</p>}

      {!loading && !error && profile && (
        <div className="auth-form">
          <p className="page__description">
            Имя пользователя: <strong>{profile.username}</strong>
          </p>
          <p className="page__description">
            Дата регистрации: {renderDateTime(profile.created_at)}
          </p>
          <p className="page__description">
            В будущем здесь можно будет изменить пароль.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
