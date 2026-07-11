import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserSettings } from './useUserSettings';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('useUserSettings', () => {
  it('starts with default settings', () => {
    const { result } = renderHook(() => useUserSettings());
    expect(result.current.theme).toBe('dark');
    expect(result.current.defaultDifficulty).toBe('medium');
    expect(result.current.language).toBe('en');
  });

  it('applies theme to documentElement', () => {
    renderHook(() => useUserSettings());
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('loads saved settings from localStorage', () => {
    const saved = { defaultDifficulty: 'hard', theme: 'light', language: 'es' };
    localStorage.setItem('sudoku-user-settings', JSON.stringify(saved));

    const { result } = renderHook(() => useUserSettings());
    expect(result.current.theme).toBe('light');
    expect(result.current.defaultDifficulty).toBe('hard');
    expect(result.current.language).toBe('es');
  });

  it('setDefaultDifficulty updates difficulty', () => {
    const { result } = renderHook(() => useUserSettings());
    act(() => {
      result.current.setDefaultDifficulty('hard');
    });
    expect(result.current.defaultDifficulty).toBe('hard');
  });

  it('setTheme updates theme and applies to documentElement', () => {
    const { result } = renderHook(() => useUserSettings());
    act(() => {
      result.current.setTheme('light');
    });
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('setLanguage updates language', () => {
    const { result } = renderHook(() => useUserSettings());
    act(() => {
      result.current.setLanguage('fr');
    });
    expect(result.current.language).toBe('fr');
  });

  it('toggleTheme switches between dark and light', () => {
    const { result } = renderHook(() => useUserSettings());
    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');
  });

  it('persists settings to localStorage', () => {
    const { result } = renderHook(() => useUserSettings());
    act(() => {
      result.current.setTheme('light');
    });
    const saved = JSON.parse(localStorage.getItem('sudoku-user-settings')!);
    expect(saved.theme).toBe('light');
  });

  it('loads legacy theme key as fallback', () => {
    localStorage.setItem('sudoku-theme', 'light');
    const { result } = renderHook(() => useUserSettings());
    expect(result.current.theme).toBe('light');
  });

  it('handles corrupt localStorage gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    localStorage.setItem('sudoku-user-settings', '{invalid json');
    const { result } = renderHook(() => useUserSettings());
    expect(result.current.theme).toBe('dark');
    expect(result.current.defaultDifficulty).toBe('medium');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error loading user settings from localStorage',
      expect.any(SyntaxError)
    );

    consoleSpy.mockRestore();
  });
});
