import React, { useState } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  
  // Player = X, Bot = O
  const PLAYER = 'X';
  const BOT = 'O';

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

  const calculateWinner = (squares) => {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinningLine(lines[i]);
        return squares[a];
      }
    }

    if (squares.every(square => square !== null)) {
      return 'Draw';
    }

    return null;
  };

  // AI Bot Logic - Smart AI
  const getBotMove = (squares) => {
    // 1. Cek apakah bot bisa menang
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      const line = [squares[a], squares[b], squares[c]];
      const botCount = line.filter(cell => cell === BOT).length;
      const emptyCount = line.filter(cell => cell === null).length;
      
      if (botCount === 2 && emptyCount === 1) {
        if (squares[a] === null) return a;
        if (squares[b] === null) return b;
        if (squares[c] === null) return c;
      }
    }

    // 2. Cek apakah perlu memblokir player
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      const line = [squares[a], squares[b], squares[c]];
      const playerCount = line.filter(cell => cell === PLAYER).length;
      const emptyCount = line.filter(cell => cell === null).length;
      
      if (playerCount === 2 && emptyCount === 1) {
        if (squares[a] === null) return a;
        if (squares[b] === null) return b;
        if (squares[c] === null) return c;
      }
    }

    // 3. Ambil center jika tersedia
    if (squares[4] === null) return 4;

    // 4. Ambil corner yang tersedia
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => squares[corner] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 5. Ambil sisi yang tersedia
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(side => squares[side] === null);
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)];
    }

    return null;
  };

  const makeBotMove = () => {
    setIsBotThinking(true);
    
    // Delay untuk efek visual bot berpikir
    setTimeout(() => {
      setBoard(prevBoard => {
        const botMoveIndex = getBotMove(prevBoard);
        
        if (botMoveIndex !== null && prevBoard[botMoveIndex] === null) {
          const newBoard = [...prevBoard];
          newBoard[botMoveIndex] = BOT;
          setIsXNext(true);
          setIsBotThinking(false);

          const gameWinner = calculateWinner(newBoard);
          if (gameWinner) {
            setWinner(gameWinner);
            setGameOver(true);
          } else {
            setWinningLine(null);
          }
          
          return newBoard;
        } else {
          setIsBotThinking(false);
          return prevBoard;
        }
      });
    }, 500); // Delay 500ms untuk efek visual
  };

  const handleClick = (index) => {
    // Hanya terima klik dari player (X)
    if (board[index] || winner || gameOver || !isXNext || isBotThinking) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = PLAYER;
    setBoard(newBoard);
    setIsXNext(false); // Setelah player, giliran bot

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
    } else {
      setWinningLine(null);
      // Trigger bot move setelah player move
      setTimeout(() => {
        makeBotMove();
      }, 100);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true); // Player mulai dulu
    setWinner(null);
    setGameOver(false);
    setWinningLine(null);
    setIsBotThinking(false);
  };

  const renderSquare = (index) => {
    const value = board[index];
    const isWinning = winningLine && winningLine.includes(index);

    return (
      <button
        key={index}
        onClick={() => handleClick(index)}
        disabled={!!value || !!winner || gameOver || !isXNext || isBotThinking}
        style={{
          width: 'clamp(64px, 10vw, 92px)',
          height: 'clamp(64px, 10vw, 92px)',
          fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)',
          fontWeight: 'bold',
          border: '2px solid rgba(0, 234, 255, 0.5)',
          background: value 
            ? `linear-gradient(135deg, rgba(0, 234, 255, 0.1) 0%, rgba(0, 234, 255, 0.05) 100%)`
            : 'transparent',
          color: value === 'X' ? '#00eaff' : value === 'O' ? '#ff0080' : '#fff',
          cursor: (value || winner || gameOver || !isXNext || isBotThinking) ? 'not-allowed' : 'pointer',
          opacity: (!isXNext || isBotThinking) && !value ? 0.5 : 1,
          transition: 'all 0.25s ease',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isWinning 
            ? '0 0 24px rgba(0, 234, 255, 0.85)' 
            : '0 8px 24px rgba(0, 0, 0, 0.3)',
          transform: isWinning ? 'scale(1.08)' : 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (!value && !winner && !gameOver && isXNext && !isBotThinking) {
            e.currentTarget.style.borderColor = '#00eaff';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 234, 255, 0.6)';
            e.currentTarget.style.transform = 'scale(1.04)';
          }
        }}
        onMouseLeave={(e) => {
          if (!value && !winner && !gameOver && isXNext && !isBotThinking) {
            e.currentTarget.style.borderColor = 'rgba(0, 234, 255, 0.5)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        {value}
      </button>
    );
  };

  const getStatus = () => {
    if (winner === 'Draw') {
      return 'Draw!';
    }
    if (winner) {
      if (winner === PLAYER) {
        return '🎉 You Win!';
      }
      return '🤖 Bot Wins!';
    }
    if (isBotThinking) {
      return '🤖 Bot is thinking...';
    }
    return `Turn: ${isXNext ? 'You (X)' : 'Bot (O)'}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'clamp(1rem, 2.5vw, 1.4rem)',
      padding: 'clamp(1.4rem, 3.5vw, 2rem)',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '22px',
      border: '1px solid rgba(0, 234, 255, 0.2)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 18px 48px rgba(0, 0, 0, 0.35)',
      maxWidth: 'clamp(300px, 34vw, 390px)',
      width: '100%',
    }}>
      <h3 style={{
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
        fontWeight: '600',
        margin: 0,
        textAlign: 'center',
        letterSpacing: '0.1em',
      }}>
        TIC TAC TOE
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'clamp(10px, 2vw, 16px)',
        width: '100%',
        maxWidth: 'clamp(240px, 30vw, 320px)',
      }}>
        {Array(9).fill(null).map((_, index) => renderSquare(index))}
      </div>

      <div style={{
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
        fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
        fontWeight: '500',
        textAlign: 'center',
        minHeight: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {getStatus()}
      </div>

      <button
        onClick={resetGame}
        style={{
          padding: 'clamp(0.5rem, 1.5vw, 0.6rem) clamp(1.2rem, 3vw, 1.5rem)',
          fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
          fontWeight: '600',
          fontFamily: 'Poppins, sans-serif',
          color: '#fff',
          background: 'transparent',
          border: '2px solid #00eaff',
          borderRadius: '50px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          letterSpacing: '0.05em',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#00eaff';
          e.currentTarget.style.color = '#000';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 234, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;

