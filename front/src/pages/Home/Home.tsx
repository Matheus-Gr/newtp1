import { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router';
import { customAlphabet } from 'nanoid';

const generateId = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  5
);

function Home() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleChat = () => {
    const room_id = generateId();
    navigate(`/chat/${room_id}?user=${username}`);
  };

  const handleGame = () => {
    const room_id = generateId();
    navigate(`/game/${room_id}?user=${username}`);
  };

  return (
    <div className="create-room-field">
      <h3>Criar Sala</h3>

      <div className="create-room-form">
        <input
          className="username-field"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />

        <button onClick={handleChat} disabled={!username}>
          Chat
        </button>

        <button onClick={handleGame} disabled={!username}>
          Jogo da Velha
        </button>
      </div>
    </div>
  );
}

export default Home;
