export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

// Generates a fully solved Sudoku board
const getSolvedBoard = (): number[][] => {
  const board: number[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  // Base pattern
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      board[r][c] = ((r * 3 + Math.floor(r / 3) + c) % 9) + 1;
    }
  }

  // Shuffle numbers 1-9 to randomize values
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  // Apply mapping
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      board[r][c] = numbers[board[r][c] - 1];
    }
  }

  // Shuffle rows within 3x3 blocks
  for (let block = 0; block < 3; block++) {
    const rows = [block * 3, block * 3 + 1, block * 3 + 2];
    // Shuffle rows
    for (let i = 2; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = board[rows[i]];
      board[rows[i]] = board[rows[j]];
      board[rows[j]] = temp;
    }
  }

  // Shuffle columns within 3x3 blocks
  for (let block = 0; block < 3; block++) {
    const cols = [block * 3, block * 3 + 1, block * 3 + 2];
    for (let i = 2; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const c1 = cols[i];
      const c2 = cols[j];
      for (let r = 0; r < 9; r++) {
        const temp = board[r][c1];
        board[r][c1] = board[r][c2];
        board[r][c2] = temp;
      }
    }
  }

  // Randomly transpose (swap rows & cols)
  if (Math.random() > 0.5) {
    for (let r = 0; r < 9; r++) {
      for (let c = r + 1; c < 9; c++) {
        const temp = board[r][c];
        board[r][c] = board[c][r];
        board[c][r] = temp;
      }
    }
  }

  return board;
};

// Checks if placing 'val' at row 'r', col 'c' is valid according to board rules
export const isValidMove = (board: number[][], r: number, c: number, val: number): boolean => {
  if (val === 0) return true;

  // Check row
  for (let i = 0; i < 9; i++) {
    if (i !== c && board[r][i] === val) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== r && board[i][c] === val) return false;
  }

  // Check 3x3 sub-grid
  const boxRowStart = Math.floor(r / 3) * 3;
  const boxColStart = Math.floor(c / 3) * 3;
  for (let i = boxRowStart; i < boxRowStart + 3; i++) {
    for (let j = boxColStart; j < boxColStart + 3; j++) {
      if ((i !== r || j !== c) && board[i][j] === val) return false;
    }
  }

  return true;
};

// Generates the game puzzle from the solved board based on difficulty levels
export const generateSudoku = (
  difficulty: Difficulty
): { initialBoard: number[][]; solvedBoard: number[][] } => {
  const solvedBoard = getSolvedBoard();
  
  // Clone to make initialBoard
  const initialBoard = solvedBoard.map((row) => [...row]);

  // Determine cells to clear based on difficulty
  let cellsToRemove = 30; // Easy default
  switch (difficulty) {
    case 'easy':
      cellsToRemove = 32;
      break;
    case 'medium':
      cellsToRemove = 42;
      break;
    case 'hard':
      cellsToRemove = 52;
      break;
    case 'expert':
      cellsToRemove = 60;
      break;
  }

  let removed = 0;
  while (removed < cellsToRemove) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);

    if (initialBoard[r][c] !== 0) {
      initialBoard[r][c] = 0;
      removed++;
    }
  }

  return { initialBoard, solvedBoard };
};
