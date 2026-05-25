import React from 'react';
import { Undo2, Eraser, Pencil, Lightbulb } from 'lucide-react';

interface KeypadStrings {
  undo: string;
  undoTitle: string;
  erase: string;
  eraseTitle: string;
  notes: string;
  notesTitle: string;
  notesOn: string;
  notesOff: string;
  hint: string;
  hintTitle: string;
}

interface KeypadProps {
  notesMode: boolean;
  onNumberClick: (num: number) => void;
  onUndo: () => void;
  onErase: () => void;
  onToggleNotes: () => void;
  onHint: () => void;
  canUndo: boolean;
  remainingCounts: Record<number, number>;
  strings: KeypadStrings;
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
  strings,
}) => {
  return (
    <div className="controls-container">
      {/* Action panel (Undo, Erase, Notes, Hint) */}
      <div className="action-bar">
        <button
          className={`action-btn ${canUndo ? '' : 'disabled'}`}
          onClick={onUndo}
          disabled={!canUndo}
          title={strings.undoTitle}
          style={{ opacity: canUndo ? 1 : 0.5 }}
        >
          <Undo2 size={22} />
          <span>{strings.undo}</span>
        </button>

        <button
          className="action-btn"
          onClick={onErase}
          title={strings.eraseTitle}
        >
          <Eraser size={22} />
          <span>{strings.erase}</span>
        </button>

        <button
          className={`action-btn ${notesMode ? 'active' : ''}`}
          onClick={onToggleNotes}
          title={strings.notesTitle}
        >
          <Pencil size={22} />
          <span>{strings.notes} {notesMode ? strings.notesOn : strings.notesOff}</span>
        </button>

        <button
          className="action-btn"
          onClick={onHint}
          title={strings.hintTitle}
        >
          <Lightbulb size={22} />
          <span>{strings.hint}</span>
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
