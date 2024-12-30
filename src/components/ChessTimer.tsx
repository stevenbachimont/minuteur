import { useState, useEffect, useRef } from 'react';
import './ChessTimer.css';

const ChessTimer = () => {
  const [initialTime, setInitialTime] = useState(600); // Temps initial en secondes
  const [player1Time, setPlayer1Time] = useState(initialTime);
  const [player2Time, setPlayer2Time] = useState(initialTime);
  const [player1Name, setPlayer1Name] = useState('Noirs');
  const [player2Name, setPlayer2Name] = useState('Blancs');
  const [editingName, setEditingName] = useState<1 | 2 | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2 | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const timeOptions = [
    { label: '1 minute', value: 60 },
    { label: '3 minutes', value: 180 },
    { label: '5 minutes', value: 300 },
    { label: '10 minutes', value: 600 },
    { label: '15 minutes', value: 900 },
    { label: '30 minutes', value: 1800 },
  ];

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayerClick = (player: 1 | 2) => {
    if (isPaused) return; // Empêcher les clics pendant la pause
    
    // Au début de la partie, seul le clic sur le minuteur noir (player 1) est permis
    if (!isRunning && !currentPlayer) {
      if (player === 1) {
        setIsRunning(true);
        setCurrentPlayer(2); // Démarre le temps des blancs
      }
      return;
    }
    
    // Pendant la partie, chaque joueur ne peut cliquer que sur son propre minuteur
    if (currentPlayer === player) {
      setCurrentPlayer(player === 1 ? 2 : 1);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTime = parseInt(event.target.value, 10);
    if (!isNaN(newTime)) {
      setInitialTime(newTime);
      setPlayer1Time(newTime);
      setPlayer2Time(newTime);
      reset();
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleNameClick = (player: 1 | 2) => {
    if (!isRunning) {
      setEditingName(player);
      // Focus l'input après le rendu
      setTimeout(() => nameInputRef.current?.focus(), 0);
    }
  };

  const handleNameChange = (player: 1 | 2, newName: string) => {
    if (player === 1) {
      setPlayer1Name(newName || 'Noirs');
    } else {
      setPlayer2Name(newName || 'Blancs');
    }
    setEditingName(null);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent, player: 1 | 2) => {
    if (e.key === 'Enter') {
      handleNameChange(player, (e.target as HTMLInputElement).value);
    }
  };

  const reset = () => {
    setPlayer1Time(initialTime);
    setPlayer2Time(initialTime);
    setCurrentPlayer(null);
    setIsRunning(false);
    setIsPaused(false);
    setEditingName(null);
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        if (currentPlayer === 1) {
          setPlayer1Time(prev => {
            if (prev <= 1) {
              setIsRunning(false);
              alert('Blancs gagnent !');
              return 0;
            }
            return prev - 1;
          });
        } else if (currentPlayer === 2) {
          setPlayer2Time(prev => {
            if (prev <= 1) {
              setIsRunning(false);
              alert('Noirs gagnent !');
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, currentPlayer, isPaused]);

  useEffect(() => {
    if (!isRunning) {
      setPlayer1Time(initialTime);
      setPlayer2Time(initialTime);
    }
  }, [initialTime, isRunning]);

  return (
    <div className="container">
      <div className="player-section">
        {editingName === 1 ? (
          <input
            ref={nameInputRef}
            type="text"
            className="name-input"
            defaultValue={player1Name}
            onBlur={(e) => handleNameChange(1, e.target.value)}
            onKeyPress={(e) => handleNameKeyPress(e, 1)}
            maxLength={20}
          />
        ) : (
          <h2 
            className="player-name"
            onClick={() => handleNameClick(1)}
          >
            {player1Name}
          </h2>
        )}
        <button 
          className={`player-button ${currentPlayer === 1 ? 'active' : ''}`}
          onClick={() => handlePlayerClick(1)}
          disabled={isPaused}
        >
          <div className="timer">{formatTime(player1Time)}</div>
        </button>
      </div>

      <div className="controls">
        <select 
          value={initialTime} 
          onChange={handleTimeChange}
          disabled={isRunning}
          className="time-select"
        >
          {timeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isRunning && (
          <button 
            onClick={togglePause}
            className={`pause-button ${isPaused ? 'paused' : ''}`}
            aria-label={isPaused ? 'Reprendre' : 'Pause'}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        )}
        <button 
          onClick={reset}
          className="reset-button"
          aria-label="Réinitialiser"
        >
          ↺
        </button>
      </div>

      <div className="player-section">
        {editingName === 2 ? (
          <input
            ref={nameInputRef}
            type="text"
            className="name-input"
            defaultValue={player2Name}
            onBlur={(e) => handleNameChange(2, e.target.value)}
            onKeyPress={(e) => handleNameKeyPress(e, 2)}
            maxLength={20}
          />
        ) : (
          <h2 
            className="player-name"
            onClick={() => handleNameClick(2)}
          >
            {player2Name}
          </h2>
        )}
        <button 
          className={`player-button ${currentPlayer === 2 ? 'active' : ''}`}
          onClick={() => handlePlayerClick(2)}
          disabled={isPaused}
        >
          <div className="timer">{formatTime(player2Time)}</div>
        </button>
      </div>
    </div>
  );
};

export default ChessTimer; 