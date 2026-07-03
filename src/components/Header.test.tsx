import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import { Header } from './Header';

const defaultProps = {
  difficulty: 'medium',
  difficultyLabel: 'Medium',
  timer: 125,
  mistakes: 1,
  maxMistakes: 3,
  theme: 'dark' as const,
  toggleTheme: vi.fn(),
  onRestart: vi.fn(),
  onBackToMenu: vi.fn(),
  view: 'play' as const,
};

describe('Header', () => {
  it('renders back button and game stats when view is play', () => {
    renderWithProviders(<Header {...defaultProps} />);
    expect(screen.getByTitle('Back to menu')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('02:05')).toBeInTheDocument();
    expect(screen.getByText('1/3')).toBeInTheDocument();
  });

  it('renders logo section instead of back button when view is not play', () => {
    renderWithProviders(<Header {...defaultProps} view="home" />);
    expect(screen.getByText('Sudoku')).toBeInTheDocument();
    expect(screen.queryByTitle('Back to menu')).not.toBeInTheDocument();
  });

  it('renders restart button only when view is play', () => {
    const { rerender } = renderWithProviders(<Header {...defaultProps} view="play" />);
    expect(screen.getByTitle('Restart game')).toBeInTheDocument();

    rerender(<Header {...defaultProps} view="home" />);
    expect(screen.queryByTitle('Restart game')).not.toBeInTheDocument();
  });

  it('calls toggleTheme when theme button is clicked', () => {
    const toggleTheme = vi.fn();
    renderWithProviders(<Header {...defaultProps} toggleTheme={toggleTheme} />);
    fireEvent.click(screen.getByTitle('Change theme'));
    expect(toggleTheme).toHaveBeenCalledOnce();
  });

  it('calls onRestart when restart button is clicked', () => {
    const onRestart = vi.fn();
    renderWithProviders(<Header {...defaultProps} onRestart={onRestart} />);
    fireEvent.click(screen.getByTitle('Restart game'));
    expect(onRestart).toHaveBeenCalledOnce();
  });

  it('calls onBackToMenu when back button is clicked', () => {
    const onBackToMenu = vi.fn();
    renderWithProviders(<Header {...defaultProps} onBackToMenu={onBackToMenu} />);
    fireEvent.click(screen.getByTitle('Back to menu'));
    expect(onBackToMenu).toHaveBeenCalledOnce();
  });

  it('formats timer correctly', () => {
    renderWithProviders(<Header {...defaultProps} timer={3661} />);
    expect(screen.getByText('61:01')).toBeInTheDocument();
  });

  it('shows sun icon in dark theme and moon icon in light theme', () => {
    const { rerender } = renderWithProviders(<Header {...defaultProps} theme="dark" />);
    expect(screen.getByTitle('Change theme').querySelector('svg')).toBeInTheDocument();

    rerender(<Header {...defaultProps} theme="light" />);
    expect(screen.getByTitle('Change theme').querySelector('svg')).toBeInTheDocument();
  });
});
