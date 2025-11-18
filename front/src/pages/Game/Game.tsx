import { useEffect, useState } from 'react';
import './Game.css';
import { useParams, useSearchParams } from 'react-router';

function Game() {
  const [yourMarker, setYourMarker] = useState<string>('x');
  const [cells, setCells] = useState<string[]>(Array(9).fill(''));
  const room_id = useParams().room_id;
  const [waiting, setWaiting] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const user = searchParams.get('user');
  const [lastPlayer, setLastPlayer] = useState<string>('');
  const [currentPlayer, setCurrentPlayer] = useState<string>('Qualquer');
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [winnerText, setWinnerText] = useState<string>('');

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: number;

    if (!room_id || !user) return;

    const connect = () => {
      const host = window.location.host;
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

      ws = new WebSocket(`${wsProtocol}//${host}/ws/${room_id}`);

      ws.onopen = () => {
        console.log(`Conectado a ${room_id}`);
        sendEnterSignal();
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        let dataType = data.type;

        if (dataType === 'enter' && waiting) {
          if (data.user === user) return;
          const rival = data.user;
          console.log('Player entrou: ', rival);
          console.log('Enviando sinal de start...');
          setYourMarker('❌');
          sendStartSignal();
          setWaiting(false);
        }
        if (dataType === 'start' && waiting) {
          if (data.user === user) return;
          const rival = data.user;
          console.log('Jogo iniciado pelo player: ', rival);
          setYourMarker('⭕');
          setWaiting(false);
        }
        if (dataType === 'action') {
          console.log('Ação recebida: ', data);

          setCells(data.cells);

          const lastP = data.user;
          const lastPMarker = data.marker;

          setLastPlayer(lastP);
          setCurrentPlayer(lastPMarker);

          const winner = checkWinner(data.cells);
          if (winner) {
            console.log('Vencedor:', lastP);
            setGameEnded(true);
            setWinnerText(winner);
          }
        }

        if (dataType === 'reset') {
          window.location.reload();
        }
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

  const checkWinner = (cells: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        console.log('Winner found at cells:', a, b, c);
        return cells[a];
      }
    }

    if (cells.every((c) => c !== '')) return 'Velha';

    return null;
  };

  const sendEnterSignal = async () => {
    const body = {
      type: 'enter',
      channel: room_id,
      user: user,
    };

    await fetch(`/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  const sendStartSignal = async () => {
    const body = {
      type: 'start',
      channel: room_id,
      user: user,
    };

    await fetch(`/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  const handleClick = async (index: number) => {
    if (lastPlayer == user) return;
    if (waiting) return;

    const newCells = [...cells];
    newCells[index] = yourMarker;
    setCells(newCells);

    console.log(newCells);

    const body = {
      type: 'action',
      cells: newCells,
      channel: room_id,
      user: user,
      marker: yourMarker,
    };

    await fetch(`/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  const handleReset = async () => {
    const body = {
      type: 'reset',
      channel: room_id,
      user: user,
    };

    await fetch(`/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  return (
    <>
      <div className="tic-tac-toe">
        <div className="column 1">
          {waiting ? (
            <p>Esperando conexão do player 2...</p>
          ) : (
            <h3>Seu marcador: {yourMarker}</h3>
          )}
          <div className="info">
            {gameEnded ? (
              <button className="reset" onClick={handleReset}>
                Reiniciar
              </button>
            ) : (
              <p className="status">Vez do jogador {currentPlayer}</p>
            )}
          </div>
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
                      className={`cell 
                        ${cell !== '' ? 'occupied' : ''} 
                        ${cell === '❌' ? 'x-cell' : ''} 
                        ${cell === '⭕' ? 'o-cell' : ''}`}
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
        </div>
        <div className="column 3">
          {gameEnded && (
            <div className="game-over">
              {winnerText === 'Velha' ? (
                <h2>Empate! Jogo terminou em Velha.</h2>
              ) : (
                <h2>Jogador {winnerText} venceu!</h2>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Game;
