import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from './useTranslation';
import { I18nProvider } from '../contexts/I18nContext';
import React from 'react';

describe('useTranslation', () => {
  it('returns translation context when used within I18nProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nProvider locale="en">{children}</I18nProvider>
    );
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.locale).toBe('en');
    expect(result.current.t.appTitle).toBe('Sudoku Premium');
    expect(result.current.t.newGame).toBe('New Game');
  });

  it('returns Spanish translations with es locale', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nProvider locale="es">{children}</I18nProvider>
    );
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.locale).toBe('es');
    expect(result.current.t.appTitle).toBe('Sudoku Premium');
    expect(result.current.t.newGame).toBe('Nueva Partida');
  });

  it('throws error when used outside I18nProvider', () => {
    expect(() => {
      renderHook(() => useTranslation());
    }).toThrow('useTranslation must be used within an I18nProvider');
  });
});
