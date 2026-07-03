import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import { Keypad } from './Keypad';

const defaultProps = {
  notesMode: false,
  onNumberClick: vi.fn(),
  onUndo: vi.fn(),
  onErase: vi.fn(),
  onToggleNotes: vi.fn(),
  onHint: vi.fn(),
  canUndo: true,
  remainingCounts: { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9 },
  hintsAvailable: 3,
};

describe('Keypad', () => {
  it('renders all number buttons 1-9', () => {
    renderWithProviders(<Keypad {...defaultProps} />);
    const numpadBtns = document.querySelectorAll('.numpad-btn');
    expect(numpadBtns).toHaveLength(9);
    numpadBtns.forEach((btn, i) => {
      expect(btn.textContent).toContain(String(i + 1));
    });
  });

  it('renders action buttons', () => {
    renderWithProviders(<Keypad {...defaultProps} />);
    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.getByText('Erase')).toBeInTheDocument();
    expect(screen.getByText('Notes OFF')).toBeInTheDocument();
    expect(screen.getByText('Hint')).toBeInTheDocument();
  });

  it('calls onNumberClick when a number button is clicked', () => {
    const onNumberClick = vi.fn();
    renderWithProviders(<Keypad {...defaultProps} onNumberClick={onNumberClick} />);
    const numpadBtns = document.querySelectorAll('.numpad-btn');
    fireEvent.click(numpadBtns[4]);
    expect(onNumberClick).toHaveBeenCalledWith(5);
  });

  it('disables undo button when canUndo is false', () => {
    renderWithProviders(<Keypad {...defaultProps} canUndo={false} />);
    expect(screen.getByTitle('Undo move')).toBeDisabled();
  });

  it('enables undo button when canUndo is true', () => {
    renderWithProviders(<Keypad {...defaultProps} canUndo={true} />);
    expect(screen.getByTitle('Undo move')).not.toBeDisabled();
  });

  it('calls onUndo when undo button is clicked', () => {
    const onUndo = vi.fn();
    renderWithProviders(<Keypad {...defaultProps} onUndo={onUndo} />);
    fireEvent.click(screen.getByText('Undo'));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it('calls onErase when erase button is clicked', () => {
    const onErase = vi.fn();
    renderWithProviders(<Keypad {...defaultProps} onErase={onErase} />);
    fireEvent.click(screen.getByText('Erase'));
    expect(onErase).toHaveBeenCalledOnce();
  });

  it('calls onToggleNotes when notes button is clicked', () => {
    const onToggleNotes = vi.fn();
    renderWithProviders(<Keypad {...defaultProps} onToggleNotes={onToggleNotes} />);
    fireEvent.click(screen.getByText('Notes OFF'));
    expect(onToggleNotes).toHaveBeenCalledOnce();
  });

  it('shows Notes ON when notesMode is true', () => {
    renderWithProviders(<Keypad {...defaultProps} notesMode={true} />);
    expect(screen.getByText('Notes ON')).toBeInTheDocument();
    expect(screen.queryByText('Notes OFF')).not.toBeInTheDocument();
  });

  it('calls onHint when hint button is clicked', () => {
    const onHint = vi.fn();
    renderWithProviders(<Keypad {...defaultProps} onHint={onHint} />);
    fireEvent.click(screen.getByText('Hint'));
    expect(onHint).toHaveBeenCalledOnce();
  });

  it('shows hints badge when hintsAvailable > 0', () => {
    renderWithProviders(<Keypad {...defaultProps} hintsAvailable={2} />);
    const badges = document.querySelectorAll('.action-btn-badge');
    expect(badges).toHaveLength(1);
    expect(badges[0].textContent).toBe('2');
  });

  it('disables hint button when hintsAvailable is 0', () => {
    renderWithProviders(<Keypad {...defaultProps} hintsAvailable={0} />);
    expect(screen.getByTitle('Request hint')).toBeDisabled();
  });

  it('disables number buttons when remaining count is 0', () => {
    const remainingCounts = { 1: 9, 2: 9, 3: 0, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9 };
    renderWithProviders(<Keypad {...defaultProps} remainingCounts={remainingCounts} />);
    const numpadBtns = Array.from(document.querySelectorAll('.numpad-btn'));
    const btn3 = numpadBtns.find((b) => b.textContent?.startsWith('3'));
    expect(btn3).toBeDisabled();

    const btn1 = numpadBtns.find((b) => b.textContent?.startsWith('1'));
    expect(btn1).not.toBeDisabled();
  });
});
