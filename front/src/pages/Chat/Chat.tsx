import { useEffect, useRef, useState } from 'react';
import './Chat.css';
import { useParams, useSearchParams } from 'react-router';

function Chat() {
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const room_id = useParams().room_id;
  const [searchParams] = useSearchParams();
  const user = searchParams.get('user');
  const [reconnectText, setReconnectText] = useState<string>('');
  // const sockets = new Map<string, WebSocket>();
  const socketsRef = useRef<Map<string, WebSocket>>(new Map());

  const connect = (chat: string) => {
    const host = window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    console.log(`Conectando ao canal ${chat}...`);

    const ws = new WebSocket(`${wsProtocol}//${host}/ws/${chat}`);

    socketsRef.current.set(chat, ws);

    ws.onopen = () => {
      console.log(`Conectado ao canal ${chat}`);
      setReconnectText('');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          setMessages((prev) => [
            ...prev,
            `(${data.channel}) ${data.user}: ${data.msg}`,
          ]);
        }
      } catch {}
    };

    ws.onerror = () => {
      console.warn(`Erro no canal ${chat}`);
    };

    ws.onclose = () => {
      console.warn(`Conexão perdida em ${chat}, tentando reconectar...`);
      socketsRef.current.delete(chat);
      setReconnectText(`Reconectando ao canal ${chat}...`);

      setTimeout(() => {
        if (selectedChats.includes(chat) && !socketsRef.current.has(chat)) {
          connect(chat);
        }
      }, 1000);
    };
  };

  useEffect(() => {
    selectedChats.forEach((chat) => {
      if (!socketsRef.current.has(chat)) {
        connect(chat);
      }
    });

    socketsRef.current.forEach((ws, chat) => {
      if (!selectedChats.includes(chat)) {
        ws.close();
        socketsRef.current.delete(chat);
      }
    });

    return () => {};
  }, [selectedChats]);

  const sendMessage = async () => {
    if (selectedChats.length === 0 || !input) return;

    for (const chat of selectedChats) {
      await fetch(`/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'message',
          msg: input,
          channel: chat,
          user: user,
        }),
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
        <span>{reconnectText}</span>
        <h3>Usuário: {user}</h3>
        <div className="options">
          {['Email', 'Geral'].map((chat) => (
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
