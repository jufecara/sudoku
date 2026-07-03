import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import { HomeScreen } from './HomeScreen';

const defaultProps = {
  hasSavedGame: false,
  showDifficultySelect: false,
  setShowDifficultySelect: vi.fn(),
  resumeSavedGame: vi.fn(),
  startNewGame: vi.fn(),
  setView: vi.fn(),
  defaultDifficulty: 'medium' as const,
};

describe('HomeScreen', () => {
  it('renders app title and tagline', () => {
    renderWithProviders(<HomeScreen {...defaultProps} />);
    expect(screen.getByText('Sudoku Premium')).toBeInTheDocument();
    expect(screen.getByText(/Enjoy classic Sudoku/)).toBeInTheDocument();
  });

  it('renders New Game, Statistics and Settings buttons', () => {
    renderWithProviders(<HomeScreen {...defaultProps} />);
    expect(screen.getByText('New Game')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('shows Continue Game button when hasSavedGame is true', () => {
    renderWithProviders(<HomeScreen {...defaultProps} hasSavedGame={true} />);
    expect(screen.getByText('Continue Game')).toBeInTheDocument();
  });

  it('hides Continue Game button when hasSavedGame is false', () => {
    renderWithProviders(<HomeScreen {...defaultProps} hasSavedGame={false} />);
    expect(screen.queryByText('Continue Game')).not.toBeInTheDocument();
  });

  it('calls startNewGame with defaultDifficulty on New Game click', () => {
    const startNewGame = vi.fn();
    renderWithProviders(<HomeScreen {...defaultProps} startNewGame={startNewGame} />);
    fireEvent.click(screen.getByText('New Game'));
    expect(startNewGame).toHaveBeenCalledWith('medium');
  });

  it('calls resumeSavedGame on Continue Game click', () => {
    const resumeSavedGame = vi.fn();
    renderWithProviders(
      <HomeScreen {...defaultProps} hasSavedGame={true} resumeSavedGame={resumeSavedGame} />
    );
    fireEvent.click(screen.getByText('Continue Game'));
    expect(resumeSavedGame).toHaveBeenCalledOnce();
  });

  it('calls setView with stats on Statistics click', () => {
    const setView = vi.fn();
    renderWithProviders(<HomeScreen {...defaultProps} setView={setView} />);
    fireEvent.click(screen.getByText('Statistics'));
    expect(setView).toHaveBeenCalledWith('stats');
  });

  it('calls setView with settings on Settings click', () => {
    const setView = vi.fn();
    renderWithProviders(<HomeScreen {...defaultProps} setView={setView} />);
    fireEvent.click(screen.getByText('Settings'));
    expect(setView).toHaveBeenCalledWith('settings');
  });

  it('renders app version', () => {
    renderWithProviders(<HomeScreen {...defaultProps} />);
    expect(screen.getByText(/v/)).toBeInTheDocument();
  });
});
