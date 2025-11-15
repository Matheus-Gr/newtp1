import { useEffect, useState } from 'react';
import './game.css';
import { useParams } from 'react-router';

function Game() {
  const [marker, setMarker] = useState<string>('❌');
  const [cells, setCells] = useState<string[]>(Array(9).fill(''));
  const room_id = useParams().room_id;
  const [waiting, setWaiting] = useState<boolean>(true);

  useEffect(() => {
    const host = window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    const ws = new WebSocket(`${wsProtocol}//${host}/ws/${room_id}`);

    ws.onopen = () => console.log(`Conectado a ${room_id}`);
    ws.onerror = (e) => console.error('Erro WS:', e);
  }, []);

  const handleClick = (index: number) => {
    const newCells = [...cells];
    newCells[index] = marker;
    setCells(newCells);
  };

  return (
    <>
      <div className="tic-tac-toe">
        <div className="column 1">
          {waiting ? (
            <p>Esperando conexão do player 2...</p>
          ) : (
            <h3>Seu marcador: {marker}</h3>
          )}
        </div>

        <div className="column 2">
          <h1 className="title">Jogo da Velha</h1>

          <div className="board">
            {[0, 1, 2].map((row) => (
              <div className="row" key={row}>
                {cells.slice(row * 3, row * 3 + 3).map((cell, col) => {
                  const index = row * 3 + col;
                  return (
                    <button
                      key={index}
                      className="cell"
                      data-pos={index}
                      onClick={() => handleClick(index)}
                    >
                      {cell}
                    </button>
                  );
                })}
              </div>
            ))}
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
