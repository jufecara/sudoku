import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Locale } from './i18n';
import {
  locales,
  localeLabels,
  normalizeLocale,
  detectBrowserLocale,
  getSavedLocale,
  saveLocale,
  getInitialLocale,
  getTranslations,
  translations,
} from './i18n';

const ALL_LOCALES = ['en', 'es', 'fr', 'pt'] as const;

describe('constants', () => {
  it('locales contains all supported locales', () => {
    expect(locales).toEqual(['en', 'es', 'fr', 'pt']);
  });

  it('localeLabels has labels for all locales', () => {
    for (const locale of locales) {
      expect(localeLabels[locale]).toBeDefined();
      expect(typeof localeLabels[locale]).toBe('string');
    }
  });
});

describe('normalizeLocale', () => {
  it('returns the locale for exact matches', () => {
    expect(normalizeLocale('en')).toBe('en');
    expect(normalizeLocale('es')).toBe('es');
    expect(normalizeLocale('fr')).toBe('fr');
    expect(normalizeLocale('pt')).toBe('pt');
  });

  it('handles region codes by extracting the language part', () => {
    expect(normalizeLocale('en-US')).toBe('en');
    expect(normalizeLocale('es-ES')).toBe('es');
    expect(normalizeLocale('fr-FR')).toBe('fr');
    expect(normalizeLocale('pt-BR')).toBe('pt');
    expect(normalizeLocale('en_GB')).toBe('en');
    expect(normalizeLocale('pt_PT')).toBe('pt');
  });

  it('is case insensitive', () => {
    expect(normalizeLocale('EN')).toBe('en');
    expect(normalizeLocale('En')).toBe('en');
    expect(normalizeLocale('FR')).toBe('fr');
  });

  it('returns null for unsupported locales', () => {
    expect(normalizeLocale('de')).toBeNull();
    expect(normalizeLocale('zh')).toBeNull();
    expect(normalizeLocale('ja')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(normalizeLocale('')).toBeNull();
  });

  it('returns null for gibberish', () => {
    expect(normalizeLocale('xyzxyz')).toBeNull();
  });

  it('extracts language from region-only codes', () => {
    expect(normalizeLocale('en-GB')).toBe('en');
    expect(normalizeLocale('pt-PT')).toBe('pt');
  });
});

describe('detectBrowserLocale', () => {
  const originalNavigator = globalThis.navigator;

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it('returns en when navigator is undefined (SSR)', () => {
    const gt = globalThis as Record<string, unknown>;
    delete gt.navigator;
    expect(detectBrowserLocale()).toBe('en');
  });

  it('returns the first supported locale from navigator.languages', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { languages: ['es-ES', 'en-US'], language: 'es-ES' },
      writable: true,
      configurable: true,
    });
    expect(detectBrowserLocale()).toBe('es');
  });

  it('falls back to navigator.language when navigator.languages is empty', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { languages: [], language: 'fr-FR' },
      writable: true,
      configurable: true,
    });
    expect(detectBrowserLocale()).toBe('fr');
  });

  it('falls back to navigator.language when navigator.languages is not available', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { language: 'pt-BR' },
      writable: true,
      configurable: true,
    });
    expect(detectBrowserLocale()).toBe('pt');
  });

  it('returns en when no supported locale is found', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { languages: ['de-DE', 'zh-CN'], language: 'de-DE' },
      writable: true,
      configurable: true,
    });
    expect(detectBrowserLocale()).toBe('en');
  });
});

describe('getSavedLocale', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns null when window is undefined (SSR)', () => {
    const gt = globalThis as Record<string, unknown>;
    const originalWindow = gt.window;
    delete gt.window;
    expect(getSavedLocale()).toBeNull();
    gt.window = originalWindow;
  });

  it('returns the saved locale when valid', () => {
    window.localStorage.setItem('sudoku-lang', 'fr');
    expect(getSavedLocale()).toBe('fr');
  });

  it('returns null when saved locale is invalid', () => {
    window.localStorage.setItem('sudoku-lang', 'de');
    expect(getSavedLocale()).toBeNull();
  });

  it('returns null when nothing is saved', () => {
    expect(getSavedLocale()).toBeNull();
  });
});

describe('saveLocale', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('does nothing when window is undefined (SSR)', () => {
    const gt = globalThis as Record<string, unknown>;
    const originalWindow = gt.window;
    delete gt.window;
    expect(() => saveLocale('en')).not.toThrow();
    gt.window = originalWindow;
  });

  it('saves locale to localStorage', () => {
    saveLocale('pt');
    expect(window.localStorage.getItem('sudoku-lang')).toBe('pt');
  });

  it('overwrites previously saved locale', () => {
    window.localStorage.setItem('sudoku-lang', 'es');
    saveLocale('fr');
    expect(window.localStorage.getItem('sudoku-lang')).toBe('fr');
  });
});

describe('getInitialLocale', () => {
  const originalNavigator = globalThis.navigator;

  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it('returns saved locale when one exists', () => {
    window.localStorage.setItem('sudoku-lang', 'es');
    expect(getInitialLocale()).toBe('es');
  });

  it('falls back to browser detection when no saved locale', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { languages: ['fr-FR'], language: 'fr-FR' },
      writable: true,
      configurable: true,
    });
    expect(getInitialLocale()).toBe('fr');
  });

  it('returns en when no saved locale and browser is unsupported', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { languages: ['de-DE'], language: 'de-DE' },
      writable: true,
      configurable: true,
    });
    expect(getInitialLocale()).toBe('en');
  });

  it('prefers saved locale over browser detection', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { languages: ['fr-FR'], language: 'fr-FR' },
      writable: true,
      configurable: true,
    });
    window.localStorage.setItem('sudoku-lang', 'pt');
    expect(getInitialLocale()).toBe('pt');
  });
});

describe('getTranslations', () => {
  it('returns English translations for en', () => {
    const t = getTranslations('en');
    expect(t.appTitle).toBe('Sudoku Premium');
    expect(t.languageLabel).toBe('Language');
  });

  it('returns Spanish translations for es', () => {
    const t = getTranslations('es');
    expect(t.appTitle).toBe('Sudoku Premium');
    expect(t.languageLabel).toBe('Idioma');
  });

  it('returns French translations for fr', () => {
    const t = getTranslations('fr');
    expect(t.appTitle).toBe('Sudoku Premium');
    expect(t.languageLabel).toBe('Langue');
  });

  it('returns Portuguese translations for pt', () => {
    const t = getTranslations('pt');
    expect(t.appTitle).toBe('Sudoku Premium');
    expect(t.languageLabel).toBe('Idioma');
  });

  it('falls back to English for an unknown locale', () => {
    const t = getTranslations('de' as unknown as Locale);
    expect(t.languageLabel).toBe('Language');
  });

  it('all locales have the same translation keys', () => {
    const enKeys = Object.keys(getTranslations('en'));
    for (const locale of ALL_LOCALES) {
      const t = getTranslations(locale);
      expect(Object.keys(t)).toEqual(enKeys);
    }
  });
});

describe('translations structure', () => {
  it('all locales have nested objects with same keys', () => {
    const en = translations.en;
    for (const locale of ALL_LOCALES) {
      const t = translations[locale];

      expect(Object.keys(t.difficultyLabels)).toEqual(Object.keys(en.difficultyLabels));
      expect(Object.keys(t.header)).toEqual(Object.keys(en.header));
      expect(Object.keys(t.keypad)).toEqual(Object.keys(en.keypad));
      expect(Object.keys(t.pwa)).toEqual(Object.keys(en.pwa));
      expect(Object.keys(t.victory)).toEqual(Object.keys(en.victory));
    }
  });

  it('all string values across all locales are non-empty strings', () => {
    function collectStrings(obj: Record<string, unknown>): string[] {
      const result: string[] = [];
      for (const value of Object.values(obj)) {
        if (typeof value === 'string') {
          result.push(value);
        } else if (typeof value === 'object' && value !== null) {
          result.push(...collectStrings(value as Record<string, unknown>));
        }
      }
      return result;
    }

    for (const locale of ALL_LOCALES) {
      const strings = collectStrings(translations[locale] as unknown as Record<string, unknown>);
      expect(strings.length).toBeGreaterThan(0);
      for (const s of strings) {
        expect(s.trim()).toBeTruthy();
      }
    }
  });

  it('gameOverMessage functions produce correct messages', () => {
    expect(translations.en.gameOverMessage(3)).toBe('You made 3 mistakes. Try again!');
    expect(translations.es.gameOverMessage(3)).toBe(
      'Has cometido 3 errores. ¡Vuelve a intentarlo!'
    );
    expect(translations.fr.gameOverMessage(3)).toBe('Vous avez fait 3 erreurs. Réessayez !');
    expect(translations.pt.gameOverMessage(3)).toBe('Você cometeu 3 erros. Tente novamente!');
  });
});
