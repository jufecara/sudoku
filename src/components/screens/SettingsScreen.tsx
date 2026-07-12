import React from 'react';
import { MonitorCog, Moon, Sun } from 'lucide-react';
import { localeLabels, locales } from '../../i18n';
import { useTranslation } from '../../hooks/useTranslation';
import type { Difficulty } from '../../utils/sudokuGenerator';
import type { Theme } from '../../hooks/useUserSettings';
import type { Locale } from '../../i18n';

interface SettingsScreenProps {
  defaultDifficulty: Difficulty;
  theme: Theme;
  language: Locale;
  setDefaultDifficulty: (difficulty: Difficulty) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Locale) => void;
  setView: (view: 'home' | 'play' | 'stats' | 'settings') => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  defaultDifficulty,
  theme,
  language,
  setDefaultDifficulty,
  setTheme,
  setLanguage,
  setView,
}) => {
  const { t } = useTranslation();

  return (
    <main className="settings-screen">
      <div className="glass-panel settings-panel">
        <h2 className="settings-title font-display">
          <MonitorCog color="var(--color-info)" />
          {t.settingsTitle}
        </h2>

        <section className="setting-group">
          <div>
            <h3 className="setting-label font-display">{t.languageLabel}</h3>
          </div>
          <div className="segmented-control" role="radiogroup" aria-label={t.languageLabel}>
            {locales.map(locale => (
              <button
                key={locale}
                className={locale === language ? 'segment-btn active' : 'segment-btn'}
                onClick={() => setLanguage(locale)}
                role="radio"
                aria-checked={locale === language}
              >
                {localeLabels[locale]}
              </button>
            ))}
          </div>
        </section>

        <section className="setting-group">
          <div>
            <h3 className="setting-label font-display">{t.defaultLevel}</h3>
            <p className="setting-helper">{t.defaultLevelHelp}</p>
          </div>
          <div className="segmented-control" role="radiogroup" aria-label="Nivel predeterminado">
            {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(difficulty => (
              <button
                key={difficulty}
                className={difficulty === defaultDifficulty ? 'segment-btn active' : 'segment-btn'}
                onClick={() => setDefaultDifficulty(difficulty)}
                role="radio"
                aria-checked={difficulty === defaultDifficulty}
              >
                {t.difficultyLabels[difficulty]}
              </button>
            ))}
          </div>
        </section>

        <section className="setting-group">
          <div>
            <h3 className="setting-label font-display">{t.themeLabel}</h3>
            <p className="setting-helper">{t.themeHelp}</p>
          </div>
          <div className="segmented-control two-up" role="radiogroup" aria-label={t.themeLabel}>
            <button
              className={theme === 'dark' ? 'segment-btn active' : 'segment-btn'}
              onClick={() => setTheme('dark')}
              role="radio"
              aria-checked={theme === 'dark'}
            >
              <Moon size={16} />
              {t.darkTheme}
            </button>
            <button
              className={theme === 'light' ? 'segment-btn active' : 'segment-btn'}
              onClick={() => setTheme('light')}
              role="radio"
              aria-checked={theme === 'light'}
            >
              <Sun size={16} />
              {t.lightTheme}
            </button>
          </div>
        </section>
      </div>

      <button className="primary-btn" onClick={() => setView('home')}>
        {t.returnMenu}
      </button>
    </main>
  );
};
