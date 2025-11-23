import React from 'react';

/**
 * Начальный экран приложения: заглушка для группового чата.
 */
export const Home = ({ currentUser }) => {
  return (
    <div
      data-easytag="id1-react/src/components/Home/index.jsx"
      className="page page--home"
    >
      <h1 className="page__title">Групповой чат</h1>
      <p className="page__description">
        Здесь будет список сообщений и поле для отправки новых сообщений.
      </p>
      {currentUser && (
        <p className="page__description">
          Вы вошли как: <strong>{currentUser.username}</strong>.
        </p>
      )}
    </div>
  );
};
