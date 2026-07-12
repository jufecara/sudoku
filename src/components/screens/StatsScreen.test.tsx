import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import { StatsScreen } from './StatsScreen';
import type { Stats } from '../../hooks/useStats';

const defaultStats: Stats = {
  played: 10,
  won: 7,
  bestTimes: {
    easy: 120,
    medium: 300,
    hard: null,
    expert: null,
  },
};

const defaultProps = {
  stats: defaultStats,
  setView: vi.fn(),
  resetStats: vi.fn(),
};

describe('StatsScreen', () => {
  it('displays games played count', () => {
    renderWithProviders(<StatsScreen {...defaultProps} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('displays win percentage', () => {
    renderWithProviders(<StatsScreen {...defaultProps} />);
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('displays 0% when no games played', () => {
    const zeroStats: Stats = {
      played: 0,
      won: 0,
      bestTimes: { easy: null, medium: null, hard: null, expert: null },
    };
    renderWithProviders(<StatsScreen {...defaultProps} stats={zeroStats} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('displays best times', () => {
    renderWithProviders(<StatsScreen {...defaultProps} />);
    expect(screen.getByText('02:00')).toBeInTheDocument();
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('displays --:-- for null best times', () => {
    renderWithProviders(<StatsScreen {...defaultProps} />);
    const dashes = screen.getAllByText('--:--');
    expect(dashes.length).toBe(2);
  });

  it('calls setView with home on Return button click', () => {
    const setView = vi.fn();
    renderWithProviders(<StatsScreen {...defaultProps} setView={setView} />);
    fireEvent.click(screen.getByText('Return to Menu'));
    expect(setView).toHaveBeenCalledWith('home');
  });

  it('calls resetStats on reset button click', () => {
    const resetStats = vi.fn();
    renderWithProviders(<StatsScreen {...defaultProps} resetStats={resetStats} />);
    fireEvent.click(screen.getByTitle('Reset statistics'));
    expect(resetStats).toHaveBeenCalledOnce();
  });
});
