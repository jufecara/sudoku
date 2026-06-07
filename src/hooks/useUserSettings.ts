import { useEffect, useState } from 'react';
import type { Difficulty } from '../utils/sudokuGenerator';
import type { Locale } from '../i18n';
import { detectBrowserLocale, getSavedLocale, locales } from '../i18n';

export type Theme = 'dark' | 'light';

export interface UserSettings {
  defaultDifficulty: Difficulty;
  theme: Theme;
  language: Locale;
}

const SETTINGS_KEY = 'sudoku-user-settings';
const LEGACY_THEME_KEY = 'sudoku-theme';

const defaultSettings: UserSettings = {
  defaultDifficulty: 'medium',
  theme: 'dark',
  language: detectBrowserLocale(),
};

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
const themes: Theme[] = ['dark', 'light'];

const isDifficulty = (value: unknown): value is Difficulty =>
  typeof value === 'string' && difficulties.includes(value as Difficulty);

const isTheme = (value: unknown): value is Theme =>
  typeof value === 'string' && themes.includes(value as Theme);

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && locales.includes(value as Locale);

const getInitialSettings = (): UserSettings => {
  if (typeof window === 'undefined') return defaultSettings;

  const savedSettings = localStorage.getItem(SETTINGS_KEY);
  const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY);

  if (!savedSettings) {
    return {
      ...defaultSettings,
      theme: isTheme(legacyTheme) ? legacyTheme : defaultSettings.theme,
      language: getSavedLocale() ?? defaultSettings.language,
    };
  }

  try {
    const parsed = JSON.parse(savedSettings);
    return {
      defaultDifficulty: isDifficulty(parsed.defaultDifficulty)
        ? parsed.defaultDifficulty
        : defaultSettings.defaultDifficulty,
      theme: isTheme(parsed.theme) ? parsed.theme : defaultSettings.theme,
      language: isLocale(parsed.language)
        ? parsed.language
        : getSavedLocale() ?? defaultSettings.language,
    };
  } catch (e) {
    console.error('Error loading user settings from localStorage', e);
    return defaultSettings;
  }
};

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(getInitialSettings);

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const updateSettings = (nextSettings: UserSettings) => {
    setSettings(nextSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
    localStorage.setItem(LEGACY_THEME_KEY, nextSettings.theme);
    localStorage.setItem('sudoku-lang', nextSettings.language);
    applyTheme(nextSettings.theme);
  };

  const setDefaultDifficulty = (defaultDifficulty: Difficulty) => {
    updateSettings({ ...settings, defaultDifficulty });
  };

  const setTheme = (theme: Theme) => {
    updateSettings({ ...settings, theme });
  };

  const setLanguage = (language: Locale) => {
    updateSettings({ ...settings, language });
  };

  const toggleTheme = () => {
    setTheme(settings.theme === 'dark' ? 'light' : 'dark');
  };

  return {
    settings,
    theme: settings.theme,
    defaultDifficulty: settings.defaultDifficulty,
    language: settings.language,
    setDefaultDifficulty,
    setTheme,
    setLanguage,
    toggleTheme,
  };
}
