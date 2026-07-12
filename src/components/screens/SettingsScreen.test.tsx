import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import { SettingsScreen } from './SettingsScreen';

const defaultProps = {
  defaultDifficulty: 'medium' as const,
  theme: 'dark' as const,
  language: 'en' as const,
  setDefaultDifficulty: vi.fn(),
  setTheme: vi.fn(),
  setLanguage: vi.fn(),
  setView: vi.fn(),
};

describe('SettingsScreen', () => {
  it('renders language options', () => {
    renderWithProviders(<SettingsScreen {...defaultProps} />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('Português')).toBeInTheDocument();
  });

  it('renders difficulty options', () => {
    renderWithProviders(<SettingsScreen {...defaultProps} />);
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
  });

  it('renders theme options', () => {
    renderWithProviders(<SettingsScreen {...defaultProps} />);
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('calls setLanguage when a language button is clicked', () => {
    const setLanguage = vi.fn();
    renderWithProviders(<SettingsScreen {...defaultProps} setLanguage={setLanguage} />);
    fireEvent.click(screen.getByText('Español'));
    expect(setLanguage).toHaveBeenCalledWith('es');
  });

  it('calls setDefaultDifficulty when a difficulty button is clicked', () => {
    const setDefaultDifficulty = vi.fn();
    renderWithProviders(
      <SettingsScreen {...defaultProps} setDefaultDifficulty={setDefaultDifficulty} />
    );
    fireEvent.click(screen.getByText('Hard'));
    expect(setDefaultDifficulty).toHaveBeenCalledWith('hard');
  });

  it('calls setTheme when a theme button is clicked', () => {
    const setTheme = vi.fn();
    renderWithProviders(<SettingsScreen {...defaultProps} setTheme={setTheme} />);
    fireEvent.click(screen.getByText('Light'));
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('marks current language as active', () => {
    renderWithProviders(<SettingsScreen {...defaultProps} language="fr" />);
    const frBtn = screen.getByText('Français');
    expect(frBtn.classList.contains('active')).toBe(true);
  });

  it('marks current difficulty as active', () => {
    renderWithProviders(<SettingsScreen {...defaultProps} defaultDifficulty="hard" />);
    const hardBtn = screen.getByText('Hard');
    expect(hardBtn.classList.contains('active')).toBe(true);
  });

  it('marks current theme as active', () => {
    renderWithProviders(<SettingsScreen {...defaultProps} theme="light" />);
    const lightBtn = screen.getByText('Light');
    expect(lightBtn.classList.contains('active')).toBe(true);
  });

  it('calls setView with home on Return button click', () => {
    const setView = vi.fn();
    renderWithProviders(<SettingsScreen {...defaultProps} setView={setView} />);
    fireEvent.click(screen.getByText('Return to Menu'));
    expect(setView).toHaveBeenCalledWith('home');
  });
});
