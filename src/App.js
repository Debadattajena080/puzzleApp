import React, { useState, useEffect } from 'react';
import Tile from './components/Tile';
import './App.css';

// Generate and solvability logic remains unchanged
const generateBoard = () => {
  const tiles = [...Array(15).keys()].map(n => n + 1);
  tiles.push(null);
  do {
    tiles.sort(() => Math.random() - 0.5);
  } while (!isSolvable(tiles));
  return tiles;
};

const isSolvable = (tiles) => {
  const array = tiles.filter(n => n !== null);
  let inversions = 0;
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] > array[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
};

const App = () => {
  const [board, setBoard] = useState(generateBoard());
  const [emptyIndex, setEmptyIndex] = useState(board.indexOf(null));
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleDragStart = (index) => {
    window.draggedTileIndex = index;
  };

  const handleDrop = (index) => {
    if (index !== emptyIndex) return;

    const draggedIndex = window.draggedTileIndex;
    if (draggedIndex === undefined) return;
    const draggedRow = Math.floor(draggedIndex / 4);
    const draggedCol = draggedIndex % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    const isNeighbor =
      (draggedRow === emptyRow && Math.abs(draggedCol - emptyCol) === 1) ||
      (draggedCol === emptyCol && Math.abs(draggedRow - emptyRow) === 1);

    if (isNeighbor) {
      const newBoard = [...board];
      newBoard[emptyIndex] = newBoard[draggedIndex]; 
      newBoard[draggedIndex] = null; 
      setBoard(newBoard);
      setEmptyIndex(draggedIndex);
      setMoves(prev => prev + 1);
      if (!isRunning) setIsRunning(true);
    }

  
    delete window.draggedTileIndex;
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const resetGame = () => {
    const newBoard = generateBoard();
    setBoard(newBoard);
    setEmptyIndex(newBoard.indexOf(null));
    setMoves(0);
    setTimer(0);
    setIsRunning(false);
  };

  const isSolved = board.slice(0, -1).every((tile, i) => tile === i + 1);

  useEffect(() => {
    if (isSolved) setIsRunning(false);
  }, [isSolved]);

  return (
    <div className="game-container">
      <h1>15 Puzzle Game</h1>
      <div className="stats">
        <p>Moves: {moves}</p>
        <p>Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
      </div>
      <div className="board">
        {board.map((tile, index) => (
          <Tile
            key={index}
            tile={tile}
            isEmpty={tile === null}
            onDragStart={() => handleDragStart(index)}
            onDrop={() => handleDrop(index)}
            onDragOver={handleDragOver}
          />
        ))}
      </div>
      {isSolved && <p className="victory-message">You solved it in {moves} moves and {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}! 🎉</p>}
      <button onClick={resetGame} className="reset-button">Reset Game</button>
    </div>
  );
};

export default App;
