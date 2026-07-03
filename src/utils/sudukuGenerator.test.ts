import { describe, it, expect } from 'vitest';
import { getSolvedBoard, isValidMove } from './sudokuGenerator';

describe('Sudoku Generator', () => {
  describe('getSolvedBoard', () => {
    it('should generate a valid solved Sudoku board', () => {
      const board = getSolvedBoard();

      // Check rows
      for (let r = 0; r < 9; r++) {
        const rowSet = new Set(board[r]);
        expect(rowSet.size).toBe(9);
        expect([...rowSet].sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      }

      // Check columns
      for (let c = 0; c < 9; c++) {
        const colSet = new Set();
        for (let r = 0; r < 9; r++) {
          colSet.add(board[r][c]);
        }
        expect(colSet.size).toBe(9);
        expect([...colSet].sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      }

      // Check 3x3 blocks
      for (let blockRow = 0; blockRow < 3; blockRow++) {
        for (let blockCol = 0; blockCol < 3; blockCol++) {
          const blockSet = new Set();
          for (let r = blockRow * 3; r < blockRow * 3 + 3; r++) {
            for (let c = blockCol * 3; c < blockCol * 3 + 3; c++) {
              blockSet.add(board[r][c]);
            }
          }
          expect(blockSet.size).toBe(9);
          expect([...blockSet].sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }
      }
    });
  });

  describe('isValidMove', () => {
    it('should validate moves correctly', () => {
      const isValid = isValidMove(
        [
          [5, 3, 0, 0, 7, 0, 0, 0, 0],
          [6, 0, 0, 1, 9, 5, 0, 0, 0],
          [0, 9, 8, 0, 0, 0, 0, 6, 0],
          [8, 0, 0, 0, 6, 0, 0, 0, 3],
          [4, 0, 0, 8, 0, 3, 0, 0, 1],
          [7, 0, 0, 0, 2, 0, 0, 0, 6],
          [0, 6, 0, 0, 0, 0, 2, 8, 0],
          [0, 0, 0, 4, 1, 9, 0, 0, 5],
          [0, 0, 0, 0, 8, 0, 0, 7, 9],
        ],
        0,
        2,
        3
      );
      expect(isValid).toBe(false);
    });
  });
});
