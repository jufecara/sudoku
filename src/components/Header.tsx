import React from 'react';
import { Sun, Moon, ArrowLeft, RotateCcw, Trophy } from 'lucide-react';

interface HeaderProps {
  difficulty: string;
  timer: number;
  mistakes: number;
  maxMistakes: number;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onRestart: () => void;
  onBackToMenu: () => void;
  view: 'home' | 'play' | 'stats';
}

export const Header: React.FC<HeaderProps> = ({
  difficulty,
  timer,
  mistakes,
  maxMistakes,
  theme,
  toggleTheme,
  onRestart,
  onBackToMenu,
  view,
}) => {
  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header className="app-header glass-panel">
      {view === 'play' ? (
        <button className="icon-btn" onClick={onBackToMenu} title="Volver al menú">
          <ArrowLeft size={20} />
        </button>
      ) : (
        <div className="logo-section">
          <div className="logo-icon">S</div>
          <span className="logo-title font-display">Sudoku</span>
        </div>
      )}

      {view === 'play' && (
        <div className="game-stats-hud">
          <span className={`difficulty-badge difficulty-${difficulty}`}>
            {difficulty}
          </span>
          <div className="hud-item" title="Tiempo transcurrido">
            <span>⏱️</span>
            <span>{formatTime(timer)}</span>
          </div>
          <div className="hud-item" title="Errores cometidos">
            <span>⚠️</span>
            <span>{mistakes}/{maxMistakes}</span>
          </div>
        </div>
      )}

      <div className="header-actions">
        {view === 'play' && (
          <button className="icon-btn" onClick={onRestart} title="Reiniciar juego">
            <RotateCcw size={18} />
          </button>
        )}
        {view === 'home' && (
          <button className="icon-btn" title="Logros">
            <Trophy size={18} />
          </button>
        )}
        <button className="icon-btn" onClick={toggleTheme} title="Cambiar tema">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
