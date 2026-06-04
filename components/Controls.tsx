import { solutionLength } from "../lib/grayCode.ts";

const PAR = solutionLength(7);

interface ControlsProps {
  moveCount: number;
  onReset: () => void;
  onUndo: () => void;
  onHint: () => void;
  canUndo: boolean;
  isWon: boolean;
}

export default function Controls({
  moveCount,
  onReset,
  onUndo,
  onHint,
  canUndo,
  isWon,
}: ControlsProps) {
  return (
    <section class="controls" aria-label="Game controls">
      <div class="controls__counter">
        Moves: {moveCount} / Par: {PAR}
      </div>
      <div class="controls__buttons">
        <button
          type="button"
          class="action-button"
          onClick={onHint}
          disabled={isWon}
        >
          Hint
        </button>
        <button
          type="button"
          class="action-button"
          onClick={onUndo}
          disabled={isWon || !canUndo}
        >
          Undo
        </button>
        <button
          type="button"
          class="action-button action-button--secondary"
          onClick={onReset}
          disabled={isWon}
        >
          Reset
        </button>
      </div>
    </section>
  );
}
