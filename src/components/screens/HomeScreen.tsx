import React from 'react';
import type { Difficulty } from '../../utils/sudokuGenerator';

interface HomeScreenProps {
  hasSavedGame: boolean;
  showDifficultySelect: boolean;
  setShowDifficultySelect: (show: boolean) => void;
  resumeSavedGame: () => void;
  startNewGame: (diff: Difficulty) => void;
  setView: (view: 'home' | 'play' | 'stats') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  hasSavedGame,
  showDifficultySelect,
  setShowDifficultySelect,
  resumeSavedGame,
  startNewGame,
  setView,
}) => {
  return (
    <main className="home-screen">
      <section className="hero-section">
        <div className="hero-logo">S</div>
        <h1 className="hero-title">Sudoku Premium</h1>
        <p className="hero-tagline">Disfruta del Sudoku clásico en tu móvil sin conexión</p>
      </section>

      {!showDifficultySelect ? (
        <div className="menu-options">
          {hasSavedGame && (
            <button
              className="primary-btn"
              onClick={resumeSavedGame}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-info))',
                boxShadow: 'var(--shadow-glow)',
                marginBottom: '8px'
              }}
            >
              Continuar Partida
            </button>
          )}
          <button
            className={hasSavedGame ? 'secondary-btn' : 'primary-btn'}
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
      <span className="app-version" aria-label={`App version ${__APP_VERSION__}`}>
        v{__APP_VERSION__}
      </span>
    </main>
  );
};
