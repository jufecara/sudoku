import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamePersistence } from './useGamePersistence';
import type { StateToSave } from '../App';
import type { Difficulty } from '../utils/sudokuGenerator';

function makeState(overrides: Partial<StateToSave> = {}): StateToSave {
  return {
    view: 'play',
    difficulty: 'medium' as Difficulty,
    initialBoard: Array.from({ length: 9 }, () => Array(9).fill(0)),
    board: Array.from({ length: 9 }, () => Array(9).fill(0)),
    solvedBoard: Array.from({ length: 9 }, () => Array(9).fill(0)),
    notes: Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [] as number[])),
    errors: Array.from({ length: 9 }, () => Array(9).fill(false)),
    mistakes: 0,
    timer: 120,
    history: [],
    hasWon: false,
    isGameOver: false,
    hintsAvailable: 3,
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe('useGamePersistence', () => {
  it('sets hasSavedGame to false when no saved game exists', () => {
    const { result } = renderHook(() => useGamePersistence(makeState(), vi.fn()));
    expect(result.current.hasSavedGame).toBe(false);
  });

  it('sets hasSavedGame to true when saved game exists in localStorage', () => {
    localStorage.setItem('sudoku-saved-game', JSON.stringify(makeState()));
    const { result } = renderHook(() => useGamePersistence(makeState(), vi.fn()));
    expect(result.current.hasSavedGame).toBe(true);
  });

  it('saves game state when view is play and game is active', () => {
    const state = makeState({ view: 'play', timer: 300 });
    const { rerender } = renderHook(
      ({ state }: { state: StateToSave }) => useGamePersistence(state, vi.fn()),
      { initialProps: { state } }
    );

    rerender({ state: { ...state, timer: 301 } });

    const saved = JSON.parse(localStorage.getItem('sudoku-saved-game')!);
    expect(saved.timer).toBe(301);
  });

  it('removes saved game when hasWon is true', () => {
    localStorage.setItem('sudoku-saved-game', JSON.stringify(makeState()));

    const state = makeState({ hasWon: true });
    renderHook(() => useGamePersistence(state, vi.fn()));

    expect(localStorage.getItem('sudoku-saved-game')).toBeNull();
  });

  it('removes saved game when isGameOver is true', () => {
    localStorage.setItem('sudoku-saved-game', JSON.stringify(makeState()));

    const state = makeState({ isGameOver: true });
    renderHook(() => useGamePersistence(state, vi.fn()));

    expect(localStorage.getItem('sudoku-saved-game')).toBeNull();
  });

  it('calls restoreCallback with saved game data on resume', () => {
    const savedState = makeState({ timer: 999, difficulty: 'hard' });
    localStorage.setItem('sudoku-saved-game', JSON.stringify(savedState));

    const restoreCallback = vi.fn();
    const { result } = renderHook(() => useGamePersistence(savedState, restoreCallback));

    act(() => {
      result.current.resumeSavedGame();
    });

    expect(restoreCallback).toHaveBeenCalledWith(savedState);
  });

  it('handles corrupt saved game gracefully', () => {
    localStorage.setItem('sudoku-saved-game', 'not-json');
    const restoreCallback = vi.fn();

    const { result } = renderHook(() =>
      useGamePersistence(makeState({ view: 'home' }), restoreCallback)
    );

    act(() => {
      result.current.resumeSavedGame();
    });

    expect(restoreCallback).not.toHaveBeenCalled();
    expect(localStorage.getItem('sudoku-saved-game')).toBeNull();
  });
});
