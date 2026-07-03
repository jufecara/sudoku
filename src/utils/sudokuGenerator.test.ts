import { describe, it, expect } from 'vitest';
import { getSolvedBoard, isValidMove, generateSudoku } from './sudokuGenerator';

function isValidBoard(board: number[][]): boolean {
  if (board.length !== 9 || board.some((r) => r.length !== 9)) return false;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v < 1 || v > 9) return false;
    }
  }

  for (let r = 0; r < 9; r++) {
    const set = new Set(board[r]);
    if (set.size !== 9) return false;
  }

  for (let c = 0; c < 9; c++) {
    const set = new Set<number>();
    for (let r = 0; r < 9; r++) set.add(board[r][c]);
    if (set.size !== 9) return false;
  }

  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const set = new Set<number>();
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) {
          set.add(board[r][c]);
        }
      }
      if (set.size !== 9) return false;
    }
  }

  return true;
}

describe('getSolvedBoard', () => {
  it('returns a 9x9 board', () => {
    const board = getSolvedBoard();
    expect(board.length).toBe(9);
    for (const row of board) {
      expect(row.length).toBe(9);
    }
  });

  it('contains only numbers 1-9', () => {
    const board = getSolvedBoard();
    for (const row of board) {
      for (const cell of row) {
        expect(cell).toBeGreaterThanOrEqual(1);
        expect(cell).toBeLessThanOrEqual(9);
      }
    }
  });

  it('has all rows, columns and 3x3 blocks complete (1-9)', () => {
    const board = getSolvedBoard();
    expect(isValidBoard(board)).toBe(true);
  });

  it('returns a different board each call (randomized)', () => {
    const boards = Array.from({ length: 5 }, () => getSolvedBoard());
    // At least two should differ (extremely unlikely all 5 are identical)
    const unique = new Set(boards.map((b) => JSON.stringify(b)));
    expect(unique.size).toBeGreaterThan(1);
  });

  it('does not share array references between calls', () => {
    const a = getSolvedBoard();
    const b = getSolvedBoard();
    a[0][0] = 99;
    expect(b[0][0]).not.toBe(99);
  });
});

describe('isValidMove', () => {
  const board = [
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

  it('returns true when val is 0 (empty cell placement)', () => {
    expect(isValidMove(board, 0, 2, 0)).toBe(true);
  });

  it('returns true for a valid move on an empty cell', () => {
    // (0,2) is empty; 1 is not in row 0, col 2, or top-left box
    expect(isValidMove(board, 0, 2, 1)).toBe(true);
  });

  it('returns false when val conflicts with a number in the same row', () => {
    // (0,2) — row 0 already has 5,3,7 → placing 3 conflicts
    expect(isValidMove(board, 0, 2, 3)).toBe(false);
  });

  it('returns false when val conflicts with a number in the same column', () => {
    // (0,2) — col 2 has 0,0,8,0,0,0,0,0,0 → use 8 (row 3, col 2)
    expect(isValidMove(board, 0, 2, 8)).toBe(false);
  });

  it('returns false when val conflicts with a number in the same 3x3 box', () => {
    // (0,2) is in top-left box; box has 5,3,6,0,0,9,8; placing 9 conflicts
    expect(isValidMove(board, 0, 2, 9)).toBe(false);
  });

  it('returns true for a valid move on a non-empty cell (no actual conflict)', () => {
    // Placing 5 at (0,0) duplicates existing value — but it's already there
    // Actually the cell already has 5, so it conflicts...
    // Let's test a different scenario: (3,8) has 3, placing 3 should be valid
    // since it's the same value that's already there and no other 3 in row/col/box
    expect(isValidMove(board, 3, 8, 3)).toBe(true);
  });

  it('detects row conflict correctly', () => {
    // Row 0 has 5,3,7 → placing another 7 at (0,3) conflicts
    expect(isValidMove(board, 0, 3, 7)).toBe(false);
  });

  it('detects column conflict correctly', () => {
    // Col 4 has 7,9,0,6,0,2,0,1,8 → placing 7 at (5,4) conflicts
    expect(isValidMove(board, 5, 4, 7)).toBe(false);
  });
});

describe('generateSudoku', () => {
  it('returns an object with initialBoard and solvedBoard', () => {
    const result = generateSudoku('easy');
    expect(result).toHaveProperty('initialBoard');
    expect(result).toHaveProperty('solvedBoard');
  });

  it('returns a valid solvedBoard', () => {
    const { solvedBoard } = generateSudoku('easy');
    expect(isValidBoard(solvedBoard)).toBe(true);
  });

  it('initial board is a subset of the solved board', () => {
    const { initialBoard, solvedBoard } = generateSudoku('hard');
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (initialBoard[r][c] !== 0) {
          expect(initialBoard[r][c]).toBe(solvedBoard[r][c]);
        }
      }
    }
  });

  it('easy difficulty has exactly 49 clues (32 removed)', () => {
    const { initialBoard } = generateSudoku('easy');
    const clues = initialBoard.flat().filter((v) => v !== 0).length;
    expect(clues).toBe(49);
  });

  it('medium difficulty has exactly 39 clues (42 removed)', () => {
    const { initialBoard } = generateSudoku('medium');
    const clues = initialBoard.flat().filter((v) => v !== 0).length;
    expect(clues).toBe(39);
  });

  it('hard difficulty has exactly 29 clues (52 removed)', () => {
    const { initialBoard } = generateSudoku('hard');
    const clues = initialBoard.flat().filter((v) => v !== 0).length;
    expect(clues).toBe(29);
  });

  it('expert difficulty has exactly 21 clues (60 removed)', () => {
    const { initialBoard } = generateSudoku('expert');
    const clues = initialBoard.flat().filter((v) => v !== 0).length;
    expect(clues).toBe(21);
  });

  it('solvedBoard is different from initialBoard (has some zeros)', () => {
    const { initialBoard, solvedBoard } = generateSudoku('medium');
    expect(initialBoard).not.toEqual(solvedBoard);
    expect(initialBoard.flat().some((v) => v === 0)).toBe(true);
  });

  it('initialBoard and solvedBoard are not the same reference', () => {
    const { initialBoard, solvedBoard } = generateSudoku('easy');
    initialBoard[0][0] = 99;
    expect(solvedBoard[0][0]).not.toBe(99);
  });

  it('generates different puzzles on subsequent calls', () => {
    const a = generateSudoku('easy');
    const b = generateSudoku('easy');
    // At least the initial boards should differ (extremely unlikely to match)
    expect(JSON.stringify(a.initialBoard)).not.toBe(JSON.stringify(b.initialBoard));
  });

  it('expert removes more cells than easy', () => {
    const easyClues = generateSudoku('easy')
      .initialBoard.flat()
      .filter((v) => v !== 0).length;
    const expertClues = generateSudoku('expert')
      .initialBoard.flat()
      .filter((v) => v !== 0).length;
    expect(expertClues).toBeLessThan(easyClues);
  });
});
