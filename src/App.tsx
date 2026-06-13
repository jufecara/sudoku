import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PWAPrompt } from './components/PWAPrompt';
import { HomeScreen } from './components/screens/HomeScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { StatsScreen } from './components/screens/StatsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

import { useUserSettings } from './hooks/useUserSettings';
import { useStats } from './hooks/useStats';
import { useTimer } from './hooks/useTimer';
import { useSudokuEngine, MAX_MISTAKES } from './hooks/useSudokuEngine';
import { useGamePersistence } from './hooks/useGamePersistence';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useTranslation } from './hooks/useTranslation';
import { I18nProvider } from './contexts/I18nContext';

import type { Difficulty } from './utils/sudokuGenerator';

function App() {
  const userSettings = useUserSettings();

  return (
    <I18nProvider locale={userSettings.language}>
      <AppContent userSettings={userSettings} />
    </I18nProvider>
  );
}

interface AppContentProps {
  userSettings: ReturnType<typeof useUserSettings>;
}

function AppContent({ userSettings }: AppContentProps) {
  const [view, setView] = useState<'home' | 'play' | 'stats' | 'settings'>('home');
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);
  const { t } = useTranslation();
  const { theme, defaultDifficulty, toggleTheme } = userSettings;
  const { stats, incrementGamesPlayed, recordWin, resetStats } = useStats();

  const engine = useSudokuEngine();

  const { timer, resetTimer, setTimerValue } = useTimer(
    view === 'play' && !engine.hasWon && !engine.isGameOver
  );

  // Auto-Save Persistence
  const stateToSave = {
    view,
    difficulty: engine.difficulty,
    initialBoard: engine.initialBoard,
    board: engine.board,
    solvedBoard: engine.solvedBoard,
    notes: engine.notes,
    errors: engine.errors,
    mistakes: engine.mistakes,
    timer,
    history: engine.history,
    hasWon: engine.hasWon,
    isGameOver: engine.isGameOver,
    hintsAvailable: engine.hintsAvailable,
  };

  const { hasSavedGame, resumeSavedGame } = useGamePersistence(stateToSave, (parsed) => {
    engine.setDifficulty(parsed.difficulty);
    engine.setInitialBoard(parsed.initialBoard);
    engine.setBoard(parsed.board);
    engine.setSolvedBoard(parsed.solvedBoard);
    engine.setNotes(parsed.notes);
    engine.setErrors(parsed.errors);
    engine.setMistakes(parsed.mistakes);
    setTimerValue(parsed.timer);
    engine.setHistory(parsed.history || []);
    engine.setHintsAvailable(parsed.hintsAvailable ?? 3);

    engine.setSelectedCell(null);
    engine.setNotesMode(false);
    engine.setHasWon(false);
    engine.setIsGameOver(false);
    setView('play');
  });

  // Cross-cutting concerns: Win detection -> Record Stats
  useEffect(() => {
    if (engine.hasWon && !engine.isGameOver) {
      recordWin(engine.difficulty, timer);
    }
  }, [engine.hasWon, engine.difficulty, engine.isGameOver, recordWin, timer]);

  // Handle new game
  const handleStartNewGame = (diff: Difficulty) => {
    engine.startNewGame(diff);
    resetTimer();
    incrementGamesPlayed();
    setView('play');
    setShowDifficultySelect(false);
  };

  // Keyboard navigation binding
  useKeyboardNavigation({
    view,
    isGameOver: engine.isGameOver,
    hasWon: engine.hasWon,
    selectedCell: engine.selectedCell,
    setSelectedCell: engine.setSelectedCell,
    handleNumberInput: engine.handleNumberInput,
    handleErase: engine.handleErase,
    handleUndo: engine.handleUndo,
  });

  return (
    <div className="app-container">
      <Header
        difficulty={engine.difficulty}
        difficultyLabel={t.difficultyLabels[engine.difficulty]}
        timer={timer}
        mistakes={engine.mistakes}
        maxMistakes={MAX_MISTAKES}
        theme={theme}
        toggleTheme={toggleTheme}
        onRestart={() => {
          engine.handleRestart();
          resetTimer();
        }}
        onBackToMenu={() => setView('home')}
        view={view}
      />

      {view === 'home' && (
        <HomeScreen
          hasSavedGame={hasSavedGame}
          showDifficultySelect={showDifficultySelect}
          setShowDifficultySelect={setShowDifficultySelect}
          resumeSavedGame={resumeSavedGame}
          startNewGame={handleStartNewGame}
          setView={setView}
          defaultDifficulty={defaultDifficulty}
        />
      )}

      {view === 'play' && (
        <PlayScreen
          isGameOver={engine.isGameOver}
          hasWon={engine.hasWon}
          board={engine.board}
          initialBoard={engine.initialBoard}
          selectedCell={engine.selectedCell}
          notes={engine.notes}
          errors={engine.errors}
          handleCellClick={engine.handleCellClick}
          startNewGame={handleStartNewGame}
          difficulty={engine.difficulty}
          handleRestart={() => {
            engine.handleRestart();
            resetTimer();
          }}
          setView={setView}
          notesMode={engine.notesMode}
          handleNumberInput={engine.handleNumberInput}
          handleUndo={engine.handleUndo}
          handleErase={engine.handleErase}
          toggleNotesMode={engine.toggleNotesMode}
          handleHint={engine.handleHint}
          historyLength={engine.history.length}
          remainingCounts={engine.getRemainingCounts()}
          hintsAvailable={engine.hintsAvailable}
          maxMistakes={MAX_MISTAKES}
        />
      )}

      {view === 'stats' && <StatsScreen stats={stats} setView={setView} resetStats={resetStats} />}

      {view === 'settings' && (
        <SettingsScreen
          defaultDifficulty={defaultDifficulty}
          theme={theme}
          setDefaultDifficulty={userSettings.setDefaultDifficulty}
          setTheme={userSettings.setTheme}
          language={userSettings.language}
          setLanguage={userSettings.setLanguage}
          setView={setView}
        />
      )}

      <PWAPrompt />
    </div>
  );
}

export default App;
