import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import { SudokuBoard } from './SudokuBoard';

function emptyBoard(): number[][] {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

function emptyNotes(): number[][][] {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []));
}

const defaultProps = {
  board: emptyBoard(),
  initialBoard: emptyBoard(),
  selectedCell: null,
  notes: emptyNotes(),
  errors: emptyBoard().map((r) => r.map(() => false)),
  onCellClick: vi.fn(),
  hasWon: false,
  onRestart: vi.fn(),
};

function getCell(row: number, col: number) {
  const cells = document.querySelectorAll('.sudoku-cell');
  return cells[row * 9 + col] as HTMLElement;
}

describe('SudokuBoard', () => {
  it('renders 81 cells', () => {
    renderWithProviders(<SudokuBoard {...defaultProps} />);
    expect(document.querySelectorAll('.sudoku-cell')).toHaveLength(81);
  });

  it('renders original cells with original class', () => {
    const board = emptyBoard();
    board[0][0] = 5;
    const initialBoard = emptyBoard();
    initialBoard[0][0] = 5;

    renderWithProviders(
      <SudokuBoard {...defaultProps} board={board} initialBoard={initialBoard} />
    );
    expect(getCell(0, 0).classList.contains('original')).toBe(true);
    expect(getCell(0, 0).classList.contains('user-entered')).toBe(false);
  });

  it('renders user-entered cells with user-entered class', () => {
    const board = emptyBoard();
    board[0][0] = 5;
    const initialBoard = emptyBoard();
    initialBoard[0][0] = 0;

    renderWithProviders(
      <SudokuBoard {...defaultProps} board={board} initialBoard={initialBoard} />
    );
    expect(getCell(0, 0).classList.contains('user-entered')).toBe(true);
    expect(getCell(0, 0).classList.contains('original')).toBe(false);
  });

  it('marks selected cell', () => {
    renderWithProviders(<SudokuBoard {...defaultProps} selectedCell={{ row: 4, col: 3 }} />);
    expect(getCell(4, 3).classList.contains('selected')).toBe(true);
  });

  it('calls onCellClick when a cell is clicked', () => {
    const onCellClick = vi.fn();
    renderWithProviders(<SudokuBoard {...defaultProps} onCellClick={onCellClick} />);
    fireEvent.click(getCell(2, 5));
    expect(onCellClick).toHaveBeenCalledWith(2, 5);
  });

  it('shows win overlay when hasWon is true', () => {
    renderWithProviders(<SudokuBoard {...defaultProps} hasWon={true} />);
    expect(screen.getByText('Play again')).toBeInTheDocument();
  });

  it('calls onRestart from win overlay', () => {
    const onRestart = vi.fn();
    renderWithProviders(<SudokuBoard {...defaultProps} hasWon={true} onRestart={onRestart} />);
    fireEvent.click(screen.getByText('Play again'));
    expect(onRestart).toHaveBeenCalledOnce();
  });

  it('does not show win overlay when hasWon is false', () => {
    renderWithProviders(<SudokuBoard {...defaultProps} hasWon={false} />);
    expect(screen.queryByText('Play again')).not.toBeInTheDocument();
  });

  it('renders notes grid for empty cells', () => {
    const notes = emptyNotes();
    notes[1][2] = [3, 7];
    renderWithProviders(<SudokuBoard {...defaultProps} notes={notes} />);
    const cell = getCell(1, 2);
    const noteElements = cell.querySelectorAll('.note-num');
    expect(noteElements.length).toBe(9);
    expect(noteElements[2].textContent).toBe('3');
    expect(noteElements[6].textContent).toBe('7');
    expect(noteElements[0].textContent).toBe('');
  });

  it('highlights same value cells', () => {
    const board = emptyBoard();
    board[2][3] = 5;
    board[7][1] = 5;
    renderWithProviders(
      <SudokuBoard {...defaultProps} board={board} selectedCell={{ row: 2, col: 3 }} />
    );
    expect(getCell(7, 1).classList.contains('highlight-value')).toBe(true);
  });

  it('highlights axis cells (same row/col/box)', () => {
    renderWithProviders(<SudokuBoard {...defaultProps} selectedCell={{ row: 4, col: 4 }} />);
    expect(getCell(4, 0).classList.contains('highlight-axis')).toBe(true);
    expect(getCell(0, 4).classList.contains('highlight-axis')).toBe(true);
    expect(getCell(3, 3).classList.contains('highlight-axis')).toBe(true);
  });

  it('marks error cells', () => {
    const errors = emptyBoard().map((r) => r.map(() => false));
    errors[0][0] = true;
    renderWithProviders(<SudokuBoard {...defaultProps} errors={errors} />);
    expect(getCell(0, 0).classList.contains('error')).toBe(true);
  });
});
