import React from 'react';
import { Undo2, Eraser, Pencil, Lightbulb } from 'lucide-react';

interface KeypadProps {
  notesMode: boolean;
  onNumberClick: (num: number) => void;
  onUndo: () => void;
  onErase: () => void;
  onToggleNotes: () => void;
  onHint: () => void;
  canUndo: boolean;
  remainingCounts: Record<number, number>;
}

export const Keypad: React.FC<KeypadProps> = ({
  notesMode,
  onNumberClick,
  onUndo,
  onErase,
  onToggleNotes,
  onHint,
  canUndo,
  remainingCounts,
}) => {
  return (
    <div className="controls-container">
      {/* Action panel (Undo, Erase, Notes, Hint) */}
      <div className="action-bar">
        <button
          className={`action-btn ${canUndo ? '' : 'disabled'}`}
          onClick={onUndo}
          disabled={!canUndo}
          title="Deshacer jugada"
          style={{ opacity: canUndo ? 1 : 0.5 }}
        >
          <Undo2 size={22} />
          <span>Deshacer</span>
        </button>

        <button
          className="action-btn"
          onClick={onErase}
          title="Borrar celda"
        >
          <Eraser size={22} />
          <span>Borrar</span>
        </button>

        <button
          className={`action-btn ${notesMode ? 'active' : ''}`}
          onClick={onToggleNotes}
          title="Modo Notas (Lápiz)"
        >
          <Pencil size={22} />
          <span>Notas {notesMode ? 'ON' : 'OFF'}</span>
        </button>

        <button
          className="action-btn"
          onClick={onHint}
          title="Pedir pista"
        >
          <Lightbulb size={22} />
          <span>Pista</span>
        </button>
      </div>

      {/* Number entry grid (1-9) */}
      <div className="numpad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const remaining = remainingCounts[num] ?? 9;
          const isDisabled = remaining <= 0;
          return (
            <button
              key={num}
              className="numpad-btn"
              onClick={() => onNumberClick(num)}
              disabled={isDisabled}
            >
              {num}
              <span className="numpad-btn-badge">{remaining}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
