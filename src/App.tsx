import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SudokuBoard } from './components/SudokuBoard';
import { Keypad } from './components/Keypad';
import { generateSudoku } from './utils/sudokuGenerator';
import type { Difficulty } from './utils/sudokuGenerator';
import { PWAPrompt } from './components/PWAPrompt';
import { Trophy, RefreshCw } from 'lucide-react';

interface GameState {
  board: number[][];
  notes: number[][][];
}

interface Stats {
  played: number;
  won: number;
  bestTimes: Record<Difficulty, number | null>;
}

const initialStats: Stats = {
  played: 0,
  won: 0,
  bestTimes: {
    easy: null,
    medium: null,
    hard: null,
    expert: null,
  },
};

const MAX_MISTAKES = 3;

function App() {
  // Navigation & Screens
  const [view, setView] = useState<'home' | 'play' | 'stats'>('home');
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);

  // Game Settings & Setup
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [initialBoard, setInitialBoard] = useState<number[][]>(() =>
    Array(9).fill(null).map(() => Array(9).fill(0))
  );
  const [board, setBoard] = useState<number[][]>(() =>
    Array(9).fill(null).map(() => Array(9).fill(0))
  );
  const [solvedBoard, setSolvedBoard] = useState<number[][]>(() =>
    Array(9).fill(null).map(() => Array(9).fill(0))
  );

  // Interaction State
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [notes, setNotes] = useState<number[][][]>(() =>
    Array(9).fill(null).map(() => Array(9).fill(null).map(() => []))
  );
  const [errors, setErrors] = useState<boolean[][]>(() =>
    Array(9).fill(null).map(() => Array(9).fill(false))
  );
  
  // Game Play Counters
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [notesMode, setNotesMode] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Undo History
  const [history, setHistory] = useState<GameState[]>([]);

  // Theme Settings
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Stats LocalStorage
  const [stats, setStats] = useState<Stats>(initialStats);

  // Timer Ref
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load stats & theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('sudoku-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const savedStats = localStorage.getItem('sudoku-stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Error loading stats from localStorage', e);
      }
    }
  }, []);

  // Timer Logic
  useEffect(() => {
    if (view === 'play' && !hasWon && !isGameOver) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [view, hasWon, isGameOver]);

  // Handle Game Over
  useEffect(() => {
    if (mistakes >= MAX_MISTAKES) {
      setIsGameOver(true);
    }
  }, [mistakes]);

  // Theme toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('sudoku-theme', nextTheme);
  };

  // Start new game
  const startNewGame = (selectedDiff: Difficulty) => {
    const { initialBoard: initB, solvedBoard: solvedB } = generateSudoku(selectedDiff);
    
    setDifficulty(selectedDiff);
    setInitialBoard(initB);
    setBoard(initB.map((row) => [...row]));
    setSolvedBoard(solvedB);
    
    setSelectedCell(null);
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
    setErrors(Array(9).fill(null).map(() => Array(9).fill(false)));
    
    setMistakes(0);
    setTimer(0);
    setNotesMode(false);
    setHasWon(false);
    setIsGameOver(false);
    setHistory([]);
    
    // Update stats for games played
    const updatedStats = {
      ...stats,
      played: stats.played + 1,
    };
    setStats(updatedStats);
    localStorage.setItem('sudoku-stats', JSON.stringify(updatedStats));

    setView('play');
    setShowDifficultySelect(false);
  };

  const handleRestart = () => {
    setBoard(initialBoard.map((row) => [...row]));
    setSelectedCell(null);
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
    setErrors(Array(9).fill(null).map(() => Array(9).fill(false)));
    setMistakes(0);
    setTimer(0);
    setHasWon(false);
    setIsGameOver(false);
    setHistory([]);
  };

  const handleCellClick = (row: number, col: number) => {
    if (isGameOver || hasWon) return;
    setSelectedCell({ row, col });
  };

  const pushHistory = (currentBoard: number[][], currentNotes: number[][][]) => {
    const snap: GameState = {
      board: currentBoard.map((r) => [...r]),
      notes: currentNotes.map((r) => r.map((n) => [...n])),
    };
    setHistory((prev) => [...prev, snap]);
  };

  const handleNumberInput = (value: number) => {
    if (!selectedCell || isGameOver || hasWon) return;
    const { row, col } = selectedCell;

    // Do not modify clues/original cells
    if (initialBoard[row][col] !== 0) return;

    pushHistory(board, notes);

    if (notesMode) {
      // Toggle note value in notes grid
      setNotes((prevNotes) => {
        const nextNotes = prevNotes.map((r) => r.map((n) => [...n]));
        const currentCellNotes = nextNotes[row][col];
        if (currentCellNotes.includes(value)) {
          nextNotes[row][col] = currentCellNotes.filter((n) => n !== value);
        } else {
          nextNotes[row][col] = [...currentCellNotes, value].sort();
        }
        return nextNotes;
      });

      // Clear cell value if set
      if (board[row][col] !== 0) {
        setBoard((prev) => {
          const next = prev.map((r) => [...r]);
          next[row][col] = 0;
          return next;
        });
        setErrors((prev) => {
          const next = prev.map((r) => [...r]);
          next[row][col] = false;
          return next;
        });
      }
    } else {
      // Input cell value
      setBoard((prevBoard) => {
        const nextBoard = prevBoard.map((r) => [...r]);
        nextBoard[row][col] = value;

        // Check value accuracy
        const isCorrect = value === solvedBoard[row][col];
        setErrors((prevErrors) => {
          const nextErrors = prevErrors.map((r) => [...r]);
          nextErrors[row][col] = !isCorrect;
          return nextErrors;
        });

        if (!isCorrect) {
          setMistakes((m) => m + 1);
        } else {
          // If correct, clear notes on the matching row, column, and box
          clearRelatedNotes(row, col, value);
          
          // Check win condition
          checkWinCondition(nextBoard);
        }

        return nextBoard;
      });
    }
  };

  const clearRelatedNotes = (row: number, col: number, value: number) => {
    setNotes((prevNotes) => {
      const nextNotes = prevNotes.map((r) => r.map((n) => [...n]));
      
      // Clear row and col
      for (let i = 0; i < 9; i++) {
        nextNotes[row][i] = nextNotes[row][i].filter((n) => n !== value);
        nextNotes[i][col] = nextNotes[i][col].filter((n) => n !== value);
      }

      // Clear 3x3 box
      const br = Math.floor(row / 3) * 3;
      const bc = Math.floor(col / 3) * 3;
      for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) {
          nextNotes[r][c] = nextNotes[r][c].filter((n) => n !== value);
        }
      }

      return nextNotes;
    });
  };

  const checkWinCondition = (currentBoard: number[][]) => {
    // Check if board is complete and correct
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
      
      // Update statistics
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
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || isGameOver || hasWon) return;
    
    setHistory((prevHistory) => {
      const nextHistory = [...prevHistory];
      const previousState = nextHistory.pop();
      if (previousState) {
        setBoard(previousState.board);
        setNotes(previousState.notes);
        // Recalculate errors
        setErrors((prev) => {
          const next = prev.map((r) => [...r]);
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
  };

  const handleErase = () => {
    if (!selectedCell || isGameOver || hasWon) return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    pushHistory(board, notes);

    setBoard((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = 0;
      return next;
    });

    setErrors((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = false;
      return next;
    });

    setNotes((prev) => {
      const next = prev.map((r) => r.map((n) => [...n]));
      next[row][col] = [];
      return next;
    });
  };

  const handleHint = () => {
    if (!selectedCell || isGameOver || hasWon) return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    pushHistory(board, notes);

    const correctVal = solvedBoard[row][col];
    
    setBoard((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = correctVal;
      return next;
    });

    setErrors((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = false;
      return next;
    });

    clearRelatedNotes(row, col, correctVal);
    
    // Check win condition
    setTimeout(() => {
      setBoard((currentBoard) => {
        checkWinCondition(currentBoard);
        return currentBoard;
      });
    }, 50);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== 'play' || isGameOver || hasWon) return;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
        return;
      }

      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        handleUndo();
        return;
      }

      if (!selectedCell) return;

      let { row, col } = selectedCell;
      switch (e.key) {
        case 'ArrowUp':
          row = Math.max(0, row - 1);
          break;
        case 'ArrowDown':
          row = Math.min(8, row + 1);
          break;
        case 'ArrowLeft':
          col = Math.max(0, col - 1);
          break;
        case 'ArrowRight':
          col = Math.min(8, col + 1);
          break;
        default:
          return;
      }
      setSelectedCell({ row, col });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, view, notesMode, board, initialBoard, isGameOver, hasWon]);

  // Format best times (seconds to mm:ss)
  const formatTime = (secs: number | null) => {
    if (secs === null) return '--:--';
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const resetStats = () => {
    setStats(initialStats);
    localStorage.removeItem('sudoku-stats');
  };

  const getRemainingCounts = () => {
    const counts: Record<number, number> = {
      1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9
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
  };

  return (
    <div className="app-container">
      <Header
        difficulty={difficulty}
        timer={timer}
        mistakes={mistakes}
        maxMistakes={MAX_MISTAKES}
        theme={theme}
        toggleTheme={toggleTheme}
        onRestart={handleRestart}
        onBackToMenu={() => setView('home')}
        view={view}
      />

      {view === 'home' && (
        <main className="home-screen">
          <section className="hero-section">
            <div className="hero-logo">S</div>
            <h1 className="hero-title">Sudoku Premium</h1>
            <p className="hero-tagline">Disfruta del Sudoku clásico en tu móvil sin conexión</p>
          </section>

          {!showDifficultySelect ? (
            <div className="menu-options">
              <button
                className="primary-btn"
                onClick={() => setShowDifficultySelect(true)}
              >
                Nueva Partida
              </button>
              <button
                className="secondary-btn"
                onClick={() => setView('stats')}
              >
                Estadísticas
              </button>
            </div>
          ) : (
            <div className="difficulty-selector">
              {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  className="diff-choice-btn"
                  onClick={() => startNewGame(diff)}
                >
                  <span className="diff-choice-title capitalize">{diff}</span>
                  <span className={`difficulty-badge difficulty-${diff}`}>
                    Seleccionar
                  </span>
                </button>
              ))}
              <button
                className="secondary-btn"
                onClick={() => setShowDifficultySelect(false)}
                style={{ marginTop: '12px' }}
              >
                Volver
              </button>
            </div>
          )}
        </main>
      )}

      {view === 'play' && (
        <main style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
          {isGameOver ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 className="font-display" style={{ color: 'var(--color-error)', fontSize: '2rem' }}>Fin del Juego 😢</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Has cometido {MAX_MISTAKES} errores. ¡Vuelve a intentarlo!</p>
              <button className="primary-btn" onClick={handleRestart}>
                Reintentar
              </button>
              <button className="secondary-btn" onClick={() => setView('home')}>
                Menú Principal
              </button>
            </div>
          ) : (
            <>
              <SudokuBoard
                board={board}
                initialBoard={initialBoard}
                selectedCell={selectedCell}
                notes={notes}
                errors={errors}
                onCellClick={handleCellClick}
                hasWon={hasWon}
                onRestart={() => startNewGame(difficulty)}
              />

              <Keypad
                notesMode={notesMode}
                onNumberClick={handleNumberInput}
                onUndo={handleUndo}
                onErase={handleErase}
                onToggleNotes={() => setNotesMode(!notesMode)}
                onHint={handleHint}
                canUndo={history.length > 0}
                remainingCounts={getRemainingCounts()}
              />
            </>
          )}
        </main>
      )}

      {view === 'stats' && (
        <main className="stats-screen">
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 className="font-display" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Trophy color="var(--color-warn)" /> Estadísticas Generales
            </h2>
            <div className="stats-grid">
              <div className="glass-panel stat-card">
                <span className="stat-value">{stats.played}</span>
                <span className="stat-label">Partidas</span>
              </div>
              <div className="glass-panel stat-card">
                <span className="stat-value">
                  {stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0}%
                </span>
                <span className="stat-label">Victorias</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="font-display" style={{ fontSize: '1.2rem' }}>Mejores Tiempos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((diff) => (
                <div key={diff} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)' }}>
                  <span className="capitalize" style={{ color: 'var(--text-secondary)' }}>{diff}</span>
                  <span style={{ fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(stats.bestTimes[diff])}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="primary-btn" style={{ flex: 1 }} onClick={() => setView('home')}>
              Volver al Menú
            </button>
            <button
              className="icon-btn"
              onClick={resetStats}
              title="Reiniciar estadísticas"
              style={{ width: '50px', height: '50px', borderRadius: '16px' }}
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </main>
      )}

      {/* PWA registration prompt toast */}
      <PWAPrompt />
    </div>
  );
}

export default App;
