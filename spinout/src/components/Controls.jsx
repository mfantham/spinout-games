import { solutionLength } from '../utils/grayCode'

const PAR = solutionLength(7)

export default function Controls({
  moveCount,
  onReset,
  onUndo,
  onHint,
  canUndo,
  isWon,
}) {
  return (
    <section className="controls" aria-label="Game controls">
      <div className="controls__counter">Moves: {moveCount} / Par: {PAR}</div>
      <div className="controls__buttons">
        <button type="button" className="action-button" onClick={onHint} disabled={isWon}>
          Hint
        </button>
        <button
          type="button"
          className="action-button"
          onClick={onUndo}
          disabled={isWon || !canUndo}
        >
          Undo
        </button>
        <button type="button" className="action-button action-button--secondary" onClick={onReset} disabled={isWon}>
          Reset
        </button>
      </div>
    </section>
  )
}
