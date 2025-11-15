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
  const room_id = generateId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nome:', username);
    navigate(`/play/${room_id}?user=${username}`);
  };

  return (
    <div className="create-room-field">
      <h3>Criar Sala</h3>

      <form className="create-room-form" onSubmit={handleSubmit}>
        <input
          className="username-field"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Home;
