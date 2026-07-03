import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSudokuEngine, MAX_MISTAKES } from './useSudokuEngine';

vi.mock('../utils/sudokuGenerator', () => ({
  generateSudoku: vi.fn(),
}));

import { generateSudoku } from '../utils/sudokuGenerator';
const mockGenerateSudoku = vi.mocked(generateSudoku);

function solvedBoard(): number[][] {
  return [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];
}

function initialBoard(): number[][] {
  return [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];
}

const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

beforeEach(() => {
  vi.clearAllMocks();
  mockGenerateSudoku.mockReturnValue({ initialBoard: initialBoard(), solvedBoard: solvedBoard() });
});

describe('useSudokuEngine', () => {
  it('starts with empty board and default difficulty', () => {
    const { result } = renderHook(() => useSudokuEngine());
    expect(result.current.difficulty).toBe('medium');
    expect(result.current.board).toEqual(emptyBoard);
    expect(result.current.mistakes).toBe(0);
    expect(result.current.hasWon).toBe(false);
    expect(result.current.isGameOver).toBe(false);
  });

  it('startNewGame initializes a new game', () => {
    const { result } = renderHook(() => useSudokuEngine());

    act(() => {
      result.current.startNewGame('easy');
    });

    expect(result.current.difficulty).toBe('easy');
    expect(result.current.board).toEqual(initialBoard());
    expect(result.current.initialBoard).toEqual(initialBoard());
    expect(result.current.hintsAvailable).toBe(5);
    expect(result.current.selectedCell).toBeNull();
    expect(result.current.mistakes).toBe(0);
  });

  it('handleCellClick selects a cell', () => {
    const { result } = renderHook(() => useSudokuEngine());

    act(() => {
      result.current.startNewGame('medium');
    });

    act(() => {
      result.current.handleCellClick(2, 5);
    });

    expect(result.current.selectedCell).toEqual({ row: 2, col: 5 });
  });

  it('handleCellClick does nothing when game is over', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));

    const { row, col } = findFirstEmptyCell(initialBoard());
    const lastCell = { row, col };

    for (let i = 0; i < MAX_MISTAKES; i++) {
      act(() => result.current.handleCellClick(row, col));
      act(() => result.current.handleNumberInput(i + 10));
    }

    expect(result.current.isGameOver).toBe(true);
    expect(result.current.selectedCell).toEqual(lastCell);

    act(() => result.current.handleCellClick(5, 5));
    expect(result.current.selectedCell).toEqual(lastCell);
  });

  it('handleNumberInput places a number on the board', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));
    act(() => result.current.handleCellClick(0, 2)); // click empty cell

    act(() => {
      result.current.handleNumberInput(4);
    });

    expect(result.current.board[0][2]).toBe(4);
    expect(result.current.mistakes).toBe(0);
  });

  it('increments mistakes on wrong number', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));

    // Find a cell where initial board is 0
    act(() => result.current.handleCellClick(1, 1));

    act(() => {
      result.current.handleNumberInput(9); // wrong number (should be 7)
    });

    expect(result.current.mistakes).toBe(1);
    expect(result.current.errors[1][1]).toBe(true);
  });

  it('sets isGameOver after MAX_MISTAKES mistakes', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));

    const { row, col } = findFirstEmptyCell(initialBoard());
    act(() => result.current.handleCellClick(row, col));

    for (let i = 0; i < MAX_MISTAKES; i++) {
      act(() => result.current.handleCellClick(row, col));
      act(() => result.current.handleNumberInput(i + 10)); // wrong number (9 is max)
    }

    expect(result.current.mistakes).toBe(MAX_MISTAKES);
    expect(result.current.isGameOver).toBe(true);
  });

  it('handleUndo restores previous state', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));
    act(() => result.current.handleCellClick(0, 2));

    act(() => result.current.handleNumberInput(4));
    expect(result.current.board[0][2]).toBe(4);

    act(() => result.current.handleUndo());
    expect(result.current.board[0][2]).toBe(0);
  });

  it('handleErase clears a user-entered cell', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));
    act(() => result.current.handleCellClick(0, 2));
    act(() => result.current.handleNumberInput(4));
    expect(result.current.board[0][2]).toBe(4);

    act(() => result.current.handleErase());
    expect(result.current.board[0][2]).toBe(0);
  });

  it('handleHint reveals a correct value', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));

    act(() => result.current.handleCellClick(0, 2)); // empty cell, solved value is 4

    act(() => result.current.handleHint());

    expect(result.current.board[0][2]).toBe(4);
    expect(result.current.hintsAvailable).toBe(2);
  });

  it('handleHint does nothing when hintsAvailable is 0', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('expert')); // expert has 1 hint

    act(() => result.current.handleCellClick(0, 2));
    act(() => result.current.handleHint());
    expect(result.current.hintsAvailable).toBe(0);

    act(() => result.current.handleCellClick(0, 3));
    act(() => result.current.handleHint());
    expect(result.current.board[0][3]).toBe(0); // unchanged
  });

  it('toggleNotesMode toggles notes mode', () => {
    const { result } = renderHook(() => useSudokuEngine());
    expect(result.current.notesMode).toBe(false);

    act(() => result.current.toggleNotesMode());
    expect(result.current.notesMode).toBe(true);

    act(() => result.current.toggleNotesMode());
    expect(result.current.notesMode).toBe(false);
  });

  it('adds notes in notes mode', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));
    act(() => result.current.handleCellClick(0, 2));
    act(() => result.current.toggleNotesMode());

    act(() => result.current.handleNumberInput(3));
    expect(result.current.notes[0][2]).toContain(3);
    expect(result.current.board[0][2]).toBe(0); // empty cell

    act(() => result.current.handleNumberInput(7));
    expect(result.current.notes[0][2]).toContain(3);
    expect(result.current.notes[0][2]).toContain(7);
  });

  it('removes note if already present', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));
    act(() => result.current.handleCellClick(0, 2));
    act(() => result.current.toggleNotesMode());

    act(() => result.current.handleNumberInput(3));
    expect(result.current.notes[0][2]).toContain(3);

    act(() => result.current.handleNumberInput(3));
    expect(result.current.notes[0][2]).not.toContain(3);
  });

  it('detects win condition when board matches solved board', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));

    // Fill in all empty cells with correct values
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (initialBoard()[r][c] === 0) {
          act(() => result.current.handleCellClick(r, c));
          act(() => result.current.handleNumberInput(solvedBoard()[r][c]));
        }
      }
    }

    expect(result.current.hasWon).toBe(true);
  });

  it('getRemainingCounts returns correct counts', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));

    const counts = result.current.getRemainingCounts();
    // 5 appears 3 times in initial board: (0,0), (1,5), (7,8)
    expect(counts[5]).toBe(6);
  });

  it('handleRestart resets the game', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('medium'));
    act(() => result.current.handleCellClick(0, 2));
    act(() => result.current.handleNumberInput(7));
    expect(result.current.board[0][2]).toBe(7);

    act(() => result.current.handleRestart());
    expect(result.current.board[0][2]).toBe(0);
    expect(result.current.mistakes).toBe(0);
    expect(result.current.hasWon).toBe(false);
    expect(result.current.isGameOver).toBe(false);
  });

  it('returns correct hints by difficulty', () => {
    const { result } = renderHook(() => useSudokuEngine());
    act(() => result.current.startNewGame('easy'));
    expect(result.current.hintsAvailable).toBe(5);

    act(() => result.current.startNewGame('medium'));
    expect(result.current.hintsAvailable).toBe(3);

    act(() => result.current.startNewGame('hard'));
    expect(result.current.hintsAvailable).toBe(2);

    act(() => result.current.startNewGame('expert'));
    expect(result.current.hintsAvailable).toBe(1);
  });
});

function findFirstEmptyCell(board: number[][]): { row: number; col: number } {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return { row: r, col: c };
    }
  }
  return { row: -1, col: -1 };
}
