import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import { PlayScreen } from './PlayScreen';

function emptyBoard(): number[][] {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

const defaultProps = {
  isGameOver: false,
  hasWon: false,
  board: emptyBoard(),
  initialBoard: emptyBoard(),
  selectedCell: null,
  notes: Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [] as number[])),
  errors: emptyBoard().map((r) => r.map(() => false)),
  handleCellClick: vi.fn(),
  startNewGame: vi.fn(),
  difficulty: 'medium' as const,
  handleRestart: vi.fn(),
  setView: vi.fn(),
  notesMode: false,
  handleNumberInput: vi.fn(),
  handleUndo: vi.fn(),
  handleErase: vi.fn(),
  toggleNotesMode: vi.fn(),
  handleHint: vi.fn(),
  historyLength: 0,
  remainingCounts: { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9 },
  hintsAvailable: 3,
  maxMistakes: 3,
};

describe('PlayScreen', () => {
  it('renders SudokuBoard and Keypad when game is active', () => {
    renderWithProviders(<PlayScreen {...defaultProps} />);
    expect(screen.getByText('Erase')).toBeInTheDocument();
    expect(screen.getByText('Notes OFF')).toBeInTheDocument();
    expect(screen.getByText('Hint')).toBeInTheDocument();
  });

  it('renders game over overlay when isGameOver is true', () => {
    renderWithProviders(<PlayScreen {...defaultProps} isGameOver={true} />);
    expect(screen.getByText(/Game Over/)).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
    expect(screen.getByText('Main Menu')).toBeInTheDocument();
  });

  it('calls handleRestart when Retry is clicked', () => {
    const handleRestart = vi.fn();
    renderWithProviders(
      <PlayScreen {...defaultProps} isGameOver={true} handleRestart={handleRestart} />
    );
    fireEvent.click(screen.getByText('Retry'));
    expect(handleRestart).toHaveBeenCalledOnce();
  });

  it('calls setView with home when Main Menu is clicked', () => {
    const setView = vi.fn();
    renderWithProviders(<PlayScreen {...defaultProps} isGameOver={true} setView={setView} />);
    fireEvent.click(screen.getByText('Main Menu'));
    expect(setView).toHaveBeenCalledWith('home');
  });

  it('shows maxMistakes in game over message', () => {
    renderWithProviders(<PlayScreen {...defaultProps} isGameOver={true} maxMistakes={5} />);
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });
});
