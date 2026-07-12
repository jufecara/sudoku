import { useState, useCallback, useEffect } from 'react';
import { generateSudoku } from '../utils/sudokuGenerator';
import type { Difficulty } from '../utils/sudokuGenerator';

export const MAX_MISTAKES = 3;

const HINTS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 5,
  medium: 3,
  hard: 2,
  expert: 1,
};

export interface GameStateSnapshot {
  board: number[][];
  notes: number[][][];
}

export function useSudokuEngine() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [initialBoard, setInitialBoard] = useState<number[][]>(() =>
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
  );
  const [board, setBoard] = useState<number[][]>(() =>
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
  );
  const [solvedBoard, setSolvedBoard] = useState<number[][]>(() =>
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
  );

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [notes, setNotes] = useState<number[][][]>(() =>
    Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => [])
      )
  );
  const [errors, setErrors] = useState<boolean[][]>(() =>
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(false))
  );

  const [mistakes, setMistakes] = useState(0);
  const [notesMode, setNotesMode] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hintsAvailable, setHintsAvailable] = useState(0);

  const [history, setHistory] = useState<GameStateSnapshot[]>([]);

  useEffect(() => {
    // TODO: FIX - This is a bit of a hack to avoid adding setIsGameOver to the dependency array, which would cause an infinite loop. We only want this effect to run when mistakes changes.
    if (mistakes >= MAX_MISTAKES) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsGameOver(true);
    }
  }, [mistakes]);

  const startNewGame = useCallback((selectedDiff: Difficulty) => {
    const { initialBoard: initB, solvedBoard: solvedB } = generateSudoku(selectedDiff);

    setDifficulty(selectedDiff);
    setInitialBoard(initB);
    setBoard(initB.map(row => [...row]));
    setSolvedBoard(solvedB);

    setSelectedCell(null);
    setNotes(
      Array(9)
        .fill(null)
        .map(() =>
          Array(9)
            .fill(null)
            .map(() => [])
        )
    );
    setErrors(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(false))
    );

    setMistakes(0);
    setNotesMode(false);
    setHasWon(false);
    setIsGameOver(false);
    setHistory([]);
    setHintsAvailable(HINTS_BY_DIFFICULTY[selectedDiff]);
  }, []);

  const handleRestart = useCallback(() => {
    setBoard(initialBoard.map(row => [...row]));
    setSelectedCell(null);
    setNotes(
      Array(9)
        .fill(null)
        .map(() =>
          Array(9)
            .fill(null)
            .map(() => [])
        )
    );
    setErrors(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(false))
    );
    setMistakes(0);
    setHasWon(false);
    setIsGameOver(false);
    setHistory([]);
    setHintsAvailable(HINTS_BY_DIFFICULTY[difficulty]);
  }, [initialBoard, difficulty]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isGameOver || hasWon) return;
      setSelectedCell({ row, col });
    },
    [isGameOver, hasWon]
  );

  const pushHistory = useCallback((currentBoard: number[][], currentNotes: number[][][]) => {
    const snap: GameStateSnapshot = {
      board: currentBoard.map(r => [...r]),
      notes: currentNotes.map(r => r.map(n => [...n])),
    };
    setHistory(prev => [...prev, snap]);
  }, []);

  const clearRelatedNotes = useCallback((row: number, col: number, value: number) => {
    setNotes(prevNotes => {
      const nextNotes = prevNotes.map(r => r.map(n => [...n]));

      for (let i = 0; i < 9; i++) {
        nextNotes[row][i] = nextNotes[row][i].filter(n => n !== value);
        nextNotes[i][col] = nextNotes[i][col].filter(n => n !== value);
      }

      const br = Math.floor(row / 3) * 3;
      const bc = Math.floor(col / 3) * 3;
      for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) {
          nextNotes[r][c] = nextNotes[r][c].filter(n => n !== value);
        }
      }

      return nextNotes;
    });
  }, []);

  const checkWinCondition = useCallback(
    (currentBoard: number[][]) => {
      let isWon = true;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (currentBoard[r][c] !== solvedBoard[r][c]) {
            isWon = false;
            break;
          }
        }
        if (!isWon) break;
      }
      if (isWon) {
        setHasWon(true);
      }
      return isWon;
    },
    [solvedBoard]
  );

  const handleNumberInput = useCallback(
    (value: number) => {
      if (!selectedCell || isGameOver || hasWon) return;
      const { row, col } = selectedCell;

      if (initialBoard[row][col] !== 0) return;

      pushHistory(board, notes);

      if (notesMode) {
        setNotes(prevNotes => {
          const nextNotes = prevNotes.map(r => r.map(n => [...n]));
          const currentCellNotes = nextNotes[row][col];
          if (currentCellNotes.includes(value)) {
            nextNotes[row][col] = currentCellNotes.filter(n => n !== value);
          } else {
            nextNotes[row][col] = [...currentCellNotes, value].sort();
          }
          return nextNotes;
        });

        if (board[row][col] !== 0) {
          setBoard(prev => {
            const next = prev.map(r => [...r]);
            next[row][col] = 0;
            return next;
          });
          setErrors(prev => {
            const next = prev.map(r => [...r]);
            next[row][col] = false;
            return next;
          });
        }
      } else {
        setBoard(prevBoard => {
          const nextBoard = prevBoard.map(r => [...r]);
          nextBoard[row][col] = value;

          const isCorrect = value === solvedBoard[row][col];
          setErrors(prevErrors => {
            const nextErrors = prevErrors.map(r => [...r]);
            nextErrors[row][col] = !isCorrect;
            return nextErrors;
          });

          if (!isCorrect) {
            setMistakes(m => m + 1);
          } else {
            clearRelatedNotes(row, col, value);
            checkWinCondition(nextBoard);
          }

          return nextBoard;
        });
      }
    },
    [
      selectedCell,
      isGameOver,
      hasWon,
      initialBoard,
      pushHistory,
      board,
      notesMode,
      solvedBoard,
      clearRelatedNotes,
      checkWinCondition,
      notes,
    ]
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0 || isGameOver || hasWon) return;

    setHistory(prevHistory => {
      const nextHistory = [...prevHistory];
      const previousState = nextHistory.pop();
      if (previousState) {
        setBoard(previousState.board);
        setNotes(previousState.notes);
        setErrors(prev => {
          const next = prev.map(r => [...r]);
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              const val = previousState.board[r][c];
              next[r][c] = val !== 0 && val !== solvedBoard[r][c];
            }
          }
          return next;
        });
      }
      return nextHistory;
    });
  }, [history.length, isGameOver, hasWon, solvedBoard]);

  const handleErase = useCallback(() => {
    if (!selectedCell || isGameOver || hasWon) return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    pushHistory(board, notes);

    setBoard(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = 0;
      return next;
    });

    setErrors(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = false;
      return next;
    });

    setNotes(prev => {
      const next = prev.map(r => r.map(n => [...n]));
      next[row][col] = [];
      return next;
    });
  }, [selectedCell, isGameOver, hasWon, initialBoard, pushHistory, board, notes]);

  const handleHint = useCallback(() => {
    if (!selectedCell || isGameOver || hasWon) return;
    if (hintsAvailable <= 0) return;

    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    pushHistory(board, notes);

    const correctVal = solvedBoard[row][col];

    setBoard(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = correctVal;
      return next;
    });

    setErrors(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = false;
      return next;
    });

    setHintsAvailable(prev => Math.max(0, prev - 1));
    clearRelatedNotes(row, col, correctVal);

    setTimeout(() => {
      setBoard(currentBoard => {
        checkWinCondition(currentBoard);
        return currentBoard;
      });
    }, 50);
  }, [
    selectedCell,
    isGameOver,
    hasWon,
    initialBoard,
    pushHistory,
    board,
    solvedBoard,
    clearRelatedNotes,
    checkWinCondition,
    hintsAvailable,
    notes,
  ]);

  const getRemainingCounts = useCallback(() => {
    const counts: Record<number, number> = {
      1: 9,
      2: 9,
      3: 9,
      4: 9,
      5: 9,
      6: 9,
      7: 9,
      8: 9,
      9: 9,
    };
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = board[r][c];
        if (val >= 1 && val <= 9) {
          counts[val]--;
        }
      }
    }
    for (let i = 1; i <= 9; i++) {
      if (counts[i] < 0) counts[i] = 0;
    }
    return counts;
  }, [board]);

  const toggleNotesMode = useCallback(() => {
    setNotesMode(prev => !prev);
  }, []);

  return {
    difficulty,
    setDifficulty,
    initialBoard,
    setInitialBoard,
    board,
    setBoard,
    solvedBoard,
    setSolvedBoard,
    selectedCell,
    setSelectedCell,
    notes,
    setNotes,
    errors,
    setErrors,
    mistakes,
    setMistakes,
    notesMode,
    setNotesMode,
    toggleNotesMode,
    hasWon,
    setHasWon,
    isGameOver,
    setIsGameOver,
    hintsAvailable,
    setHintsAvailable,
    history,
    setHistory,
    startNewGame,
    handleRestart,
    handleCellClick,
    handleNumberInput,
    handleUndo,
    handleErase,
    handleHint,
    getRemainingCounts,
    checkWinCondition,
  };
}
