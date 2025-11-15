import { useEffect, useState } from 'react';
import './Chat.css';
import { useParams, useSearchParams } from 'react-router';

function Chat() {
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const room_id = useParams().room_id;
  const [searchParams] = useSearchParams();
  const user = searchParams.get('user');

  console.log('Peste da desgraça');
  console.log('room id:' + room_id);
  console.log('user:' + user);

  useEffect(() => {
    if (selectedChats.length === 0) return;

    const host = window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    const sockets = selectedChats.map((chat) => {
      const ws = new WebSocket(`${wsProtocol}//${host}/ws/${chat}`);
      ws.onopen = () => console.log(`Conectado a ${chat}`);
      ws.onmessage = (event) => setMessages((prev) => [...prev, event.data]);
      ws.onerror = (e) => console.error('Erro WS:', e);
      return ws;
    });

    return () => sockets.forEach((ws) => ws.close());
  }, [selectedChats]);

  const sendMessage = async () => {
    if (selectedChats.length === 0 || !input) return;

    for (const chat of selectedChats) {
      await fetch(`/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat, message: input, user }),
      });
    }
    setInput('');
  };

  const toggleChat = (chat: string) => {
    // setMessages([]);
    setSelectedChats((prev) =>
      prev.includes(chat) ? prev.filter((c) => c !== chat) : [...prev, chat]
    );
  };

  useEffect(() => {
    if (!room_id) return;

    toggleChat(room_id);
  }, [room_id]);

  return (
    <>
      <div className="select-chat-container">
        <h3>Usuário: {user}</h3>
        <div className="options">
          {['Geral'].map((chat) => (
            <div className="option" key={chat}>
              <span>{chat}</span>
              <input
                type="checkbox"
                checked={selectedChats.includes(chat)}
                onChange={() => toggleChat(chat)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="chat-history">
        <h3>Mensagens:</h3>
        <div>
          {messages.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>
      </div>

      <div className="chat-container">
        <textarea
          className="text-area"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <button className="send-text" onClick={sendMessage}>
          Enviar
        </button>
      </div>
    </>
  );
}

export default Chat;
