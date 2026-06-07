import { useEffect } from 'react';

interface KeyboardNavigationProps {
  view: 'home' | 'play' | 'stats' | 'settings';
  isGameOver: boolean;
  hasWon: boolean;
  selectedCell: { row: number; col: number } | null;
  setSelectedCell: (cell: { row: number; col: number }) => void;
  handleNumberInput: (value: number) => void;
  handleErase: () => void;
  handleUndo: () => void;
}

export function useKeyboardNavigation({
  view,
  isGameOver,
  hasWon,
  selectedCell,
  setSelectedCell,
  handleNumberInput,
  handleErase,
  handleUndo
}: KeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== 'play' || isGameOver || hasWon) return;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
        return;
      }

      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        handleUndo();
        return;
      }

      if (!selectedCell) return;

      let { row, col } = selectedCell;
      switch (e.key) {
        case 'ArrowUp':
          row = Math.max(0, row - 1);
          break;
        case 'ArrowDown':
          row = Math.min(8, row + 1);
          break;
        case 'ArrowLeft':
          col = Math.max(0, col - 1);
          break;
        case 'ArrowRight':
          col = Math.min(8, col + 1);
          break;
        default:
          return;
      }
      setSelectedCell({ row, col });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, view, isGameOver, hasWon, handleNumberInput, handleErase, handleUndo, setSelectedCell]);
}
