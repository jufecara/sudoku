import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStats, initialStats } from './useStats';

beforeEach(() => {
  localStorage.clear();
});

describe('useStats', () => {
  it('starts with initial stats', () => {
    const { result } = renderHook(() => useStats());
    expect(result.current.stats).toEqual(initialStats);
  });

  it('loads saved stats from localStorage on mount', () => {
    const saved = {
      played: 5,
      won: 3,
      bestTimes: { easy: 60, medium: null, hard: null, expert: null },
    };
    localStorage.setItem('sudoku-stats', JSON.stringify(saved));

    const { result } = renderHook(() => useStats());
    expect(result.current.stats).toEqual(saved);
  });

  it('incrementGamesPlayed increments played count', () => {
    const { result } = renderHook(() => useStats());
    act(() => {
      result.current.incrementGamesPlayed();
    });
    expect(result.current.stats.played).toBe(1);
    expect(result.current.stats.won).toBe(0);
  });

  it('persists to localStorage after incrementGamesPlayed', () => {
    const { result } = renderHook(() => useStats());
    act(() => {
      result.current.incrementGamesPlayed();
    });
    const saved = JSON.parse(localStorage.getItem('sudoku-stats')!);
    expect(saved.played).toBe(1);
  });

  it('recordWin increments won count', () => {
    const { result } = renderHook(() => useStats());
    act(() => {
      result.current.incrementGamesPlayed();
    });
    act(() => {
      result.current.recordWin('medium', 300);
    });
    expect(result.current.stats.won).toBe(1);
    expect(result.current.stats.bestTimes.medium).toBe(300);
  });

  it('recordWin keeps the best (lowest) time', () => {
    const { result } = renderHook(() => useStats());
    act(() => {
      result.current.incrementGamesPlayed();
    });
    act(() => {
      result.current.recordWin('easy', 500);
    });
    expect(result.current.stats.bestTimes.easy).toBe(500);

    act(() => {
      result.current.recordWin('easy', 300);
    });
    expect(result.current.stats.bestTimes.easy).toBe(300);

    act(() => {
      result.current.recordWin('easy', 400);
    });
    expect(result.current.stats.bestTimes.easy).toBe(300);
  });

  it('resetStats resets to initial and removes from localStorage', () => {
    const { result } = renderHook(() => useStats());
    act(() => {
      result.current.incrementGamesPlayed();
      result.current.recordWin('hard', 200);
    });
    expect(result.current.stats.played).toBe(1);

    act(() => {
      result.current.resetStats();
    });
    expect(result.current.stats).toEqual(initialStats);
    expect(localStorage.getItem('sudoku-stats')).toBeNull();
  });
});
