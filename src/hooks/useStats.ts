import { useState, useEffect } from 'react';
import type { Difficulty } from '../utils/sudokuGenerator';

export interface Stats {
  played: number;
  won: number;
  bestTimes: Record<Difficulty, number | null>;
}

export const initialStats: Stats = {
  played: 0,
  won: 0,
  bestTimes: {
    easy: null,
    medium: null,
    hard: null,
    expert: null,
  },
};

export function useStats() {
  const [stats, setStats] = useState<Stats>(initialStats);

  useEffect(() => {
    const savedStats = localStorage.getItem('sudoku-stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Error loading stats from localStorage', e);
      }
    }
  }, []);

  const incrementGamesPlayed = () => {
    setStats((prevStats) => {
      const updatedStats = {
        ...prevStats,
        played: prevStats.played + 1,
      };
      localStorage.setItem('sudoku-stats', JSON.stringify(updatedStats));
      return updatedStats;
    });
  };

  const recordWin = (difficulty: Difficulty, timer: number) => {
    setStats((prevStats) => {
      const bestTime = prevStats.bestTimes[difficulty];
      const nextBestTime = bestTime === null ? timer : Math.min(bestTime, timer);
      const nextStats = {
        ...prevStats,
        won: prevStats.won + 1,
        bestTimes: {
          ...prevStats.bestTimes,
          [difficulty]: nextBestTime,
        },
      };
      localStorage.setItem('sudoku-stats', JSON.stringify(nextStats));
      return nextStats;
    });
  };

  const resetStats = () => {
    setStats(initialStats);
    localStorage.removeItem('sudoku-stats');
  };

  return { stats, incrementGamesPlayed, recordWin, resetStats };
}
