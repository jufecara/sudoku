import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import type { Difficulty } from '../../utils/sudokuGenerator';

interface HomeScreenProps {
  hasSavedGame: boolean;
  showDifficultySelect: boolean;
  setShowDifficultySelect: (show: boolean) => void;
  resumeSavedGame: () => void;
  startNewGame: (diff: Difficulty) => void;
  setView: (view: 'home' | 'play' | 'stats' | 'settings') => void;
  defaultDifficulty: Difficulty;
}

interface MenuItem {
  label: string;
  className: string;
  onClick: () => void;
  show: boolean;
  text: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  hasSavedGame,
  resumeSavedGame,
  startNewGame,
  setView,
  defaultDifficulty,
}) => {
  const { t } = useTranslation();

  const menuItems: MenuItem[] = [
    {
      label: t.continueGame,
      className: 'primary-btn',
      onClick: resumeSavedGame,
      show: hasSavedGame,
      text: t.continueGame,
    },
    {
      label: t.newGame,
      className: hasSavedGame ? 'secondary-btn' : 'primary-btn',
      onClick: () => startNewGame(defaultDifficulty),
      show: true,
      text: t.newGame,
    },
    {
      label: t.statistics,
      className: 'secondary-btn',
      onClick: () => setView('stats'),
      show: true,
      text: t.statistics,
    },
    {
      label: t.settings,
      className: 'secondary-btn',
      onClick: () => setView('settings'),
      show: true,
      text: t.settings,
    },
  ];

  return (
    <main className="home-screen">
      <section className="hero-section">
        <div className="hero-logo">S</div>
        <h1 className="hero-title">{t.appTitle}</h1>
        <p className="hero-tagline">{t.heroTagline}</p>
      </section>

      <div className="menu-options">
        {menuItems.map(
          (item) =>
            item.show && (
              <button key={item.label} className={item.className} onClick={item.onClick}>
                {item.text}
              </button>
            )
        )}
      </div>

      <span className="app-version" aria-label={`App version ${__APP_VERSION__}`}>
        v{__APP_VERSION__}
      </span>
    </main>
  );
};
