import { useEffect, useState } from 'react';
import './game.css';
import { useParams } from 'react-router';

function Game() {
  const [marker, setMarker] = useState<string>('❌');

  const [cells, setCells] = useState<string[]>(Array(9).fill(''));

  const room_id = useParams().room_id;

  useEffect(() => {
    const host = window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    const ws = new WebSocket(`${wsProtocol}//${host}/ws/${room_id}`);

    ws.onopen = () => console.log(`Conectado a ${room_id}`);
    ws.onerror = (e) => console.error('Erro WS:', e);
  }, []);

  return (
    <>
      <div className="tic-tac-toe">
        <div className="column 1">
          <h3>Seu marcador: {marker}</h3>
        </div>

        <div className="column 2">
          <h1 className="title">Jogo da Velha</h1>

          <div className="board">
            <div className="row">
              <button className="cell" data-pos="0">
                {cells[0]}
              </button>
              <button className="cell" data-pos="1">
                {cells[1]}
              </button>
              <button className="cell" data-pos="2">
                {cells[2]}
              </button>
            </div>

            <div className="row">
              <button className="cell" data-pos="3">
                {cells[3]}
              </button>
              <button className="cell" data-pos="4">
                {cells[4]}
              </button>
              <button className="cell" data-pos="5">
                {cells[5]}
              </button>
            </div>

            <div className="row">
              <button className="cell" data-pos="6">
                {cells[6]}
              </button>
              <button className="cell" data-pos="7">
                {cells[7]}
              </button>
              <button className="cell" data-pos="8">
                {cells[8]}
              </button>
            </div>
          </div>

          <div className="info">
            <p className="status">Vez do jogador X</p>
            <button className="reset">Reiniciar</button>
          </div>
        </div>
        <div className="column 3"></div>
      </div>
    </>
  );
}

export default Game;
