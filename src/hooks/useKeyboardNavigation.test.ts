import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardNavigation } from './useKeyboardNavigation';

function createProps(overrides = {}) {
  return {
    view: 'play' as const,
    isGameOver: false,
    hasWon: false,
    selectedCell: { row: 4, col: 4 },
    setSelectedCell: vi.fn(),
    handleNumberInput: vi.fn(),
    handleErase: vi.fn(),
    handleUndo: vi.fn(),
    ...overrides,
  };
}

function dispatchKey(key: string, options: Partial<KeyboardEventInit> = {}) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...options }));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useKeyboardNavigation', () => {
  it('calls handleNumberInput for number keys 1-9', () => {
    const props = createProps();
    renderHook(() => useKeyboardNavigation(props));

    for (let i = 1; i <= 9; i++) {
      dispatchKey(String(i));
      expect(props.handleNumberInput).toHaveBeenCalledWith(i);
    }
  });

  it('calls handleErase for Backspace key', () => {
    const props = createProps();
    renderHook(() => useKeyboardNavigation(props));

    dispatchKey('Backspace');
    expect(props.handleErase).toHaveBeenCalledOnce();
  });

  it('calls handleErase for Delete key', () => {
    const props = createProps();
    renderHook(() => useKeyboardNavigation(props));

    dispatchKey('Delete');
    expect(props.handleErase).toHaveBeenCalledOnce();
  });

  it('calls handleUndo for Ctrl+Z', () => {
    const props = createProps();
    renderHook(() => useKeyboardNavigation(props));

    dispatchKey('z', { ctrlKey: true });
    expect(props.handleUndo).toHaveBeenCalledOnce();
  });

  it('calls handleUndo for Meta+Z', () => {
    const props = createProps();
    renderHook(() => useKeyboardNavigation(props));

    dispatchKey('z', { metaKey: true });
    expect(props.handleUndo).toHaveBeenCalledOnce();
  });

  it('moves selected cell with arrow keys', () => {
    const props = createProps();
    renderHook(() => useKeyboardNavigation(props));

    dispatchKey('ArrowUp');
    expect(props.setSelectedCell).toHaveBeenCalledWith({ row: 3, col: 4 });

    dispatchKey('ArrowDown');
    expect(props.setSelectedCell).toHaveBeenCalledWith({ row: 5, col: 4 });

    dispatchKey('ArrowLeft');
    expect(props.setSelectedCell).toHaveBeenCalledWith({ row: 4, col: 3 });

    dispatchKey('ArrowRight');
    expect(props.setSelectedCell).toHaveBeenCalledWith({ row: 4, col: 5 });
  });

  it('clamps arrow key navigation to grid bounds', () => {
    const props = createProps({ selectedCell: { row: 0, col: 0 } });
    renderHook(() => useKeyboardNavigation(props));

    dispatchKey('ArrowUp');
    expect(props.setSelectedCell).toHaveBeenCalledWith({ row: 0, col: 0 });

    dispatchKey('ArrowLeft');
    expect(props.setSelectedCell).toHaveBeenCalledWith({ row: 0, col: 0 });

    props.setSelectedCell.mockClear();
    const props2 = createProps({ selectedCell: { row: 8, col: 8 } });
    renderHook(() => useKeyboardNavigation(props2));

    dispatchKey('ArrowDown');
    expect(props2.setSelectedCell).toHaveBeenCalledWith({ row: 8, col: 8 });

    dispatchKey('ArrowRight');
    expect(props2.setSelectedCell).toHaveBeenCalledWith({ row: 8, col: 8 });
  });

  it('does nothing when view is not play', () => {
    const props = createProps({ view: 'home' });
    renderHook(() => useKeyboardNavigation(props));

    dispatchKey('5');
    dispatchKey('Backspace');
    dispatchKey('z', { ctrlKey: true });
    dispatchKey('ArrowDown');

    expect(props.handleNumberInput).not.toHaveBeenCalled();
    expect(props.handleErase).not.toHaveBeenCalled();
    expect(props.handleUndo).not.toHaveBeenCalled();
    expect(props.setSelectedCell).not.toHaveBeenCalled();
  });

  it('does nothing when isGameOver is true', () => {
    const props = createProps({ isGameOver: true });
    renderHook(() => useKeyboardNavigation(props));

    dispatchKey('5');
    expect(props.handleNumberInput).not.toHaveBeenCalled();
  });

  it('does nothing when hasWon is true', () => {
    const props = createProps({ hasWon: true });
    renderHook(() => useKeyboardNavigation(props));

    dispatchKey('5');
    expect(props.handleNumberInput).not.toHaveBeenCalled();
  });

  it('ignores arrow keys when no cell is selected', () => {
    const props = createProps({ selectedCell: null });
    renderHook(() => useKeyboardNavigation(props));

    dispatchKey('ArrowDown');
    expect(props.setSelectedCell).not.toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    const props = createProps();
    const { unmount } = renderHook(() => useKeyboardNavigation(props));

    unmount();

    dispatchKey('5');
    expect(props.handleNumberInput).not.toHaveBeenCalled();
  });
});
