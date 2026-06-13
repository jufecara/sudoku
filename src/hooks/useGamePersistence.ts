import { useState, useEffect } from 'react';

export function useGamePersistence(stateToSave: any, restoreCallback: (state: any) => void) {
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // Check if a saved game exists
  useEffect(() => {
    const saved = localStorage.getItem('sudoku-saved-game');
    setHasSavedGame(!!saved);
  }, [stateToSave.view, stateToSave.hasWon, stateToSave.isGameOver]);

  // Persist game state
  useEffect(() => {
    if (stateToSave.view === 'play' && !stateToSave.hasWon && !stateToSave.isGameOver) {
      localStorage.setItem('sudoku-saved-game', JSON.stringify(stateToSave));
    } else if (stateToSave.hasWon || stateToSave.isGameOver) {
      localStorage.removeItem('sudoku-saved-game');
    }
  }, [stateToSave]);

  const resumeSavedGame = () => {
    const saved = localStorage.getItem('sudoku-saved-game');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      restoreCallback(parsed);
    } catch (e) {
      console.error('Error resuming saved game:', e);
      localStorage.removeItem('sudoku-saved-game');
      setHasSavedGame(false);
    }
  };

  return { hasSavedGame, setHasSavedGame, resumeSavedGame };
}
