import { useState } from 'react';
import './Home.css';

function Home() {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nome:', username);
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
