import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Chat from './pages/Chat/Chat';
import Home from './pages/Home/Home';
import Game from './pages/Game/Game';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:room_id" element={<Game />} />
        <Route path="/chat/:room_id" element={<Chat />} />
      </Routes>
    </Router>
  </StrictMode>
);
