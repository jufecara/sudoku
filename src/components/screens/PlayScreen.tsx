import React from 'react';
import { SudokuBoard } from '../SudokuBoard';
import { Keypad } from '../Keypad';
import { useTranslation } from '../../hooks/useTranslation';
import type { Difficulty } from '../../utils/sudokuGenerator';

interface PlayScreenProps {
  isGameOver: boolean;
  hasWon: boolean;
  board: number[][];
  initialBoard: number[][];
  selectedCell: { row: number; col: number } | null;
  notes: number[][][];
  errors: boolean[][];
  handleCellClick: (row: number, col: number) => void;
  startNewGame: (diff: Difficulty) => void;
  difficulty: Difficulty;
  handleRestart: () => void;
  setView: (view: 'home' | 'play' | 'stats' | 'settings') => void;
  notesMode: boolean;
  handleNumberInput: (val: number) => void;
  handleUndo: () => void;
  handleErase: () => void;
  toggleNotesMode: () => void;
  handleHint: () => void;
  historyLength: number;
  remainingCounts: Record<number, number>;
  hintsAvailable: number;
  maxMistakes: number;
}

export const PlayScreen: React.FC<PlayScreenProps> = ({
  isGameOver,
  hasWon,
  board,
  initialBoard,
  selectedCell,
  notes,
  errors,
  handleCellClick,
  startNewGame,
  difficulty,
  handleRestart,
  setView,
  notesMode,
  handleNumberInput,
  handleUndo,
  handleErase,
  toggleNotesMode,
  handleHint,
  historyLength,
  remainingCounts,
  hintsAvailable,
  maxMistakes,
}) => {
  const { t } = useTranslation();

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        flex: 1,
        justifyContent: 'center',
      }}
    >
      {isGameOver ? (
        <div
          className="glass-panel"
          style={{
            padding: '32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <h2 className="font-display" style={{ color: 'var(--color-error)', fontSize: '2rem' }}>
            {t.gameOverTitle}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t.gameOverMessage(maxMistakes)}</p>
          <button className="primary-btn" onClick={handleRestart}>
            {t.retry}
          </button>
          <button className="secondary-btn" onClick={() => setView('home')}>
            {t.mainMenu}
          </button>
        </div>
      ) : (
        <>
          <SudokuBoard
            board={board}
            initialBoard={initialBoard}
            selectedCell={selectedCell}
            notes={notes}
            errors={errors}
            onCellClick={handleCellClick}
            hasWon={hasWon}
            onRestart={() => startNewGame(difficulty)}
          />

          <Keypad
            notesMode={notesMode}
            onNumberClick={handleNumberInput}
            onUndo={handleUndo}
            onErase={handleErase}
            onToggleNotes={toggleNotesMode}
            onHint={handleHint}
            canUndo={historyLength > 0}
            remainingCounts={remainingCounts}
            hintsAvailable={hintsAvailable}
          />
        </>
      )}
    </main>
  );
};
