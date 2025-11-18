import { useEffect, useState } from 'react';
import './Game.css';
import { useParams, useSearchParams } from 'react-router';

function Game() {
  const [marker, setMarker] = useState<string>('❌');
  const [cells, setCells] = useState<string[]>(Array(9).fill(''));
  const room_id = useParams().room_id;
  const [waiting, setWaiting] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const user = searchParams.get('user');
  const [lastPlayer, setLastPlayer] = useState<string>('Qualquer');

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: number;

    const connect = () => {
      const host = window.location.host;
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

      ws = new WebSocket(`${wsProtocol}//${host}/ws/${room_id}`);

      ws.onopen = () => {
        console.log(`Conectado a ${room_id}`);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setCells(data.cells);
        setLastPlayer(data.lastPlayer);
        setMarker(data.marker === '❌' ? '⭕' : '❌');
      };

      ws.onerror = () => {
        console.log('Erro WS, fechando conexão...');
        ws?.close();
      };

      ws.onclose = () => {
        console.log('WS fechado, tentando reconectar...');
        reconnectTimeout = window.setTimeout(connect, 1000);
      };
    };

    connect();

    return () => {
      ws?.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  const handleClick = async (index: number) => {
    if (lastPlayer == user) return;

    const newCells = [...cells];
    newCells[index] = marker;
    setCells(newCells);
    setWaiting(false);

    const response = await fetch(`/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'action',
        cells: newCells,
        channel: room_id,
        user: user,
      }),
    });

    console.log('Response:', response);
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
            <p className="status">Vez do jogador {lastPlayer}</p>
            <button className="reset">Reiniciar</button>
          </div>
        </div>
        <div className="column 3"></div>
      </div>
    </>
  );
}

export default Game;
