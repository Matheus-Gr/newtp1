import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Chat from './pages/Chat/Chat';
import Home from './pages/Home/Home';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:room_id" element={<Chat />} />
      </Routes>
    </Router>
  </StrictMode>
);
