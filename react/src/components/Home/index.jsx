import React, { useEffect, useState } from 'react';
import { fetchMessages, sendMessage } from '../../api/chat';

/**
 * Начальный экран приложения: интерфейс группового чата.
 */
export const Home = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');

  const loadMessages = async () => {
    if (!currentUser) {
      setMessages([]);
      setError('Войдите в систему, чтобы просматривать сообщения.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (err) {
      console.error('Fetch messages error:', err);
      setError('Не удалось загрузить сообщения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setMessages([]);
      return;
    }

    let intervalId;

    const init = async () => {
      await loadMessages();

      if (typeof window !== 'undefined') {
        intervalId = window.setInterval(() => {
          loadMessages();
        }, 5000);
      }
    };

    init();

    return () => {
      if (intervalId && typeof window !== 'undefined') {
        window.clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!currentUser) {
      setError('Войдите в систему, чтобы отправлять сообщения.');
      return;
    }

    const trimmedText = newMessageText.trim();

    if (!trimmedText) {
      setError('Текст сообщения не должен быть пустым.');
      return;
    }

    setError('');
    setSending(true);

    try {
      const createdMessage = await sendMessage({ text: trimmedText });
      setMessages((prev) => [...prev, createdMessage]);
      setNewMessageText('');
    } catch (err) {
      console.error('Send message error:', err);
      setError('Не удалось отправить сообщение. Попробуйте ещё раз.');
    } finally {
      setSending(false);
    }
  };

  const handleRefreshClick = () => {
    loadMessages();
  };

  const renderMessageTime = (isoString) => {
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
      data-easytag="id1-react/src/components/Home/index.jsx"
      className="page page--home"
    >
      <h1 className="page__title">Групповой чат</h1>
      <p className="page__description">
        Здесь отображаются сообщения всех пользователей чата.
      </p>
      {currentUser && (
        <p className="page__description">
          Вы вошли как: <strong>{currentUser.username}</strong>.
        </p>
      )}

      <div className="chat">
        <div className="chat__header-row">
          <span className="chat__header-text">Сообщения</span>
          <button
            type="button"
            className="chat__refresh-button"
            onClick={handleRefreshClick}
            disabled={loading}
          >
            Обновить
          </button>
        </div>

        {loading && (
          <div className="chat__status">Загрузка сообщений...</div>
        )}
        {error && <div className="chat__error">{error}</div>}

        <div className="chat__messages">
          {messages.length === 0 && !loading && !error && (
            <div className="chat__empty">Пока нет сообщений.</div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="chat-message">
              <div className="chat-message__meta">
                <span className="chat-message__sender">
                  {message.sender_username}
                </span>
                <span className="chat-message__time">
                  {renderMessageTime(message.created_at)}
                </span>
              </div>
              <div className="chat-message__text">{message.text}</div>
            </div>
          ))}
        </div>

        <div className="chat__input-block">
          {currentUser ? (
            <form className="chat-form" onSubmit={handleSendMessage}>
              <label className="chat-form__label" htmlFor="chat-message-text">
                Отправить сообщение
              </label>
              <textarea
                id="chat-message-text"
                className="chat-form__textarea"
                value={newMessageText}
                onChange={(event) => setNewMessageText(event.target.value)}
                placeholder="Введите текст сообщения"
                disabled={sending}
              />
              <button
                type="submit"
                className="chat-form__submit"
                disabled={sending}
              >
                {sending ? 'Отправка...' : 'Отправить'}
              </button>
            </form>
          ) : (
            <p className="chat__note">
              Войдите в систему, чтобы отправлять сообщения.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
