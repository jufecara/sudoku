import React from 'react';

interface SudokuBoardProps {
  board: number[][];
  initialBoard: number[][];
  selectedCell: { row: number; col: number } | null;
  notes: number[][][]; // 9x9 array containing arrays of notes (1-9)
  errors: boolean[][];
  onCellClick: (row: number, col: number) => void;
  hasWon: boolean;
  onRestart: () => void;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  initialBoard,
  selectedCell,
  notes,
  errors,
  onCellClick,
  hasWon,
  onRestart,
}) => {
  // Check if a cell is in the same row, column or 3x3 box as the selected cell
  const isHighlightedAxis = (r: number, c: number) => {
    if (!selectedCell) return false;
    const { row, col } = selectedCell;
    if (r === row && c === col) return false; // Handled by selected cell state
    if (r === row || c === col) return true;
    
    // Check 3x3 box
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    return r >= boxRowStart && r < boxRowStart + 3 && c >= boxColStart && c < boxColStart + 3;
  };

  // Check if cell has the same value as selected cell
  const isSameValue = (r: number, c: number) => {
    if (!selectedCell) return false;
    const { row, col } = selectedCell;
    const selectedVal = board[row][col];
    if (selectedVal === 0) return false;
    return board[r][c] === selectedVal && !(r === row && c === col);
  };

  return (
    <div className="board-container">
      {board.map((rowArr, rIndex) =>
        rowArr.map((value, cIndex) => {
          const isOriginal = initialBoard[rIndex][cIndex] !== 0;
          const isSelected = selectedCell?.row === rIndex && selectedCell?.col === cIndex;
          const isAxis = isHighlightedAxis(rIndex, cIndex);
          const isSameVal = isSameValue(rIndex, cIndex);
          const isError = errors[rIndex][cIndex];
          
          let cellClass = 'sudoku-cell';
          if (isOriginal) cellClass += ' original';
          else if (value !== 0) cellClass += ' user-entered';
          
          if (isSelected) cellClass += ' selected';
          else if (isSameVal) cellClass += ' highlight-value';
          else if (isAxis) cellClass += ' highlight-axis';
          
          if (isError) cellClass += ' error';

          // Helper to check if a number was popped (scale pop effect on entry)
          const cellKey = `cell-${rIndex}-${cIndex}`;

          return (
            <div
              key={cellKey}
              className={cellClass}
              onClick={() => onCellClick(rIndex, cIndex)}
            >
              {value !== 0 ? (
                <span>{value}</span>
              ) : (
                // Notes mode layout: 3x3 mini grid
                <div className="notes-grid">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                    const hasNote = notes[rIndex][cIndex]?.includes(num);
                    return (
                      <span key={num} className="note-num">
                        {hasNote ? num : ''}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}

      {hasWon && (
        <div className="win-overlay">
          <h2 className="win-title font-display">¡Victoria! 🎉</h2>
          <p className="win-subtitle">¡Has resuelto el Sudoku correctamente!</p>
          <button className="primary-btn" onClick={onRestart}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};
