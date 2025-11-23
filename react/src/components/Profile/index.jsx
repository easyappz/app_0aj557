import React from 'react';

function ProfilePage({ currentUser }) {
  const isAuthenticated = Boolean(currentUser);

  return (
    <div
      data-easytag="id1-react/src/components/Profile/index.jsx"
      className="page page--profile"
    >
      <h1 className="page__title">Профиль пользователя</h1>
      {isAuthenticated ? (
        <>
          <p className="page__description">
            Текущий пользователь: <strong>{currentUser.username}</strong>
          </p>
          <p className="page__description">
            Здесь в дальнейшем будет расширенная информация о профиле
            и настройках аккаунта.
          </p>
        </>
      ) : (
        <p className="page__description">
          Вы не авторизованы. Пожалуйста, войдите в систему, чтобы просмотреть
          профиль.
        </p>
      )}
    </div>
  );
}

export default ProfilePage;
